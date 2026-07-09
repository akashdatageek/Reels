import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {useVibe} from './VibeContext';

/**
 * Aesthetic image behind text/data scenes: darkened, slightly blurred,
 * slow drift, heavy scrim — presence without fighting the type.
 */
export const Backdrop: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const moody = useVibe() === 'moody';
  const t = frame / Math.max(durationInFrames, 1);
  const scale = interpolate(t, [0, 1], [1.06, 1.14]);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          filter: `brightness(${moody ? 0.5 : 0.42}) saturate(0.85) blur(1.5px)`,
        }}
      />
      {/* scrim: keep the center readable, let edges breathe */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(5,6,16,0.55) 0%, rgba(5,6,16,0.75) 70%, rgba(5,6,16,0.9) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
