---
name: editor
description: Final stage — review the rendered reel like an editor, then tighten it. LOOK at the actual frames/images, catch weak or off-story visuals and pacing problems, fix them in reel.json (or regenerate), re-run the build, then write caption.txt and hand off the path. Use after a build, or any time a reel needs a critical pass before delivery.
---

# Edit — review the render, then tighten

A render is a draft, not a delivery. Look at it critically before it ships.

## 1. Actually look

- **Read the generated images** (`output/<story>/images/*.png`) — don't trust
  the prompt, view the file.
- **Spot-check the render** by opening `reel.mp4`, or render a single frame for
  a specific beat:
  ```bash
  bash scripts/still.sh output/<story> <frame>   # -> /tmp/still_<story>_<frame>.png
  ```
  (`still.sh` rebuilds the props `assemble.sh` deletes and wires the story dir
  as the public dir, so images + audio resolve.) Confirm safe zones,
  legibility, and that figures are readable.

## 2. Regenerate a weak image (one scene, not all)

`generate_images.py --force` regenerates **every** image — costly, and it
changes ones you liked. To redo just one scene, delete its file, clear its
`image` field, and run **without** `--force` (existing files are skipped):

```bash
rm output/<story>/images/scene_03.png
python3 - <<'PY'
import json; p="output/<story>/reel.json"; d=json.load(open(p))
d["scenes"][3].pop("image", None); json.dump(d, open(p,"w"), indent=2)
PY
python3 pipeline/generate_images.py output/<story>/reel.json   # only the missing one
```

First improve the scene's `imagePrompt` (or switch the beat to a real asset /
`FigureScene`) — a better prompt beats a re-roll of the same one.

## 3. Apply the editor's lens to the finished thing

Re-run the `script` skill's critique lens (problem before announcement · proof
moment · stats felt by contrast · outro calls back) — this time against what's
actually on screen, not the words on paper. Plus the render-only checks:

- **Structure check:** does this reel's scene order differ from the last one? If
  it's the same sequence again, break it.
- **Figures explained:** every shown graph has a `voiceSegment` that names the
  axes/colors and reads the takeaway (per the `author` skill's "show the real
  thing" rule).
- **Legibility:** type clears the IG safe zones (top 250px / bottom 320px) and
  nothing important sits under the caption band.

Anything that fails → fix in reel.json and re-run the relevant build step (just
the image regen above for a picture swap; full `make_reel.sh` if text or timing
changed).

## 4. Package and hand off

- **Write `output/<story>/caption.txt`:** 1-line hook, 2–3 line summary, source
  credit (from research.md), the handle **@startups.ai**, 8–12 hashtags. Emoji
  in the caption are fine; on-screen text stays clean.
- **Show the output path** (`output/<story>/reel.mp4`).
- **Never post automatically.**

## Hard rules (always)

- Never use an unverified stat — everything on screen traces to research.md.
- Always credit the source in caption.txt.
- If the input included a launch video: use max 2–3 short clips (<5s each) as
  b-roll with our commentary overlaid — never re-post their video wholesale.
- Design constraints are baked into the components: 1080×1920 @ 30fps, IG safe
  zones (top 250px / bottom 320px), max 2 fonts, one accent color per reel.
