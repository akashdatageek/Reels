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

try:  # optional: load .env from repo root (for the gemini engine key)
    from dotenv import load_dotenv

    load_dotenv(pathlib.Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

DEFAULT_VOICE = os.environ.get("EDGE_TTS_VOICE", "en-US-AndrewNeural")
GEMINI_TTS_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_TTS_VOICE = os.environ.get("GEMINI_TTS_VOICE", "Charon")
# Natural-language delivery direction (interpreted, not spoken, by Gemini TTS).
# The default matches the 'bold' vibe; per-vibe presets below let the DELIVERY
# match the look, and a reel can override with a "voiceStyle" field.
GEMINI_TTS_STYLE = os.environ.get(
    "GEMINI_TTS_STYLE",
    "Narrate briskly and energetically, like a fast-paced news reel: ",
)
VOICE_STYLES = {
    # loud, punchy, breaking-news energy — matches the acid Gen-Z look
    "bold": GEMINI_TTS_STYLE,
    # slow, intimate, reflective — matches the cinematic/dusk moody look
    "moody": (
        "Narrate slowly and intimately, calm and reflective, warm and unhurried, "
        "leaving a little space between phrases: "
    ),
}


def resolve_voice_style(reel: dict) -> str:
    """Pick the TTS delivery direction: explicit reel `voiceStyle` wins, else a
    per-vibe preset, else the bold default."""
    explicit = (reel.get("voiceStyle") or "").strip()
    if explicit:
        return explicit if explicit.endswith((":", " ")) else explicit + ": "
    return VOICE_STYLES.get(reel.get("vibe") or "bold", GEMINI_TTS_STYLE)


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


def estimate_word_timings(text: str, dur: float):
    """Distribute words across a known audio duration, weighted by length.
    Used for engines that don't emit word boundaries (Gemini TTS)."""
    tokens = text.split()
    weights = [len(t) + 2 for t in tokens]  # +2 ~ inter-word pause share
    total = sum(weights)
    words, cursor = [], 0.05  # small lead-in
    usable = max(dur - 0.15, 0.1)
    for tok, wgt in zip(tokens, weights):
        span = usable * wgt / total
        words.append(
            {"word": tok, "start": round(cursor, 3), "end": round(cursor + span * 0.85, 3)}
        )
        cursor += span
    return words


async def synth_segment_gemini(
    text: str, voice: str, out_path: pathlib.Path, style: str = GEMINI_TTS_STYLE
):
    """Gemini TTS over plain HTTPS (works where WebSockets are blocked).
    Returns (duration_s, estimated word timings)."""
    import base64
    import subprocess
    import time

    import requests

    api_key = os.environ.get("NANO_BANANA_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("gemini engine needs NANO_BANANA_API_KEY / GEMINI_API_KEY")
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_TTS_MODEL}:generateContent"
    )
    body = {
        "contents": [{"parts": [{"text": style + text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}
            },
        },
    }
    last_err = None
    for attempt in range(3):
        resp = requests.post(url, params={"key": api_key}, json=body, timeout=120)
        if resp.status_code in (429, 500, 503):
            last_err = f"HTTP {resp.status_code}: {resp.text[:300]}"
            time.sleep(2 ** (attempt + 1))
            continue
        resp.raise_for_status()
        data = resp.json()
        try:
            inline = data["candidates"][0]["content"]["parts"][0]["inlineData"]
        except (KeyError, IndexError) as exc:
            raise RuntimeError(f"no audio in response: {json.dumps(data)[:400]}") from exc
        pcm = base64.b64decode(inline["data"])  # s16le mono 24kHz
        dur = len(pcm) / 2 / 24000
        proc = subprocess.run(
            ["ffmpeg", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-",
             "-c:a", "libmp3lame", "-q:a", "2", str(out_path)],
            input=pcm, capture_output=True,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg pcm->mp3 failed: {proc.stderr[-500:].decode()}")
        return dur, estimate_word_timings(text, dur)
    raise RuntimeError(f"gemini tts failed after retries: {last_err}")


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


async def run(reel_path: pathlib.Path, voice: str, engine: str = "edge") -> None:
    reel = json.loads(reel_path.read_text(encoding="utf-8"))
    out_dir = reel_path.parent
    seg_dir = out_dir / "segments"
    seg_dir.mkdir(parents=True, exist_ok=True)

    voice_style = resolve_voice_style(reel)
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
        if engine == "mock":
            dur, words = await synth_segment_mock(text, seg_path)
        elif engine == "gemini":
            gemini_voice = voice if voice != DEFAULT_VOICE else GEMINI_TTS_VOICE
            dur, words = await synth_segment_gemini(text, gemini_voice, seg_path, voice_style)
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
    parser.add_argument("--engine", choices=["edge", "gemini", "mock"], default="edge",
                        help="edge = Edge-TTS (word-exact timings, needs WebSocket); "
                             "gemini = Gemini TTS over HTTPS (estimated timings); "
                             "mock = silence (offline testing)")
    parser.add_argument("--mock", action="store_true",
                        help="Shorthand for --engine mock")
    args = parser.parse_args()
    engine = "mock" if args.mock else args.engine
    reel_path = pathlib.Path(args.reel_json)
    if not reel_path.exists():
        print(f"not found: {reel_path}", file=sys.stderr)
        return 1
    asyncio.run(run(reel_path, args.voice, engine=engine))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
