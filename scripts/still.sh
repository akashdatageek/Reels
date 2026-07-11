#!/usr/bin/env bash
# Render ONE still frame from a built story, for editorial review.
#
# Usage: scripts/still.sh output/<story> <frame> [out.png]
#
# assemble.sh deletes props.json after rendering, and the renderer needs the
# {reel, captions} props shape plus the story dir as its public dir (so
# staticFile() resolves images + the audio the pulse hook analyzes). This
# rebuilds props.json and renders the frame with everything wired up.
set -euo pipefail

STORY_DIR="$(cd "$1" && pwd)"
FRAME="${2:-0}"
OUT="${3:-/tmp/still_$(basename "$STORY_DIR")_${FRAME}.png}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$STORY_DIR/reel.json" ] || { echo "no reel.json in $STORY_DIR (build it first)" >&2; exit 1; }

# Rebuild the props the composition expects ({reel, captions}).
python3 - "$STORY_DIR" <<'PY'
import json, pathlib, sys
d = pathlib.Path(sys.argv[1])
reel = json.loads((d / "reel.json").read_text())
caps = json.loads((d / "captions.json").read_text()) if (d / "captions.json").exists() else []
# The pulse hook analyzes music.mp3 (staged into the story dir by assemble.sh
# and left there) or falls back to voice.mp3; if music is gone, null it so the
# still render doesn't 404 on a missing file.
if not (d / "music.mp3").exists():
    reel["music"] = None
(d / "props.json").write_text(json.dumps({"reel": reel, "captions": caps}))
PY

cd "$REPO_DIR/remotion"
npx remotion still Reel "$OUT" \
  --frame="$FRAME" \
  --props="$STORY_DIR/props.json" \
  --public-dir="$STORY_DIR"
echo "still -> $OUT"
