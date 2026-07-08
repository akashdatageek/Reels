# Music

Put 5–10 royalty-free tracks here (mp3), upbeat tech vibe. Sources:

- Pixabay Audio — https://pixabay.com/music/ (no attribution required)
- YouTube Audio Library — https://www.youtube.com/audiolibrary

Naming: `upbeat_01.mp3`, `upbeat_02.mp3`, ... (referenced from reel.json as
`music/upbeat_01.mp3`).

Normalize to around -20 dB so the ducking in `scripts/assemble.sh` behaves
consistently:

```bash
ffmpeg -i input.mp3 -af loudnorm=I=-20:TP=-2 music/upbeat_01.mp3
```

Tracks are gitignored (binaries) — keep a note of the source URL/license here:

| File | Source | License |
|------|--------|---------|
