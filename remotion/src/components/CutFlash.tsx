import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useVibe} from './VibeContext';

const WIPE_FRAMES = 9;

/**
 * Accent-colored diagonal wipe that sweeps across at a scene cut —
 * mount inside a short Sequence starting at each scene boundary.
 */
export const CutFlash: React.FC<{accent: string; secondary?: string}> = ({
  accent,
  secondary,
}) => {
  const frame = useCurrentFrame();
  const moody = useVibe() === 'moody';
  const t = Math.min(1, frame / WIPE_FRAMES);
  const x = interpolate(t, [0, 1], [-130, 130]);
  const opacity = interpolate(t, [0, 0.15, 0.85, 1], [0, 0.9, 0.9, 0]);
  const second = secondary ?? accent;

  if (moody) {
    // quiet luma dip instead of a light blade
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          backgroundColor: '#000',
          opacity: interpolate(t, [0, 0.45, 1], [0, 0.55, 0]),
        }}
      />
    );
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          height: '140%',
          width: '55%',
          left: 0,
          transform: `translateX(${x}%) skewX(-12deg)`,
          background: `linear-gradient(90deg, transparent, ${accent}cc 30%, #ffffff 50%, ${second}cc 70%, transparent)`,
          opacity,
          filter: 'blur(2px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const CUT_FLASH_FRAMES = WIPE_FRAMES + 1;
