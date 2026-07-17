import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY, FONT_DISPLAY, SAFE_TOP} from '../theme';
import {usePalette} from './ThemeContext';

/**
 * Editorial card layout system ("one document" look):
 *  - ChannelBadge: small logo + handle, top-left, inside IG chrome margins
 *  - MediaCard: rounded, bordered, slightly elevated media region (top ~55-60%)
 *  - EditorialTextBlock: accent divider · big white headline · accent subhead
 * All entrances are non-oscillating (damping 200) and settle to PERFECT
 * stillness — no idle motion anywhere in this layout.
 */

// Layout grid (1080x1920, IG safe zones top 250 / bottom 320)
export const ED_X = 64; // left/right text margin
export const CARD_TOP = SAFE_TOP + 80; // 330
export const CARD_H = 820; // card bottom = 1150 (~60% of frame)
export const TEXT_TOP = 1210;
export const CAPTION_TOP = 1400; // karaoke body text zone (shared by all scenes)

export const ChannelBadge: React.FC<{logo?: string; handle?: string}> = ({logo, handle}) => {
  const pal = usePalette();
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_TOP,
        left: ED_X,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {logo ? (
        <Img
          src={staticFile(logo)}
          style={{width: 46, height: 46, objectFit: 'contain', borderRadius: 10}}
        />
      ) : null}
      {handle ? (
        <div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: 30, color: pal.textDim, letterSpacing: 0.5}}>
          {handle}
        </div>
      ) : null}
    </div>
  );
};

export const MediaCard: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pal = usePalette();
  const enter = spring({frame, fps, config: {damping: 200}});
  return (
    <div
      style={{
        position: 'absolute',
        top: CARD_TOP,
        left: 44,
        right: 44,
        height: CARD_H,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: pal.panel,
        border: `1px solid ${pal.panelBorder}`,
        boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
        opacity: enter,
      }}
    >
      {children}
    </div>
  );
};

export const EditorialTextBlock: React.FC<{
  headline?: string;
  subtext?: string;
  accent: string;
}> = ({headline, subtext, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pal = usePalette();
  const enter = spring({frame: frame - 4, fps, config: {damping: 200}});
  return (
    <div
      style={{
        position: 'absolute',
        top: TEXT_TOP,
        left: ED_X,
        right: ED_X,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      <div style={{width: 96, height: 10, borderRadius: 5, backgroundColor: accent, marginBottom: 22}} />
      {headline ? (
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 60,
            lineHeight: 1.12,
            color: pal.text,
            letterSpacing: -0.5,
          }}
        >
          {headline.replace(/\*/g, '')}
        </div>
      ) : null}
      {subtext ? (
        <div
          style={{
            marginTop: 16,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1.25,
            color: accent,
          }}
        >
          {subtext}
        </div>
      ) : null}
    </div>
  );
};
