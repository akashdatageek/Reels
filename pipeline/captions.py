#!/usr/bin/env python3
"""Turn word_timings.json into caption groups for animated word-by-word captions.

Groups words into short chunks (max N words / max gap), which Remotion's
<Captions> component renders with the active word highlighted.

Usage:
    python pipeline/captions.py output/<story>/word_timings.json \
        [--max-words 4] [--max-gap 0.6]

Writes captions.json next to the input:
[
  {"start": 0.05, "end": 1.32, "scene": 0,
   "words": [{"word": "Claude", "start": 0.05, "end": 0.38}, ...]},
  ...
]
"""
import argparse
import json
import pathlib


def group_words(words, max_words=4, max_gap=0.6):
    groups, current = [], []
    for w in words:
        if current and (
            len(current) >= max_words
            or w["start"] - current[-1]["end"] > max_gap
            or w.get("scene") != current[-1].get("scene")
        ):
            groups.append(current)
            current = []
        current.append(w)
    if current:
        groups.append(current)

    return [
        {
            "start": g[0]["start"],
            "end": g[-1]["end"],
            "scene": g[0].get("scene", 0),
            "words": [
                {"word": w["word"], "start": w["start"], "end": w["end"]} for w in g
            ],
        }
        for g in groups
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("timings_json", help="Path to word_timings.json")
    parser.add_argument("--max-words", type=int, default=4)
    parser.add_argument("--max-gap", type=float, default=0.6)
    args = parser.parse_args()

    path = pathlib.Path(args.timings_json)
    words = json.loads(path.read_text(encoding="utf-8"))
    groups = group_words(words, args.max_words, args.max_gap)

    out = path.parent / "captions.json"
    out.write_text(json.dumps(groups, indent=2), encoding="utf-8")
    print(f"{len(words)} words -> {len(groups)} caption groups -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
