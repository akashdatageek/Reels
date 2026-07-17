import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useVibe} from './VibeContext';
import {usePalette} from './ThemeContext';

/**
 * One global grade pass mounted over all scenes (below captions/UI) so the reel
 * reads as a single graded film instead of eight separate cards:
 *  - soft cinematic top/bottom falloff
 *  - a faint accent halation/bloom that breathes with the music energy
 *  - a whisper of chromatic fringe at the extreme edges
 * Kept very low-opacity; light theme gets only the gentlest touch.
 */
export const CinemaGrade: React.FC<{accent: string}> = ({accent}) => {
  const moody = useVibe() === 'moody';
  const kind = usePalette().kind;

  if (kind === 'light' || kind === 'editorial') {
    // editorial looks: only the faintest STATIC top/bottom falloff, no bloom
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            kind === 'light'
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 14%, transparent 86%, rgba(0,0,0,0.05) 100%)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.26) 100%)',
        }}
      />
    );
  }

  // static bloom — the old music-driven term made the whole frame breathe
  const bloom = moody ? 0.05 : 0.08;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* cinematic vertical falloff (distinct from the per-scene radial vignette) */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 18%, transparent 80%, rgba(0,0,0,0.34) 100%)',
        }}
      />
      {/* accent halation — ties the whole frame to the reel's one accent */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 46%, ${accent}00 52%, ${accent}14 100%)`,
          mixBlendMode: 'screen',
          opacity: bloom,
        }}
      />
      {/* whisper of chromatic fringe at the corners */}
      <AbsoluteFill
        style={{
          boxShadow:
            'inset 0 0 120px 40px rgba(255,60,90,0.05), inset 0 0 120px 40px rgba(60,140,255,0.05)',
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
