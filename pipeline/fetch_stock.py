#!/usr/bin/env python3
"""Fetch REAL licensed photos for b-roll slots — the pipeline's rung-3 visual.

Providers, in fallback order (first that yields a usable image wins):
    pexels    — needs PEXELS_API_KEY      (free: https://www.pexels.com/api/)
    unsplash  — needs UNSPLASH_ACCESS_KEY (free: https://unsplash.com/developers)
    openverse — no key (CC/CC0 pool; CC-BY results REQUIRE caption attribution)

Prefers portrait/tall images, min 1080px on the short side. Every fetched image
gets a provenance row in output/<story>/assets_manifest.json — that manifest is
what preflight uses to enforce THE hard rule: **editing is for b-roll only,
never for evidence**. `figure` assets are untouchable; only fetched `broll`
assets may later be edited (generate_images.py flips the row to edited: true).

Usage:
    python3 pipeline/fetch_stock.py output/<story> \
        --query "data center corridor" --slot broll_01 [--orientation portrait]

Writes  output/<story>/assets/<slot>.jpg  + a manifest row:
    {slot, file, provider, source_url, photographer, license, license_url,
     attribution_required, edited: false, fetched_at}
Records ledger stage "assets" (pass/fail + manifest count).
"""
from __future__ import annotations

import argparse
import datetime
import io
import json
import os
import pathlib
import sys

import requests

import state  # sibling module (scripts run as `python3 pipeline/<x>.py`)

try:  # optional: load .env from repo root
    from dotenv import load_dotenv

    load_dotenv(pathlib.Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

UA = {"User-Agent": "reel-pipeline/1.0"}
MIN_SHORT_SIDE = 1080


def _fetch_pexels(query: str, orientation: str) -> dict | None:
    key = os.environ.get("PEXELS_API_KEY", "").strip()
    if not key:
        print("pexels: PEXELS_API_KEY not set — skipping", file=sys.stderr)
        return None
    resp = requests.get(
        "https://api.pexels.com/v1/search",
        params={"query": query, "orientation": orientation, "per_page": 10},
        headers={"Authorization": key, **UA},
        timeout=30,
    )
    resp.raise_for_status()
    for p in resp.json().get("photos", []):
        if min(p.get("width", 0), p.get("height", 0)) < MIN_SHORT_SIDE:
            continue
        return {
            "download_url": p["src"].get("portrait") or p["src"]["original"],
            "provider": "pexels",
            "source_url": p.get("url", ""),
            "photographer": p.get("photographer", "unknown"),
            "license": "Pexels License",
            "license_url": "https://www.pexels.com/license/",
            "attribution_required": False,
        }
    return None


def _fetch_unsplash(query: str, orientation: str) -> dict | None:
    key = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
    if not key:
        print("unsplash: UNSPLASH_ACCESS_KEY not set — skipping", file=sys.stderr)
        return None
    resp = requests.get(
        "https://api.unsplash.com/search/photos",
        params={"query": query, "orientation": orientation, "per_page": 10},
        headers={"Authorization": f"Client-ID {key}", **UA},
        timeout=30,
    )
    resp.raise_for_status()
    for p in resp.json().get("results", []):
        if min(p.get("width", 0), p.get("height", 0)) < MIN_SHORT_SIDE:
            continue
        return {
            "download_url": p["urls"].get("full") or p["urls"]["raw"],
            "provider": "unsplash",
            "source_url": p.get("links", {}).get("html", ""),
            "photographer": (p.get("user") or {}).get("name", "unknown"),
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "attribution_required": False,
        }
    return None


def _fetch_openverse(query: str, orientation: str) -> dict | None:
    resp = requests.get(
        "https://api.openverse.org/v1/images/",
        params={
            "q": query,
            "license_type": "commercial,modification",
            "aspect_ratio": "tall" if orientation == "portrait" else "wide",
            "page_size": 10,
        },
        headers=UA,
        timeout=30,
    )
    resp.raise_for_status()
    for r in resp.json().get("results", []):
        if not r.get("url"):
            continue
        w, h = r.get("width") or 0, r.get("height") or 0
        # Openverse sometimes omits dimensions — accept and verify after download.
        if w and h and min(w, h) < MIN_SHORT_SIDE:
            continue
        lic = (r.get("license") or "").lower()  # cc0, by, by-sa, pdm ...
        return {
            "download_url": r["url"],
            "provider": "openverse",
            "source_url": r.get("foreign_landing_url") or r["url"],
            "photographer": r.get("creator") or "unknown",
            "license": f"CC {lic.upper()} {r.get('license_version') or ''}".strip(),
            "license_url": r.get("license_url")
            or f"https://creativecommons.org/licenses/{lic}/{r.get('license_version') or '4.0'}/",
            # CC0 / public domain need no credit; every CC-BY* flavor does.
            "attribution_required": lic not in ("cc0", "pdm"),
        }
    return None


PROVIDERS = [("pexels", _fetch_pexels), ("unsplash", _fetch_unsplash), ("openverse", _fetch_openverse)]


def load_manifest(story_dir: pathlib.Path) -> list[dict]:
    path = story_dir / "assets_manifest.json"
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (ValueError, OSError):
        return []


def save_manifest(story_dir: pathlib.Path, rows: list[dict]) -> None:
    (story_dir / "assets_manifest.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("story_dir", help="output/<story> directory")
    parser.add_argument("--query", required=True)
    parser.add_argument("--slot", required=True, help="e.g. broll_01 -> assets/broll_01.jpg")
    parser.add_argument("--orientation", default="portrait", choices=["portrait", "landscape"])
    args = parser.parse_args()

    story = pathlib.Path(args.story_dir)
    assets = story / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    hit, errors = None, []
    for name, fn in PROVIDERS:
        try:
            hit = fn(args.query, args.orientation)
        except Exception as exc:  # noqa: BLE001 — a dead provider falls through
            errors.append(f"{name}: {type(exc).__name__}: {exc}")
            print(f"{name}: failed ({exc}) — trying next provider", file=sys.stderr)
            continue
        if hit:
            break
    if not hit:
        detail = f"no result for {args.query!r} ({'; '.join(errors) or 'no providers returned matches'})"
        print(f"fetch_stock: {detail}", file=sys.stderr)
        state.record(story, "assets", "fail", detail[:200])
        return 1

    try:
        img = requests.get(hit["download_url"], headers=UA, timeout=90)
        img.raise_for_status()
        data = img.content
        # verify min size (Openverse may omit dimensions in search results)
        try:
            from PIL import Image

            w, h = Image.open(io.BytesIO(data)).size
            if min(w, h) < MIN_SHORT_SIDE:
                raise RuntimeError(f"image too small ({w}x{h}, need {MIN_SHORT_SIDE} short side)")
        except ImportError:
            pass
        out = assets / f"{args.slot}.jpg"
        out.write_bytes(data)
    except Exception as exc:  # noqa: BLE001
        detail = f"{args.slot}: download failed — {type(exc).__name__}: {exc}"
        print(f"fetch_stock: {detail}", file=sys.stderr)
        state.record(story, "assets", "fail", detail[:200])
        return 1

    rows = load_manifest(story)
    rows = [r for r in rows if r.get("slot") != args.slot]  # upsert by slot
    rows.append(
        {
            "slot": args.slot,
            "file": str(out.relative_to(story)),
            "provider": hit["provider"],
            "source_url": hit["source_url"],
            "photographer": hit["photographer"],
            "license": hit["license"],
            "license_url": hit["license_url"],
            "attribution_required": hit["attribution_required"],
            "edited": False,
            "fetched_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        }
    )
    save_manifest(story, rows)
    state.record(story, "assets", "pass", f"{len(rows)} fetched asset(s) in manifest")
    cred = " (CC-BY: caption credit REQUIRED)" if hit["attribution_required"] else ""
    print(f"fetch_stock: {out} <- {hit['provider']} · {hit['photographer']} · {hit['license']}{cred}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
