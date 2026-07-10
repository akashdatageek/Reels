---
name: script
description: Second stage — write the reel's script after research. Produces input/<story>/script.md as a scriptwriter's cut (V1 draft → self-critique → V2), with a deliberately chosen hook archetype and tight line craft. Use once research.md exists and before authoring reel.json.
---

# Write the script — as a scriptwriter, not a summarizer

Target **45–75s** (~60s when the story has depth; go shorter rather than
padding a thin story). Structure for the longer format:
**HOOK → CONTEXT → 3–5 KEY POINTS (each with a receipt) → SO-WHAT → OUTRO.**

Write `input/<story>/script.md` in three explicit parts:

- **V1 draft** — HOOK (0–3s, must stop the scroll) → CONTEXT → 3–5 KEY POINTS →
  SO-WHAT → OUTRO. Conversational, no jargon, short sentences.
- **Critique** — attack V1 like an editor: Is there a *problem/villain* before
  the announcement? Is there a *proof moment* (a receipt, not a promise)? Are
  stats *felt* via contrast ("soccer field vs classroom"), not listed? Does the
  outro *call back* to the hook?
- **V2** — rewrite fixing the critique; cross-check every line against
  research.md sources before it goes anywhere near reel.json.

## Hook archetypes — pick one deliberately, rotate day to day

Never open two reels the same way. Prefer problem-first over announcement.
- **Problem-first** — name the pain before the product ("Your agent forgets
  everything the second the chat ends.").
- **Number-shock** — lead with the stat that sounds impossible ("It fixed 82%
  of real GitHub issues.").
- **Contrarian** — reverse the consensus ("Everyone says bigger wins. This
  tiny model just beat them.").
- **Overlooked** — the buried detail nobody's covering ("Everyone's posting the
  demo. The footnote is the real story.").
- **Before/after** — the world-before and world-after in one breath.
- **Stakes** — who it helps or hurts, made concrete ("If you ship code, this
  changes your Monday.").

The first 3 seconds must contain a **concrete noun or number**, not a category
("a 30-second render", not "an exciting advance").

## Line craft (apply in V2)

- One idea per sentence; one sentence per caption group.
- Vary sentence length — a long setup then a 3-word punch.
- Concrete over abstract: name the thing, cite the number, show the actor.
- Cut hedges and corporate voice ("basically", "seamless", "game-changing",
  "revolutionary"). No forced slang either — the aesthetic can be loud, the
  words stay real.
- Make stats *felt* by contrast ("0.60 vs 0.85 — a third fewer errors"), not
  listed.
- The outro calls back to the hook's exact word or image so the reel closes a
  loop.

## Decide the visual intent per beat (write it into script.md)

For each beat, note *what shows it and why*: which beat gets a provided asset,
which gets a real source figure, which gets a generated image — and why that
image tells that beat. Screenshots of webpages must be cropped to the photo
region first. This intent is what the `author` skill turns into reel.json.

## Tone note

The reel's `vibe` (set in reel.json by the `author` skill) also drives voice
delivery: `bold` = brisk news energy, `moody` = slow and intimate. Write V2 in
the register you intend to hear.

**Next:** invoke the `author` skill.
