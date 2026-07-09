import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY, FONT_SERIF, SAFE_BOTTOM, TEXT} from '../theme';
import type {CaptionGroup} from '../types';
import {usePulse} from './MusicPulse';
import {useVibe} from './VibeContext';

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
  const {bass} = usePulse();
  const vibe = useVibe();
  const moody = vibe === 'moody';
  const t = frame / fps;

  const groupIndex = captions.findIndex((g) => t >= g.start && t <= g.end + 0.25);
  if (groupIndex === -1) return null;
  const group = captions[groupIndex];
  // sticker feel: each caption group lands at a slightly different angle
  const jitter = ((groupIndex * 37) % 5) - 2; // deterministic, -2..2 degrees

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
            backgroundColor: moody ? 'transparent' : 'rgba(5,6,16,0.82)',
            borderRadius: 22,
            padding: moody ? '10px 24px' : '18px 32px',
            fontFamily: moody ? FONT_SERIF : FONT_BODY,
            fontWeight: moody ? 400 : 800,
            fontSize: moody ? 44 : 50,
            lineHeight: 1.3,
            textTransform: moody ? 'lowercase' : 'uppercase',
            transform: moody ? undefined : `rotate(${jitter * 0.6}deg)`,
            textShadow: moody ? '0 2px 24px rgba(0,0,0,0.9)' : undefined,
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
                  transform: isCurrent ? `scale(${1.06 + bass * 0.05})` : 'scale(1)',
                  transformOrigin: 'center bottom',
                  textShadow: isCurrent ? `0 0 ${bass * 30}px ${accent}` : undefined,
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
