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

4. **Write a 30–45s script.** HOOK (0–3s, must stop the scroll) → CONTEXT →
   2–3 KEY POINTS → OUTRO. Conversational, no jargon, short sentences.
   Choose the theme/angle yourself based on research.md.

5. **Build `output/<story>/reel.json`** — 5–8 scenes (schema:
   `remotion/src/types.ts`, example: `remotion/src/example/reel.json`).
   - Scene types: `HookCard`, `ImageScene`, `StatCallout`, `SplitCompare`, `OutroCard`.
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
- FFmpeg must be on PATH.
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
