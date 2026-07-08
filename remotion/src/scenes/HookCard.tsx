import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BG, FONT_DISPLAY, SAFE_BOTTOM, SAFE_TOP, TEXT} from '../theme';
import type {Scene} from '../types';

/** Big bold opening statement — huge type, spring-in, high contrast bg. */
export const HookCard: React.FC<{scene: Scene; accent: string}> = ({
  scene,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const barW = interpolate(
    spring({frame: frame - 6, fps, config: {damping: 200}}),
    [0, 1],
    [0, 220],
  );

  const words = (scene.text ?? '').split(' ');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
        paddingLeft: 70,
        paddingRight: 70,
      }}
    >
      {/* subtle accent glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
          top: '18%',
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: pop,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 96,
            lineHeight: 1.08,
            color: TEXT,
            textTransform: 'uppercase',
            letterSpacing: -1,
          }}
        >
          {words.map((w, i) => {
            const wordIn = spring({
              frame: frame - i * 3,
              fps,
              config: {damping: 14},
            });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  marginRight: 22,
                  opacity: wordIn,
                  transform: `translateY(${(1 - wordIn) * 40}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            height: 12,
            width: barW,
            backgroundColor: accent,
            margin: '48px auto 0',
            borderRadius: 6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
