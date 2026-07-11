---
name: build
description: Fourth stage — turn an authored reel.json into the rendered video. Runs the mechanical pipeline (voice → forced alignment → captions → images → Remotion render → FFmpeg mux) and knows how to run/retry each step and what happens automatically. Use once reel.json is authored; also use to re-render after edits.
---

# Build the reel (mechanical pipeline)

One command runs everything:

```bash
bash scripts/make_reel.sh output/<story>
```

= `tts.py` → `align.py` → `captions.py` → `generate_images.py` → `assemble.sh`.
Any step can be run individually if something needs a retry.

## What each step does

1. **`tts.py` — voice + timings.** Synthesizes each scene's `voiceSegment` into
   `voice.mp3`, measures real durations, writes them back into reel.json
   (durations stop being placeholders) and stamps each scene's `audioStart`.
   - **Delivery matches the vibe automatically:** `bold` = brisk news energy,
     `moody` = slow and intimate; a reel's `voiceStyle` overrides both.
   - Engines (`--engine`, or `TTS_ENGINE` for make_reel.sh): `edge` (word-exact
     timings, needs a WebSocket) · `gemini` (plain HTTPS, uses
     `NANO_BANANA_API_KEY`; timings estimated then refined by align.py) ·
     `mock` (silent, for testing).
2. **`align.py` — refine timings.** Forced alignment (faster-whisper) tightens
   word timings to the audio; degrades gracefully to the estimate if the model
   is unavailable. **Only runs for `gemini`/`mock`** (which start from estimated
   timings); `make_reel.sh` skips it for `edge`, whose timings are already
   word-exact.
3. **`captions.py` — caption groups.** Reads `word_timings.json` (not reel.json),
   groups words into short 1–3 word chunks that pop in sync with the voice, and
   writes `captions.json` next to it.
4. **`generate_images.py` — images + backdrops.** For each scene with an
   `imagePrompt`/`backdropPrompt` and no provided asset, calls Nano Banana and
   writes the path back into reel.json. The final prompt is assembled as:

   ```
   BASE_RULES  (photographic, anti-slop: no CGI blobs / floating spheres /
                hologram-grid cliche; "no text, no logos")
   + imageStyle (from reel.json) OR the restrained cinematic DEFAULT_VIBE
   + the scene's subject
   + an auto-rotated composition (wide / low-angle / macro / top-down / POV /
     off-center), indexed by scene position so images never look cloned
   ```

   Without `NANO_BANANA_API_KEY`, it emits styled placeholder gradients so the
   pipeline still runs end-to-end.
5. **`assemble.sh` — render + mux.** Remotion renders scenes to silent video
   (music staged as `music.mp3` so visuals pulse to the beat); FFmpeg muxes
   voice + music (music sidechain-ducked −12 dB under the voice) and
   loudness-normalizes to −14 LUFS. Output: `output/<story>/reel.mp4`.

## What's automatic (no per-reel work)

- **Audio-reactive motion:** the renderer FFT-analyzes the music per frame — the
  aurora background, stat glow, hook bar, captions, and progress bar pulse with
  the low end; cuts get an accent light wipe; ImageScenes get a light sweep +
  perspective drift; film grain overlays everything. Just set `music`.
- **Cinematic finish:** a layered aurora background, a global CinemaGrade pass
  (vertical falloff + accent halation + faint chromatic fringe), and kinetic
  titles (Chart/Figure/Split wipe up behind a mask). Light theme keeps all of it
  restrained. Nothing to set per reel.

## Environment (one-time setup)

- Python deps: `pip install -r requirements.txt`
- Remotion deps: `cd remotion && npm install`
- Fonts (once, after npm install): `bash scripts/install_fonts.sh` — installs
  Archivo Black / Inter / JetBrains Mono / Fraunces as system fonts.
- FFmpeg on PATH. `.env` from `.env.example` holds `NANO_BANANA_API_KEY`.
- Music: `music/*.mp3` is **gitignored**, so a fresh clone has an empty
  `music/`. Add a real track (see `music/README.md`) or run
  `python3 pipeline/make_ambient.py` to synthesize a bed *before* building —
  otherwise the track named in reel.json won't exist and the mux ships voice
  only (no audio-reactive motion). Then point reel.json's `music` at it.
- Headless render: set `REMOTION_BROWSER_EXECUTABLE` to the pre-installed
  Chromium headless shell if the default browser isn't found.

**Next:** invoke the `editor` skill to review the render.
