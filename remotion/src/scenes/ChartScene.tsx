import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {RevealText} from '../components/RevealText';
import {FONT_BODY, FONT_DISPLAY, SAFE_BOTTOM, SAFE_TOP, TEXT, TEXT_DIM} from '../theme';
import type {ChartItem, Scene} from '../types';

/**
 * Animated horizontal bar chart — bars grow in staggered, values count up,
 * the `highlight` item glows in the accent color. For benchmark stories.
 */
export const ChartScene: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items: ChartItem[] = scene.chart ?? [];
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <AbsoluteFill>
      <AmbientBackground accent={accent} secondary={second} seed={5} />
      <AbsoluteFill
        style={{
          paddingTop: SAFE_TOP + 60,
          paddingBottom: SAFE_BOTTOM,
          paddingLeft: 80,
          paddingRight: 80,
          justifyContent: 'center',
        }}
      >
        {scene.text ? (
          <RevealText
            text={scene.text}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 62,
              color: TEXT,
              textTransform: 'uppercase',
              marginBottom: 70,
            }}
          />
        ) : null}
        {items.map((item, i) => {
          const grow = spring({
            frame: frame - 8 - i * 7,
            fps,
            config: {damping: 26, stiffness: 70},
          });
          const widthPct = (item.value / max) * 100 * grow;
          const isHi = Boolean(item.highlight);
          const decimals = Number.isInteger(item.value) ? 0 : 1;
          const shown = (item.value * grow).toFixed(decimals);
          return (
            <div key={i} style={{marginBottom: 46}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontFamily: FONT_BODY,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 40,
                    color: isHi ? accent : TEXT_DIM,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 52,
                    color: isHi ? accent : TEXT,
                  }}
                >
                  {shown}
                  {item.suffix ?? ''}
                </span>
              </div>
              <div
                style={{
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    borderRadius: 17,
                    background: isHi
                      ? `linear-gradient(90deg, ${accent}, ${second})`
                      : 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.45))',
                    boxShadow: isHi ? `0 0 40px ${accent}66` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
        {scene.label ? (
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT_BODY,
              fontSize: 30,
              color: TEXT_DIM,
              opacity: interpolate(frame, [20, 40], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {scene.label}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
