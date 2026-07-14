#!/usr/bin/env bash
# Render + audio assembly for one story.
#
# Usage: scripts/assemble.sh output/<story-folder>
#
# Expects in the story folder (created by earlier pipeline steps):
#   reel.json        scene spec (durations already set by tts.py)
#   captions.json    word-level caption groups (captions.py)
#   voice.mp3        narration (tts.py)
#   images/          generated images (generate_images.py)
#   assets/          optional provided assets (copied from input/)
#
# Steps:
#   1. Build props.json ({reel, captions}) for Remotion
#   2. remotion render (silent video; story folder is the public dir,
#      so scene image paths resolve via staticFile)
#   3. Mux: voice + music (music ducked -12dB under voice via sidechain),
#      loudness-normalized to -14 LUFS (IG/YT target)
set -euo pipefail

STORY_DIR="$(cd "$1" && pwd)"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REEL_JSON="$STORY_DIR/reel.json"
CAPTIONS_JSON="$STORY_DIR/captions.json"
VOICE="$STORY_DIR/voice.mp3"

# Record the build stage into the state ledger: fail on ANY nonzero exit
# (precondition miss, render error, ffmpeg error), pass only on a clean finish.
build_state() { python3 "$REPO_DIR/pipeline/state.py" record "$STORY_DIR" build "$1" "$2" >/dev/null 2>&1 || true; }
trap 'rc=$?; [ "$rc" -ne 0 ] && build_state fail "assemble.sh exited $rc"' EXIT

[ -f "$REEL_JSON" ] || { echo "missing $REEL_JSON" >&2; exit 1; }
[ -f "$VOICE" ] || { echo "missing $VOICE (run pipeline/tts.py first)" >&2; exit 1; }

# 1. Stage the music track in the story dir so the renderer can analyze it
#    (audio-reactive visuals read music.mp3 via staticFile)
MUSIC_REL_PRE="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('music') or '')" "$REEL_JSON")"
rm -f "$STORY_DIR/music.mp3"
if [ -n "$MUSIC_REL_PRE" ] && [ -f "$REPO_DIR/$MUSIC_REL_PRE" ]; then
  cp "$REPO_DIR/$MUSIC_REL_PRE" "$STORY_DIR/music.mp3"
fi

# 1a2. Stage the brand logo into the story dir for the OutroCard.
rm -f "$STORY_DIR/logo.png"
if [ -f "$REPO_DIR/brand/startups-logo.png" ]; then
  cp "$REPO_DIR/brand/startups-logo.png" "$STORY_DIR/logo.png"
fi

# 1b. props.json = {reel, captions}; music/logo cleared if not staged so the
#     renderer never references a missing file
python3 - "$REEL_JSON" "$CAPTIONS_JSON" "$STORY_DIR/props.json" "$STORY_DIR/music.mp3" "$STORY_DIR/logo.png" <<'PY'
import json, pathlib, sys
reel = json.loads(pathlib.Path(sys.argv[1]).read_text())
captions = []
cap_path = pathlib.Path(sys.argv[2])
if cap_path.exists():
    captions = json.loads(cap_path.read_text())
if not pathlib.Path(sys.argv[4]).exists():
    reel["music"] = None
reel["logo"] = "logo.png" if pathlib.Path(sys.argv[5]).exists() else None
pathlib.Path(sys.argv[3]).write_text(json.dumps({"reel": reel, "captions": captions}))
PY

# 2. Render video (no audio) — story dir is the public dir for staticFile()
cd "$REPO_DIR/remotion"
npx remotion render Reel "$STORY_DIR/video_silent.mp4" \
  --props="$STORY_DIR/props.json" \
  --public-dir="$STORY_DIR" \
  --muted

# 3. Mux audio
MUSIC_REL="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('music') or '')" "$REEL_JSON")"
MUSIC="$REPO_DIR/$MUSIC_REL"
OUT="$STORY_DIR/reel.mp4"

if [ -n "$MUSIC_REL" ] && [ -f "$MUSIC" ]; then
  # music looped to full length, ducked -12dB under voice, then loudnorm
  ffmpeg -y \
    -i "$STORY_DIR/video_silent.mp4" \
    -i "$VOICE" \
    -stream_loop -1 -i "$MUSIC" \
    -filter_complex "\
[2:a]volume=0.5[music];\
[music][1:a]sidechaincompress=threshold=0.03:ratio=8:attack=50:release=400:makeup=1[ducked];\
[1:a][ducked]amix=inputs=2:duration=first:dropout_transition=0[mix];\
[mix]loudnorm=I=-14:TP=-1.5:LRA=11[aout]" \
    -map 0:v -map "[aout]" \
    -c:v copy -c:a aac -b:a 192k -shortest \
    "$OUT"
else
  echo "no music track found ($MUSIC_REL) — muxing voice only" >&2
  ffmpeg -y \
    -i "$STORY_DIR/video_silent.mp4" \
    -i "$VOICE" \
    -filter_complex "[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[aout]" \
    -map 0:v -map "[aout]" \
    -c:v copy -c:a aac -b:a 192k -shortest \
    "$OUT"
fi

rm -f "$STORY_DIR/video_silent.mp4" "$STORY_DIR/props.json"
build_state pass "reel.mp4 rendered + muxed"
echo ""
echo "DONE -> $OUT"
