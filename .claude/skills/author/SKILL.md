---
name: author
description: Third stage — turn the script into output/<story>/reel.json, the single contract the renderer reads. Choose the visual identity (theme, vibe, accent/secondary palette, imageStyle), pick scene types that SHOW the story, wire real assets and image prompts, and set handle/music. Use after script.md is written and before running the build.
---

# Author reel.json — the single contract

Build `output/<story>/reel.json`, 6–12 scenes. Schema:
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

**Theme (`theme`): choose by content.** `light` (editorial warm-white, dark
text) for data, research papers, charts, explainers, business/credibility
stories. `dark` (default) for launches, drama, atmosphere. Don't default to
dark neon for everything — it makes data look like a sci-fi trailer instead of
credible reporting.

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

- Each spoken scene gets a `voiceSegment` (1–2 short sentences).
- **Hook emphasis:** in HookCard `text`, wrap the 1–2 payoff words in
  *asterisks* — they render in the accent color (`"now *one command*"`).
  Emphasize the surprise, not the subject.
- **Prefer provided assets over generated images.** Copy usable files from
  `input/<story>/assets/` into `output/<story>/assets/` and reference them in
  the scene's `image` field. Only add an `imagePrompt` to scenes with no asset.
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
- Pick `music` from `music/`. Scene `duration` values are placeholders — the
  build step overwrites them.

**Next:** invoke the `build` skill.
