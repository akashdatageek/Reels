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
import {useVibe} from '../components/VibeContext';
import {FONT_DISPLAY, FONT_SERIF, SAFE_BOTTOM, SAFE_TOP, TEXT} from '../theme';
import type {Scene} from '../types';

/** Big bold opening statement — huge type, spring-in, living background.
 *  Words wrapped in *asterisks* render in the accent color. */
export const HookCard: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const vibe = useVibe();
  const moody = vibe === 'moody';
  // moody: slow fade-drift in; bold: springy pop
  const pop = spring({
    frame,
    fps,
    config: moody ? {damping: 60, stiffness: 22} : {damping: 12, stiffness: 120},
  });
  const {bass} = usePulse();
  const scale = interpolate(pop, [0, 1], [moody ? 0.96 : 0.6, 1]) * (1 + bass * (moody ? 0.004 : 0.015));
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
      <AmbientBackground accent={accent} secondary={second} seed={1} />
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
            fontFamily: moody ? FONT_SERIF : FONT_DISPLAY,
            fontSize: moody ? 66 : 96,
            fontWeight: moody ? 400 : undefined,
            lineHeight: moody ? 1.45 : 1.08,
            color: TEXT,
            textTransform: moody ? 'none' : 'uppercase',
            letterSpacing: moody ? 0.5 : -1,
            maxWidth: moody ? 760 : undefined,
            margin: moody ? '0 auto' : undefined,
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
                  // bold: acid gradient chrome-type; moody: quiet warm italic
                  ...(w.emphasized
                    ? moody
                      ? {fontStyle: 'italic', color: accent}
                      : {
                          background: `linear-gradient(115deg, ${accent} 20%, ${second} 80%)`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: `drop-shadow(0 0 26px ${accent}66)`,
                        }
                    : null),
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
        <div
          style={{
            height: moody ? 2 : 12,
            width: moody ? 120 : barW * (1 + bass * 0.25),
            background: moody ? `${accent}88` : `linear-gradient(90deg, ${accent}, ${second})`,
            margin: '48px auto 0',
            borderRadius: 6,
            boxShadow: moody ? 'none' : `0 0 ${10 + bass * 50}px ${accent}`,
          }}
        />
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
