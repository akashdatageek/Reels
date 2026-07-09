#!/usr/bin/env python3
"""Fetch free CC-licensed photos from Openverse (no API key needed).

NOTE: stock-photo hosts are blocked in the remote sandbox's network policy —
run this locally. Downloads the top results for a query into a directory and
writes credits.md with attribution lines (required for CC BY licenses).

Usage:
    python3 pipeline/fetch_stock.py "empty classroom dusk" \
        --out input/<story>/assets/stock --count 4
"""
import argparse
import pathlib
import re

import requests

API = "https://api.openverse.org/v1/images/"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:50]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query")
    parser.add_argument("--out", default="stock")
    parser.add_argument("--count", type=int, default=4)
    args = parser.parse_args()

    out_dir = pathlib.Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    resp = requests.get(
        API,
        params={
            "q": args.query,
            "license_type": "commercial,modification",
            "page_size": args.count,
            "aspect_ratio": "tall",
        },
        headers={"User-Agent": "reel-pipeline/1.0"},
        timeout=30,
    )
    resp.raise_for_status()
    results = resp.json().get("results", [])
    if not results:
        print("no results")
        return 1

    credits = []
    for i, r in enumerate(results):
        url = r.get("url")
        if not url:
            continue
        ext = pathlib.Path(url.split("?")[0]).suffix or ".jpg"
        path = out_dir / f"{slug(args.query)}-{i}{ext}"
        img = requests.get(url, headers={"User-Agent": "reel-pipeline/1.0"}, timeout=60)
        img.raise_for_status()
        path.write_bytes(img.content)
        credits.append(
            f"- {path.name}: \"{r.get('title', 'untitled')}\" by {r.get('creator', 'unknown')} "
            f"({r.get('license', '?').upper()} {r.get('license_version', '')}) — {r.get('foreign_landing_url', url)}"
        )
        print(f"saved {path}")

    (out_dir / "credits.md").write_text("# Photo credits\n\n" + "\n".join(credits) + "\n", encoding="utf-8")
    print(f"credits -> {out_dir/'credits.md'} (include in caption.txt where CC BY)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
