import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY} from '../theme';
import type {LowerThird as LowerThirdData, Sticker} from '../types';

/** Emoji/text stickers that pop in and gently wobble — Gen-Z personality. */
export const Stickers: React.FC<{stickers: Sticker[]}> = ({stickers}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      {stickers.map((s, i) => {
        const at = (s.at ?? 0.1) * durationInFrames;
        const p = spring({frame: frame - at, fps, config: {damping: 8, stiffness: 190}});
        if (p < 0.01) return null;
        const wob = Math.sin(((frame - at) / fps) * 3 + i) * 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: s.size ?? 96,
              lineHeight: 1,
              transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0, 1])}) rotate(${(s.rotate ?? 0) + wob}deg)`,
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {s.text}
          </div>
        );
      })}
    </>
  );
};

/** A news-style lower-third strip that slides in from the left. */
export const LowerThird: React.FC<{data: LowerThirdData; accent: string}> = ({data, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 90}});
  const x = interpolate(inP, [0, 1], [-120, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        bottom: 520, // clears the word-caption band at the very bottom
        transform: `translateX(${x}%)`,
        opacity: inP,
        display: 'flex',
        alignItems: 'stretch',
        pointerEvents: 'none',
      }}
    >
      <div style={{width: 10, backgroundColor: accent, borderRadius: 3}} />
      <div
        style={{
          backgroundColor: 'rgba(8,10,24,0.86)',
          padding: '16px 26px',
          borderRadius: '0 12px 12px 0',
        }}
      >
        <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontSize: 40, color: '#fff', lineHeight: 1.1}}>
          {data.title}
        </div>
        {data.subtitle ? (
          <div style={{fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, color: accent, marginTop: 4}}>
            {data.subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
