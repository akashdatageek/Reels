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
import {usePulse} from '../components/MusicPulse';
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
  const {bass} = usePulse();
  // 2.5D feel: a slow perspective tilt + a light band sweeping across once
  const tilt = Math.sin(t * Math.PI) * 1.2;
  const sweepX = interpolate(t, [0.1, 0.75], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `perspective(1400px) rotateY(${tilt}deg) scale(${scale * (1 + bass * 0.01)}) translate(${tx}px, ${ty}px)`,
          }}
        />
      ) : null}
      {/* light sweep across the image */}
      <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            height: '140%',
            width: '45%',
            left: 0,
            transform: `translateX(${sweepX}%) skewX(-14deg)`,
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 50%, transparent)',
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>
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
