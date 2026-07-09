import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {usePulse} from '../components/MusicPulse';
import {FONT_BODY, FONT_DISPLAY, TEXT_DIM} from '../theme';
import type {Scene} from '../types';

/** Parse a stat like "2x", "87%", "$20", "1.5M" into prefix/number/suffix. */
const parseStat = (stat: string) => {
  const m = stat.match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/);
  if (!m) return {prefix: '', value: null as number | null, suffix: stat, decimals: 0};
  const raw = m[2].replace(',', '.');
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return {prefix: m[1], value: parseFloat(raw), suffix: m[3], decimals};
};

/** Animated number/metric — counts up, label fades in. */
export const StatCallout: React.FC<{scene: Scene; accent: string}> = ({
  scene,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const {prefix, value, suffix, decimals} = parseStat(scene.stat ?? '');
  const progress = spring({frame, fps, config: {damping: 30, stiffness: 60}});
  const shown =
    value === null ? '' : (value * progress).toFixed(decimals);

  const labelIn = spring({frame: frame - 10, fps, config: {damping: 200}});
  const {bass} = usePulse();
  const ringScale = interpolate(progress, [0, 1], [0.8, 1]) * (1 + bass * 0.04);

  return (
    <AbsoluteFill>
      <AmbientBackground accent={accent} seed={2} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 260,
            lineHeight: 1,
            color: accent,
            textShadow: `0 0 ${80 + bass * 90}px ${accent}${bass > 0.4 ? '88' : '55'}`,
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
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
