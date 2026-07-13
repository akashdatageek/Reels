# Content frames — The Neutrality Project (v2: explain it for a non-expert)

Rebuilt so a smart, **non-technical** viewer fully gets it: the concept is
defined, every number is decoded, the charts are explained in plain words, and
the stakes land in their own life. ~75–80s, figure-led. Theme **light**, vibe
**bold-restrained**, accent **teal #12B98A** (non-partisan), handle **@startups.ai**.
Every receipt traces to `research.md` → results.html / homepage.

**Coverage:** concept (fr2) · who+how (fr3) · what/result (fr4) · proof (fr5) ·
contrast (fr6) · fairness (fr7) · why-you-care (fr8). Numbers decoded inline;
figures carry plain annotations. Non-partisan throughout; it's *this open test's*
finding.

| # | Role | Point (one line) | Content — receipt + source | On-screen text | Visual + plain annotation |
|---|------|------------------|----------------------------|----------------|---------------------------|
| 1 | hook | The most neutral AI is Grok | Grok 4.5 = −0.02, closest to 0 [results] | **MOST NEUTRAL AI: GROK** | HookCard, emphasize *GROK* |
| 2 | concept | AIs have a political lean, baked in | "AI does more than answer questions. It frames how we think"; default worldview [home] | AI has a *political lean* | HookCard — the missing "what this means" |
| 3 | who + how | Independent group gave 18 AIs a political survey | The Neutrality Project · 18 models · ~4,000 real opinion-poll questions [home/results] | 18 AIs · a 4,000-question survey | HookCard/text — "like a survey a person takes" |
| 4 | what / result | Almost all leaned left — 97 of 108 | 97/108 scores left; 18 AIs × 6 topics = 108 [results] | 97 of 108 leaned LEFT | FigureScene aggregate bar · figureFocus spotlight cluster "ALL LEFT OF CENTER" · **annotations:** "Each dot = one AI", "Left = progressive · Right = conservative" |
| 5 | proof / twist | Grok landed dead center | Grok 4.5 −0.02, only one whose band includes 0 [results] | Grok = most balanced | FigureScene neutrality map · figureFocus spotlight Grok · **annotations:** "Closer to the middle = more neutral", "Grok sits on the line" |
| 6 | contrast | Phi-4 most one-sided + dodged questions | Phi-4 −0.59, refused 26% (1 in 4) [results] | Phi-4: dodged 1 in 4 | StatCallout **26%** — gloss "dodging is its own bias" |
| 7 | why-fair | 3 countries decided left vs right | multi-country reference, 3 countries/labs [home] | 3 countries kept it fair | HookCard/text |
| 8 | why-you-care | Its lean becomes your information | assistants' assumptions "become part of their decisions" [home] | Its lean → *your* news, emails, homework | HookCard — the stakes in their life |
| 9 | outro | It has a side — check it | results public + reproducible [results] | Most neutral: Grok. Check the rest. | OutroCard + @startups.ai |

## Notes for downstream stages
- **script:** one voiceSegment per frame; keep each to 1–2 plain sentences.
  Decode 108 out loud (fr4), gloss "refused" (fr6), read the charts (fr4/fr5).
- **author:** ADD `annotations` to the two FigureScenes (plain-language, per the
  table) — this is what explains the chart to a non-expert. Keep `figureFocus`
  zooms from the prior pass. Splitting who/how (fr3) from the result figure (fr4)
  also fixes the earlier 14s over-long figure scene.
- **figures:** reuse `assets/aggregate_scale.png` (fr4) and
  `assets/neutrality_map.png` (fr5). No generated images.
- **caption.txt:** credit The Neutrality Project (neutralityproject.org, Release
  01); note it's *this open test's* finding, models judged vs their own range.
