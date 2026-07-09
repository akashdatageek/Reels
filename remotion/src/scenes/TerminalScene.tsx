import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {FONT_BODY, FONT_MONO, SAFE_BOTTOM, SAFE_TOP, TEXT, TEXT_DIM} from '../theme';
import type {Scene, TerminalLine} from '../types';

const TYPE_CPS = 22; // typed characters per second for command lines

/**
 * A terminal window that types commands and prints output on a timeline —
 * the scene for dev-tool launches ("push an agent", "npm install x").
 * Commands type character-by-character; outputs pop in line-by-line.
 */
export const TerminalScene: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const lines: TerminalLine[] = scene.terminal ?? [];

  const windowIn = spring({frame, fps, config: {damping: 15, stiffness: 110}});

  // Build a schedule: commands take len/TYPE_CPS seconds, outputs 0.18s each,
  // scaled to fit ~80% of the scene so everything is visible before the cut.
  const raw: number[] = lines.map((l) =>
    l.kind === 'command' ? Math.max(0.5, l.text.length / TYPE_CPS) : 0.18,
  );
  const rawTotal = raw.reduce((a, b) => a + b, 0);
  const budget = (durationInFrames / fps) * 0.8;
  const scale = rawTotal > budget ? budget / rawTotal : 1;

  let acc = 0.25; // small lead-in after the window pops
  const starts = raw.map((d) => {
    const s = acc;
    acc += d * scale;
    return s;
  });
  const tNow = frame / fps;

  return (
    <AbsoluteFill>
      <AmbientBackground accent={accent} secondary={second} seed={3} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: SAFE_TOP,
          paddingBottom: SAFE_BOTTOM,
        }}
      >
        <div
          style={{
            width: 920,
            borderRadius: 28,
            overflow: 'hidden',
            backgroundColor: 'rgba(8,10,24,0.92)',
            border: `2px solid ${accent}44`,
            boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 70px ${accent}22`,
            transform: `scale(${0.85 + windowIn * 0.15}) translateY(${(1 - windowIn) * 60}px)`,
            opacity: windowIn,
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '22px 28px',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} style={{width: 22, height: 22, borderRadius: '50%', backgroundColor: c}} />
            ))}
            {scene.text ? (
              <div
                style={{
                  marginLeft: 18,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 30,
                  color: TEXT_DIM,
                }}
              >
                {scene.text}
              </div>
            ) : null}
          </div>
          {/* terminal body */}
          <div
            style={{
              padding: '34px 40px 44px',
              fontFamily: FONT_MONO,
              fontSize: 36,
              lineHeight: 1.75,
              minHeight: 500,
            }}
          >
            {lines.map((line, i) => {
              const elapsed = tNow - starts[i];
              if (elapsed < 0) return null;
              const isCmd = line.kind === 'command';
              const chars = isCmd
                ? Math.min(line.text.length, Math.floor(elapsed * TYPE_CPS / scale))
                : line.text.length;
              const done = chars >= line.text.length;
              const isLastVisible =
                i === lines.length - 1 || tNow < (starts[i + 1] ?? Infinity);
              return (
                <div key={i} style={{whiteSpace: 'pre-wrap'}}>
                  {isCmd ? (
                    <span style={{color: accent, fontWeight: 700}}>{'$ '}</span>
                  ) : null}
                  <span
                    style={{
                      color:
                        line.kind === 'comment'
                          ? TEXT_DIM
                          : line.kind === 'success'
                            ? accent
                            : TEXT,
                      fontWeight: line.kind === 'success' ? 700 : 400,
                    }}
                  >
                    {line.text.slice(0, chars)}
                  </span>
                  {isCmd && !done && isLastVisible ? (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 20,
                        height: 40,
                        marginLeft: 4,
                        verticalAlign: 'middle',
                        backgroundColor: accent,
                        opacity: Math.floor(tNow * 2.5) % 2 === 0 ? 1 : 0.15,
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
