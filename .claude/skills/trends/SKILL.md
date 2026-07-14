---
name: trends
description: Keep the pipeline's trend knowledge fresh as DATA, not prose. Two modes — REFRESH (run weekly, or when preflight warns the data is stale) web-searches current Instagram Reels formats/editing styles/algorithm changes for a faceless AI-news channel and rewrites trends-current.md; APPLY (read by the author skill) picks at most 1-2 current tactics that fit the story. Use when asked to refresh trends, when preflight warns trends-current.md is older than 14 days, or from author when styling a reel.
---

# Trends — refreshed data, not stale prose

Trend knowledge goes stale in weeks. So it lives in a **dated data file this
skill regenerates** — `.claude/skills/trends/trends-current.md` — never as
hardcoded advice in the other skills. `preflight.py` warns when the file is
older than 14 days; that warning means "run REFRESH mode before the next reel."

The durable 2026 shifts are NOT here — they're hardcoded where they're used
(sendable frame role → `content`; caption keywords + 3–5 hashtags + series
naming → `editor`; cut density → `author`). This file carries only the
fast-moving layer on top.

## REFRESH mode (run weekly)

1. **Web-search the current state** (3–5 searches, this week's results):
   - Instagram Reels algorithm changes / ranking-signal updates
   - currently-hot Reels formats & editing styles
   - what's working for faceless / educational / tech-news channels
   - caption & discovery (SEO/keywords/hashtags) changes
2. **Filter hard for OUR channel.** Keep only tactics compatible with
   **faceless, credibility-first** AI-news content. Skip lip-sync, dance,
   talking-head/selfie-cam, GRWM, couple/reaction formats — no matter how hot.
3. **Rewrite `trends-current.md`** (full replacement, not append):
   - **Dated header**: `Updated: YYYY-MM-DD` (preflight parses this exact key).
   - **5–8 currently-hot formats/tactics.** Each entry MUST have three parts:
     *what it is* · *why it works (the signal it feeds)* · ***how it maps to
     OUR scene system*** — name the concrete scene type / reel.json field
     (`FigureScene.figureFocus`, `StatCallout.statVariant`, `HookCard.textStyle`,
     `transition`, `bgStyle`, `stickers`, `cover.png`, `caption.txt`…). An entry
     that can't name its mapping doesn't go in the file.
   - **A "stale / avoid" list** — tactics that died, got penalized, or never
     fit a faceless credibility channel, each with a one-line reason.
   - **Sources** — the URLs the entries came from.
4. Sanity: keep it under ~120 lines — it's a working reference, not a report.

## APPLY mode (read by the `author` skill)

- Read `trends-current.md` **before choosing the visual identity**.
- **Pick at most 1–2 tactics** that genuinely fit the story's tone and content.
  A data-explainer might take the sendable-stat card + cut-density pattern; a
  drama story might take a kinetic-type hook.
- **Never force a trend onto a serious piece.** A credibility story outranks
  any tactic — when in doubt, apply zero trends. The stale/avoid list is
  binding: nothing on it goes into a reel even if it "would look cool."
- Trends season the reel; the frames decide it. If applying a tactic would
  change WHAT a frame says (not just how it moves), it's out of scope here —
  that's a `content` decision.
