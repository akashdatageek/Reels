# AI News Reel Pipeline

Claude Code is the orchestrator of this repo. When asked to "make today's reel"
(or given a story folder / a link), follow the Daily Reel Workflow below.

**Stack:** Claude Code (research + script + orchestration) · Nano Banana (images) ·
Edge-TTS (voice + word timings) · Remotion (render) · FFmpeg (mux) · royalty-free music.

## Daily Reel Workflow

1. **Read the input.** `input/<date>-<slug>/brief.md` and everything in its
   `assets/` folder. The brief can be as thin as one link.

2. **RESEARCH PASS (mandatory, before any scripting).**
   - WebFetch the primary source (official blog, docs, model card, launch post).
     Primary > news aggregators. Use `python3 pipeline/extract.py <url> --out input/<story>/extracted`
     when you need clean article text.
   - WebSearch 2–3 independent sources to confirm key claims and numbers.
     If sources conflict, flag it — never guess.
   - Enrich: concrete benchmarks, pricing, availability date, comparison to
     the previous version / competitors.
   - Angle check: quick search of what's already being said, so the hook
     isn't the same take everyone posted 6 hours ago.
   - Write `input/<story>/research.md`:
     - Verified facts, each with source URL
     - 2–3 killer numbers/stats for StatCallout scenes
     - Suggested hook angles, ranked
     - Anything unverified → marked ⚠️ and excluded from the script
   - **Rules:** every on-screen stat must trace to a source URL in research.md.
     If the story can't be verified from at least 2 sources → stop and ask.

3. **Extract the story:** what launched, who, why it matters, 2–3 concrete numbers.

4. **Write a 45–75s script — as a scriptwriter, not a summarizer.**
   Aim ~60s when the story has depth; go shorter rather than padding a thin
   story. Structure for the longer format: HOOK → CONTEXT → 3–5 KEY POINTS
   (each with a receipt) → SO-WHAT → OUTRO.
   Write `input/<story>/script.md` with three parts:
   - **V1 draft**: HOOK (0–3s, must stop the scroll) → CONTEXT → 3–5 KEY
     POINTS → SO-WHAT → OUTRO. Conversational, no jargon, short sentences.
   - **Critique**: attack V1 like an editor — Is there a *problem/villain*
     before the announcement? Is there a *proof moment* (a receipt, not a
     promise)? Are stats *felt* via contrast ("soccer field vs classroom"),
     not listed? Does the outro *call back* to the hook?
   - **V2**: rewrite fixing the critique; cross-check every line against
     research.md sources before it goes in reel.json.
   Prefer problem-first hooks over announcement hooks.

4b. **Choose each scene's visual deliberately** (and write the choice into
   script.md): which beat gets a provided asset, which gets a generated
   image, and *why that image tells that beat*. After generating images,
   LOOK at them (Read the file); regenerate if one is weak or off-story.
   Screenshots of webpages must be cropped to the photo region first.

5. **Build `output/<story>/reel.json`** — 6–12 scenes (schema:
   `remotion/src/types.ts`, example: `remotion/src/example/reel.json`).
   - Scene types: `HookCard`, `ImageScene`, `StatCallout`, `SplitCompare`,
     `TerminalScene` (typed CLI demo), `ChartScene` (animated bars), `OutroCard`.
   - Each spoken scene gets a `voiceSegment` (1–2 short sentences).
   - **Prefer provided assets over generated images**: copy usable files from
     `input/<story>/assets/` into `output/<story>/assets/` and reference them
     in the scene's `image` field. Only add an `imagePrompt` (for Nano Banana)
     to scenes with no asset.
   - Pick one `accentColor` for the whole reel; set `music` to one of the
     tracks in `music/`.
   - Scene `duration` values are placeholders — tts.py overwrites them with
     real audio durations.

6. **Run the mechanical pipeline:**
   ```bash
   bash scripts/make_reel.sh output/<story>
   ```
   (= tts.py → captions.py → generate_images.py → assemble.sh; each step can
   also be run individually if something needs a retry.)

7. **Write `output/<story>/caption.txt`:** 1-line hook, 2–3 line summary,
   source credit (from research.md), 8–12 hashtags.

8. **Show the output path (`output/<story>/reel.mp4`). Never post automatically.**

## Theme analysis (before any visuals — the editor's first decision)

Analyze the story's *theme* and pick a matching Gen-Z-friendly identity,
writing the choice + reasoning into script.md. Set in reel.json:
`accentColor` + `secondaryColor` (acid duotone pair; gradients, orbs and
wipes run accent → secondary) and `imageStyle` (vibe words prepended to
every image prompt).

| Story theme | Duotone pair | imageStyle flavor |
|---|---|---|
| dev tools / infra | mint `#00E58C` + electric blue `#00A3FF` | "clean holographic terminal glow" |
| models / research | violet `#8B5CF6` + hot pink `#FF4D9D` | "iridescent neural chrome" |
| money / business | amber `#FFB020` + acid green `#B6FF3B` | "gold chrome, ticker energy" |
| drama / security | red `#FF4D4D` + neon orange `#FF7A1A` | "alarm glow, high tension" |
| climate / science | orange `#FF7A1A` + golden `#FFD23F` | "warm ember glow, natural scale" |
| consumer / social | hot pink `#FF4D9D` + cyan `#00E5FF` | "playful glossy plastic, Y2K" |

Also choose the reel's **vibe** (`vibe` in reel.json):
- `bold` (default) — loud acid duotone, chunky uppercase type, sticker
  captions, light-blade cuts. For news, launches, benchmarks.
- `moody` — cinematic restraint: quiet serif (Fraunces), sentence case,
  luma-dip cuts, heavier grain, calmer audio-reactivity, no grid, captions
  as bare serif text. For human/emotional/reflective stories. Pair with a
  dusk palette (e.g. warm amber `#E8A25C` + soft teal `#7FBFB5`) and an
  imageStyle like "moody dusk film photography, muted teal and warm amber,
  atmospheric haze, silhouettes" (imageStyle *replaces* the default look).

Pairs are starting points — tune per story. **Gen-Z authenticity rules:**
conversational hooks, never corporate phrasing ("game-changing solution" is
banned); no forced slang — the aesthetic can be loud, the words stay real;
receipts over promises (show the terminal, the chart, the photo); emoji in
caption.txt are fine, on-screen text stays clean.

## Creative direction (choose deliberately, per story)

- **Scene mix:** never use the same scene sequence two days in a row. Pick the
  scene that *shows* the story: dev tool → `TerminalScene` with the actual
  commands; benchmark/comparison story → `ChartScene` (only verified numbers,
  subject bar `highlight: true`); product/hardware → `ImageScene`; head-to-head
  → `SplitCompare`. StatCallout is for the single most surprising number, max
  1–2 per reel.
- **Hook emphasis:** in HookCard text, wrap the 1–2 payoff words in
  *asterisks* — they render in the accent color (`"now *one command*"`).
  Emphasize the surprise, not the subject.
- **Accent color:** pick per story, loosely matched to the subject's brand or
  mood — e.g. cyan `#00E5FF` (infra/cloud), mint `#00E58C` (dev tools), violet
  `#8B5CF6` (research/models), amber `#FFB020` (money/business), red `#FF4D4D`
  (drama/security). One accent per reel, never more.
- **Image prompts:** vary the composition day to day (isometric platform,
  close-up macro, top-down grid, low-angle monument scale) so consecutive
  reels don't look cloned; the style prefix keeps them on-brand.
- **Terminal content:** real commands/output only — from docs or the launch
  post; treat CLI text like a stat (it's on screen; it must be traceable).
- **Audio-reactive motion (automatic):** the renderer FFT-analyzes the music
  track per frame — background orbs, stat glow, hook bar, captions and the
  progress bar all pulse with the low end; scene cuts get an accent light
  wipe; ImageScenes get a light sweep + perspective drift; film grain overlays
  everything. No per-reel work needed — just set `music` in reel.json.
  Punchier track = punchier reel.

## Rules

- If the input includes a launch video: extract max 2–3 short clips (<5s each)
  as b-roll, always with our commentary overlaid. Never re-post their video wholesale.
- Always credit the source in caption.txt.
- Never use an unverified stat. Everything on screen traces to research.md.
- Image prompt style (baked into `pipeline/generate_images.py` as STYLE_PREFIX):
  dark navy bg, one neon accent, isometric-3D/abstract tech, **no text in image**.
  Per-scene prompts describe the subject only; the style prefix keeps visuals
  consistent day to day.
- Design constraints (baked into Remotion components): 1080×1920 @ 30fps,
  IG safe zones (top 250px / bottom 320px), max 2 fonts, one accent color per reel.

## Environment

- Python deps: `pip install -r requirements.txt`
- Remotion deps: `cd remotion && npm install`
- Fonts (once, after npm install): `bash scripts/install_fonts.sh` — installs
  Archivo Black / Inter / JetBrains Mono as system fonts for the renderer.
- FFmpeg must be on PATH.
- Voice engines (`pipeline/tts.py --engine`): `edge` (word-exact timings;
  needs WebSocket) · `gemini` (plain HTTPS, uses NANO_BANANA_API_KEY; timings
  estimated, then refined by `pipeline/align.py` if faster-whisper is
  available) · `mock` (silent, testing). Set `TTS_ENGINE` for make_reel.sh.
- Music: real tracks per `music/README.md`; `python3 pipeline/make_ambient.py`
  generates a subtle synthesized bed as a stopgap so reels never ship dry.
- `.env` (copy from `.env.example`): `NANO_BANANA_API_KEY`. Without a key,
  generate_images.py produces styled placeholder gradients so the pipeline
  still runs end-to-end for testing.

## Repo map

```
input/<story>/          brief.md (+ assets/) → research.md written here
pipeline/               extract.py · tts.py · captions.py · generate_images.py
remotion/               scene templates + Reel sequencer (reads reel.json via --props)
scripts/                make_reel.sh (end-to-end) · assemble.sh (render + mux)
music/                  royalty-free tracks (see music/README.md)
output/<story>/         reel.json · voice.mp3 · captions.json · images/ · reel.mp4 · caption.txt
```
