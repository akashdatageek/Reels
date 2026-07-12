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

1. **Read `research.md`** — verified facts, killer numbers, ranked hook angles,
   caveats. If key content is missing or unverified, STOP and ask for manual
   data (see the `research` skill) — don't invent a frame to fill a gap.
2. **Pick the spine and order.** Break the structure per story (an explainer is
   figure-led; a launch is image-led). **Frame 1 carries the single most
   surprising, *named* result** (the thing a viewer would text a friend).
3. **For EVERY frame, lock all four:**
   - **Point** — the one idea this frame lands (one sentence).
   - **Content (the receipt)** — the exact fact / number / figure / quote from
     research.md that fills it, **with its source**. No frame ships without real
     content.
   - **On-screen text** — the few words a viewer reads (headline / label / stat).
   - **Visual** — the real asset to show (which figure to crop from `assets/`),
     or a StatCallout / Chart built from a verified number; a generated image
     only as a last resort, with a reason.
   Tag each frame's **role**: hook · who · what · result · proof · stakes · outro.
4. **Coverage check** (same bar as the `script` skill's "cover the basics"): the
   frames together must answer **WHO · WHAT · RESULT · WHY**, all reachable in
   roughly the first 15s. Every on-screen number traces to research.md.
5. **Cut ruthlessly.** A frame with no real content — only vibes — gets merged or
   dropped. Prefer a real figure over a generated image every time. Aim 6–10
   frames for a 45–75s reel.

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

**Next:** invoke the `script` skill to write the voiceover to these frames.
