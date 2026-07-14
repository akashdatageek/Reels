---
name: comprehension
description: Fourth stage — a gate that runs AFTER script.md and BEFORE author. Verifies a non-technical viewer actually UNDERSTANDS the reel, by spawning a fresh-context subagent whose only input is the V2 voiceover text and having it play a smart viewer with zero background. Fails on any undefined term/number, a wrong retell, or any line the viewer had to guess at. Use once script.md's V2 exists; blocks authoring until it passes.
---

# Comprehension gate — is it UNDERSTOOD?

Our reels are factually correct but a non-technical viewer doesn't always
*understand* them. The `script` skill says "explain for zero background" — this
gate **verifies** it, with fresh eyes that can't cheat off the source. It is the
comprehension half of the two quality gates; the `factcheck` gate (in `editor`)
is the *truth* half. **factcheck = is it TRUE · comprehension = is it UNDERSTOOD.**

Run this the moment `script.md`'s V2 is written, before the `author` stage turns
it into scenes. A script that only insiders get should never reach a render.

## 1. Extract the V2 voiceover — and ONLY that

Pull the `voiceSegment` text of every frame from `script.md`'s V2 table, in
order, one line per frame. **Nothing else** goes to the reviewer — no
research.md, no frames.md, no source, no title, not this conversation. The
viewer hears only what the reel says out loud; that's the whole point.

## 2. Spawn a fresh-context reviewer (the `Agent` tool)

Launch a subagent (`Agent`, `subagent_type: general-purpose`) — a *fresh
context* is mandatory, so it can't fill gaps from knowledge you have and the
viewer won't. Paste the voiceover into this exact prompt:

> You are a smart, curious adult with ZERO background in AI, machine learning,
> statistics, or tech politics. You just watched a short social-media video and
> heard ONLY the narration transcript below — no visuals, no on-screen text, no
> captions, no sources, no title. Nothing else exists. Answer STRICTLY from
> these spoken words alone. Do NOT use outside knowledge to fill a gap — if the
> narration didn't explain something, you did not learn it, and you must say so.
> This is a comprehension test of the SCRIPT, not of you. Being generous helps
> no one. Be blunt and strict.
>
> === NARRATION (what you heard, in order) ===
> {{one voiceSegment per line}}
> === END NARRATION ===
>
> Answer in writing, numbered exactly (a)(b)(c)(d):
> (a) ONE-SENTENCE RETELL — In a single sentence, what was this video about?
> (b) TERMS & NUMBERS — List EVERY technical term, proper name, and number you
>     heard. For each, write what it means using ONLY the narration. If the
>     narration did not actually explain it, write "NOT EXPLAINED — my guess:
>     ..." Do not quietly explain it from your own knowledge.
> (c) SO WHAT — Why should a normal person care? Only from the narration.
> (d) GUESS / RE-READ LINES — Quote every sentence you had to re-read or that
>     made you think "wait, what does that mean?" If none, write "NONE".
>
> Finally print one line — VERDICT: PASS only if your (a) retell is correct AND
> nothing in (b) is marked NOT EXPLAINED AND (d) is NONE. Otherwise VERDICT:
> FAIL, followed by a one-line reason.

## 3. Grade it (the gate is strict on purpose)

The **gate FAILS** if ANY of these is true:
- the (a) one-sentence retell is wrong, vague, or misses the actual point;
- ANY term or number in (b) is marked `NOT EXPLAINED` / guessed — a viewer who
  has to guess what "108 scores" or "the map" means didn't understand it;
- (d) lists even one line the viewer had to re-read or puzzle over.

Only a clean sweep — correct retell, every term/number defined *from the
narration*, a clear reason to care, and zero guess lines — **passes**.

Don't argue with the reviewer. If it says a line was confusing, the line is
confusing — that's the whole signal.

## 4. Fix and re-run (max 3 iterations) — route each failure to the RIGHT stage

Before fixing anything, **cross-check every failed term against research.md's
TRANSLATION TABLE** — the table tells you which stage broke:

- **Failed term HAS a table entry** → the script **ignored the table**. The
  plain form was already decided; the voiceover just didn't use it. Fix is in
  `script.md`: swap the line to the table's plain form (+ its analogy). Cheap.
- **Failed term has NO entry** → the **research stage missed it** — the term was
  never harvested into the table at all. Go back to `research.md` first: add the
  row (plain form + analogy), then flow it through frames.md/script.md. Fixing
  only the script line would leave the gap for the next stage to trip on.

Then fix accordingly:
- **Undefined term/number** → route as above, and add the plain gloss in the
  `voiceSegment` ("108 scores — that's 18 AIs across six topics"). If the gap is
  a missing explainer beat (no frame even tries to define the concept), go back
  to the `content` skill and add the frame to `frames.md`, then rewrite the
  script to it — frames.md stays the single source of truth.
- **Deictic visual reference** ("on the map…", "this line") the audio can't
  follow → make the voice self-describe it ("on a left-to-right scale, the
  closer to center, the more neutral").
- **Wrong retell** → the spine is unclear; strengthen the hook/outro so the one
  idea is unmissable.

Re-extract the revised voiceover and **re-run step 2 with a NEW fresh subagent**
(never reuse the prior one — it's already seen the answers). Cap at **3
iterations**. If it still fails after three, STOP and ask the user — a script
that resists three honest passes has a content problem the pipeline shouldn't
paper over.

## 5. Record the gate (required)

```bash
# on a clean pass:
python3 pipeline/state.py record output/<story> comprehension pass "fresh viewer: retell correct, all terms defined, no guesses"
# if you had to stop after 3 failed iterations (then ask the user):
python3 pipeline/state.py record output/<story> comprehension fail "unresolved: <what the viewer still couldn't follow>"
```

`handoff.sh` requires `comprehension` green, so a reel whose script a fresh
viewer can't follow cannot ship.

**Next:** invoke the `author` skill.
