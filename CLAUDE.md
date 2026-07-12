# AI News Reel Pipeline

Claude Code is the orchestrator of this repo. It turns one link (or a story
folder) into a rendered, narrated, captioned 9:16 reel. The user provides source
data; Claude does the research, writing, visual identity, and orchestration.

**Stack:** Claude Code (research + script + orchestration) · Nano Banana
(images) · Edge-TTS / Gemini TTS (voice + word timings) · Remotion (render) ·
FFmpeg (mux) · royalty-free music.

## The workflow is six skills — run them in order

When asked to "make today's reel" (or given a link / story folder), walk these
six stages. **Each stage is a skill in `.claude/skills/` — invoke it (or open
its `SKILL.md`) when you reach that stage.** The detailed discipline lives in the
skills, not here, so there's a single source of truth.

| # | Skill | Stage | Writes |
|---|-------|-------|--------|
| 1 | **`research`** | Verify the story from primary + independent sources | `input/<story>/research.md` |
| 2 | **`content`** | Lock the content frame-by-frame (point + receipt + visual) | `input/<story>/frames.md` |
| 3 | **`script`** | Write the voiceover to the frames: V1 → critique → V2 | `input/<story>/script.md` |
| 4 | **`author`** | Build the contract: scenes, theme/vibe/palette, assets | `output/<story>/reel.json` |
| 5 | **`build`** | Run the pipeline: voice → captions → images → render → mux | `output/<story>/reel.mp4` |
| 6 | **`editor`** | Review the render, tighten, write the caption, hand off | `output/<story>/caption.txt` |

**Content before words:** `content` locks *what each frame says and shows* (its
real receipt) before `script` writes the voice — so the script is never written
in a vacuum. `reel.json` is then the single contract: `author` writes it from the
frames + script, `build` enriches it (durations, image paths) and renders it.
Schema: `remotion/src/types.ts`; example: `remotion/src/example/reel.json`.

## Non-negotiable rules (apply across every stage)

- **Never use an unverified stat.** Everything on screen traces to a source URL
  in research.md. If the story can't be verified from ≥2 sources → stop and ask.
- **When the picture is incomplete, ask for manual data — don't fill the gap.**
  If a source is blocked/unreachable, a claim can't be verified, or key data is
  missing, STOP and ask the user to provide it manually (paste the text, drop a
  screenshot into the story's `assets/`). Never proceed on partial info, and
  never substitute adjacent or lookalike data as if it were the real source.
- **Always credit the source** in caption.txt.
- **Show the real thing.** If the source provides a chart/figure/photo that
  carries the point, put it on screen (`FigureScene`) and explain it out loud —
  don't paraphrase evidence into decoration or a generated image.
- **Break the structure.** Never reuse the same scene order two days running.
- **Never post automatically.** Show the output path and stop.
- **Design constraints** (baked into the Remotion components): 1080×1920 @
  30fps, IG safe zones (top 250px / bottom 320px), max 2 fonts, one accent color
  per reel.
- If the input includes a launch video: max 2–3 short clips (<5s each) as
  b-roll with our commentary overlaid — never re-post their video wholesale.

## Repo map

```
.claude/skills/         research · content · script · author · build · editor (the workflow)
input/<story>/          brief.md (+ assets/) → research.md, frames.md, script.md written here
pipeline/               extract.py · tts.py · align.py · captions.py · generate_images.py
remotion/               scene templates + Reel sequencer (reads reel.json via --props)
scripts/                make_reel.sh (end-to-end) · assemble.sh (render + mux) · still.sh (review frame) · install_fonts.sh
music/                  royalty-free tracks (see music/README.md)
brand/                  startups-logo.png (auto-staged onto the OutroCard)
output/<story>/         reel.json · voice.mp3 · captions.json · images/ · reel.mp4 · caption.txt
```

## Environment quick reference

- Python deps: `pip install -r requirements.txt` · Remotion: `cd remotion && npm install`
- Fonts once: `bash scripts/install_fonts.sh` · FFmpeg must be on PATH.
- `.env` (from `.env.example`): `NANO_BANANA_API_KEY`. Without it,
  `generate_images.py` emits styled placeholder gradients so the pipeline still
  runs end-to-end.
- Full setup + engine/voice details live in the `build` skill.
