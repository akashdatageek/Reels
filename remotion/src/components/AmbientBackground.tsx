import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BG} from '../theme';

/**
 * Living background for text scenes: slow-drifting accent glow orbs over a
 * faint perspective grid, so no scene ever sits on dead pixels.
 * Deterministic per `seed` so different scenes get different drift patterns.
 */
export const AmbientBackground: React.FC<{accent: string; seed?: number}> = ({
  accent,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const orbs = [0, 1, 2].map((i) => {
    const phase = seed * 1.7 + i * 2.1;
    const speed = 0.12 + i * 0.05;
    return {
      x: 540 + Math.sin(t * speed + phase) * (260 + i * 130),
      y: 640 + Math.cos(t * speed * 0.8 + phase * 1.3) * (330 + i * 160) + i * 220,
      r: 340 - i * 70,
      opacity: 0.16 - i * 0.04,
    };
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden'}}>
      {/* faint grid, slow vertical drift */}
      <AbsoluteFill
        style={{
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
            background: `radial-gradient(circle, ${accent} 0%, transparent 62%)`,
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
