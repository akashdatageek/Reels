import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {usePalette} from '../components/ThemeContext';
import {FONT_BODY, FONT_DISPLAY} from '../theme';
import type {FigureAnnotation, Scene} from '../types';

/**
 * Shows a REAL source figure (chart, diagram, screenshot) big and legible,
 * with a title and explanation callouts that fade in one-by-one across the
 * scene — so the graph is actually walked through, not decorated over.
 * No generation: the credibility is the real figure.
 */
export const FigureScene: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = usePalette();
  const anns: FigureAnnotation[] = scene.annotations ?? [];

  const titleIn = spring({frame, fps, config: {damping: 200}});
  const figIn = spring({frame: frame - 6, fps, config: {damping: 22, stiffness: 90}});

  // annotations fade in staggered over the middle 70% of the scene
  const startF = 0.22 * durationInFrames;
  const stepF = anns.length
    ? (0.62 * durationInFrames) / anns.length
    : 0;

  return (
    <AbsoluteFill style={{backgroundColor: p.bg}}>
      {/* faint accent wash in a corner — subtle, editorial */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          padding: '260px 70px 340px',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {scene.text ? (
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 60,
              lineHeight: 1.06,
              color: p.text,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 34,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 24}px)`,
            }}
          >
            {scene.text}
          </div>
        ) : null}

        {scene.figure ? (
          <div
            style={{
              width: '100%',
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              border: `1px solid ${p.panelBorder}`,
              boxShadow:
                p.bg === '#f5f4f0'
                  ? '0 24px 60px rgba(0,0,0,0.12)'
                  : '0 24px 60px rgba(0,0,0,0.5)',
              opacity: figIn,
              transform: `scale(${0.94 + figIn * 0.06})`,
            }}
          >
            <Img
              src={staticFile(scene.figure)}
              style={{width: '100%', height: 'auto', display: 'block'}}
            />
          </div>
        ) : null}

        {scene.figureCredit ? (
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT_BODY,
              fontSize: 26,
              color: p.textDim,
              alignSelf: 'flex-end',
            }}
          >
            {scene.figureCredit}
          </div>
        ) : null}

        {/* explanation callouts */}
        <div style={{marginTop: 40, width: '100%'}}>
          {anns.map((a, i) => {
            const aIn = spring({
              frame: frame - (startF + i * stepF),
              fps,
              config: {damping: 200},
            });
            if (aIn < 0.01) return null;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 18,
                  marginBottom: 22,
                  opacity: aIn,
                  transform: `translateX(${(1 - aIn) * -24}px)`,
                }}
              >
                <div
                  style={{
                    marginTop: 14,
                    minWidth: 20,
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: a.emphasis ? accent : p.textDim,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: a.emphasis ? 800 : 600,
                    fontSize: 44,
                    lineHeight: 1.25,
                    color: a.emphasis ? accent : p.text,
                  }}
                >
                  {a.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
