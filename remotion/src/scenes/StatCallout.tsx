import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {Backdrop} from '../components/Backdrop';
import {ChannelBadge} from '../components/EditorialCard';
import {usePulse} from '../components/MusicPulse';
import {usePalette} from '../components/ThemeContext';
import {FONT_BODY, FONT_DISPLAY} from '../theme';
import type {Scene} from '../types';

/** Parse a stat like "2x", "87%", "$20", "1.5M" into prefix/number/suffix. */
const parseStat = (stat: string) => {
  const m = stat.match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/);
  if (!m) return {prefix: '', value: null as number | null, suffix: stat, decimals: 0};
  const raw = m[2].replace(',', '.');
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return {prefix: m[1], value: parseFloat(raw), suffix: m[3], decimals};
};

/** Derive a 0..1 fraction from a stat like "26%" or "97/108" (else null). */
const fractionOf = (stat: string): number | null => {
  const pct = stat.match(/([0-9.]+)\s*%/);
  if (pct) return Math.min(1, parseFloat(pct[1]) / 100);
  const frac = stat.match(/([0-9.]+)\s*\/\s*([0-9.]+)/);
  if (frac) {
    const d = parseFloat(frac[2]);
    if (d) return Math.min(1, parseFloat(frac[1]) / d);
  }
  return null;
};

/** Animated number/metric — counts up, label fades in. */
export const StatCallout: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const {prefix, value, suffix, decimals} = parseStat(scene.stat ?? '');
  const progress = spring({frame, fps, config: {damping: 30, stiffness: 60}});
  const shown =
    value === null ? '' : (value * progress).toFixed(decimals);

  const labelIn = spring({frame: frame - 10, fps, config: {damping: 200}});
  const TEXT_DIM = usePalette().textDim;
  const {bass} = usePulse();
  const ringScale = interpolate(progress, [0, 1], [0.8, 1]) * (1 + bass * 0.04);

  // data viz: donut/bar need a fraction (a "26%" or "97/108")
  const fraction = fractionOf(scene.stat ?? '');
  const variant = scene.statVariant && fraction !== null ? scene.statVariant : 'ring';
  const fillP = (fraction ?? 0) * progress; // arc/bar fills in sync with count-up
  const R = 46;
  const C = 2 * Math.PI * R;

  // ---- editorial-dark: left-aligned document stat — solid accent number,
  // static glow, fraction as a clean bar. No music-driven motion. ----
  const pal = usePalette();
  if (pal.kind === 'editorial') {
    return (
      <AbsoluteFill>
        <AmbientBackground accent={accent} secondary={second} seed={2} variant={scene.bgStyle} />
        <ChannelBadge logo={scene.logo} handle={scene.handle} />
        <div style={{position: 'absolute', left: 64, right: 64, top: 560}}>
          <div style={{width: 96, height: 10, borderRadius: 5, backgroundColor: accent, marginBottom: 40}} />
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 220,
              lineHeight: 1,
              color: accent,
              letterSpacing: -2,
            }}
          >
            {value === null ? scene.stat : `${prefix}${shown}${suffix}`}
          </div>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.3,
              color: pal.text,
              opacity: labelIn,
              transform: `translateY(${(1 - labelIn) * 20}px)`,
            }}
          >
            {scene.label}
          </div>
          {fraction !== null ? (
            <div style={{marginTop: 44, width: '100%', height: 26, borderRadius: 13, backgroundColor: `${accent}26`, overflow: 'hidden'}}>
              <div style={{width: `${fillP * 100}%`, height: '100%', borderRadius: 13, backgroundColor: accent}} />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {scene.backdrop ? <Backdrop src={scene.backdrop} /> : null}
      <AmbientBackground accent={accent} secondary={second} seed={2} transparent={Boolean(scene.backdrop)} variant={scene.bgStyle} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      {variant === 'ring' ? (
        <div
          style={{
            width: 780,
            height: 780,
            borderRadius: '50%',
            border: `3px solid ${accent}33`,
            position: 'absolute',
            transform: `scale(${ringScale})`,
          }}
        />
      ) : null}
      {variant === 'donut' ? (
        <svg width={720} height={720} viewBox="0 0 100 100" style={{position: 'absolute', transform: `rotate(-90deg) scale(${1 + bass * 0.02})`}}>
          <circle cx="50" cy="50" r={R} fill="none" stroke={`${accent}22`} strokeWidth={7} />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={accent}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fillP)}
            style={{filter: `drop-shadow(0 0 6px ${accent})`}}
          />
        </svg>
      ) : null}
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 260,
            lineHeight: 1,
            background: `linear-gradient(160deg, ${accent} 25%, ${second} 85%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${34 + bass * 44}px ${accent}${bass > 0.4 ? '88' : '55'})`,
            transform: `scale(${1 + bass * 0.025})`,
          }}
        >
          {value === null ? scene.stat : `${prefix}${shown}${suffix}`}
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 58,
            color: TEXT_DIM,
            textTransform: 'uppercase',
            letterSpacing: 4,
            opacity: labelIn,
            transform: `translateY(${(1 - labelIn) * 24}px)`,
          }}
        >
          {scene.label}
        </div>
        {variant === 'bar' ? (
          <div style={{margin: '44px auto 0', width: 760, height: 34, borderRadius: 17, backgroundColor: `${accent}22`, overflow: 'hidden'}}>
            <div style={{width: `${fillP * 100}%`, height: '100%', borderRadius: 17, background: `linear-gradient(90deg, ${accent}, ${second})`, boxShadow: `0 0 40px ${accent}66`}} />
          </div>
        ) : null}
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
