#!/usr/bin/env python3
"""Refine word timings via forced alignment (faster-whisper).

The Gemini TTS engine estimates word timings by distributing words across the
audio duration. This script replaces those estimates with real per-word
timestamps by transcribing each scene's segment mp3 with word-level
timestamps, then snapping them to the known script text.

Usage:
    python pipeline/align.py output/<story>/reel.json [--model base.en]

Reads  <out>/segments/scene_XX.mp3 + each scene's voiceSegment text.
Writes <out>/word_timings.json (reel-global seconds, same schema as tts.py).
Falls back gracefully (exit 0, timings untouched) if faster-whisper or the
model download is unavailable — estimated timings remain in place.
"""
import argparse
import json
import pathlib
import re
import sys


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9]", "", w.lower())


def align_segment(model, seg_path: pathlib.Path, script_words: list[str]):
    """Returns [{word,start,end}] for one segment, snapped to script words."""
    segments, _info = model.transcribe(
        str(seg_path), language="en", word_timestamps=True, beam_size=5
    )
    heard = [w for s in segments for w in (s.words or [])]
    if not heard:
        return None

    # Greedy monotonic match: walk script words, consume heard words.
    out = []
    hi = 0
    for sw in script_words:
        matched = None
        # look ahead a small window for the script word
        for j in range(hi, min(hi + 4, len(heard))):
            if norm(heard[j].word) and norm(heard[j].word) == norm(sw):
                matched = heard[j]
                hi = j + 1
                break
        if matched is None and hi < len(heard):
            # no exact match (TTS said "5x5" for "five-by-five" etc.) —
            # borrow the next heard word's timing to stay monotonic
            matched = heard[hi]
            hi += 1
        if matched is None:
            # ran out of heard words: stretch the last known timing
            prev_end = out[-1]["end"] if out else 0.0
            out.append({"word": sw, "start": prev_end, "end": prev_end + 0.25})
            continue
        out.append(
            {"word": sw, "start": round(matched.start, 3), "end": round(matched.end, 3)}
        )
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reel_json")
    parser.add_argument("--model", default="base.en",
                        help="faster-whisper model size (tiny.en/base.en/small.en)")
    args = parser.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("align: faster-whisper not installed — keeping estimated timings", file=sys.stderr)
        return 0

    reel_path = pathlib.Path(args.reel_json)
    reel = json.loads(reel_path.read_text(encoding="utf-8"))
    out_dir = reel_path.parent
    seg_dir = out_dir / "segments"

    try:
        model = WhisperModel(args.model, device="cpu", compute_type="int8")
    except Exception as exc:  # noqa: BLE001 — model download can fail offline
        print(f"align: model unavailable ({exc}) — keeping estimated timings", file=sys.stderr)
        return 0

    all_words = []
    refined_scenes = 0
    for idx, scene in enumerate(reel["scenes"]):
        text = (scene.get("voiceSegment") or "").strip()
        seg_path = seg_dir / f"scene_{idx:02d}.mp3"
        if not text or not seg_path.exists():
            continue
        script_words = text.split()
        words = align_segment(model, seg_path, script_words)
        offset = float(scene.get("audioStart", 0.0))
        if words is None:
            print(f"align: scene {idx:02d} — no speech recognized, skipping")
            continue
        refined_scenes += 1
        for w in words:
            all_words.append(
                {
                    "word": w["word"],
                    "start": round(offset + w["start"], 3),
                    "end": round(offset + w["end"], 3),
                    "scene": idx,
                }
            )
        print(f"align: scene {idx:02d} — {len(words)} words aligned")

    if not all_words:
        print("align: nothing aligned — keeping estimated timings", file=sys.stderr)
        return 0

    (out_dir / "word_timings.json").write_text(
        json.dumps(all_words, indent=2), encoding="utf-8"
    )
    print(f"align: word_timings.json refined ({refined_scenes} scenes, {len(all_words)} words)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
