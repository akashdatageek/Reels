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

echo "==> 1/4 TTS (sets real scene durations)"
python3 pipeline/tts.py "$STORY_DIR/reel.json"

echo "==> 2/4 Captions"
python3 pipeline/captions.py "$STORY_DIR/word_timings.json"

echo "==> 3/4 Images (Nano Banana, or placeholders without API key)"
python3 pipeline/generate_images.py "$STORY_DIR/reel.json"

echo "==> 4/4 Render + mux"
bash scripts/assemble.sh "$STORY_DIR"
