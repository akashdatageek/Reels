#!/usr/bin/env python3
"""Per-story state ledger — the pipeline's enforcement spine.

Every stage records its result into ``output/<story>/state.json``; the final
handoff gate (``scripts/handoff.sh``) refuses to release the reel unless every
required stage is present and green. The design principle: the orchestrator
must not be able to skip its own checklist — non-negotiables live in exit codes,
not prose. A missing or failed gate makes ``handoff.sh`` exit 1, full stop.

state.json is a list of entries, one per stage (upserted, newest wins):

    [{"stage": "preflight", "status": "pass", "detail": "", "timestamp": "..."}]

``status`` is one of ``pass`` | ``fail`` | ``warn``. A ``warn`` is not a failure
(the stage completed with a caveat) — only ``fail`` or a missing stage is red.

CLI:
    python3 pipeline/state.py record <story_dir> <stage> <status> [detail]
    python3 pipeline/state.py check  <story_dir> <stage1> [<stage2> ...]

``record`` always exits 0 — recording a result never blocks the stage that just
finished. ``check`` exits 0 if every required stage is present and not failed,
else exits 1 after printing exactly which gates are red.
"""
from __future__ import annotations

import argparse
import datetime
import json
import pathlib
import sys

STATUSES = ("pass", "fail", "warn")


def _state_path(story_dir: str | pathlib.Path) -> pathlib.Path:
    return pathlib.Path(story_dir) / "state.json"


def _load(story_dir: str | pathlib.Path) -> list[dict]:
    path = _state_path(story_dir)
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return []
    return data if isinstance(data, list) else []


def record(story_dir: str | pathlib.Path, stage: str, status: str, detail: str = "") -> dict:
    """Append or update this stage's entry in output/<story>/state.json.

    Upserts by stage (a stage recording twice overwrites its prior entry), so
    the ledger always reflects each stage's *latest* result. Creates the story
    dir and file if needed. Returns the entry written.
    """
    if status not in STATUSES:
        raise ValueError(f"status must be one of {STATUSES}, got {status!r}")
    story = pathlib.Path(story_dir)
    story.mkdir(parents=True, exist_ok=True)
    entries = _load(story)
    entry = {
        "stage": stage,
        "status": status,
        "detail": detail or "",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
    }
    entries = [e for e in entries if e.get("stage") != stage]
    entries.append(entry)
    _state_path(story).write_text(json.dumps(entries, indent=2), encoding="utf-8")
    return entry


def check(story_dir: str | pathlib.Path, required_stages: list[str]) -> int:
    """Return 0 if every required stage is present and not failed, else 1.

    Red = a required stage is missing, or its latest status is ``fail``. A
    ``warn`` counts as green (present, completed with a caveat). Prints one line
    per red gate to stderr so the caller sees exactly what's blocking handoff.
    """
    by_stage = {e.get("stage"): e for e in _load(story_dir)}
    red: list[str] = []
    for stage in required_stages:
        entry = by_stage.get(stage)
        if entry is None:
            red.append(f"  ✗ {stage:<14} MISSING — stage never ran")
        elif entry.get("status") == "fail":
            red.append(f"  ✗ {stage:<14} FAILED — {entry.get('detail') or 'no detail'}")
    if red:
        print(f"gate check FAILED — {len(red)} of {len(required_stages)} required stages red:", file=sys.stderr)
        for line in red:
            print(line, file=sys.stderr)
        return 1
    print(f"gate check OK — all {len(required_stages)} required stages green")
    return 0


def _cli(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_rec = sub.add_parser("record", help="record a stage result")
    p_rec.add_argument("story_dir")
    p_rec.add_argument("stage")
    p_rec.add_argument("status", choices=STATUSES)
    p_rec.add_argument("detail", nargs="?", default="")

    p_chk = sub.add_parser("check", help="check required stages are all green")
    p_chk.add_argument("story_dir")
    p_chk.add_argument("stages", nargs="+", help="required stage names")

    args = parser.parse_args(argv)
    if args.cmd == "record":
        entry = record(args.story_dir, args.stage, args.status, args.detail)
        print(f"state: {entry['stage']} = {entry['status']}"
              + (f" ({entry['detail']})" if entry["detail"] else ""))
        return 0
    return check(args.story_dir, args.stages)


if __name__ == "__main__":
    raise SystemExit(_cli(sys.argv[1:]))
