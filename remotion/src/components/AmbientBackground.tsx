import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {usePulse} from './MusicPulse';
import {useVibe} from './VibeContext';
import {usePalette} from './ThemeContext';

/**
 * Living background for text scenes. Two modes:
 *  - dark: a layered aurora field — soft duotone washes that drift and rotate
 *    over a fine dot texture, breathing with the low end. Deliberately NOT the
 *    three-blurred-circles look (that reads as generic AI video).
 *  - light: clean editorial — near-white with two faint accent corner washes.
 * Deterministic per `seed` so scenes drift differently.
 */
export const AmbientBackground: React.FC<{
  accent: string;
  secondary?: string;
  seed?: number;
  /** true when a Backdrop image sits underneath — washes only, no fill */
  transparent?: boolean;
  /** motion variety behind text scenes (dark theme): aurora default | beams | plain */
  variant?: 'aurora' | 'beams' | 'dots' | 'plain';
}> = ({accent, secondary, seed = 0, transparent = false, variant = 'aurora'}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = usePulse();
  const moody = useVibe() === 'moody';
  const pal = usePalette();
  const light = pal.bg === '#f5f4f0';
  // moody: calmer glow, half the audio reactivity
  const bass = moody ? pulse.bass * 0.5 : pulse.bass;
  const t = frame / fps;

  // ---- light theme: clean editorial (no aurora, no dots) ----
  if (light) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: transparent ? 'transparent' : pal.bg,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}1f 0%, transparent 68%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -240,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${second}18 0%, transparent 68%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ---- dark theme: layered aurora field ----
  // Three broad, soft washes anchored to mesh points, each drifting on its own
  // slow orbit. Large + very soft so they read as light, not blobs.
  const washes = [
    {hue: accent, ax: 28, ay: 30, sp: 0.05, ph: seed * 1.3, size: 115},
    {hue: second, ax: 74, ay: 62, sp: 0.045, ph: seed * 2.1 + 2, size: 125},
    {hue: accent, ax: 52, ay: 88, sp: 0.06, ph: seed * 0.7 + 4, size: 105},
  ].map((w) => ({
    x: w.ax + Math.sin(t * w.sp + w.ph) * 12,
    y: w.ay + Math.cos(t * w.sp * 0.8 + w.ph * 1.2) * 10,
    hue: w.hue,
    size: w.size * (1 + bass * 0.12),
    op: (moody ? 0.2 : 0.32) * (1 + bass * 0.5),
  }));

  const meshBg = washes
    .map(
      (w) =>
        `radial-gradient(${w.size}vh ${w.size}vh at ${w.x}% ${w.y}%, ` +
        `${w.hue}${Math.round(w.op * 255).toString(16).padStart(2, '0')} 0%, transparent 55%)`,
    )
    .join(', ');

  // slow-rotating conic sheen adds directionality the flat orbs lacked
  const sheenRot = (t * 6 + seed * 40) % 360;

  // ---- alt dark backgrounds (motion variety behind text) ----
  if (variant === 'plain') {
    return (
      <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : pal.bg, overflow: 'hidden'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
      </AbsoluteFill>
    );
  }
  if (variant === 'beams') {
    // drifting diagonal light streaks
    const beams = [0, 1, 2, 3].map((i) => {
      const hue = i % 2 === 0 ? accent : second;
      const x = ((t * (6 + i * 2) + seed * 30 + i * 26) % 140) - 20;
      return {hue, x, w: 5 + i * 1.5, op: (0.10 + (i % 2) * 0.04) * (1 + bass * 0.6)};
    });
    return (
      <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : pal.bg, overflow: 'hidden'}}>
        {beams.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-30%',
              height: '160%',
              left: `${b.x}%`,
              width: `${b.w}%`,
              transform: 'skewX(-16deg)',
              background: `linear-gradient(90deg, transparent, ${b.hue}, transparent)`,
              opacity: b.op,
              filter: 'blur(14px)',
              mixBlendMode: 'screen',
            }}
          />
        ))}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.5) 100%)'}} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : pal.bg, overflow: 'hidden'}}>
      {/* aurora washes */}
      <AbsoluteFill style={{backgroundImage: meshBg, filter: 'blur(8px)'}} />
      {/* rotating conic sheen, barely there */}
      <AbsoluteFill
        style={{
          display: moody ? 'none' : undefined,
          background: `conic-gradient(from ${sheenRot}deg at 50% 42%, transparent 0deg, ${accent}0f 90deg, transparent 180deg, ${second}0f 270deg, transparent 360deg)`,
          mixBlendMode: 'screen',
          opacity: 0.6 + bass * 0.3,
        }}
      />
      {/* fine dot texture (replaces the old grid — subtler, less sci-fi) */}
      <AbsoluteFill
        style={{
          display: moody ? 'none' : undefined,
          backgroundImage: `radial-gradient(${accent}22 1.2px, transparent 1.2px)`,
          backgroundSize: '46px 46px',
          backgroundPosition: `0px ${(t * 7) % 46}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)',
          opacity: 0.6,
        }}
      />
      {/* vignette to keep edges calm */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
