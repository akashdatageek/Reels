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

import state  # sibling module (scripts run as `python3 pipeline/<x>.py`)


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

    reel_path = pathlib.Path(args.reel_json)
    out_dir = reel_path.parent

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("align: faster-whisper not installed — keeping estimated timings", file=sys.stderr)
        state.record(out_dir, "align", "pass", "faster-whisper unavailable, kept estimates")
        return 0

    reel = json.loads(reel_path.read_text(encoding="utf-8"))
    seg_dir = out_dir / "segments"

    try:
        model = WhisperModel(args.model, device="cpu", compute_type="int8")
    except Exception as exc:  # noqa: BLE001 — model download can fail offline
        print(f"align: model unavailable ({exc}) — keeping estimated timings", file=sys.stderr)
        state.record(out_dir, "align", "pass", "model unavailable, kept estimates")
        return 0

    # Load the estimated timings tts.py already wrote, so scenes that DON'T
    # align keep their estimates instead of losing their captions entirely.
    tw_path = out_dir / "word_timings.json"
    estimates = []
    if tw_path.exists():
        try:
            estimates = json.loads(tw_path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            estimates = []

    aligned_words = []
    aligned_scene_ids: set[int] = set()
    for idx, scene in enumerate(reel["scenes"]):
        text = (scene.get("voiceSegment") or "").strip()
        seg_path = seg_dir / f"scene_{idx:02d}.mp3"
        if not text or not seg_path.exists():
            continue
        script_words = text.split()
        try:
            words = align_segment(model, seg_path, script_words)
        except Exception as exc:  # noqa: BLE001 — a transcription failure is real
            print(f"align: scene {idx:02d} transcription failed ({exc})", file=sys.stderr)
            state.record(out_dir, "align", "fail", f"scene {idx:02d}: {type(exc).__name__}: {exc}")
            return 1
        offset = float(scene.get("audioStart", 0.0))
        if words is None:
            # keep this scene's estimated timings (do NOT drop its captions)
            print(f"align: scene {idx:02d} — no speech recognized, keeping estimate")
            continue
        aligned_scene_ids.add(idx)
        for w in words:
            aligned_words.append(
                {
                    "word": w["word"],
                    "start": round(offset + w["start"], 3),
                    "end": round(offset + w["end"], 3),
                    "scene": idx,
                }
            )
        print(f"align: scene {idx:02d} — {len(words)} words aligned")

    if not aligned_scene_ids:
        print("align: nothing aligned — keeping estimated timings", file=sys.stderr)
        state.record(out_dir, "align", "pass", "nothing aligned, kept estimates")
        return 0

    # Merge: aligned scenes replace their estimates; every other scene keeps its
    # estimated words. Order by scene then time.
    kept = [w for w in estimates if w.get("scene") not in aligned_scene_ids]
    merged = kept + aligned_words
    merged.sort(key=lambda w: (w.get("scene", 0), w.get("start", 0.0)))

    tw_path.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    kept_scenes = len({w.get("scene") for w in kept})
    print(
        f"align: refined {len(aligned_scene_ids)} scene(s), kept estimates for "
        f"{kept_scenes} — {len(merged)} words total"
    )
    state.record(out_dir, "align", "pass",
                 f"refined {len(aligned_scene_ids)} scene(s), {len(merged)} words")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
