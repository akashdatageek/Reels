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

**Next:** invoke the `script` skill.
