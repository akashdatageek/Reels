# Script — The Neutrality Project

**Target:** ~60s. **Register:** brisk but credible news (bold), **not** partisan.
**Non-negotiable tone rule:** this is a reel *about* political neutrality, so the
reel itself must stay neutral — report the finding, never editorialize on whether
a left lean is good or bad. The hero is the open, checkable *method*, not a "side."
Every number traces to `research.md` → `results.html`.

**Hook archetype chosen:** Number-shock + Contrarian (the Grok twist subverts the
expectation that xAI would be the biased one).

---

## V1 (draft)

- **HOOK:** "Someone measured the politics of 18 AI models. 97 out of 108 landed left of center."
- **CONTEXT:** "When you ask an AI to summarize a debate, its worldview quietly becomes your starting point — usually without you noticing."
- **POINT 1:** "The Neutrality Project ran 18 models through nearly 4,000 real survey questions. Every one leaned progressive overall."
- **POINT 2:** "The twist: the most neutral model was Grok. The most progressive, Microsoft's Phi-4, also refused one in four questions."
- **POINT 3:** "And they didn't grade against their own idea of 'center.' Each model was measured against its own far-left and far-right, judged by models from three different countries."
- **SO-WHAT:** "It's open source, reproducible, and funded by grants — not the labs it's grading."
- **OUTRO:** "97 of 108. Now you can see it."

## Critique (attack V1 like an editor)

- **Problem before the announcement?** Weak — the hook is a number, but the
  *stakes* (an invisible worldview steering your thinking) land only in context.
  Fix: make context hit the stakes in one concrete line, immediately.
- **Proof moment?** Strong — 97/108, the leaderboard, the method are all real
  figures we can put on screen. Keep FigureScenes; don't paraphrase the charts.
- **Stats felt by contrast?** Partly. "Grok most neutral vs Phi-4 refused 1 in 4"
  is a good contrast — sharpen it. "97 of 108" is strong. "Nearly 4,000 questions"
  fine.
- **Accuracy risk:** "Every one leaned progressive" — the source says exactly that
  ("every model leans progressive overall, xAI's Groks alone sit near center"),
  but Grok 4.5's error band includes 0. Fix: "even the most neutral one" so the
  twist and the truth agree.
- **Honesty (relative-not-absolute):** must keep "against its own far-left and
  far-right" — without it we'd imply an *objective* left lean, which the project
  explicitly disclaims. Point 3 carries it. Keep.
- **Neutral tone:** V1 doesn't editorialize. Guard it in V2 — no adjectives that
  cheer or jeer the result.
- **Outro callback?** Yes — "97 of 108" mirrors the hook. Tighten to a checkable
  action ("a number you can check yourself").
- **Line length:** several long sentences; break them. Spoken "one in four" >
  "26%."

## V2 (final — this goes to the author stage)

1. **HOOK:** "Someone measured the politics of 18 AI models. 97 of 108 scores landed left of center."
2. **CONTEXT / STAKES:** "Ask an AI to summarize a debate, and its worldview quietly becomes your starting point. The Neutrality Project decided to measure that — in the open."
3. **POINT 1 — the finding:** "Eighteen models. Almost 4,000 real survey questions. Every one leaned progressive — even the most neutral of them."
4. **POINT 2 — the twist:** "And the most neutral was Grok. The most progressive, Microsoft's Phi-4, also dodged one in four questions."
5. **POINT 3 — why trust it:** "They didn't grade against their own idea of center. Each model was measured against its own far-left and far-right — judged by models from three different countries."
6. **SO-WHAT:** "Open source. Reproducible. Funded by grants, not the labs it grades."
7. **OUTRO:** "97 of 108. Now it's a number you can check yourself."

**Word count ≈ 105 → ~45s voice → ~60s reel with scene pauses. On target.**

---

## Per-beat visual intent (hand-off to the `author` stage)

Deliberately **figure-led** — an explainer built on the project's REAL charts
(this is the cure for the "AI-slop" look). Theme **light** (editorial /
credibility). Vibe **bold** but restrained. Accent: a neutral, non-partisan hue
(recommend a **teal/blue-green ~#12B98A**, echoing the site's own mint — avoids
red/blue partisan coding, which matters for this topic). Handle **@startups.ai**.

| # | Beat | Scene | Visual (real asset) | Why |
|---|------|-------|--------------------|-----|
| 1 | Hook | HookCard | text, emphasize *97 of 108* | scroll-stopping number, clean |
| 2 | Context | HookCard/text | short statement, no chart | the stakes, said plainly |
| 3 | Finding | FigureScene | **aggregate positions scatter** (−1↔+1, AVERAGE −0.41) — crop from results/home | show every model landing left; explain the −1↔+1 ruler out loud |
| 4 | Twist | FigureScene | **Neutrality Map / ranked leaderboard** with Grok 4.5 −0.02 marked "most neutral", Phi-4 −0.59 | the contrast IS the chart; annotate Grok + Phi-4 |
| 5 | Method | FigureScene | **six-axis table** (economic/social/…) or self-anchoring fig | explain self-anchoring + multi-country judges out loud (the honesty beat) |
| 6 | So-what | StatCallout/text | "OPEN · REPRODUCIBLE · GRANT-FUNDED" | independence is the point |
| 7 | Outro | OutroCard | "97 of 108 — now you can check it" + @startups.ai | callback to the hook number |

**Figures to crop from `assets/results.pdf` / `assets/homepage.pdf` (build stage):**
aggregate scatter (AVERAGE −0.41); Neutrality Map (Grok marked MOST NEUTRAL);
the ranked 18-model leaning list; the six-axis pole table.

**Source credit (for caption.txt later):** The Neutrality Project —
neutralityproject.org/results.html (Release 01).

**Caveats to keep visible in delivery:** positions are relative to each model's
*own* range (not an absolute axis); self-published Release 01, 18 models. Don't
oversell as settled science — "what this open benchmark found."
