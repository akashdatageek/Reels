import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useVibe} from './VibeContext';
import {usePalette} from './ThemeContext';

// Static SVG noise tile; animating its offset per frame reads as film grain.
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

/** Subtle animated film grain — tactile texture over the whole reel.
 *  Heavier in the moody vibe (film-look). */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const moody = useVibe() === 'moody';
  const pal = usePalette();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: NOISE,
        backgroundPosition: `${(frame * 37) % 140}px ${(frame * 61) % 140}px`,
        opacity: moody ? 0.11 : pal.grainOpacity,
        mixBlendMode: pal.grainBlend,
      }}
    />
  );
};
