#!/usr/bin/env python3
"""Synthesize a subtle ambient music bed (placeholder until real tracks land).

Generates a soft, slowly-evolving pad — chord pulse at 84 BPM with a gentle
sub root — good enough to sit -12dB under narration without drawing attention.
Not a replacement for real tracks (see music/README.md), but keeps every reel
from shipping dry.

Usage: python pipeline/make_ambient.py [music/ambient_01.mp3] [--seconds 64]
"""
import argparse
import pathlib
import subprocess

import numpy as np

SR = 44100


def adsr(n, a=0.35, d=0.2, s=0.75, r=0.4):
    """Attack/decay/sustain/release envelope over n samples (fractions of n)."""
    env = np.ones(n) * s
    an, dn, rn = int(n * a), int(n * d), int(n * r)
    env[:an] = np.linspace(0, 1, an)
    env[an:an + dn] = np.linspace(1, s, dn)
    env[-rn:] = np.linspace(s, 0, rn)
    return env


def tone(freq, n, vib_hz=0.15, vib_cents=6, harmonics=((1, 1.0), (2, 0.28), (3, 0.10))):
    t = np.arange(n) / SR
    vib = 2 ** (vib_cents / 1200 * np.sin(2 * np.pi * vib_hz * t))
    out = np.zeros(n)
    for mult, amp in harmonics:
        out += amp * np.sin(2 * np.pi * freq * mult * vib * t)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("out", nargs="?", default="music/ambient_01.mp3")
    parser.add_argument("--seconds", type=int, default=64)
    args = parser.parse_args()

    # Am – F – C – G, voiced low-mid; frequencies in Hz
    chords = [
        [220.00, 261.63, 329.63],  # A3 C4 E4
        [174.61, 220.00, 261.63],  # F3 A3 C4
        [130.81, 196.00, 261.63],  # C3 G3 C4
        [196.00, 246.94, 293.66],  # G3 B3 D4
    ]
    bar_s = 60 / 84 * 4 * 2  # two 4/4 bars per chord at 84 BPM ≈ 5.7s
    bar_n = int(bar_s * SR)

    total_n = 0
    chunks = []
    while total_n < args.seconds * SR:
        for chord in chords:
            pad = np.zeros(bar_n)
            for f in chord:
                pad += tone(f, bar_n)
            pad *= adsr(bar_n) / len(chord)
            sub = tone(chord[0] / 2, bar_n, harmonics=((1, 1.0),)) * adsr(bar_n, a=0.5) * 0.35
            chunks.append(pad * 0.5 + sub)
            total_n += bar_n
            if total_n >= args.seconds * SR:
                break
    audio = np.concatenate(chunks)

    # gentle 84 BPM amplitude pulse (breathing, not a beat)
    t = np.arange(len(audio)) / SR
    audio *= 0.85 + 0.15 * np.sin(2 * np.pi * (84 / 60) * t - np.pi / 2)
    audio /= np.max(np.abs(audio)) * 1.15  # headroom

    out_path = pathlib.Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pcm = (audio * 32767).astype(np.int16).tobytes()
    proc = subprocess.run(
        ["ffmpeg", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
         "-af", "lowpass=f=2600,loudnorm=I=-20:TP=-3",
         "-c:a", "libmp3lame", "-q:a", "3", str(out_path)],
        input=pcm, capture_output=True,
    )
    if proc.returncode != 0:
        raise SystemExit(proc.stderr[-500:].decode())
    print(f"ambient bed -> {out_path} ({args.seconds}s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
