# Content frames — The Neutrality Project (v3: reference cut, all gates)

Rebuilt to the current skill set: every text scene ≤20 words of narration,
evidence-heavy narration lives in FigureScenes with `figureFocus` motion, one
designed **sendable** frame, cut-or-move every ~4s. ~70s, figure-led. Theme
**light**, vibe **bold-restrained**, accent **teal #12B98A** (non-partisan),
handle **@startups.ai**. Every receipt traces to `research.md` (inventory IDs
cited). Translations inherited from the TRANSLATION TABLE — "left" is always
glossed as *toward social change*, "108" always decoded as *18 AIs × 6 topics*.

| # | Role | Point (one line) | Content — receipt + source | On-screen text | Visual |
|---|------|------------------|----------------------------|----------------|--------|
| 1 | hook | The most neutral AI is Grok | Grok 4.5 −0.02, only band containing 0 [N8] | **MOST NEUTRAL AI: GROK** | HookCard, emphasize *GROK* |
| 2 | concept | Every AI leans on hot topics, silently | "It frames how we think"; lean = which options it validates [Q1,Q3] | AI has a *hidden lean* | HookCard |
| 3 | who+how | An independent group measured it with a survey | The Neutrality Project · 18 AIs · 3,987 questions [E1,N2,N3] | 18 AIs · 4,000 questions | HookCard — "The Neutrality Project" named on screen |
| 4 | result+**sendable** | 97 of 108 scores leaned left | 97/108; 108 = 18 AIs × 6 topics [N1] | **97/108 leaned LEFT** · 18 AIs × 6 topics · The Neutrality Project | StatCallout `donut` "97/108" — self-contained, screenshot-ready; doubles as cover.png |
| 5 | proof | See them cluster left on one line | aggregate strip, avg −0.41 [F2,N5] | Almost all sit LEFT | FigureScene `aggregate_scale.png` · 2 focus moves · annotations: "Each dot = one AI", "Left = social change · Right = tradition" |
| 6 | topics | The six topics, named — hardest on climate | per-dimension strips; env −0.82 strongest, foreign policy −0.11 mildest [F3,N6,N7] | 6 topics · hardest: CLIMATE | FigureScene `topics_strips.png` (new crop) · 2 focus moves down the strips · annotations: "Six topics, plain labels", "Climate = strongest lean" |
| 7 | twist | Grok lands dead center; 2nd is also Grok | Grok 4.5 −0.02 (band incl. 0), Grok 4.3 −0.11 [F1,N8,N9] | GROK: dead center | FigureScene `neutrality_map.png` · spotlight → circleDraw on Grok · annotations: "Middle = more neutral", "2nd place: Grok 4.3" |
| 8 | contrast | Most one-sided dodged 1 in 4 | Phi-4 −0.59, refused 26%; dodging hides a lean [N10,N11] | Phi-4: dodged **1 in 4** | StatCallout `donut` "26%" |
| 9 | why-fair | 3 countries set the rules | multi-country reference, circularity guard [home p4] | 3 countries kept it fair | HookCard |
| 10 | stakes | Its lean becomes your information | assistants' assumptions "become part of their decisions" [Q2] | Its lean → *your* news | HookCard |
| 11 | outro | It has a side — check it; which do you use? | results public + reproducible [Q8] | Most neutral: Grok. Which do YOU use? | OutroCard + @startups.ai — genuine comment question |

**Sendable check (fr4):** claim + number + who measured, all on the frame —
"97/108 leaned LEFT · 18 AIs × 6 topics · The Neutrality Project". Sends with
zero caption. ✔

**Coverage:** concept fr2 · who fr3 · what/result fr4–5 · topics fr6 · proof
fr7 · contrast fr8 · fairness fr9 · stakes fr10. WHO/WHAT/RESULT/WHY all inside
the first ~15s (fr1–4).

## Dropped USE items (inventory accounting)

| Item | Why dropped |
|------|-------------|
| N5 avg −0.41 (as narration) | fr5 shows the average marker on the strip; saying a decimal out loud fails plain-language — visual only |
| N7 foreign policy −0.11 (as narration) | folded visually into fr6's strips; naming two decimals aloud would bloat the topics beat |
| N12 GPT −0.46 / Claude −0.48 | strong personal-stakes beat, but it's a THIRD stat cluster — reel already carries 97/108, −0.82, 26%; saving as the hook of a follow-up episode ("where does YOUR AI land?") |
| N9 as its own frame | kept, but as fr7's second focus step instead of a separate scene — cheaper cut |
| Q4 "trust us is not verifiable" | outro carries "check it yourself" (Q8) — one trust line is enough |

## Notes for downstream stages
- **script:** one voiceSegment per frame; text scenes (fr1–4, 8–11) ≤20 words
  HARD; FigureScenes ≤20 words too (keeps every scene under the 8s pacing warn).
- **author:** figureFocus steps as specified (fr5 ×2, fr6 ×2, fr7 ×2 moves) —
  with 11 scene entries that's ~17 visible moves ≈ one per 4s. Trends APPLY:
  tactic #1 (sendable stat card → cover.png) + #5 (genuine comment question).
  Nothing from the stale/avoid list.
- **figures:** `assets/aggregate_scale.png` (fr5), `assets/topics_strips.png`
  (fr6, new crop from results.pdf p4–5), `assets/neutrality_map.png` (fr7). No
  generated images.
- **caption:** keyword-first line + series tag `AI Receipts · Ep. 1` + 3–5 tags.
