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
import datetime
import json
import pathlib
import re
import sys

import state  # sibling module (scripts run as `python3 pipeline/<x>.py`)

TRENDS_MAX_AGE_DAYS = 14


def trends_staleness_warning(repo_dir: pathlib.Path) -> str | None:
    """Return a warning line if trends-current.md is missing, undated, or older
    than TRENDS_MAX_AGE_DAYS. The date comes from the file's `Updated:` header
    (mtimes lie after a fresh clone). Warning only — never blocks a build."""
    path = repo_dir / ".claude" / "skills" / "trends" / "trends-current.md"
    if not path.exists():
        return "trends-current.md missing — run the `trends` skill (REFRESH mode)"
    m = re.search(r"^Updated:\s*(\d{4}-\d{2}-\d{2})", path.read_text(encoding="utf-8"), re.M)
    if not m:
        return "trends-current.md has no 'Updated: YYYY-MM-DD' header — re-run REFRESH"
    updated = datetime.date.fromisoformat(m.group(1))
    age = (datetime.date.today() - updated).days
    if age > TRENDS_MAX_AGE_DAYS:
        return (
            f"trends-current.md is {age} days old (updated {updated}) — trend data "
            f"goes stale in weeks; run the `trends` skill (REFRESH mode)"
        )
    return None

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
    "background": "backgroundPrompt",
    "logo": None,
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reel_json")
    args = parser.parse_args()

    reel_path = pathlib.Path(args.reel_json)
    out_dir = reel_path.parent
    if not reel_path.exists():
        print(f"preflight: not found: {reel_path}", file=sys.stderr)
        state.record(out_dir, "preflight", "fail", f"reel.json not found: {reel_path}")
        return 1
    try:
        reel = json.loads(reel_path.read_text(encoding="utf-8"))
    except ValueError as exc:
        print(f"preflight: reel.json is not valid JSON — {exc}", file=sys.stderr)
        state.record(out_dir, "preflight", "fail", f"invalid JSON: {exc}")
        return 1

    repo_dir = pathlib.Path(__file__).resolve().parent.parent
    errors: list[str] = []
    warnings: list[str] = []

    scenes = reel.get("scenes")
    if not isinstance(scenes, list) or not scenes:
        print("preflight: reel.json has no scenes", file=sys.stderr)
        state.record(out_dir, "preflight", "fail", "reel.json has no scenes")
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

        # ---- HARD RULE: no scene shows text on a bare canvas ----
        # Every text scene must carry a topic-relevant background (a path now,
        # or a backgroundPrompt the pipeline will generate). Media scenes may
        # omit it — their card IS the visual.
        if stype in TEXT_SCENE_TYPES and not (
            scene.get("background") or scene.get("backgroundPrompt")
        ):
            errors.append(
                f"scene {idx:02d}: {stype} has no background — text never sits on "
                f"a bare canvas. Source one per the content skill's background "
                f"ladder (story asset crop → fetched stock → generated abstract)."
            )
        # A background is decoration (scrimmed, blurred) — it can never double
        # as the scene's evidence. The bit-exact figure in the card carries
        # that role, so the two must be distinct files.
        bg = scene.get("background")
        if bg and scene.get("figure") and bg == scene.get("figure"):
            errors.append(
                f"scene {idx:02d}: background equals figure path ({bg!r}) — a "
                f"scrimmed background is decoration, not evidence. Point "
                f"background at a distinct copy/crop and keep the card's "
                f"figure bit-exact."
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

    # ---- THE hard rule: editing is for b-roll only, NEVER for evidence ----
    # Anything a viewer treats as proof (`figure`) stays bit-exact from source.
    manifest_path = out_dir / "assets_manifest.json"
    manifest: list = []
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            errors.append("assets_manifest.json is unreadable — fix or delete it")
    by_file = {r.get("file"): r for r in manifest if isinstance(r, dict)}

    for idx, scene in enumerate(scenes):
        fig = scene.get("figure")
        if fig and scene.get("editPrompt"):
            errors.append(
                f"scene {idx:02d}: has BOTH figure and editPrompt — evidence is "
                f"untouchable; editing is for b-roll only"
            )
        if fig:
            row = by_file.get(fig)
            if row and row.get("edited"):
                errors.append(
                    f"scene {idx:02d}: figure {fig!r} is a fetched asset marked "
                    f"edited in assets_manifest.json — evidence must stay bit-exact "
                    f"from source; use the untouched original or a real story asset"
                )
            if pathlib.PurePath(fig).name.startswith("edit_"):
                errors.append(
                    f"scene {idx:02d}: figure {fig!r} points at an edited output "
                    f"(images/edit_*.png) — evidence is untouchable, never edited"
                )

    # ---- provenance: every fetched asset accounted for, nothing anonymous ----
    for row in manifest:
        f = row.get("file")
        if f and not (out_dir / f).exists():
            errors.append(f"fetched asset missing — {f} (in manifest, not on disk; re-run fetch_stock.py)")
    input_assets = set()
    input_dir = pathlib.Path(str(out_dir).replace("output/", "input/", 1)) / "assets"
    if input_dir.exists():
        input_assets = {p.name for p in input_dir.iterdir() if p.is_file()}
    assets_dir = out_dir / "assets"
    if assets_dir.exists():
        manifest_names = {pathlib.PurePath(r["file"]).name for r in manifest if r.get("file")}
        for p in sorted(assets_dir.iterdir()):
            if p.is_file() and p.name not in manifest_names and p.name not in input_assets:
                warnings.append(
                    f"assets/{p.name} has no manifest row and isn't in input/ assets — unknown provenance"
                )

    # ---- attribution: CC-BY fetched assets MUST be credited in caption.txt ----
    caption_path = out_dir / "caption.txt"
    caption_text = caption_path.read_text(encoding="utf-8") if caption_path.exists() else ""
    for row in manifest:
        if row.get("attribution_required") and row.get("photographer"):
            if row["photographer"] not in caption_text:
                errors.append(
                    f"asset {row.get('file')} ({row.get('license')}) requires attribution but "
                    f"caption.txt lacks its credit — editor: append "
                    f"\"📷 {row['photographer']} via {row.get('provider')}\" and re-run preflight"
                )

    trends_warn = trends_staleness_warning(repo_dir)
    if trends_warn:
        warnings.append(trends_warn)

    for w in warnings:
        print(f"preflight WARN: {w}", file=sys.stderr)
    if errors:
        for e in errors:
            print(f"preflight ERROR: {e}", file=sys.stderr)
        print(f"\npreflight: {len(errors)} error(s) — fix reel.json before building.", file=sys.stderr)
        state.record(out_dir, "preflight", "fail", f"{len(errors)} error(s): {errors[0]}")
        return 1

    print(f"preflight: OK — {len(scenes)} scenes, {len(warnings)} warning(s)")
    state.record(out_dir, "preflight", "pass", f"{len(scenes)} scenes, {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
