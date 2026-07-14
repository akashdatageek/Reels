---
name: script
description: Third stage — write the reel's voiceover to the frames from the content stage. Produces input/<story>/script.md as a scriptwriter's cut (V1 draft → self-critique → V2), one voiceSegment per frame, with a deliberately chosen hook and tight, plain-language line craft. Use once frames.md exists and before authoring reel.json.
---

# Write the script — as a scriptwriter, not a summarizer

**Write the voice TO the frames.** The `content` stage has already locked the
reel's content in `input/<story>/frames.md` — each frame's point, its real
receipt, and its visual. Your job here is the *voiceover* that carries those
frames, not to invent new content. One `voiceSegment` per frame, in frame order.
If a frame has no real content behind it, go back to `content`/`research` — don't
paper over it with words.

**Length follows the value, not a target.** Make it as long as it needs to be to
genuinely inform the viewer — and no longer. Roughly 45–90s: go long enough that
the idea truly lands (define the concept, read the charts, land the stakes),
short enough that every line earns its place. **Never amputate substance to hit a
number; never pad a thin story to fill time.** The frames give you the structure:
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
- **Inherit the TRANSLATION TABLE — don't re-translate.** research.md already
  decided every term's plain form (and its scale analogy) once. Use those exact
  plain forms. **V2 checklist item: any jargon in the voiceover that is not in
  the translation table (as its plain form) is a defect** — either the line
  keeps insider words the table already translated (fix the line), or the term
  has no row at all (go back to `research` and add one; don't improvise a
  translation here).
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

**Assume zero background (write for a non-expert).** Beyond who/what/result/why,
the voice must actually *teach the idea*:
- **Define the concept** in one plain line before the finding ("AI chatbots
  answer touchy questions with a slant — usually without telling you").
- **Decode the numbers out loud** ("108 scores — that's 18 AIs across 6 topics").
- **Read the chart for them** ("each dot is one AI; almost all sit on the left").
- **Land the stakes in their world** ("the AI writing your emails and news
  summaries isn't neutral either").
If a smart non-expert would ask "wait, what does that mean?", the voice failed —
add the line.

## Worked example (V1 → critique → V2)

- **V1 hook:** "Today a company announced a new AI model that improves coding
  performance." → category noun, no stakes, no number, corporate voice.
- **Critique:** no problem before the announcement; "improves performance" is a
  promise, not a receipt; nothing concrete in the first 3 seconds.
- **V2 hook (number-shock + problem-first):** "AI still fumbles real bugs — this
  one just fixed **82% of them.**" → concrete number, a problem framed first, a
  receipt implied. The outro then calls back: "82%. On the bugs that used to
  win."

## Visuals are already decided (in frames.md)

Don't re-invent the visuals here — the `content` stage already assigned each
frame its real asset / figure / scene in `frames.md`. If writing the voice
reveals a frame's visual is wrong, note it and fix it back in `content`, so
frames.md stays the single source of truth the `author` stage reads.

## Tone note

The reel's `vibe` (set in reel.json by the `author` skill) also drives voice
delivery: `bold` = brisk news energy, `moody` = slow and intimate. Write V2 in
the register you intend to hear.

## Mark the gate (required)

Once V2 is written — one voiceSegment per frame, every line cross-checked
against research.md — record the gate:

```bash
python3 pipeline/state.py record output/<story> script pass "V2, ~Ns, plain-language pass done"
```

**Next:** invoke the `author` skill.
