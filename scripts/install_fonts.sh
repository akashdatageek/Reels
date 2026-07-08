#!/usr/bin/env bash
# Install the reel fonts (Archivo Black, Inter, JetBrains Mono) as system
# fonts so Remotion's headless Chromium picks them up without any network
# or browser-side font loading. Sources: @fontsource packages in
# remotion/node_modules (run `npm install` there first).
#
# Usage: bash scripts/install_fonts.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_DIR/remotion/node_modules/@fontsource"
DEST="${XDG_DATA_HOME:-$HOME/.local/share}/fonts/reels"
mkdir -p "$DEST"

FILES=(
  "archivo-black/files/archivo-black-latin-400-normal.woff2"
  "inter/files/inter-latin-400-normal.woff2"
  "inter/files/inter-latin-600-normal.woff2"
  "inter/files/inter-latin-700-normal.woff2"
  "inter/files/inter-latin-800-normal.woff2"
  "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"
  "jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2"
)

for f in "${FILES[@]}"; do
  src="$SRC/$f"
  base="$(basename "$f" .woff2)"
  out="$DEST/$base.ttf"
  [ -f "$src" ] || { echo "missing $src — run: cd remotion && npm install" >&2; exit 1; }
  python3 - "$src" "$out" <<'PY'
import sys
from fontTools.ttLib import TTFont
font = TTFont(sys.argv[1])
font.flavor = None  # decompress woff2 -> plain ttf
font.save(sys.argv[2])
PY
  echo "installed $base.ttf"
done

fc-cache -f "$DEST" >/dev/null 2>&1 || true
echo "done -> $DEST"
