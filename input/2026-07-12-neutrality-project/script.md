# Script — The Neutrality Project (v4: reference cut, written to frames v3)

One voiceSegment per frame, 11 frames, ~185 words ≈ 66s voice / ~70s reel.
Register: brisk but credible, **non-partisan**. Every term uses the TRANSLATION
TABLE's plain form; every text scene ≤20 words (preflight hard cap).

## V1 (draft) — and what's wrong with it

V1 opened "The most politically neutral AI right now? It's Grok." then reused
the v3 lines. Three defects, found against the comprehension gate's notes on
the old cut:
1. **Deictic chart-talk.** "On the map… landed right on the line" — an
   audio-only viewer can't see a map; the gate flagged it. The voice must
   self-describe the geometry ("picture all eighteen on one line…").
2. **"Left/progressive" undefined at first use.** 97-of-108 landed before any
   plain meaning of "left". Translation table says: gloss as *toward social
   change* at first mention.
3. **"Six topics" never named.** The gate's exact catch. The topics now have
   their own frame (fr6) with the source's plain labels.

## V2 (final) — the voiceover, frame by frame

| # | Role | `voiceSegment` | words |
|---|------|----------------|-------|
| 1 | hook | "The most politically neutral AI right now? It's Grok." | 9 |
| 2 | concept | "Every AI chatbot leans one way on hot topics — baked in, whether it tells you or not." | 16 |
| 3 | who+how | "An independent group, The Neutrality Project, gave eighteen AIs a political survey — almost four thousand questions." | 16 |
| 4 | result+sendable | "Eighteen AIs, six topics each — that's one hundred eight scores. Ninety-seven of them leaned left." | 16 |
| 5 | proof | "Picture all eighteen on one line, left to right. Left means favoring social change; right, tradition. Nearly all sit left." | 20 |
| 6 | topics | "The six topics: climate, social values, national identity, religion, money, and war and peace. The lean is hardest on climate." | 20 |
| 7 | twist | "Closer to the middle of that line means more neutral. The closest — so close it may be exactly neutral: Grok." | 20 |
| 8 | contrast | "The most one-sided: Microsoft's Phi-4. It dodged one in four questions — and dodging hides a lean too." | 17 |
| 9 | why-fair | "The grading rules were set in advance by referees from three countries — so no one country's politics defined the middle." | 20 |
| 10 | stakes | "Because AI writes your emails, your homework, your news. If it leans, your information leans." | 15 |
| 11 | outro | "Your AI has a side — now you can check it. Which one do you use? Most neutral today: Grok." | 19 |

**Total 187 words ≈ 67s voice → ~71s reel with pads.** All scenes ≤20 words →
every scene lands under the 8s pacing warn; text scenes clear the preflight cap.

## Comprehension-gate iteration log

- **Iteration 1: FAIL.** Fresh viewer flagged (i) "Second place? Also Grok" —
  two Grok entries were never established in the narration; (ii) the fairness
  line read as "AIs decided?" and forced a re-read; (iii) "Elon Musk" was a
  name the narration never explained. All three are script-clarity defects (no
  translation-table rows involved) → fixed in V2: runner-up claim moved to the
  figure's on-screen annotation only; fairness line recast; the person's name
  dropped from the voice (Grok is already "the most neutral AI" in the hook).
- **Iteration 2: FAIL.** Two stumbles left: the viewer back-solved 18×6 to
  parse "97 of 108", and "referee AIs" raised "why does that make it fair?" →
  fr4 now derives the math BEFORE the total ("Eighteen AIs, six topics each —
  that's one hundred eight scores"); fr9 states the why ("so no one country's
  politics defined the middle").
- **Iteration 3: PASS.** Correct retell, every term/number defined from the
  narration alone, zero guess/re-read lines.
- **Post-factcheck revision + re-gate.** The editor's factcheck flagged "dead
  center" as overstating −0.02 ± 0.047 (research supports "so close it may be
  exactly neutral") and on-screen "4,000" vs the verified 3,987. fr7 recast to
  the research's own decoder phrasing (fr10 trimmed 2 words to hold ~75s);
  transcript changed → comprehension re-run with a fresh subagent (below).

## Checklist (per the script skill)

- **Hook archetype:** contrarian/named-result (Grok twist). Differs from the
  GRAM (number-shock) and Edviro (problem-first) openers. ✔
- **Translation-table conformance:** "left" glossed *toward social change*
  (fr5); "108" decoded *18 AIs × 6 topics* (fr4); "refused" → *dodged* (fr8);
  topics named in plain labels (fr6); "check it yourself" for *reproducible*
  (fr11); no off-table jargon remains. ✔
- **Deictic references removed:** no "map", no "this chart" — fr5/fr7
  self-describe ("picture all eighteen on one line…", "closer to the middle of
  that line"). ✔
- **Outro calls back** to the hook's exact result ("Most neutral today: Grok")
  and asks one genuine question ("Which one do you use?"). ✔
- **Non-partisan:** reports the benchmark's finding, names no side as right or
  wrong; fairness beat (fr9) keeps the method honest.
- Every line cross-checked against research.md inventory IDs (fr4→N1, fr5→F2,
  fr6→F3/N6, fr7→N8/N9, fr8→N10, fr9→home p4, fr11→Q8).

## Notes for the `author` stage
- Scenes/visuals per frames.md v3 (figureFocus counts there).
- Vibe `bold`, `voiceStyle`: "Narrate clearly and evenly, like a credible
  explainer — engaged but calm and non-partisan: ".
- Trends APPLY (≤2): sendable stat card (fr4 → also cover.png) + genuine
  comment question (fr11). Nothing from stale/avoid.
