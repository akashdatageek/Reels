#!/usr/bin/env python3
"""Nano Banana (Gemini image gen) wrapper: scene prompts -> 1080x1920 PNGs.

Reads reel.json; for every scene that has an `imagePrompt` but no existing
`image` file, calls the Nano Banana API and saves the result into
<out>/images/scene_<idx>.png, then writes the relative path back into the
scene's `image` field.

If NANO_BANANA_API_KEY is not set, generates a styled placeholder gradient
(so the rest of the pipeline can be tested end-to-end without the key).

Usage:
    python pipeline/generate_images.py output/<story>/reel.json [--force]

Env:
    NANO_BANANA_API_KEY   Google AI Studio key
    NANO_BANANA_MODEL     default: gemini-2.5-flash-image
"""
import argparse
import base64
import hashlib
import json
import os
import pathlib
import sys
import time

import requests

import state  # sibling module (scripts run as `python3 pipeline/<x>.py`)

try:  # optional: load .env from repo root
    from dotenv import load_dotenv

    load_dotenv(pathlib.Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

# One key powers TTS + generation + editing: fall back to GEMINI_API_KEY
# exactly like tts.py does.
API_KEY = os.environ.get("NANO_BANANA_API_KEY") or os.environ.get("GEMINI_API_KEY") or ""
MODEL = os.environ.get("NANO_BANANA_MODEL", "gemini-2.5-flash-image")
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

# Keep visuals consistent day to day — this prefix is applied to every prompt.
# Push for a CAPTURED, crafted look (photo/still) over the generic stock-AI
# render, and explicitly steer away from the tells that read as slop. Per-reel
# flavor comes from reel.json "imageStyle"; the subject from each scene's prompt.
BASE_RULES = (
    "Vertical 9:16 image, full-bleed. Photographic, physically-based lighting, "
    "real materials and textures, natural depth of field, subtle analog film "
    "grain — looks captured or hand-crafted, intentional and art-directed. "
    "Absolutely no text, no words, no letters, no logos, no watermarks, no UI. "
    "Avoid the generic AI-stock look: no glossy plastic CGI blobs, no floating "
    "3D spheres, no default hologram-grid cliche, no over-rendered chrome soup, "
    "no muddy centered symmetry. "
)
# Default vibe words — a restrained cinematic grade (used only when a reel does
# NOT set "imageStyle"). A reel's "imageStyle" REPLACES these entirely, so a
# bold Gen-Z reel can still ask for a loud acid-duotone palette on top of the
# crafted BASE_RULES above.
DEFAULT_VIBE = (
    "Moody cinematic still, restrained color grade built around one dominant "
    "accent hue, deep controlled shadows, atmospheric haze, a single confident "
    "light source. "
)

# Deterministic composition rotation so consecutive foreground images are never
# framed the same way (attacks the 'every AI image looks alike' tell). Indexed
# by scene position; backdrops get their own uncluttered-environment framing.
COMPOSITIONS = [
    "wide establishing shot with generous negative space, subject small in frame",
    "low-angle hero shot looking up, monumental sense of scale",
    "extreme macro close-up, tactile surface detail, very shallow focus",
    "clean top-down overhead flat-lay, geometric order",
    "immersive first-person / over-the-shoulder point of view",
    "off-center subject, strong diagonal lead-in lines, rule-of-thirds",
]


# House rule appended to EVERY edit instruction (and included in the output
# hash): editing may reframe/grade/clean a real photo — it must never change
# what the photo depicts. Evidence never comes through this path at all
# (preflight blocks `figure` + edits), but even b-roll must stay honest.
EDIT_RULES = (
    " Keep the photograph's real content truthful: do not add screens with "
    "fabricated data, invented text, logos, people, or objects that change what "
    "the photo depicts. Output a vertical 9:16 image, full-bleed."
)

MIME_BY_SUFFIX = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}


def generate_nano_banana(prompt: str, out_path: pathlib.Path, base_image: pathlib.Path | None = None) -> None:
    """Text->image generation, or (with base_image) image+instruction editing —
    same Gemini endpoint, the base photo sent as inline_data."""
    parts = []
    if base_image is not None:
        mime = MIME_BY_SUFFIX.get(base_image.suffix.lower(), "image/jpeg")
        parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(base_image.read_bytes()).decode()}})
    parts.append({"text": prompt})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "9:16"},
        },
    }
    # Retry transient failures with exponential backoff (same pattern as tts.py).
    last_err = None
    for attempt in range(4):
        resp = requests.post(ENDPOINT, params={"key": API_KEY}, json=body, timeout=120)
        if resp.status_code in (429, 500, 503):
            last_err = f"HTTP {resp.status_code}: {resp.text[:300]}"
            print(f"  nano banana {resp.status_code}, retry {attempt + 1}/4", file=sys.stderr)
            time.sleep(2 ** (attempt + 1))
            continue
        resp.raise_for_status()
        data = resp.json()
        for part in data["candidates"][0]["content"]["parts"]:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline:
                out_path.write_bytes(base64.b64decode(inline["data"]))
                return
        raise RuntimeError(f"no image in response: {json.dumps(data)[:500]}")
    raise RuntimeError(f"nano banana failed after retries: {last_err}")


def generate_placeholder(prompt: str, out_path: pathlib.Path, accent: str = "#00E5FF") -> None:
    """Dark gradient placeholder so the pipeline runs without an API key."""
    from PIL import Image, ImageDraw

    w, h = 1080, 1920
    img = Image.new("RGB", (w, h))
    top, bottom = (10, 12, 28), (24, 28, 52)
    for y in range(h):
        t = y / h
        img.paste(
            tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)),
            (0, y, w, y + 1),
        )
    draw = ImageDraw.Draw(img)
    ac = tuple(int(accent.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
    # a few accent rings so scenes are visually distinct per prompt
    seed = sum(prompt.encode()) % 7
    for k in range(3):
        r = 180 + 140 * k + seed * 20
        cx, cy = w // 2, h // 3 + seed * 60
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ac, width=3)
    img.save(out_path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reel_json", help="Path to reel.json")
    parser.add_argument("--force", action="store_true", help="Regenerate even if file exists")
    args = parser.parse_args()

    reel_path = pathlib.Path(args.reel_json)
    reel = json.loads(reel_path.read_text(encoding="utf-8"))
    out_dir = reel_path.parent
    img_dir = out_dir / "images"
    img_dir.mkdir(parents=True, exist_ok=True)

    if not API_KEY:
        print("WARN: NANO_BANANA_API_KEY not set -> generating placeholder gradients", file=sys.stderr)

    # per-reel vibe words (from theme analysis) replace the default look, e.g.
    # "moody dusk film photography, muted teal and warm amber, atmospheric haze"
    image_style = (reel.get("imageStyle") or "").strip()
    vibe_words = f"{image_style.rstrip('.')}. " if image_style else DEFAULT_VIBE

    import fetch_stock  # sibling module: manifest helpers

    manifest = fetch_stock.load_manifest(out_dir)
    manifest_dirty = False

    made = 0
    for idx, scene in enumerate(reel["scenes"]):
        # ---- EDIT MODE: baseImage (a real fetched asset) + editPrompt ----
        # Produces images/edit_<hash of base bytes + prompt>.png — same stable-
        # key semantics as imagePrompt (reword -> new hash -> regenerates; the
        # ORIGINAL fetched file is never overwritten). B-roll only: preflight
        # refuses any `figure` that enters this path.
        base_rel = scene.get("baseImage")
        edit_prompt = (scene.get("editPrompt") or "").strip()
        if base_rel and edit_prompt:
            base_path = out_dir / base_rel
            if not base_path.exists():
                state.record(out_dir, "images", "fail",
                             f"scene {idx:02d}: baseImage missing — {base_rel}")
                raise RuntimeError(f"scene {idx:02d}: baseImage not found: {base_rel}")
            if scene.get("imagePrompt"):
                print(f"scene {idx:02d}: WARN both editPrompt and imagePrompt set — edit wins, imagePrompt ignored",
                      file=sys.stderr)
            full_edit = edit_prompt + EDIT_RULES
            digest = hashlib.sha1(base_path.read_bytes() + full_edit.encode("utf-8")).hexdigest()[:12]
            out_path = img_dir / f"edit_{digest}.png"
            rel = str(out_path.relative_to(out_dir))
            if scene.get("image") == rel and out_path.exists() and not args.force:
                print(f"scene {idx:02d}: keeping existing edit {rel}")
                continue
            if out_path.exists() and not args.force:
                print(f"scene {idx:02d}: edit already generated ({out_path.name}), relinking")
            else:
                print(f"scene {idx:02d}: editing {base_rel} -> {out_path.name}")
                try:
                    if API_KEY:
                        generate_nano_banana(full_edit, out_path, base_image=base_path)
                    else:
                        # keyless: use the unedited original so the pipeline
                        # still runs — honest fallback, no fake "edited" flag
                        print(f"scene {idx:02d}: WARN no API key — using unedited base image", file=sys.stderr)
                        out_path.write_bytes(base_path.read_bytes())
                except Exception as exc:  # noqa: BLE001 — record, then re-raise
                    state.record(out_dir, "images", "fail",
                                 f"scene {idx:02d} edit: {type(exc).__name__}: {exc}")
                    raise
                made += 1
            scene["image"] = rel
            if API_KEY:
                for row in manifest:
                    if row.get("file") == base_rel:
                        row["edited"] = True
                        row["edit_prompt"] = edit_prompt
                        manifest_dirty = True
                        break
                else:
                    print(f"scene {idx:02d}: WARN baseImage {base_rel} has no manifest row "
                          f"(not a fetched asset?) — provenance unknown", file=sys.stderr)
            # imagePrompt is superseded by the edit; backdrop/background still run
            jobs = [("backdropPrompt", "backdrop"), ("backgroundPrompt", "background")]
        else:
            # (prompt field, path field)
            jobs = [
                ("imagePrompt", "image"),
                ("backdropPrompt", "backdrop"),
                ("backgroundPrompt", "background"),
            ]
        for prompt_field, target_field in jobs:
            subject = scene.get(prompt_field)
            if not subject:
                continue
            if target_field == "backdrop":
                framing = (
                    " Real, uncluttered environment with out-of-focus depth, dark "
                    "and atmospheric so overlaid text stays readable."
                )
            elif target_field == "background":
                # scene backgrounds are AMBIENCE under a scrim (ladder rung c —
                # generation is the last resort after story assets and stock)
                framing = (
                    " Abstract, topic-toned atmosphere for a text-card background — "
                    "soft light, texture, depth; dark and uncluttered. Absolutely "
                    "no text, no charts, no logos, no readable UI."
                )
            else:
                framing = f" Composition: {COMPOSITIONS[idx % len(COMPOSITIONS)]}."
            prompt = BASE_RULES + vibe_words + subject + framing
            # Filename is a hash of the FINAL prompt, not the scene index — so a
            # scene keeps its image when other scenes are inserted/reordered, and
            # a reworded prompt automatically maps to a fresh file. Backdrop
            # framing differs from foreground, so the two never collide.
            digest = hashlib.sha1(prompt.encode("utf-8")).hexdigest()[:12]
            out_path = img_dir / f"img_{digest}.png"
            rel = str(out_path.relative_to(out_dir))
            existing = scene.get(target_field)
            # Keep the existing file only when it matches THIS prompt's hash. A
            # reworded prompt yields a new hash, so the stale image no longer
            # matches and we fall through to regenerate — no manual delete needed.
            if existing == rel and out_path.exists() and not args.force:
                print(f"scene {idx:02d}: keeping existing {target_field} {existing}")
                continue
            if out_path.exists() and not args.force:
                print(f"scene {idx:02d}: {target_field} already generated ({out_path.name}), skipping")
            else:
                print(f"scene {idx:02d}: generating {target_field} -> {out_path.name}")
                try:
                    if API_KEY:
                        generate_nano_banana(prompt, out_path)
                    else:
                        generate_placeholder(prompt, out_path, reel.get("accentColor", "#00E5FF"))
                except Exception as exc:  # noqa: BLE001 — record, then re-raise
                    state.record(out_dir, "images", "fail",
                                 f"scene {idx:02d} {target_field}: {type(exc).__name__}: {exc}")
                    raise
                made += 1
            scene[target_field] = rel

    if manifest_dirty:
        fetch_stock.save_manifest(out_dir, manifest)
    reel_path.write_text(json.dumps(reel, indent=2), encoding="utf-8")
    print(f"\n{made} image(s) generated; reel.json updated")
    state.record(out_dir, "images", "pass", f"{made} image(s) generated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
