---
name: editor
description: Final stage — review the rendered reel like an editor, then tighten it. LOOK at the actual frames/images, catch weak or off-story visuals and pacing problems, fix them in reel.json (or regenerate), re-run the build, then write caption.txt and hand off the path. Use after a build, or any time a reel needs a critical pass before delivery.
---

# Edit — review the render, then tighten

A render is a draft, not a delivery. Look at it critically before it ships.

## 1. Actually look

- **Read the generated images** (`output/<story>/images/*.png`) — don't trust
  the prompt, view the file. Regenerate any image that's weak, off-story, or
  reads as generic AI slop: fix the scene's `imagePrompt`, then
  `python3 pipeline/generate_images.py output/<story>/reel.json --force`.
- **Spot-check the render** without a full re-encode by rendering a still of a
  specific frame:
  ```bash
  cd remotion && npx remotion still Reel /tmp/frame.png \
    --frame=<n> --props=<story>/props.json --public-dir=<story>
  ```
  (or just open `reel.mp4`). Confirm safe zones, legibility, and that figures
  are readable.

## 2. Apply the editor's lens to the finished thing

- Is there a **problem/villain before the announcement**?
- Is there a **proof moment** — a receipt (real chart/terminal/photo), not a
  promise?
- Are stats **felt** via contrast, not just listed?
- Does the **outro call back** to the hook?
- **Structure check:** does this reel's scene order differ from the last one?
  If it's the same sequence again, break it.
- **Figures explained:** every shown graph has a `voiceSegment` that names the
  axes/colors and reads the takeaway.

Anything that fails → fix in reel.json and re-run the relevant build step (only
`generate_images.py` for image swaps; full `make_reel.sh` if text/timing
changed).

## 3. Package and hand off

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
