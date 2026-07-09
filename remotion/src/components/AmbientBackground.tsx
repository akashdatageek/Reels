import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {usePulse} from './MusicPulse';
import {useVibe} from './VibeContext';
import {usePalette} from './ThemeContext';

/**
 * Living background for text scenes: slow-drifting accent glow orbs over a
 * faint perspective grid, so no scene ever sits on dead pixels.
 * Deterministic per `seed` so different scenes get different drift patterns.
 */
export const AmbientBackground: React.FC<{
  accent: string;
  secondary?: string;
  seed?: number;
  /** true when a Backdrop image sits underneath — orbs/glow only, no fill */
  transparent?: boolean;
}> = ({accent, secondary, seed = 0, transparent = false}) => {
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

  const orbs = [0, 1, 2].map((i) => {
    const phase = seed * 1.7 + i * 2.1;
    const speed = 0.12 + i * 0.05;
    return {
      x: 540 + Math.sin(t * speed + phase) * (260 + i * 130),
      y: 640 + Math.cos(t * speed * 0.8 + phase * 1.3) * (330 + i * 160) + i * 220,
      // orbs breathe with the low end of the music
      r: (340 - i * 70) * (1 + bass * 0.18),
      opacity: (0.16 - i * 0.04) * (1 + bass * 0.9),
    };
  });

  // On light theme, keep it clean editorial: near-white bg, faint accent
  // corner wash, no orbs/grid.
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

  return (
    <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : pal.bg, overflow: 'hidden'}}>
      {/* faint grid, slow vertical drift (hidden in moody vibe) */}
      <AbsoluteFill
        style={{
          display: moody ? 'none' : undefined,
          backgroundImage: `linear-gradient(${accent}14 1px, transparent 1px),
            linear-gradient(90deg, ${accent}14 1px, transparent 1px)`,
          backgroundSize: '108px 108px',
          backgroundPosition: `0px ${(t * 9) % 108}px`,
          maskImage:
            'radial-gradient(ellipse at 50% 45%, black 30%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 45%, black 30%, transparent 78%)',
        }}
      />
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: o.x - o.r,
            top: o.y - o.r,
            width: o.r * 2,
            height: o.r * 2,
            borderRadius: '50%',
            // alternate the acid pair so the background reads duotone
            background: `radial-gradient(circle, ${i % 2 === 0 ? accent : second} 0%, transparent 62%)`,
            opacity: o.opacity,
            filter: 'blur(2px)',
          }}
        />
      ))}
      {/* vignette to keep edges calm */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
