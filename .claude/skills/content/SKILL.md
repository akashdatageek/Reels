---
name: content
description: Second stage (between research and script) — turn verified research into the reel's content, frame by frame, BEFORE any voiceover is written. Produces input/<story>/frames.md, an ordered storyboard where each frame locks one point, the real evidence that proves it, the on-screen text, and the visual. Use after research.md exists and before the script.
---

# Generate the content — frame by frame (the storyboard)

**Why this stage exists:** never write the script in a vacuum. The voiceover
must be written TO real content, not invent it. Here you lock what each frame of
the reel actually *says and shows* — its point and its receipt — using only
verified facts from `research.md`. The `script` stage then writes voice to these
frames; the `author` stage turns them into scenes. Content first, words second.

## Steps

1. **Read `research.md`** — the SOURCE INVENTORY, the TRANSLATION TABLE,
   verified facts, killer numbers, ranked hook angles, caveats. If key content
   is missing or unverified, STOP and ask for manual data (see the `research`
   skill) — don't invent a frame to fill a gap. **Use the translation table's
   plain forms** in every Point / on-screen text / annotation — the plain words
   were decided once in research; inherit them, don't re-translate.
2. **Pick the spine and order.** Break the structure per story (an explainer is
   figure-led; a launch is image-led). **Frame 1 carries the single most
   surprising, *named* result** (the thing a viewer would text a friend).
3. **For EVERY frame, lock all four:**
   - **Point** — the one idea this frame lands (one sentence).
   - **Content (the receipt)** — the exact fact / number / figure / quote from
     research.md that fills it, **with its source**. No frame ships without real
     content.
   - **On-screen text** — the few words a viewer reads (headline / label / stat).
   - **Visual** — pick from the ladder below, best to last resort, and **name
     the rung in the frame's Visual cell** (e.g. "R1: fig from paper", "R3:
     stock b-roll") so every drop from real toward generated is a visible,
     deliberate choice — never a silent default:
     1. **Real story asset** — their blog/paper/repo figure or screenshot
        (crop from `assets/`), or a StatCallout/Chart built from a verified
        number.
     2. **Our screenshot of the real thing** — product UI, terminal, docs.
     3. **Fetched stock b-roll, unedited** — `pipeline/fetch_stock.py` (real
        licensed photos: Pexels → Unsplash → Openverse; provenance recorded in
        `assets_manifest.json`).
     4. **Fetched stock b-roll + Nano Banana edit** — format/grade/cleanup
        only (`baseImage` + `editPrompt`); never content that changes what the
        photo depicts.
     5. **Pure Nano Banana generation** — ONLY when no real image can exist
        (abstract concepts), with a written reason.
     **The hard rule: editing is for b-roll only, NEVER for evidence.** Charts,
     benchmark figures, result screenshots — anything a viewer treats as proof —
     stay bit-exact from source (rung 1); `figure` assets are untouchable and
     preflight enforces it.
   Tag each frame's **role**: hook · who · what · result · proof · stakes ·
   **sendable** · outro.
   - **`sendable` is REQUIRED — design one deliberately SENDABLE moment per
     reel.** DM shares outweigh likes in distribution, so exactly one frame is
     engineered to be screenshotted and sent: the single most shocking,
     self-contained fact, fully readable OUT of context (the claim + its number
     + who measured it, all on the frame). Usually it doubles as the `result`
     or `proof` frame — tag it `result+sendable`. Ask of it: "would someone DM
     this to a friend with zero caption?" If no frame qualifies, the story
     angle is weak — go back one step.
4. **Coverage check** (same bar as the `script` skill's "cover the basics"): the
   frames together must answer **WHO · WHAT · RESULT · WHY**, all reachable in
   roughly the first 15s. Every on-screen number traces to research.md.
5. **Cut ruthlessly.** A frame with no real content — only vibes — gets merged or
   dropped. Prefer a real figure over a generated image every time. Aim 6–11
   frames for a 45–80s reel.
6. **Account for every USE-marked inventory item.** Walk the research.md SOURCE
   INVENTORY: every item marked **USE** either appears in a frame, or gets a row
   in a **"Dropped USE items"** section at the bottom of frames.md with a
   one-line justification ("−0.11 foreign-policy avg — third per-topic number,
   would dilute the −0.82 beat"). A USE item that silently vanishes between
   research and frames is a defect — the whole point of the inventory is that
   nothing falls off the table by accident.

## Explain it for someone who's never heard of this

The viewer is smart but **non-technical, with zero background** in the topic.
Findings alone don't land — the reel has to teach the idea. The frames together
must, in plain words:
- **Define the core concept** before stating a result about it. A reel on "AI
  political neutrality" needs a frame that says *what that even means* — "AI
  chatbots answer touchy questions with a slant, baked in from training" — not
  just "97 of 108 leaned left."
- **Decode every number.** "108 scores" is meaningless alone; "18 AIs across 6
  topics — money, climate, religion and more" is not. Gloss any jargon term the
  moment it appears ("refused = dodged the question, its own kind of bias").
- **Explain what each chart shows.** A figure frame must plan a **plain-language
  annotation** — "each dot is one AI", "closer to the middle = more neutral" —
  never just drop the raw chart and move on.
- **Say why it matters to a normal person's life** — connect it to the AI that
  writes their emails, their kid's homework, their news summary.

Test: if a smart friend outside the field would say "wait — what does that
mean?", you're missing a frame. Add it. Better a slightly longer reel that
everyone understands than a tight one only insiders get.

## Output: `input/<story>/frames.md`

An ordered table, one row per frame:

| # | Role | Point (one line) | Content — receipt + source | On-screen text | Visual (real asset) |
|---|------|------------------|----------------------------|----------------|---------------------|
| 1 | hook | The most neutral AI is Grok | Grok 4.5 = −0.02, closest to 0 [results.html] | "MOST NEUTRAL: GROK" | HookCard |
| 2 | who+what | An independent group tested it | The Neutrality Project · 18 models · ~4,000 Qs [home] | "The Neutrality Project" | text/logo |
| … | | | | | |

## Rule

**Content first, voice second.** If a frame can't cite real content from
research.md, it doesn't exist yet — fix the research or cut the frame. Keep the
research caveats attached to the frames they touch, so the script and author
inherit them.

## Mark the gate (required)

Once frames.md is written and every frame cites real content from research.md,
record the gate:

```bash
python3 pipeline/state.py record output/<story> content pass "N frames, all cite research.md"
```

Don't record `pass` while any frame is still a placeholder with no receipt —
fix the research or cut the frame first.

**Next:** invoke the `script` skill to write the voiceover to these frames.
