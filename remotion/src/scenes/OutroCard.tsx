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
import {AmbientBackground} from '../components/AmbientBackground';
import {SceneBackground} from '../components/SceneBackground';
import {usePalette} from '../components/ThemeContext';
import {FONT_BODY, FONT_DISPLAY} from '../theme';
import type {Scene} from '../types';

/** CTA + handle, with a "follow" pulse. */
export const OutroCard: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pal = usePalette();
  const TEXT = pal.text;
  const TEXT_DIM = pal.textDim;
  const BG = pal.bg;

  const cardIn = spring({frame, fps, config: {damping: 14}});
  // gentle infinite pulse on the follow button
  const pulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 2.2);
  // periodic "tap" press every ~2.3s + a bell that rings during the tap
  const tp = (frame % 70) / 70;
  const tap = tp < 0.14 ? 1 - 0.1 * Math.sin((tp / 0.14) * Math.PI) : 1;
  const bellWob = Math.sin((frame / fps) * 11) * (tp < 0.22 ? 16 : 3);

  return (
    <AbsoluteFill>
      {scene.background ? <SceneBackground src={scene.background} /> : null}
      <AmbientBackground accent={accent} secondary={second} seed={4} transparent={Boolean(scene.background)} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      <div
        style={{
          textAlign: 'center',
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [60, 0])}px)`,
        }}
      >
        {scene.logo ? (
          <Img
            src={staticFile(scene.logo)}
            style={{
              width: 150,
              height: 'auto',
              margin: '0 auto 44px',
              display: 'block',
              filter: `drop-shadow(0 6px 30px ${accent}55)`,
            }}
          />
        ) : null}
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 84,
            color: TEXT,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            padding: '0 80px',
          }}
        >
          {scene.text ?? 'Follow for daily AI news'}
        </div>
        {scene.handle ? (
          <div
            style={{
              marginTop: 40,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 52,
              color: TEXT_DIM,
            }}
          >
            {scene.handle}
          </div>
        ) : null}
        <div
          style={{
            marginTop: 70,
            display: 'inline-block',
            transform: `scale(${pulse * tap})`,
            backgroundColor: accent,
            color: BG,
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 48,
            padding: '26px 90px',
            borderRadius: 999,
            boxShadow: `0 0 60px ${accent}66`,
          }}
        >
          FOLLOW{' '}
          <span style={{display: 'inline-block', transform: `rotate(${bellWob}deg)`, transformOrigin: 'top center'}}>🔔</span>
        </div>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
