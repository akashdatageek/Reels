# AI News Reel Pipeline

Turn one link into a rendered, captioned, narrated 9:16 news reel —
research-verified, for ~$0.10–0.30 per reel (image generation only).

**Stack:** Claude Code (orchestrator) · Nano Banana (images) · Edge-TTS (voice)
· Remotion (rendering) · FFmpeg (post) · Pixabay/YT Audio Library (music)

## How it works

```
brief.md (1 link)
   │
   ▼
Claude Code research pass ──► research.md (verified facts + sources)
   │
   ▼
reel.json (5–8 scenes, script, image prompts)     ← Claude writes this
   │
   ▼
pipeline/tts.py          voice.mp3 + word timings; real durations → reel.json
pipeline/captions.py     word-level caption groups
pipeline/generate_images.py   Nano Banana images for scenes without assets
scripts/assemble.sh      Remotion render → FFmpeg mux (music ducked under voice)
   │
   ▼
output/<story>/reel.mp4 + caption.txt
```

Everything flows through one contract file: **reel.json**
(schema: `remotion/src/types.ts`, example: `remotion/src/example/reel.json`).

## Setup

```bash
# 1. Python deps
pip install -r requirements.txt

# 2. Remotion
cd remotion && npm install && cd ..

# 3. FFmpeg on PATH (e.g. apt install ffmpeg / brew install ffmpeg)

# 4. API key
cp .env.example .env    # add NANO_BANANA_API_KEY
#    (without a key, placeholder images are generated so you can test)

# 5. Music: drop 5–10 tracks into music/ (see music/README.md)
```

## Daily use

1. Create `input/<YYYY-MM-DD>-<slug>/brief.md` with a link (+ optional assets/)
2. Tell Claude Code: **"make today's reel"** — it follows `CLAUDE.md`:
   research → script → reel.json → `scripts/make_reel.sh output/<story>`
3. Review `output/<story>/reel.mp4`, post manually with `caption.txt`

## Manual pipeline run

If reel.json already exists:

```bash
bash scripts/make_reel.sh output/2026-07-08-example
```

Or step by step:

```bash
python3 pipeline/tts.py output/<story>/reel.json
python3 pipeline/captions.py output/<story>/word_timings.json
python3 pipeline/generate_images.py output/<story>/reel.json
bash scripts/assemble.sh output/<story>
```

Preview scenes interactively: `cd remotion && npm run dev`

## Scene templates

| Type | Use |
|------|-----|
| `HookCard` | Big bold opening statement, spring-in animation |
| `ImageScene` | Ken Burns pan/zoom on an image + caption bar |
| `StatCallout` | Number counts up, label fades in |
| `SplitCompare` | Two panels slide in — before/after, X vs Y |
| `OutroCard` | CTA + handle with follow pulse |

Word-by-word animated captions (from edge-tts WordBoundary events) are overlaid
on all scenes. Safe zones for IG UI are baked into the components.

## Later upgrades

- ElevenLabs voice (~$5/mo) — biggest quality jump
- Instagram Graph API auto-posting
- Multi-platform exports (YT Shorts = same file; 1:1 crop for feed)
- A/B hook variants (render 2 versions of the first 3 seconds)
