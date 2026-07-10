import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Kinetic title reveal: the text wipes up behind a clip-path mask instead of a
 * flat fade — a small piece of motion craft shared by the data/figure scenes so
 * their titles feel authored, not defaulted. Optional per-word stagger.
 */
export const RevealText: React.FC<{
  text: string;
  style?: React.CSSProperties;
  /** frames to wait before starting */
  delay?: number;
  /** stagger each word instead of revealing the whole line at once */
  perWord?: boolean;
  className?: string;
}> = ({text, style, delay = 0, perWord = false, className}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (!perWord) {
    const p = spring({frame: frame - delay, fps, config: {damping: 200}});
    const clip = interpolate(p, [0, 1], [100, 0]);
    return (
      <div
        className={className}
        style={{
          ...style,
          clipPath: `inset(0 0 ${clip}% 0)`,
          transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
        }}
      >
        {text}
      </div>
    );
  }

  const words = text.split(/\s+/);
  return (
    <div className={className} style={style}>
      {words.map((w, i) => {
        const p = spring({frame: frame - delay - i * 3, fps, config: {damping: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              clipPath: `inset(0 0 ${interpolate(p, [0, 1], [100, 0])}% 0)`,
              transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
