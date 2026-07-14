#!/usr/bin/env bash
# The final gate — the reel is DONE only when this exits 0.
#
# Usage: scripts/handoff.sh output/<story-folder>
#
# Refuses to release the reel unless EVERY required stage is green in the
# story's state ledger (output/<story>/state.json). Non-negotiables live in
# this exit code, not in prose: the orchestrator cannot skip its own checklist,
# because a missing or failed gate makes this script exit 1 and print exactly
# which gates are red. Only when all gates pass does it print the final paths.
set -euo pipefail

STORY_DIR="${1:?usage: scripts/handoff.sh output/<story-folder>}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# Every stage that MUST be green before a reel can ship. The creative gates
# (research → comprehension) are recorded by the skills; preflight + build by
# the pipeline scripts.
REQUIRED=(research content script factcheck comprehension preflight build)

if ! python3 pipeline/state.py check "$STORY_DIR" "${REQUIRED[@]}"; then
  echo "" >&2
  echo "⛔ HANDOFF BLOCKED — the reel is NOT done. Clear the red gates above, then re-run." >&2
  exit 1
fi

# All gates green — now confirm the artifacts the gates promise actually exist.
REEL="$STORY_DIR/reel.mp4"
COVER="$STORY_DIR/cover.png"
missing=0
[ -f "$REEL" ]  || { echo "⛔ gate 'build' is green but $REEL is missing" >&2; missing=1; }
[ -f "$COVER" ] || { echo "⛔ 'comprehension' is green but $COVER is missing (editor: export the cover)" >&2; missing=1; }
if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo ""
echo "✅ ALL GATES GREEN — reel is ready to hand off."
echo "   reel:  $REEL"
echo "   cover: $COVER"
