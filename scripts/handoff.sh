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
# (research → comprehension) are recorded by the skills; the mechanical gates
# by the pipeline scripts. `align` is deliberately NOT required — the edge
# engine skips it by design (its timings are already word-exact), so a missing
# align entry is normal; every other mechanical stage runs on every build.
REQUIRED=(research content script factcheck comprehension preflight tts captions images build screening)

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

# No scene may still carry an UNGENERATED image/backdrop prompt. Preflight
# exempts prompt-scenes (their files come later); the `images` gate covers the
# run that generated them — but a scene added AFTER images last ran would render
# blank while riding a stale green ledger. Catch it here, on the final artifact.
if ! python3 - "$STORY_DIR/reel.json" <<'PY'
import json, pathlib, sys
p = pathlib.Path(sys.argv[1]); reel = json.loads(p.read_text(encoding="utf-8"))
bad = []
for i, s in enumerate(reel.get("scenes", [])):
    for prompt, field in (("imagePrompt", "image"), ("backdropPrompt", "backdrop")):
        if s.get(prompt) and not (s.get(field) and (p.parent / s[field]).exists()):
            bad.append(f"scene {i:02d}: {prompt} set but no generated {field} file — would render blank")
for b in bad:
    print(f"⛔ {b}", file=sys.stderr)
sys.exit(1 if bad else 0)
PY
then
  echo "⛔ ungenerated prompt(s) above — re-run pipeline/generate_images.py" >&2
  missing=1
fi

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo ""
echo "✅ ALL GATES GREEN — reel is ready to hand off."
echo "   reel:  $REEL"
echo "   cover: $COVER"
