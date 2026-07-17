import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY, FONT_SERIF, SAFE_BOTTOM} from '../theme';
import type {CaptionGroup} from '../types';
import {usePulse} from './MusicPulse';
import {useVibe} from './VibeContext';
import {usePalette} from './ThemeContext';

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
  const pal = usePalette();
  const light = pal.bg === '#f5f4f0';
  // moody serif captions sit bare on the page, so they follow the theme text
  // color; bold captions live in a dark pill, so their text stays light.
  const pillText = moody ? pal.text : '#f5f7ff';
  const inactive = moody
    ? (light ? 'rgba(22,23,29,0.35)' : 'rgba(245,247,255,0.35)')
    : 'rgba(245,247,255,0.35)';
  const t = frame / fps;

  const groupIndex = captions.findIndex((g) => t >= g.start && t <= g.end + 0.25);
  if (groupIndex === -1) return null;
  const group = captions[groupIndex];
  // sticker feel: each caption group lands at a slightly different angle
  const jitter = ((groupIndex * 37) % 5) - 2; // deterministic, -2..2 degrees

  // ---- editorial-dark: karaoke as calm BODY TEXT in the document's text
  // zone — left-aligned, no pill (redundant on the dark canvas), no rotation,
  // no music-driven scale. Word-level highlight kept. ----
  if (pal.kind === 'editorial') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 64,
            top: 1400,
            textAlign: 'left',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.42,
          }}
        >
          {group.words.map((w, i) => {
            const active = t >= w.start;
            const isCurrent = t >= w.start && t <= w.end + 0.12;
            return (
              <span
                key={i}
                style={{
                  color: isCurrent ? accent : active ? pal.text : pal.textDim,
                  marginRight: 16,
                  display: 'inline-block',
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

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
                  color: active ? (isCurrent ? accent : pillText) : inactive,
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
