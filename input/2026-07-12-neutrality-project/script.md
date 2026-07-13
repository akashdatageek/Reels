# Script — The Neutrality Project (v3: layperson explainer, written to frames.md)

**Written to the 9 frames** — one voiceSegment per frame. ~75–80s. Register:
brisk but credible, **non-partisan**. Now teaches the idea for a non-technical
viewer: defines the concept, decodes the numbers, reads the charts, lands the
stakes. Every line traces to `research.md`.

## Critique (what this rewrite fixes vs the last cut)

- **Was insider-only.** Stated "97 of 108 leaned left" with no idea of *what an
  AI's political lean is*, what 108 means, or why anyone should care. Fix: a
  concept frame (fr2), a plain "it's a survey" frame (fr3), numbers decoded out
  loud, charts read aloud, stakes in the viewer's life (fr8).
- **Scene 2 dragged (~14s).** Fix: split who/how (fr3) from the result figure
  (fr4), so no single figure holds 14s.
- **Kept:** lead with Grok, non-partisan tone, the "3 countries kept it fair"
  safeguard, and the relative-not-absolute honesty.

## V2 (final) — the voiceover, frame by frame

| Frame | Role | `voiceSegment` |
|-------|------|----------------|
| 1 | hook | "The most politically neutral AI right now? It's Grok." |
| 2 | concept | "Here's something most people don't realize: every AI chatbot leans a certain way on hot topics — baked in, whether it tells you or not." |
| 3 | who + how | "An independent group, The Neutrality Project, decided to measure it. They gave 18 AIs the same kind of political survey a person would take — almost 4,000 questions." |
| 4 | result | "Almost every one leaned left — its answers favored progressive views. Across 18 AIs and six topics, that's 108 scores. 97 of them tilted left." |
| 5 | proof | "But here's the twist. On the map, closer to the middle means more neutral — and Elon Musk's Grok landed right on the line. The most balanced of all." |
| 6 | contrast | "The most one-sided? Microsoft's Phi-4 — which also refused to answer one in four questions. And dodging is its own kind of bias." |
| 7 | why-fair | "To keep it fair, AIs from three different countries decided what counts as left or right — so no single country's politics set the rules." |
| 8 | why-you-care | "Why care? This is the AI writing your emails, your kid's homework, your news summary. If it leans, your information leans too — quietly." |
| 9 | outro | "So next time an AI explains the news to you, remember: it has a side. The most balanced one is Grok — now you can check the rest yourself." |

**Word count ≈ 175 → ~65s voice → ~78s reel with scene pauses.** Slightly longer
than the punchy cut on purpose — the point is that everyone understands it.

**Say-it-out-loud check:** each line is plain and self-contained; no term a
non-expert must look up (concept defined fr2, "108" decoded fr4, "refused"
glossed fr6, charts read fr4/fr5).

---

## Notes for the `author` stage
- 9 scenes: HookCard(1) · HookCard(2 concept) · HookCard(3 survey) ·
  FigureScene(4 aggregate, + annotations) · FigureScene(5 map, + annotations) ·
  StatCallout(6, 26%) · HookCard(7) · HookCard(8) · OutroCard(9).
- **Add plain `annotations` to the two FigureScenes** (from frames.md): fr4 —
  "Each dot = one AI", "Left = progressive, Right = conservative"; fr5 — "Closer
  to the middle = more neutral", "Grok sits on the line". Keep the figureFocus
  zooms.
- Source credit for caption.txt: The Neutrality Project — neutralityproject.org
  (Release 01). Keep the relative-not-absolute caveat in the caption.
