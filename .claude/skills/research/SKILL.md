---
name: research
description: First stage of making a reel — run BEFORE any scripting, every time. Verify the story from the primary source plus 2–3 independent ones and write input/<story>/research.md with sourced facts, killer stats, and ranked hook angles. Use when starting a new reel from a link, brief, or story folder.
---

# Research pass (mandatory, before any scripting)

The whole pipeline's credibility rests here: **every on-screen stat must trace
to a source URL in research.md.** If the story can't be verified from at least
2 independent sources → stop and ask.

## Steps

1. **Read the input.** `input/<date>-<slug>/brief.md` and everything in its
   `assets/` folder. The brief can be as thin as one link.

2. **Primary source first.** WebFetch the official blog, docs, model card, or
   launch post — primary beats news aggregators. Use
   `python3 pipeline/extract.py <url> --out input/<story>/extracted` when you
   need clean article text.

3. **Confirm independently.** WebSearch 2–3 independent sources to confirm the
   key claims and numbers. If sources conflict, flag it — never guess.

4. **Enrich.** Concrete benchmarks, pricing, availability date, comparison to
   the previous version / competitors — the specifics that make a script land.

5. **Angle check.** Quick search of what's already being said, so the hook
   isn't the same take everyone posted 6 hours ago.

6. **Write `input/<story>/research.md`:**
   - **SOURCE INVENTORY** (mandatory — see below)
   - **TRANSLATION TABLE** (mandatory — see below)
   - Verified facts, each with a source URL
   - 2–3 killer numbers/stats (candidates for StatCallout / ChartScene)
   - Suggested hook angles, ranked
   - Anything unverified → marked ⚠️ and excluded from the script

Also extract the spine of the story: what launched, who, why it matters, and
the 2–3 concrete numbers that prove it.

## SOURCE INVENTORY (mandatory) — harvest, don't notice

Facts must be **systematically harvested, not noticed in passing**. Enumerate
**EVERY figure, chart, screenshot, number, named entity, and quotable line** in
the provided source(s) — walk each source top to bottom and log every item, even
the ones you're sure you won't use. Then decide each one:

| # | Type | Item | Where | USE/SKIP | Reason (one line) |
|---|------|------|-------|----------|-------------------|
| 1 | chart | Leaderboard bar chart, 18 models | results p2 | USE | the proof beat |
| 2 | number | −0.82 environment avg (strongest lean) | results p2 | USE | most extreme per-topic stat |
| 3 | quote | "It frames how we think." | home p2 | USE | stakes in seven words |
| 4 | entity | Founder bios (3 people) | home p7–8 | SKIP | credibility, not story |

- **Skipping must be deliberate, never accidental.** An item with no row was
  *missed*, not skipped — the inventory is the proof of exhaustiveness.
- Ready-made explainers count as items: sources often carry **their own plain-
  language labels** (an axis legend, a caption, a "what this means" card).
  Harvest them — they're pre-translated gold for the TRANSLATION TABLE.
- Downstream contract: the `content` skill must **justify any USE-marked item
  that doesn't appear in frames.md** — so a USE mark is a real commitment, and
  a dropped one leaves a written trail.

## TRANSLATION TABLE (mandatory) — decide the plain words ONCE

Every technical term and insider number the story needs gets its plain-English
replacement **decided here, once** — grade 6–8 words. Where an abstract quantity
needs *scale*, add one **physical analogy** ("5B parameters" → "a brain about
100× smaller than ChatGPT's"). The `content` and `script` stages **INHERIT**
this table — they never invent their own translation mid-sentence.

| Term / number (source's words) | Plain English (grade 6–8) | Analogy (if scale needs it) |
|---|---|---|
| "self-anchored ideological axes" | each AI graded against its own most extreme answers | — |
| "0.60 vs 0.85, lower is better" | about a third fewer mistakes | — |
| "5B parameters" | the size of the AI's brain | ~100× smaller than ChatGPT's |

Rule of thumb: if the term would appear on screen or in the voice, it needs a
row. The `script` skill treats any jargon **not covered by this table** as a V2
defect, and the `comprehension` gate uses the table to route failures — a term
that fails *with* a row means the script ignored the table; a term that fails
*without* a row means research missed it. Keep the table complete.

## Worked example (research.md shape)

```markdown
# GRAM — verified facts
- Beats the prior best on the benchmark: 0.60 vs 0.85, lower is better.
  [source: https://example.com/gram-paper §4.2]
- ~10× smaller than the model it beats. [source: https://example.com/blog]
- ⚠️ "runs on a laptop" — claimed in one tweet, not in the paper. EXCLUDE.

## Killer numbers
- 0.60 vs 0.85 (headline contrast)  ·  10× smaller

## Hook angles (ranked)
1. Contrarian — tiny model beats the giants
2. Number-shock — a third fewer errors
```

Every kept line carries a source URL; anything that can't be sourced twice is
marked ⚠️ and left out.

## Rule

Never carry an unverified stat forward. If ≥2 sources don't agree, stop and ask.

**When the picture is incomplete, ask for manual data.** If a primary source is
blocked/unreachable (e.g. an egress-policy 403), a number can't be confirmed, or
key data is missing, do NOT proceed on partial info and do NOT substitute
adjacent/lookalike data (a different paper, a different lab's benchmark) as if it
were the source. Write down what you *can* verify, mark the rest ⚠️, and **ask
the user to provide the missing data manually** — paste the text, or drop a
screenshot/file into the story's `assets/`. Better a paused reel than a
confident-but-wrong one.

## Mark the gate (required — the reel can't ship without it)

Once research.md is written and every kept fact carries a source, record the
gate so the final `handoff.sh` can see this stage passed:

```bash
python3 pipeline/state.py record output/<story> research pass "verified from N sources"
```

If you had to stop and ask for manual data, don't record `pass` — leave it
unrecorded (handoff stays blocked) until the story is actually verified.

**Next:** invoke the `content` skill (generate the frames), then `script`.
