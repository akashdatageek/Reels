---
name: author
description: Fourth stage — turn the frames + script into output/<story>/reel.json, the single contract the renderer reads. Choose the visual identity (theme, vibe, accent/secondary palette, imageStyle), realize each frame as a scene, wire real assets and image prompts, and set handle/music. Use after frames.md and script.md exist, before running the build.
---

# Author reel.json — the single contract

Build `output/<story>/reel.json`, 6–12 scenes, by realizing the storyboard.
**Read `frames.md` (the content per frame + its visual) and `script.md` (the
voiceover per frame).** Each frame becomes one scene: frames.md tells you the
scene type + real asset, script.md gives its `voiceSegment`. Schema:
`remotion/src/types.ts`; example: `remotion/src/example/reel.json`. The build
step overwrites placeholder durations with real audio, so focus on *content and
identity*, not timing.

## Step 1 — Visual identity (the editor's first decision)

Analyze the story's theme and pick a matching Gen-Z-friendly identity; write the
choice + reasoning into script.md. Set in reel.json: `accentColor` +
`secondaryColor` (acid duotone pair — gradients, aurora washes and wipes run
accent → secondary) and `imageStyle` (vibe words prepended to every image
prompt; *replaces* the default look).

| Story theme | Duotone pair | imageStyle flavor |
|---|---|---|
| dev tools / infra | mint `#00E58C` + electric blue `#00A3FF` | "clean holographic terminal glow" |
| models / research | violet `#8B5CF6` + hot pink `#FF4D9D` | "iridescent neural chrome" |
| money / business | amber `#FFB020` + acid green `#B6FF3B` | "gold chrome, ticker energy" |
| drama / security | red `#FF4D4D` + neon orange `#FF7A1A` | "alarm glow, high tension" |
| climate / science | orange `#FF7A1A` + golden `#FFD23F` | "warm ember glow, natural scale" |
| consumer / social | hot pink `#FF4D9D` + cyan `#00E5FF` | "playful glossy plastic, Y2K" |

Pairs are starting points — tune per story. One `accentColor` per reel, never
more (loosely match the subject's brand/mood).

**Theme (`theme`): `editorial-dark` is the DEFAULT for new reels** — the
channel's editorial card look: warm near-black canvas (#0d0b09), rounded media
card on the top ~55-60% with the channel badge top-left, then a left-aligned
text block (accent divider → big white headline from `text` → one accent
`subtext` subhead → karaoke captions as body text). Media is rock-steady by
design (no beat-punch, no drift; figureFocus moves are ease-in-out then HOLD).
Prefer ONE warm accent (rust/amber family, e.g. `#C96B3B` + `#E39A5E`) unless
the story demands otherwise. `light` (warm-white editorial) stays available for
paper-white data stories; `dark` is the legacy navy look for older reels.
**Write a `subtext` for every media scene** — one line, the scene's "so what",
already fact-checked wording (an emphasized annotation line works verbatim).

**Vibe (`vibe`):**
- `bold` (default) — loud acid duotone, chunky uppercase type, sticker
  captions, light-blade cuts, brisk news voice. For news, launches, benchmarks.
- `moody` — cinematic restraint: quiet serif (Fraunces), sentence case,
  luma-dip cuts, heavier grain, calmer audio-reactivity, captions as bare serif
  text, slow intimate voice. For human/emotional/reflective stories. Pair with a
  dusk palette (e.g. warm amber `#E8A25C` + soft teal `#7FBFB5`) and an
  imageStyle like "moody dusk film photography, muted teal and warm amber,
  atmospheric haze, silhouettes".
- Override voice per reel with `voiceStyle` (a natural-language direction, e.g.
  `"Deadpan and dry, like you're unimpressed:"`) when the story wants a
  specific tone.

## Step 2 — Scene selection (SHOW the story)

Scene types: `HookCard`, `ImageScene`, `StatCallout`, `SplitCompare`,
`TerminalScene` (typed CLI demo), `ChartScene` (animated bars), `FigureScene`
(real source figure + explanation), `OutroCard`.

- **Show the real thing.** If the source has a chart, diagram, screenshot, or
  photo that carries the point, put it on screen with `FigureScene` (`figure` =
  cropped asset, `figureCredit`, `annotations` = callouts that walk through it).
  Do NOT paraphrase a chart into decoration or replace it with a generated
  image. Generated images are for *mood/metaphor* beats only — never a stand-in
  for evidence the source actually provided.
- **Zoom & highlight the chart (`figureFocus`).** A FigureScene can do real
  editing moves: `figureFocus` is a timeline of camera steps, each `{at, region,
  highlight, label}` where `at` is a fraction 0..1 of the scene, `region` is a
  normalized rect `{x,y,w,h}` (0..1) of the figure, `highlight` is
  `box|circle|underline|spotlight`, and `label` is a short pinned caption. Use it
  to push into the exact bar/row/number as the voice hits it (e.g. spotlight the
  "Grok" row when the voiceSegment says Grok), then a `{at, region: full}` step
  to pull back out. Border/label sizes stay crisp at any zoom. Estimate regions
  by eye from the cropped figure; verify with `scripts/still.sh` at a frame mid-
  zoom before rendering the whole reel. Highlight styles: `spotlight` (dims the
  rest), `box`/`underline` (wipe on), `circle` (springs in), `circleDraw` (a
  hand-drawn scribble ring — great for "circle the winner"), `marker` (a
  highlighter bar sweeps across).
- **Scene transitions (`transition`).** Each scene enters with a move — `punch`
  (scale-in), `slide`, `pushUp`, `whip` (motion-blur pan), `wipe`, or `none`.
  Omit to auto-rotate per scene index so consecutive cuts never repeat. It's
  sync-safe (plays in the first ~0.4s, then settles), so it never shifts audio.
  A subtle **beat punch** (whole-frame zoom on the kick) is automatic when
  `music` is set.
- **Cut density: a visible cut or camera move at least every ~4s.** Dead air is
  where viewers swipe. Scene entries (transitions) provide one move each; any
  scene longer than ~4–5s must move *within* itself — for a `FigureScene` that
  means 2–3 `figureFocus` steps spaced through the scene (they count as camera
  moves); for Image/Terminal/Chart scenes the built-in drift/typing/bar motion
  covers it. Audit the timeline: no stretch of more than ~4s where nothing
  visibly changes.
- **Trends (APPLY mode).** Read `.claude/skills/trends/trends-current.md` (the
  `trends` skill refreshes it weekly) and pick **at most 1–2** current tactics
  that genuinely fit this story — never force a trend onto a serious piece, and
  never use anything on its stale/avoid list.
- **Kinetic type (`textStyle` on HookCard).** `rise` (default word lift),
  `typewriter` (typed on), `pop` (bouncy scale-in), `marker` (a highlighter
  swipe behind the *asterisk-emphasized* words). Vary it so titles don't all
  animate the same; moody vibe always stays on `rise`.
- **Animated data (`statVariant` on StatCallout).** `ring` (default halo),
  `donut` (an arc fills to the fraction), `bar` (a horizontal fill). donut/bar
  need the `stat` to be a percentage (`"26%"`) or a fraction (`"97/108"`) — the
  fill animates in sync with the count-up.
- **Text-scene backgrounds (`bgStyle` on Hook/Stat, dark theme only).** `aurora`
  (default), `beams` (drifting light streaks), `dots`, `plain`. Light theme
  keeps its clean editorial wash regardless. (True video b-roll needs stock
  footage the pipeline can't source in-sandbox — this is the motion-variety
  substitute.)
- **Personality flourishes (use sparingly, match the tone).** `stickers` — an
  array of `{text, x, y, at, rotate, size}` emoji/short-label pops (`"🤯"`,
  `"!!"`) at normalized positions; great for punchy stories, **skip them on
  serious/credibility pieces**. `lowerThird` — a `{title, subtitle}` news strip
  that slides in (e.g. a source credit). The OutroCard's follow button now taps
  and rings a bell automatically. A subtle beat camera-bounce is automatic in
  bold vibe.
- **Explain graphs out loud.** When a figure is shown, the `voiceSegment` names
  the axes/colors and reads the takeaway ("blue = kept, red = removed, lower is
  better; GRAM's red bar is 0.60 vs 0.85").
- **Break the structure.** Never reuse the same scene order two days running. An
  explainer is mostly FigureScenes; a launch is image-led; a data story is
  chart-led; a dev tool → `TerminalScene` with the actual commands; head-to-head
  → `SplitCompare`. `StatCallout` is for the single most surprising number, max
  1–2 per reel. `ChartScene` uses only verified numbers, subject bar
  `highlight: true`.

## Step 3 — Wire content

- **Pace it: max ~7s of narration per scene.** One frame held longer than that
  drags — the eye finishes with the visual and the scene keeps talking. If a
  point needs more than ~1–2 short sentences, **split it across visual beats**
  (a Hook → its Figure, or a claim → its stat) instead of parking it on one
  scene. Rule of thumb: ~2.8 words/sec, so ~7s ≈ 20 words.
  - **Text scenes are hard-capped.** A `HookCard`, `StatCallout`, or
    `OutroCard` has no motion to survive a long hold — one card or one number
    frozen for 10+ seconds is exactly where viewers swipe. **`preflight.py`
    fails the build** if any of these carries more than ~20 words of
    `voiceSegment`; there's no walking past it. Keep them punchy.
  - **Motion scenes earn their length.** A `FigureScene` with `figureFocus`
    steps (or an `ImageScene`) can hold 10–13s because the camera is moving
    through it — put the long, evidence-heavy narration there, not on a card.
  - The build's `tts.py` also prints a `⚠️ PACING` warning for *any* scene that
    lands over ~8s of real audio — a softer nudge for the motion scenes.
- Each spoken scene gets a `voiceSegment` (1–2 short sentences).
- **Hook emphasis:** in HookCard `text`, wrap the 1–2 payoff words in
  *asterisks* — they render in the accent color (`"now *one command*"`).
  Emphasize the surprise, not the subject.
- **Prefer provided assets over generated images.** Copy usable files from
  `input/<story>/assets/` into `output/<story>/assets/` and reference them in
  the scene's `image` field. Follow the frame's ladder rung from frames.md:
  fetched b-roll goes in `image` as-is (rung 3), or via `baseImage` +
  `editPrompt` when it needs 9:16/grade/cleanup (rung 4 — b-roll ONLY, never a
  `figure`). Only add an `imagePrompt` (rung 5, last resort) to scenes whose
  frame explicitly justified pure generation.
- **Image prompts describe the SUBJECT only.** `generate_images.py` prepends a
  photographic, anti-slop base and auto-rotates composition per scene, so don't
  restate style — push for a *real photograph or specific art-directed still*,
  not generic "abstract tech." (See the `build` skill for how the prompt is
  assembled.)
- **Backdrops:** text/data scenes (HookCard, StatCallout, SplitCompare) can
  carry a `backdropPrompt` — a real *place* tied to the beat (the classroom, the
  boiler room, the control room), dark and uncluttered; it renders dimmed under
  a scrim. Or put a credited photo path directly in `backdrop`.
- **Terminal content:** real commands/output only, from docs or the launch post
  — treat CLI text like a stat; it's on screen, so it must be traceable.
- **Handle + logo:** set `"handle": "@startups.ai"` on every reel (renders on
  the OutroCard). The brand logo is staged automatically by assemble.sh — no
  per-reel field needed.
- Set `music` to a track that actually exists in `music/` (the folder is
  gitignored, so a fresh clone is empty — the `build` skill covers adding one or
  synthesizing a bed). Scene `duration` values are placeholders — the build step
  overwrites them from the real audio.

## Worked example (shape, not a template to copy)

A two-scene slice — a hook and a real figure. Note: subject-only image prompt,
`*asterisks*` for accent emphasis, a figure with credit + annotations, and a
`voiceSegment` that reads the chart out loud.

```json
{
  "title": "GRAM benchmark",
  "theme": "light",
  "vibe": "bold",
  "accentColor": "#8B5CF6",
  "secondaryColor": "#FF4D9D",
  "handle": "@startups.ai",
  "music": "music/upbeat_01.mp3",
  "scenes": [
    {
      "type": "HookCard",
      "duration": 3,
      "text": "This tiny model just *beat* the giants",
      "voiceSegment": "A model a fraction of the size just topped the leaderboard."
    },
    {
      "type": "FigureScene",
      "duration": 6,
      "figure": "assets/gram_bar.png",
      "figureCredit": "Source: GRAM paper, fig. 3",
      "text": "Lower is better",
      "voiceSegment": "Blue is the old model, purple is GRAM. Lower is better — GRAM's bar is 0.60 versus 0.85.",
      "annotations": [
        { "text": "Blue = previous best", "emphasis": false },
        { "text": "Purple = GRAM, 0.60", "emphasis": true }
      ]
    }
  ]
}
```

## Verify as you wire (the `factcheck` gate is recorded later)

reel.json is the moment content becomes on-screen text — so as you place each
number, stat, quote, and figure caption, keep it traceable to a sourced line in
`research.md`. No stat that only lives in your head, no figure credited to the
wrong source, no rounded number that drifted from the receipt. Catching it here
saves a wasted render. The **`factcheck` gate itself is recorded by the `editor`
skill** (a fresh-context pass over the rendered reel vs research.md) — that's
the *truth* gate; the `comprehension` gate already checked it's *understood*.
Don't record `factcheck` here; just don't hand the build an unsourced figure.

**Next:** invoke the `build` skill.
