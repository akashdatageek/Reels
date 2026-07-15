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
changes ones you liked. Two ways to redo just one scene (files are keyed by a
hash of the prompt, `img_<hash>.png`, not the scene index):

- **Preferred — reword the prompt.** Improve the scene's `imagePrompt` (more
  specific subject, or switch the beat to a real asset / `FigureScene`). A
  changed prompt hashes to a *new* filename, so a plain re-run regenerates only
  that scene — no deletion needed. A better prompt beats a re-roll of the same
  one.
- **Same prompt, fresh roll.** Delete that scene's current file and clear its
  `image` field, then re-run without `--force` (existing files are skipped):

```bash
python3 - <<'PY'
import json, pathlib
p = "output/<story>/reel.json"; d = json.load(open(p))
img = d["scenes"][3].pop("image", None)          # the scene you're redoing
if img: pathlib.Path("output/<story>", img).unlink(missing_ok=True)
json.dump(d, open(p, "w"), indent=2)
PY
python3 pipeline/generate_images.py output/<story>/reel.json   # only the missing one
```

(Never delete `output/<story>/images/scene_03.png` by index — that naming is
gone; look up the real filename from the scene's `image` field.)

## 3. Apply the editor's lens to the finished thing

**Fact-check with fresh eyes — the `factcheck` gate.** Comprehension (is it
UNDERSTOOD) was already gated before authoring by the `comprehension` skill;
this gate is the other half — **is it TRUE**. You wrote this reel, so you'll
read past its weak spots. Launch a subagent (the `Agent` tool) whose only inputs
are `input/<story>/research.md` and the reel's on-screen claims — every number,
label, stat, name, and figure caption from `reel.json` plus a few exported
stills (§1) — *not* this conversation. Ask it one thing: **does every on-screen
claim trace to a sourced line in research.md?** It should flag any stat that's
unsupported, misattributed (wrong source/credit), or drifted from the receipt
(a rounded or transcribed number that no longer matches). Fix every flag in
reel.json — or cut the claim — then record the gate:

```bash
python3 pipeline/state.py record output/<story> factcheck pass "every on-screen claim traces to research.md"
```

If a claim can't be traced, don't record `pass` — fix it first. This is the
non-negotiable "never use an unverified stat" rule, enforced as a gate.

Then re-run the `script` skill's critique lens (problem before announcement · proof
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

- **Export a cover frame.** Pick the single strongest frame (usually the hook
  payoff) and render it to a still the post can use as its thumbnail:
  ```bash
  bash scripts/still.sh output/<story> <frame> output/<story>/cover.png
  ```
  Choose the frame by eye from §1's spot-checks — a legible, on-brand moment,
  not a mid-transition blur.
- **Write `output/<story>/caption.txt`** — captions are a search surface now,
  not a hashtag dump:
  - **First line = keyword-rich hook.** Lead with the exact phrase someone
    would search ("The most neutral AI in 2026 is…"), not a teaser — Instagram
    weighs the caption's first sentence most for discovery.
  - **Series tag** — episodic naming converts viewers to followers: a stable
    series name + episode number on its own line (e.g. `AI Receipts · Ep. 12`).
    Keep the same series name across reels of the same kind.
  - 2–3 line summary, source credit (from research.md), the handle
    **@startups.ai**.
  - **3–5 hashtags MAX, all niche-relevant** (`#AInews #AIbias #Grok` — never
    generic `#viral #fyp`). More tags dilute relevance signals and read as
    spam. Emoji in the caption are fine; on-screen text stays clean.
  - **Photo credits (required when owed).** Check
    `output/<story>/assets_manifest.json`: every row with
    `attribution_required: true` gets a credit line in caption.txt —
    `📷 <photographer> via <provider>` — one per photographer. Then **re-run
    `python3 pipeline/preflight.py output/<story>/reel.json`** to refresh the
    gate: preflight hard-fails a missing owed credit, so the ledger stays red
    until the credit lands.
- **Record the factcheck gate** (from §3 — every on-screen claim traces to
  research.md). Comprehension was already gated before authoring, so both
  quality gates — TRUE and UNDERSTOOD — are now green.
- **Hand off through the gate (never print the path yourself).** The reel is
  DONE only when `handoff.sh` exits 0 — it checks every required stage is green
  and *then* prints the output paths:
  ```bash
  bash scripts/handoff.sh output/<story>
  ```
  If it exits 1, it names the red gates — go back and clear them (a missing
  stage means that skill never recorded, or its check failed). Do **not** report
  `reel.mp4` any other way; the exit code is the source of truth.
- **Never post automatically.**

## Hard rules (always)

- Never use an unverified stat — everything on screen traces to research.md.
- Always credit the source in caption.txt.
- If the input included a launch video: use max 2–3 short clips (<5s each) as
  b-roll with our commentary overlaid — never re-post their video wholesale.
- Design constraints are baked into the components: 1080×1920 @ 30fps, IG safe
  zones (top 250px / bottom 320px), max 2 fonts, one accent color per reel.
