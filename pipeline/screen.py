#!/usr/bin/env python3
"""Screening assets — the frames the orchestrator must actually LOOK at.

The pipeline renders reels it never looks at; this stage fixes that. From the
finished ``reel.mp4`` + ``reel.json`` it produces, under ``<story>/stills/``:

  scene_<idx>_<t>.jpg   one still at every scene's first visible frame, its
                        midpoint, and the midpoint of every figureFocus step
                        (times computed from reel.json scene durations)
  contact_sheet.jpg     every still tiled 4-across at 270x480 — the whole reel
                        at Explore-grid size, for the squint test
  first_second.jpg      frames at 0.25s / 0.5s / 1.0s tiled in a row — the
                        scroll-stop test (what a thumb actually sees)
  waveform.png          full-reel audio waveform (ffmpeg showwavespic) — dead
                        air, clipping, and outro shape are visible at a glance

Records ledger stage ``screening_assets`` (pass + still count). The rubric
judgment itself is the screening SKILL's job (ledger stage ``screening``) —
this script only makes the evidence.

Idempotent: timestamps are recomputed from reel.json every run; a still is
re-extracted only when it's missing or older than reel.mp4, stale stills from
a previous scene layout are deleted, and the composites are rebuilt only when
an input still changed. Usage:

    python3 pipeline/screen.py output/<story>
"""
from __future__ import annotations

import json
import pathlib
import subprocess
import sys

from PIL import Image, ImageDraw

import state  # sibling module (scripts run as `python3 pipeline/<x>.py`)

# Contact-sheet geometry: 4-across at phone-grid tile size (spec: 270x480).
SHEET_COLS = 4
TILE_W, TILE_H = 270, 480
LABEL_H = 26  # filename strip under each tile so verdicts can cite stills

# First-second strip: the scroll-stop test frames.
FIRST_SECOND_TIMES = (0.25, 0.5, 1.0)
STRIP_W, STRIP_H = 360, 640

# The CutFlash wipe starts 3 frames before each cut and runs 10 frames total
# (CUT_FLASH_FRAMES), so it still covers the boundary until ~0.23s in; sample
# past it so "first visible frame" shows the scene, not the transition streak.
FIRST_VISIBLE_OFFSET = 0.30


def scene_still_times(reel: dict) -> list[tuple[int, float, str]]:
    """(scene_idx, t_seconds, why) for every still we owe, from reel.json.

    Scene starts are cumulative durations (mirrors Reel.tsx sequencing — never
    trust audioStart, which can drift from the rendered timeline). figureFocus
    step k spans [at_k, at_{k+1} or 1]; we sample each step's midpoint so the
    still shows the held camera, not the move between steps.
    """
    out: list[tuple[int, float, str]] = []
    total = sum(s.get("duration", 0) for s in reel.get("scenes", []))
    cursor = 0.0
    for idx, scene in enumerate(reel.get("scenes", [])):
        dur = float(scene.get("duration", 0))
        end_cap = cursor + max(0.0, dur - 0.1)  # never sample past the scene
        out.append((idx, min(cursor + FIRST_VISIBLE_OFFSET, end_cap), "first"))
        out.append((idx, cursor + dur / 2, "mid"))
        steps = scene.get("figureFocus") or []
        for k, step in enumerate(steps):
            at = float(step.get("at", 0))
            nxt = float(steps[k + 1].get("at", 1)) if k + 1 < len(steps) else 1.0
            t = cursor + dur * (at + (min(nxt, 1.0) - at) / 2)
            out.append((idx, min(t, end_cap), f"focus{k}"))
        cursor += dur
    # Dedupe near-identical timestamps (e.g. focus0 midpoint ~ scene midpoint)
    # and clamp inside the render.
    seen: list[tuple[int, float, str]] = []
    for idx, t, why in sorted(out, key=lambda r: (r[0], r[1])):
        t = max(0.0, min(t, total - 0.05))
        if any(i == idx and abs(t - pt) < 0.2 for i, pt, _ in seen):
            continue
        seen.append((idx, t, why))
    return seen


def still_name(idx: int, t: float) -> str:
    return f"scene_{idx:02d}_{t:06.2f}.jpg"


def extract_frame(video: pathlib.Path, t: float, out: pathlib.Path) -> None:
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-ss", f"{t:.3f}", "-i", str(video),
         "-frames:v", "1", "-q:v", "2", str(out)],
        check=True,
    )


def _labeled_tile(img_path: pathlib.Path, w: int, h: int, label: str) -> Image.Image:
    tile = Image.new("RGB", (w, h + LABEL_H), "#0d0b09")
    with Image.open(img_path) as im:
        tile.paste(im.resize((w, h), Image.LANCZOS), (0, 0))
    d = ImageDraw.Draw(tile)
    d.text((4, h + 6), label, fill="#c9c2b6")
    return tile


def build_contact_sheet(stills: list[pathlib.Path], out: pathlib.Path) -> None:
    rows = (len(stills) + SHEET_COLS - 1) // SHEET_COLS
    sheet = Image.new("RGB", (SHEET_COLS * TILE_W, rows * (TILE_H + LABEL_H)), "#0d0b09")
    for i, path in enumerate(stills):
        tile = _labeled_tile(path, TILE_W, TILE_H, path.name)
        sheet.paste(tile, ((i % SHEET_COLS) * TILE_W, (i // SHEET_COLS) * (TILE_H + LABEL_H)))
    sheet.save(out, quality=88)


def build_first_second(video: pathlib.Path, stills_dir: pathlib.Path, out: pathlib.Path) -> None:
    strip = Image.new("RGB", (len(FIRST_SECOND_TIMES) * STRIP_W, STRIP_H + LABEL_H), "#0d0b09")
    for i, t in enumerate(FIRST_SECOND_TIMES):
        tmp = stills_dir / f"_first_{t:.2f}.jpg"
        extract_frame(video, t, tmp)
        strip.paste(_labeled_tile(tmp, STRIP_W, STRIP_H, f"t={t:.2f}s"), (i * STRIP_W, 0))
        tmp.unlink()
    strip.save(out, quality=90)


def build_waveform(video: pathlib.Path, out: pathlib.Path, accent: str) -> None:
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
         "-filter_complex",
         f"[0:a]aformat=channel_layouts=mono,showwavespic=s=1920x420:colors={accent}[w];"
         f"color=c=0x0d0b09:s=1920x420[bg];[bg][w]overlay=format=auto",
         "-frames:v", "1", str(out)],
        check=True,
    )


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    story = pathlib.Path(sys.argv[1])
    video = story / "reel.mp4"
    reel_path = story / "reel.json"
    try:
        if not video.exists():
            raise FileNotFoundError(f"{video} missing — run the build first")
        reel = json.loads(reel_path.read_text(encoding="utf-8"))

        stills_dir = story / "stills"
        stills_dir.mkdir(exist_ok=True)
        plan = scene_still_times(reel)
        expected = {still_name(idx, t) for idx, t, _ in plan}

        # Drop stills from a previous scene layout so the sheet never shows
        # frames the current reel.json doesn't own.
        for stale in stills_dir.glob("scene_*.jpg"):
            if stale.name not in expected:
                stale.unlink()

        video_mtime = video.stat().st_mtime
        changed = False
        for idx, t, _why in plan:
            out = stills_dir / still_name(idx, t)
            if not out.exists() or out.stat().st_mtime < video_mtime:
                extract_frame(video, t, out)
                changed = True

        sheet = stills_dir / "contact_sheet.jpg"
        first = stills_dir / "first_second.jpg"
        wave = stills_dir / "waveform.png"
        if changed or not sheet.exists():
            ordered = [stills_dir / still_name(idx, t) for idx, t, _ in plan]
            build_contact_sheet(ordered, sheet)
        if changed or not first.exists():
            build_first_second(video, stills_dir, first)
        if changed or not wave.exists():
            build_waveform(video, wave, reel.get("accentColor", "#C96B3B"))

        n = len(plan)
        state.record(story, "screening_assets", "pass",
               f"{n} scene stills + contact sheet + first-second strip + waveform")
        print(f"screening assets OK — {n} stills in {stills_dir}/")
        print(f"  contact sheet: {sheet}")
        print(f"  first second:  {first}")
        print(f"  waveform:      {wave}")
        return 0
    except Exception as exc:  # noqa: BLE001 — the ledger must see any failure
        state.record(story, "screening_assets", "fail", f"{type(exc).__name__}: {exc}")
        print(f"screening assets FAILED: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
