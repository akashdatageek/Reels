#!/usr/bin/env python3
"""Validate reel.json BEFORE the pipeline spends time (and API calls) on it.

The render silently skips scenes with an unknown `type`, and TTS/image calls
are the expensive part — so a typo or a missing asset should fail loud and
early, not after minutes of synthesis. Run this as step 0 of make_reel.sh.

Checks (hard errors -> exit 1):
  * reel.json parses and has a non-empty `scenes` list
  * every scene `type` is one the renderer knows
  * every referenced local asset that's already a PATH exists
    (figure / image / backdrop / logo / music) — prompt fields are exempt,
    their files get generated later
  * `music`, if set, exists under the repo root

Soft checks (warnings -> still exit 0):
  * a spoken scene type with no voiceSegment
  * a percentage/fraction statVariant whose stat isn't one

Usage:
    python pipeline/preflight.py output/<story>/reel.json
"""
import argparse
import json
import pathlib
import re
import sys

# Must stay in sync with SCENE_COMPONENTS in remotion/src/Reel.tsx.
KNOWN_TYPES = {
    "HookCard",
    "ImageScene",
    "StatCallout",
    "SplitCompare",
    "TerminalScene",
    "ChartScene",
    "FigureScene",
    "OutroCard",
}
# Scene types that are expected to narrate — a missing voiceSegment is a warning.
SPOKEN_TYPES = {"HookCard", "ImageScene", "StatCallout", "SplitCompare", "FigureScene", "OutroCard"}
# Pure-text scenes have no figureFocus motion to survive a long hold — one card,
# one number, held for 10+ seconds is where viewers swipe. Their narration is
# HARD-capped here (word count is the pre-TTS proxy for duration: ~2.8 words/s,
# so ~20 words ≈ 7s). FigureScene/ImageScene/etc. earn longer holds with motion,
# so they're exempt. Split long text-scene narration across visual beats.
TEXT_SCENE_TYPES = {"HookCard", "StatCallout", "OutroCard"}
TEXT_SCENE_MAX_WORDS = 20


def word_count(text: str) -> int:
    """Count word-like tokens (ignore lone punctuation such as em-dashes)."""
    return sum(1 for tok in text.split() if re.search(r"\w", tok))
# (scene field -> whether the pipeline can still fill it from a *Prompt sibling)
ASSET_FIELDS = {
    "figure": None,          # always provided, never generated
    "image": "imagePrompt",
    "backdrop": "backdropPrompt",
    "logo": None,
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reel_json")
    args = parser.parse_args()

    reel_path = pathlib.Path(args.reel_json)
    if not reel_path.exists():
        print(f"preflight: not found: {reel_path}", file=sys.stderr)
        return 1
    try:
        reel = json.loads(reel_path.read_text(encoding="utf-8"))
    except ValueError as exc:
        print(f"preflight: reel.json is not valid JSON — {exc}", file=sys.stderr)
        return 1

    out_dir = reel_path.parent
    repo_dir = pathlib.Path(__file__).resolve().parent.parent
    errors: list[str] = []
    warnings: list[str] = []

    scenes = reel.get("scenes")
    if not isinstance(scenes, list) or not scenes:
        print("preflight: reel.json has no scenes", file=sys.stderr)
        return 1

    for idx, scene in enumerate(scenes):
        stype = scene.get("type")
        if stype not in KNOWN_TYPES:
            errors.append(
                f"scene {idx:02d}: unknown type {stype!r} "
                f"(known: {', '.join(sorted(KNOWN_TYPES))})"
            )
            # a bad type can't have its assets meaningfully checked
            continue

        for field, prompt_sibling in ASSET_FIELDS.items():
            ref = scene.get(field)
            if not ref:
                continue
            # a *Prompt-backed field will be generated; only a literal path is
            # expected to exist right now.
            if prompt_sibling and scene.get(prompt_sibling):
                continue
            if not (out_dir / ref).exists():
                errors.append(f"scene {idx:02d}: {field} asset missing — {ref}")

        voice = (scene.get("voiceSegment") or "").strip()
        if stype in SPOKEN_TYPES and not voice:
            warnings.append(f"scene {idx:02d}: {stype} has no voiceSegment (silent scene)")

        if stype in TEXT_SCENE_TYPES and voice:
            wc = word_count(voice)
            if wc > TEXT_SCENE_MAX_WORDS:
                errors.append(
                    f"scene {idx:02d}: {stype} narration is {wc} words "
                    f"(> {TEXT_SCENE_MAX_WORDS}) — a text card can't hold that long. "
                    f"Split it across visual beats, or move the point to a "
                    f"FigureScene/ImageScene that earns the screen time."
                )

        variant = scene.get("statVariant")
        stat = str(scene.get("stat", ""))
        if variant in ("donut", "bar") and not re.search(r"%|/", stat):
            warnings.append(
                f"scene {idx:02d}: statVariant {variant!r} needs a percentage or "
                f"fraction stat, got {stat!r}"
            )

    music = (reel.get("music") or "").strip()
    if music and not (repo_dir / music).exists():
        errors.append(f"music track missing — {music} (put a file in music/ or update reel.json)")

    for w in warnings:
        print(f"preflight WARN: {w}", file=sys.stderr)
    if errors:
        for e in errors:
            print(f"preflight ERROR: {e}", file=sys.stderr)
        print(f"\npreflight: {len(errors)} error(s) — fix reel.json before building.", file=sys.stderr)
        return 1

    print(f"preflight: OK — {len(scenes)} scenes, {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
