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
import json
import os
import pathlib
import sys

import requests

try:  # optional: load .env from repo root
    from dotenv import load_dotenv

    load_dotenv(pathlib.Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

API_KEY = os.environ.get("NANO_BANANA_API_KEY", "")
MODEL = os.environ.get("NANO_BANANA_MODEL", "gemini-2.5-flash-image")
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

# Keep visuals consistent day to day — this prefix is applied to every prompt.
# The per-reel creative direction comes from the scene's imagePrompt itself.
STYLE_PREFIX = (
    "Vertical 9:16 social media background image. Dark navy/black background, "
    "single neon accent color, clean isometric 3D or abstract tech aesthetic, "
    "cinematic lighting, high detail. Absolutely no text, no words, no letters, "
    "no logos, no watermarks in the image. "
)


def generate_nano_banana(prompt: str, out_path: pathlib.Path) -> None:
    body = {
        "contents": [{"parts": [{"text": STYLE_PREFIX + prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "9:16"},
        },
    }
    resp = requests.post(
        ENDPOINT,
        params={"key": API_KEY},
        json=body,
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    for part in data["candidates"][0]["content"]["parts"]:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline:
            out_path.write_bytes(base64.b64decode(inline["data"]))
            return
    raise RuntimeError(f"no image in response: {json.dumps(data)[:500]}")


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

    made = 0
    for idx, scene in enumerate(reel["scenes"]):
        prompt = scene.get("imagePrompt")
        if not prompt:
            continue
        existing = scene.get("image")
        if existing and (out_dir / existing).exists() and not args.force:
            print(f"scene {idx:02d}: keeping existing asset {existing}")
            continue
        out_path = img_dir / f"scene_{idx:02d}.png"
        if out_path.exists() and not args.force:
            print(f"scene {idx:02d}: already generated, skipping (--force to redo)")
        else:
            print(f"scene {idx:02d}: generating -> {out_path.name}")
            if API_KEY:
                generate_nano_banana(prompt, out_path)
            else:
                generate_placeholder(prompt, out_path, reel.get("accentColor", "#00E5FF"))
            made += 1
        scene["image"] = str(out_path.relative_to(out_dir))

    reel_path.write_text(json.dumps(reel, indent=2), encoding="utf-8")
    print(f"\n{made} image(s) generated; reel.json updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
