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
   - Verified facts, each with a source URL
   - 2–3 killer numbers/stats (candidates for StatCallout / ChartScene)
   - Suggested hook angles, ranked
   - Anything unverified → marked ⚠️ and excluded from the script

Also extract the spine of the story: what launched, who, why it matters, and
the 2–3 concrete numbers that prove it.

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
