import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BG, FONT_BODY, SAFE_BOTTOM, TEXT} from '../theme';
import type {Scene} from '../types';

/** Ken Burns pan/zoom on an image, caption bar, subtle vignette. */
export const ImageScene: React.FC<{scene: Scene; accent: string}> = ({
  scene,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);

  const mode = scene.kenBurns ?? 'zoom-in';
  let scale = 1;
  let tx = 0;
  const ty = 0;
  switch (mode) {
    case 'zoom-in':
      scale = interpolate(t, [0, 1], [1.02, 1.16]);
      break;
    case 'zoom-out':
      scale = interpolate(t, [0, 1], [1.18, 1.04]);
      break;
    case 'pan-left':
      scale = 1.15;
      tx = interpolate(t, [0, 1], [40, -40]);
      break;
    case 'pan-right':
      scale = 1.15;
      tx = interpolate(t, [0, 1], [-40, 40]);
      break;
  }

  const barIn = spring({frame: frame - 4, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          }}
        />
      ) : null}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* bottom gradient for caption legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(5,6,16,0.9) 0%, transparent 38%)',
        }}
      />
      {scene.text ? (
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            bottom: SAFE_BOTTOM + 160,
            opacity: barIn,
            transform: `translateY(${(1 - barIn) * 30}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              borderLeft: `10px solid ${accent}`,
              paddingLeft: 26,
              fontFamily: FONT_BODY,
              fontWeight: 800,
              fontSize: 54,
              lineHeight: 1.2,
              color: TEXT,
            }}
          >
            {scene.text}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
