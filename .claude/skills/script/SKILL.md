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

**Lead with the ONE thing a viewer would text a friend.** Open on the single
most surprising, most repeatable finding — and prefer a **named, concrete
result over an abstract stat**. "The most neutral AI right now is Grok" beats
"97 of 108 scores landed left of center." The abstract stat is your *proof* in
beat 2, not your opener. If the result names a recognizable person, product, or
brand and defies expectations, that's almost always the hook.

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

## Plain language (write for the scroll, not the seminar)

A viewer is half-watching on a phone. If a line needs a re-read, they're gone.
- **Short, common words.** Aim ~grade 6–8. Read every line **out loud** — if
  it's hard to say, rewrite it.
- **Ban jargon and insider terms.** Translate the source, don't quote it: "self-
  anchored ideological axes" → "they tested each AI against its own most extreme
  answers"; "reproducible" → "anyone can check the math." If a technical idea is
  essential, say it in plain words in ≤1 sentence.
- **One clause per breath.** No nested sub-points inside a spoken line.
- **Numbers as a person would say them** ("one in four", not "26%").

## Cover the basics (an explainer must actually explain)

Punchy is not the same as complete. Before V2, confirm the reel answers the four
questions a first-time viewer has — and that all four are findable in roughly the
first 15 seconds:
- **WHO** made or did this (name the team/company/project).
- **WHAT** it is — the product / benchmark / thing, in one plain sentence.
- **WHAT they found** — the actual result, with its receipt.
- **WHY it matters** — the stakes for the viewer.

A hook full of numbers that never says *who* did it or *what* it is leaves the
viewer lost. Lead with the surprise (above), then immediately ground it: who +
what, fast.

## Worked example (V1 → critique → V2)

- **V1 hook:** "Today a company announced a new AI model that improves coding
  performance." → category noun, no stakes, no number, corporate voice.
- **Critique:** no problem before the announcement; "improves performance" is a
  promise, not a receipt; nothing concrete in the first 3 seconds.
- **V2 hook (number-shock + problem-first):** "AI still fumbles real bugs — this
  one just fixed **82% of them.**" → concrete number, a problem framed first, a
  receipt implied. The outro then calls back: "82%. On the bugs that used to
  win."

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
