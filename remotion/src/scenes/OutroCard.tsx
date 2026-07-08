import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {BG, FONT_BODY, FONT_DISPLAY, TEXT, TEXT_DIM} from '../theme';
import type {Scene} from '../types';

/** CTA + handle, with a "follow" pulse. */
export const OutroCard: React.FC<{scene: Scene; accent: string}> = ({
  scene,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardIn = spring({frame, fps, config: {damping: 14}});
  // gentle infinite pulse on the follow button
  const pulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 2.2);

  return (
    <AbsoluteFill>
      <AmbientBackground accent={accent} seed={4} />
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
            transform: `scale(${pulse})`,
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
          FOLLOW
        </div>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
