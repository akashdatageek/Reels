#!/usr/bin/env python3
"""Edge-TTS wrapper: per-scene narration -> voice.mp3 + word_timings.json + updated reel.json.

Reads reel.json, synthesizes each scene's `voiceSegment` with edge-tts,
measures the real audio duration, and:
  * writes  <out>/voice.mp3           (all segments concatenated)
  * writes  <out>/word_timings.json   (word-level timings, reel-global seconds)
  * updates reel.json scene durations to match the audio (+ small padding),
    and stamps each scene with `audioStart` (seconds into voice.mp3).

Scenes without a voiceSegment (e.g. OutroCard) keep their scripted duration.

Usage:
    python pipeline/tts.py output/<story>/reel.json [--voice en-US-AndrewNeural]

--mock synthesizes silence with estimated word timings instead of calling
Edge-TTS — for testing the pipeline offline / in CI (Edge-TTS needs a
WebSocket connection some sandboxes block).
"""
import argparse
import asyncio
import json
import os
import pathlib
import struct
import sys

import edge_tts

DEFAULT_VOICE = os.environ.get("EDGE_TTS_VOICE", "en-US-AndrewNeural")
SCENE_PAD_S = 0.35  # breathing room after the voice ends, per scene


def mp3_duration_seconds(path: pathlib.Path) -> float:
    """Duration of an MP3 by walking its frames (no ffprobe dependency).

    edge-tts emits 24kHz mono CBR MPEG-1 Layer III; frame-walking is exact.
    """
    bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
    srates_v1 = [44100, 48000, 32000]
    srates_v2 = [22050, 24000, 16000]
    data = path.read_bytes()
    i, dur = 0, 0.0
    n = len(data)
    while i < n - 4:
        if data[i] == 0xFF and (data[i + 1] & 0xE0) == 0xE0:
            hdr = struct.unpack(">I", data[i : i + 4])[0]
            version = (hdr >> 19) & 0x3
            layer = (hdr >> 17) & 0x3
            br_idx = (hdr >> 12) & 0xF
            sr_idx = (hdr >> 10) & 0x3
            padding = (hdr >> 9) & 0x1
            if layer == 0x1 and br_idx not in (0, 0xF) and sr_idx != 0x3:
                if version == 0x3:  # MPEG-1
                    sr = srates_v1[sr_idx]
                    samples, slot = 1152, 144
                else:  # MPEG-2 / 2.5
                    sr = srates_v2[sr_idx] if version == 0x2 else srates_v2[sr_idx] // 2
                    samples, slot = 576, 72
                frame_len = (slot * bitrates[br_idx] * 1000) // sr + padding
                if frame_len > 0:
                    dur += samples / sr
                    i += frame_len
                    continue
        i += 1
    return dur


async def synth_segment(text: str, voice: str, out_path: pathlib.Path):
    """Synthesize one segment; returns (duration_s, [word timing dicts])."""
    communicate = edge_tts.Communicate(text, voice)
    words = []
    with open(out_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "word": chunk["text"],
                        "start": chunk["offset"] / 10_000_000,  # 100ns -> s
                        "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                    }
                )
    return mp3_duration_seconds(out_path), words


async def synth_segment_mock(text: str, out_path: pathlib.Path):
    """Offline stand-in: silence at ~2.8 words/sec with evenly spaced timings."""
    import subprocess

    tokens = text.split()
    dur = max(1.0, len(tokens) / 2.8)
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=24000:cl=mono",
         "-t", f"{dur:.2f}", "-c:a", "libmp3lame", "-q:a", "2", str(out_path)],
        check=True, capture_output=True,
    )
    per = dur / len(tokens)
    words = [
        {"word": w, "start": round(i * per, 3), "end": round((i + 1) * per - 0.05, 3)}
        for i, w in enumerate(tokens)
    ]
    return dur, words


async def run(reel_path: pathlib.Path, voice: str, mock: bool = False) -> None:
    reel = json.loads(reel_path.read_text(encoding="utf-8"))
    out_dir = reel_path.parent
    seg_dir = out_dir / "segments"
    seg_dir.mkdir(parents=True, exist_ok=True)

    all_words = []
    cursor = 0.0  # seconds into the concatenated voice track
    seg_files = []

    for idx, scene in enumerate(reel["scenes"]):
        text = (scene.get("voiceSegment") or "").strip()
        scene["audioStart"] = round(cursor, 3)
        if not text:
            # silent scene: keep scripted duration, advance cursor with silence
            cursor += float(scene.get("duration", 2.0))
            continue
        seg_path = seg_dir / f"scene_{idx:02d}.mp3"
        if mock:
            dur, words = await synth_segment_mock(text, seg_path)
        else:
            dur, words = await synth_segment(text, voice, seg_path)
        if dur <= 0:
            raise RuntimeError(f"scene {idx}: synthesized audio has zero duration")
        for w in words:
            all_words.append(
                {
                    "word": w["word"],
                    "start": round(cursor + w["start"], 3),
                    "end": round(cursor + w["end"], 3),
                    "scene": idx,
                }
            )
        scene["duration"] = round(dur + SCENE_PAD_S, 2)
        seg_files.append((seg_path, dur, float(scene["duration"])))
        cursor += scene["duration"]
        print(f"scene {idx:02d}  {dur:6.2f}s voice  -> {scene['duration']:.2f}s scene  ({text[:48]}...)")

    # Concatenate segments into voice.mp3, padding each scene to its full
    # duration with silence so audioStart offsets line up exactly.
    voice_path = out_dir / "voice.mp3"
    concat_with_padding(reel, seg_dir, voice_path)

    (out_dir / "word_timings.json").write_text(
        json.dumps(all_words, indent=2), encoding="utf-8"
    )
    reel["voiceFile"] = "voice.mp3"
    reel["totalDuration"] = round(sum(float(s["duration"]) for s in reel["scenes"]), 2)
    reel_path.write_text(json.dumps(reel, indent=2), encoding="utf-8")
    print(f"\nvoice.mp3 written, total {reel['totalDuration']}s")
    print(f"word_timings.json: {len(all_words)} words")
    print(f"reel.json updated with real durations")


def concat_with_padding(reel: dict, seg_dir: pathlib.Path, voice_path: pathlib.Path):
    """Build voice.mp3 via ffmpeg: each scene's segment padded to the scene's
    full duration with silence (silent scenes become pure silence), so the
    concatenated track lines up exactly with audioStart offsets."""
    import subprocess

    inputs, filters, labels = [], [], []
    n_inputs = 0
    for idx, scene in enumerate(reel["scenes"]):
        seg = seg_dir / f"scene_{idx:02d}.mp3"
        dur = float(scene["duration"])
        label = f"s{idx}"
        if seg.exists():
            inputs += ["-i", str(seg)]
            filters.append(
                f"[{n_inputs}:a]aresample=24000,aformat=channel_layouts=mono,"
                f"apad,atrim=duration={dur}[{label}]"
            )
            n_inputs += 1
        else:
            filters.append(
                f"anullsrc=r=24000:cl=mono,atrim=duration={dur}[{label}]"
            )
        labels.append(label)

    concat = "".join(f"[{l}]" for l in labels) + f"concat=n={len(labels)}:v=0:a=1[out]"
    graph = ";".join(filters + [concat])
    cmd = [
        "ffmpeg", "-y", *inputs,
        "-filter_complex", graph,
        "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "2", str(voice_path),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg concat failed:\n{proc.stderr[-2000:]}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reel_json", help="Path to reel.json")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--mock", action="store_true",
                        help="Silence + estimated timings (offline testing)")
    args = parser.parse_args()
    reel_path = pathlib.Path(args.reel_json)
    if not reel_path.exists():
        print(f"not found: {reel_path}", file=sys.stderr)
        return 1
    asyncio.run(run(reel_path, args.voice, mock=args.mock))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
