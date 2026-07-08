import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY, SAFE_BOTTOM, TEXT} from '../theme';
import type {CaptionGroup} from '../types';

/**
 * Word-by-word animated captions overlaid on all scenes.
 * Timings come from edge-tts WordBoundary events (reel-global seconds).
 */
export const Captions: React.FC<{
  captions: CaptionGroup[];
  accent: string;
}> = ({captions, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const group = captions.find((g) => t >= g.start && t <= g.end + 0.25);
  if (!group) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: SAFE_BOTTOM + 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(5,6,16,0.78)',
            borderRadius: 20,
            padding: '18px 30px',
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 48,
            lineHeight: 1.25,
            textTransform: 'uppercase',
          }}
        >
          {group.words.map((w, i) => {
            const active = t >= w.start;
            const isCurrent = t >= w.start && t <= w.end + 0.12;
            return (
              <span
                key={i}
                style={{
                  color: active ? (isCurrent ? accent : TEXT) : 'rgba(245,247,255,0.35)',
                  marginRight: 22,
                  display: 'inline-block',
                  transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                  transformOrigin: 'center bottom',
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
