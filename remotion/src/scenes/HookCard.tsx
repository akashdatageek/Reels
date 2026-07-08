import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {FONT_DISPLAY, SAFE_BOTTOM, SAFE_TOP, TEXT} from '../theme';
import type {Scene} from '../types';

/** Big bold opening statement — huge type, spring-in, living background.
 *  Words wrapped in *asterisks* render in the accent color. */
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

  // "now *one command*" -> emphasized run of words in accent.
  // Asterisks toggle emphasis on/off, so multi-word spans work.
  let emphasis = false;
  const words = (scene.text ?? '').split(/\s+/).map((w) => {
    const opens = w.startsWith('*');
    const closes = /\*[.,!?]?$/.test(w) && w.length > (opens ? 2 : 1);
    if (opens) emphasis = true;
    const emphasized = emphasis;
    if (closes) emphasis = false;
    return {text: w.replace(/\*/g, ''), emphasized};
  });

  return (
    <AbsoluteFill>
      <AmbientBackground accent={accent} seed={1} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: SAFE_TOP,
          paddingBottom: SAFE_BOTTOM,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
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
                  color: w.emphasized ? accent : undefined,
                  textShadow: w.emphasized ? `0 0 50px ${accent}66` : undefined,
                }}
              >
                {w.text}
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
    </AbsoluteFill>
  );
};
