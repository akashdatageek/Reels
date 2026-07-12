# Content frames — The Neutrality Project

The reel's content, locked frame by frame **before** the voiceover. Every frame
carries a real receipt from `research.md` (→ `results.html` / homepage). This is
what the `script` stage writes voice to, and the `author` stage turns into scenes.

- **Format:** ~60s, figure-led explainer. **Theme:** light (credibility).
  **Vibe:** bold-restrained. **Accent:** teal `#12B98A` (non-partisan — not
  red/blue). **Handle:** @startups.ai.
- **Coverage:** WHO (fr2) · WHAT (fr3) · RESULT (fr1, fr4, fr5) · WHY (fr7) —
  all inside the first ~15s.
- **Carried caveat:** positions are relative to each model's *own* range, not an
  absolute political center; self-published Release 01, 18 models. Frame 6 states
  the fairness method; delivery must not imply an objective left lean.

| # | Role | Point (one line) | Content — receipt + source | On-screen text | Visual (real asset) |
|---|------|------------------|----------------------------|----------------|---------------------|
| 1 | hook | The most neutral AI right now is Grok | Grok 4.5 = **−0.02**, closest of 18 to a neutral 0; only model whose error band includes 0 [results.html] | **MOST NEUTRAL AI: GROK** | HookCard, emphasize *GROK* (teal) |
| 2 | who | An independent open group ran the test | **The Neutrality Project** — independent, open-source, grant-funded (not the labs it grades) [homepage] | The Neutrality Project · independent | HookCard/text (+ site mark) |
| 3 | what | It's a political-lean test on 18 AIs | 18 models · 12 labs · **~4,000** real opinion-poll questions · 6 axes (left ↔ right) [results.html / home] | 18 AIs · ~4,000 questions | FigureScene — six-axis pole table (crop from homepage.pdf p4) |
| 4 | result | Almost every model leaned left | **97 of 108** scores left of center; every model leaned ≥ a little; Grok closest to middle [results.html] | 97 of 108 leaned LEFT | FigureScene — aggregate −1↔+1 scatter, AVERAGE −0.41 (crop results.pdf p1–2) |
| 5 | proof | Grok sits at the center line; the leaderboard proves it | Neutrality Map: Grok 4.5 −0.02 marked "MOST NEUTRAL"; ranked list to Phi-4 [results.html] | The scoreboard | FigureScene — Neutrality Map w/ Grok marked (crop results.pdf p2) |
| 6 | contrast | The most one-sided model also dodged questions | **Phi-4 = −0.59** (most progressive) and **refused 1 in 4** questions (26%), flags all six axes [results.html] | Phi-4: most one-sided · refused 1 in 4 | StatCallout **26%** / bottom of leaderboard |
| 7 | why-fair | It's kept honest by outside judges | Left/right fixed by judge models from **3 different countries & labs**; circularity guard; per-axis refusal report [homepage] | 3 countries set the scale | FigureScene/text — simple fairness graphic |
| 8 | stakes (why) | An AI's hidden lean becomes yours | "When people delegate research, reasoning and writing to an assistant, its assumptions become part of their decisions" [homepage] | Its lean becomes your starting point | StatCallout/text, no chart |
| 9 | outro | See it for yourself | Results are public + reproducible; "every number is reproducible from the raw files" [results.html] | Most neutral: Grok. Check the rest. | OutroCard + @startups.ai |

## Notes for downstream stages
- **script:** one `voiceSegment` per frame, in this order; lead voice on fr1
  (Grok), ground with who/what on fr2–3, then result → contrast → fairness →
  stakes → outro. Keep it plain-language and non-partisan.
- **author/build — figures to crop** from `assets/`:
  1. six-axis pole table (homepage.pdf p4) → fr3
  2. aggregate −1↔+1 scatter, AVERAGE −0.41 (results.pdf p1–2) → fr4
  3. Neutrality Map with Grok marked MOST NEUTRAL (results.pdf p2) → fr5
  4. (optional) ranked 18-model list, Grok −0.02 … Phi-4 −0.59 (results.pdf p2–3) → fr5/fr6
- **No generated images planned** — every content frame rides a real figure or a
  verified number. (Backdrops for text frames optional, decided in `author`.)
