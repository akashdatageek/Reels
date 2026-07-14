#!/usr/bin/env bash
# Run the mechanical half of the pipeline for one story, end to end.
# (The creative half — research, script, reel.json — is done by Claude Code
#  per CLAUDE.md before calling this.)
#
# Usage: scripts/make_reel.sh output/<story-folder>
set -euo pipefail

STORY_DIR="$1"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# Voice engine: edge (word-exact, needs WebSocket) | gemini (HTTPS) | mock
TTS_ENGINE="${TTS_ENGINE:-edge}"

echo "==> 0/6 Preflight (validate reel.json before any expensive step)"
python3 pipeline/preflight.py "$STORY_DIR/reel.json"

echo "==> 1/6 TTS via $TTS_ENGINE (sets real scene durations)"
if ! python3 pipeline/tts.py "$STORY_DIR/reel.json" --engine "$TTS_ENGINE"; then
  if [ "$TTS_ENGINE" = "edge" ]; then
    echo "   edge TTS failed (WebSocket blocked?) — falling back to gemini (HTTPS)" >&2
    TTS_ENGINE=gemini
    python3 pipeline/tts.py "$STORY_DIR/reel.json" --engine "$TTS_ENGINE"
  else
    exit 1
  fi
fi

echo "==> 2/6 Word alignment (refines gemini/mock timings; no-op for edge)"
if [ "$TTS_ENGINE" != "edge" ]; then
  python3 pipeline/align.py "$STORY_DIR/reel.json"
fi

echo "==> 3/6 Captions"
python3 pipeline/captions.py "$STORY_DIR/word_timings.json"

echo "==> 4/6 Images (Nano Banana, or placeholders without API key)"
python3 pipeline/generate_images.py "$STORY_DIR/reel.json"

echo "==> 5/6 Render + mux"
bash scripts/assemble.sh "$STORY_DIR"

echo "==> 6/6 Done -> $STORY_DIR/reel.mp4"
