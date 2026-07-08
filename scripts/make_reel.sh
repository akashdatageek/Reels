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

echo "==> 1/5 TTS via $TTS_ENGINE (sets real scene durations)"
python3 pipeline/tts.py "$STORY_DIR/reel.json" --engine "$TTS_ENGINE"

echo "==> 2/5 Word alignment (refines gemini/mock timings; no-op for edge)"
if [ "$TTS_ENGINE" != "edge" ]; then
  python3 pipeline/align.py "$STORY_DIR/reel.json"
fi

echo "==> 3/5 Captions"
python3 pipeline/captions.py "$STORY_DIR/word_timings.json"

echo "==> 4/5 Images (Nano Banana, or placeholders without API key)"
python3 pipeline/generate_images.py "$STORY_DIR/reel.json"

echo "==> 5/5 Render + mux"
bash scripts/assemble.sh "$STORY_DIR"
