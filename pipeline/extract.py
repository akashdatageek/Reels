#!/usr/bin/env python3
"""Extract clean article text from URLs so Claude can work from primary sources.

Usage:
    python pipeline/extract.py <url> [<url> ...] [--out input/<story>/extracted]

Writes one .md file per URL (title + clean text + source URL) into --out
(default: ./extracted next to wherever you run it from).
"""
import argparse
import hashlib
import pathlib
import sys

import requests
import trafilatura

UA = "Mozilla/5.0 (compatible; reel-pipeline/1.0)"


def slugify(url: str) -> str:
    tail = url.rstrip("/").split("/")[-1][:60] or "page"
    digest = hashlib.sha1(url.encode()).hexdigest()[:8]
    safe = "".join(c if c.isalnum() or c in "-_" else "-" for c in tail)
    return f"{safe}-{digest}"


def extract(url: str) -> str | None:
    resp = requests.get(url, headers={"User-Agent": UA}, timeout=30)
    resp.raise_for_status()
    return trafilatura.extract(
        resp.text,
        url=url,
        include_comments=False,
        include_tables=True,
        with_metadata=True,
        output_format="markdown",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="+", help="Article URLs to extract")
    parser.add_argument("--out", default="extracted", help="Output directory")
    args = parser.parse_args()

    out_dir = pathlib.Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    failures = 0
    for url in args.urls:
        try:
            text = extract(url)
        except Exception as exc:  # noqa: BLE001 — report and continue
            print(f"FAIL  {url}: {exc}", file=sys.stderr)
            failures += 1
            continue
        if not text:
            print(f"EMPTY {url}: no extractable content", file=sys.stderr)
            failures += 1
            continue
        path = out_dir / f"{slugify(url)}.md"
        path.write_text(f"{text}\n\n---\nSource: {url}\n", encoding="utf-8")
        print(f"OK    {url} -> {path}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
