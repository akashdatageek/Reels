# Script — The Neutrality Project (v2, plain-language rewrite)

**Target:** ~60s. **Register:** brisk but credible news (bold), **not** partisan.
**Tone rule:** a reel *about* neutrality must itself stay neutral — report the
finding, never cheer or jeer a "side." The hero is the open, checkable method.
Every number traces to `research.md` → `results.html`.

**Hook archetype:** lead with the ONE surprising, *named* result — "the most
neutral AI is Grok" — then prove it with the 97-of-108 stat.

**Covers the basics (all in the first ~15s):**
WHO = The Neutrality Project (independent, open-source). WHAT = a test that
measures the political lean of AI models. RESULT = Grok most neutral; almost all
leaned left; Phi-4 the most + dodged questions. WHY = an AI's lean quietly
becomes yours.

---

## V1 (draft — see critique below)

Kept from the earlier draft; its problems: opened on an abstract stat (97/108)
instead of the human result, used hard words ("self-anchored", "ideological
axes"), and never plainly said *who* did it or *what* the benchmark is.

## Critique (what this rewrite fixes)

- **Wrong thing on page one.** Old hook led with "97 of 108 left of center" — a
  stat, not the surprise. Fix: open on "the most neutral AI is Grok" (named,
  counter-intuitive, repeatable). The stat becomes the proof in beat 3.
- **Too hard to follow.** "Self-anchored ideological axes", "reproducible",
  "measured against its own far-left and far-right" — seminar language. Fix:
  plain words a person says out loud.
- **Didn't cover the basics.** Never plainly said *who* (The Neutrality Project)
  or *what the benchmark is* (a political-lean test). Fix: who + what land right
  after the hook.
- **Kept:** the honesty caveat (it's *this test's* finding, models compared to
  their own range) and the strict non-partisan tone.

## V2 (final — this goes to the author stage)

1. **HOOK:** "The most politically neutral AI right now? It's Grok."
2. **WHO + WHAT:** "That's the finding from The Neutrality Project — an independent group that tested the politics inside 18 AI models."
3. **WHAT (the test):** "They asked each AI almost 4,000 real opinion-poll questions, then mapped where it leans — left or right."
4. **RESULT (proof):** "Out of 108 scores, 97 leaned left. Every model leaned at least a little. Grok just landed closest to the middle."
5. **CONTRAST:** "The most one-sided? Microsoft's Phi-4 — which also dodged one in four questions."
6. **WHY IT'S FAIR:** "To keep it honest, AIs from three different countries set the scale — not the project's own idea of the center."
7. **WHY YOU CARE:** "It matters, because when an AI writes your summary, its lean quietly becomes yours."
8. **OUTRO:** "The most neutral AI is Grok — and now you can check the rest yourself."

**Word count ≈ 115 → ~48s voice → ~60s reel with scene pauses. On target.**

**Say-it-out-loud check:** every line is one clause, common words, no term a
normal viewer would need to look up. "One in four", not "26%".

---

## Per-beat visual intent (hand-off to the `author` stage)

Figure-led explainer on the project's REAL charts. Theme **light** (editorial /
credibility). Vibe **bold**, restrained. Accent: **teal ~#12B98A** (non-partisan;
echoes the site — deliberately not red/blue). Handle **@startups.ai**.

| # | Beat | Scene | Visual (real asset) | Why |
|---|------|-------|--------------------|-----|
| 1 | Hook — "most neutral is Grok" | HookCard | text, emphasize *Grok* | named surprise, clean, scroll-stopping |
| 2 | Who + what | HookCard/text | short line, project name | grounds the hook fast |
| 3 | The test | FigureScene | **six-axis pole table** (economic/social/…) or the −1↔+1 ruler | show what "leans left/right" means, in plain view |
| 4 | Result — Grok closest | FigureScene | **Neutrality Map / leaderboard** with Grok 4.5 −0.02 marked "MOST NEUTRAL"; "97 of 108 left" as annotation | the result IS the chart |
| 5 | Contrast — Phi-4 | FigureScene/Stat | Phi-4 −0.59 + "dodged 1 in 4" (from the same leaderboard) | the other end of the scale |
| 6 | Why fair | FigureScene/text | "3 countries set the scale" simple graphic | the honesty beat, plain |
| 7 | Why you care | StatCallout/text | one plain statement, no chart | the stakes |
| 8 | Outro | OutroCard | "Most neutral: Grok — check the rest" + @startups.ai | callback to the hook |

**Figures to crop (build stage) from `assets/results.pdf` / `assets/homepage.pdf`:**
Neutrality Map with Grok marked MOST NEUTRAL; the ranked 18-model list (Grok
−0.02 … Phi-4 −0.59); the six-axis pole table; the aggregate −1↔+1 scatter.

**Source credit (caption.txt):** The Neutrality Project — neutralityproject.org
(Release 01). **Keep visible:** it's *this open test's* finding; models are
compared to their own range, not an absolute political center.
