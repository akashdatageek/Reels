import React from 'react';
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {usePalette} from '../components/ThemeContext';
import {RevealText} from '../components/RevealText';
import {FONT_BODY, FONT_DISPLAY} from '../theme';
import type {FigureAnnotation, FigureFocus, Scene} from '../types';

/** smoothstep-eased sample of scalar keyframes at fraction t (0..1). */
const sampleKF = (t: number, times: number[], values: number[]): number => {
  if (t <= times[0]) return values[0];
  for (let i = 1; i < times.length; i++) {
    if (t <= times[i]) {
      const span = times[i] - times[i - 1] || 1;
      const l = Math.min(1, Math.max(0, (t - times[i - 1]) / span));
      const e = l * l * (3 - 2 * l); // smoothstep
      return values[i - 1] + (values[i] - values[i - 1]) * e;
    }
  }
  return values[values.length - 1];
};

/**
 * Shows a REAL source figure big and legible, and — when `figureFocus` is set —
 * zooms into the exact part of the chart on a timeline, drawing a box / circle /
 * underline / spotlight + label as the voice hits it. Without figureFocus it
 * renders the static figure + fade-in annotations (unchanged, backward-compat).
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
  const focus: FigureFocus[] = scene.figureFocus ?? [];

  const figIn = spring({frame: frame - 6, fps, config: {damping: 22, stiffness: 90}});
  const t = frame / Math.max(durationInFrames - 1, 1);

  // ---- camera keyframes: full-frame at 0, then each focus step ----
  const kf = [
    {at: 0, cx: 0.5, cy: 0.5, s: 1},
    ...focus.map((f) => {
      const r = f.region;
      const cx = r ? r.x + r.w / 2 : 0.5;
      const cy = r ? r.y + r.h / 2 : 0.5;
      const s = r ? Math.min(4, Math.max(1, 0.9 / Math.max(r.w, r.h))) : 1;
      return {at: f.at, cx, cy, s};
    }),
  ];
  const times = kf.map((k) => k.at);
  const cx = sampleKF(t, times, kf.map((k) => k.cx));
  const cy = sampleKF(t, times, kf.map((k) => k.cy));
  const s = sampleKF(t, times, kf.map((k) => k.s));

  // active highlight = last focus step whose `at` has passed
  const activeIdx = focus.reduce((acc, f, i) => (t >= f.at ? i : acc), -1);
  const active = activeIdx >= 0 ? focus[activeIdx] : undefined;
  // draw-on progress (0..1) since this highlight became active
  const drawP = active
    ? spring({frame: frame - active.at * durationInFrames, fps, config: {damping: 200}})
    : 0;

  return (
    <AbsoluteFill style={{backgroundColor: p.bg}}>
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
      <AbsoluteFill style={{padding: '260px 70px 340px', justifyContent: 'flex-start', alignItems: 'center'}}>
        {scene.text ? (
          <RevealText
            text={scene.text}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 60,
              lineHeight: 1.06,
              color: p.text,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 34,
            }}
          />
        ) : null}

        {scene.figure ? (
          <div
            style={{
              width: '100%',
              borderRadius: 20,
              overflow: 'hidden', // clip the zoom
              backgroundColor: '#ffffff',
              border: `1px solid ${p.panelBorder}`,
              boxShadow:
                p.bg === '#f5f4f0' ? '0 24px 60px rgba(0,0,0,0.12)' : '0 24px 60px rgba(0,0,0,0.5)',
              opacity: figIn,
            }}
          >
            {/* zoom layer: image + on-figure highlights share one transform */}
            <div
              style={{
                position: 'relative',
                transformOrigin: `${cx * 100}% ${cy * 100}%`,
                transform: `translate(${(0.5 - cx) * 100}%, ${(0.5 - cy) * 100}%) scale(${(0.94 + figIn * 0.06) * s})`,
              }}
            >
              <Img src={staticFile(scene.figure)} style={{width: '100%', height: 'auto', display: 'block'}} />
              {active && active.region ? (
                <Highlight region={active.region} kind={active.highlight ?? 'box'} label={active.label} accent={accent} scale={s} progress={drawP} />
              ) : null}
            </div>
          </div>
        ) : null}

        {scene.figureCredit ? (
          <div style={{marginTop: 16, fontFamily: FONT_BODY, fontSize: 26, color: p.textDim, alignSelf: 'flex-end'}}>
            {scene.figureCredit}
          </div>
        ) : null}

        {/* explanation callouts (below the figure) */}
        <div style={{marginTop: 40, width: '100%'}}>
          {anns.map((a, i) => {
            const startF = 0.22 * durationInFrames;
            const stepF = anns.length ? (0.62 * durationInFrames) / anns.length : 0;
            const aIn = spring({frame: frame - (startF + i * stepF), fps, config: {damping: 200}});
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
                <div style={{marginTop: 14, minWidth: 20, width: 20, height: 20, borderRadius: 5, backgroundColor: a.emphasis ? accent : p.textDim}} />
                <div style={{fontFamily: FONT_BODY, fontWeight: a.emphasis ? 800 : 600, fontSize: 44, lineHeight: 1.25, color: a.emphasis ? accent : p.text}}>
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

/** A mark drawn on a figure region. Border/label sizes are divided by the
 *  current zoom so they stay crisp and constant on screen. */
const Highlight: React.FC<{
  region: {x: number; y: number; w: number; h: number};
  kind: 'box' | 'circle' | 'underline' | 'spotlight' | 'marker' | 'circleDraw';
  label?: string;
  accent: string;
  scale: number;
  /** 0..1 draw-on progress since the mark became active */
  progress: number;
}> = ({region, kind, label, accent, scale, progress}) => {
  const bw = 5 / scale; // on-screen ~5px border regardless of zoom
  const P = Math.min(1, Math.max(0, progress));
  const box: React.CSSProperties = {
    position: 'absolute',
    left: `${region.x * 100}%`,
    top: `${region.y * 100}%`,
    width: `${region.w * 100}%`,
    height: `${region.h * 100}%`,
    pointerEvents: 'none',
  };

  return (
    <>
      {kind === 'spotlight' ? (
        <div style={{...box, boxShadow: `0 0 0 9999px rgba(8,10,24,${0.55 * P})`, borderRadius: 8 / scale}} />
      ) : null}
      {/* box / spotlight border wipes on left→right */}
      {kind === 'box' || kind === 'spotlight' ? (
        <div style={{...box, border: `${bw}px solid ${accent}`, borderRadius: 8 / scale, boxShadow: `0 0 ${16 / scale}px ${accent}`, clipPath: `inset(0 ${(1 - P) * 100}% 0 0)`}} />
      ) : null}
      {/* plain circle: springs in */}
      {kind === 'circle' ? (
        <div style={{...box, border: `${bw}px solid ${accent}`, borderRadius: '50%', boxShadow: `0 0 ${16 / scale}px ${accent}`, transform: `scale(${0.7 + P * 0.3})`, opacity: P}} />
      ) : null}
      {/* hand-drawn scribble ring: SVG stroke draws on */}
      {kind === 'circleDraw' ? (
        <svg style={{...box, overflow: 'visible'}} viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="46"
            fill="none"
            stroke={accent}
            strokeWidth={bw}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100 - P * 100}
            style={{filter: `drop-shadow(0 0 ${10 / scale}px ${accent})`}}
          />
        </svg>
      ) : null}
      {/* highlighter marker: translucent accent bar sweeps across (works on any
          figure background — no blend mode) */}
      {kind === 'marker' ? (
        <div
          style={{
            ...box,
            width: `${region.w * 100 * P}%`,
            backgroundColor: accent,
            opacity: 0.38,
            borderRadius: 4 / scale,
          }}
        />
      ) : null}
      {kind === 'underline' ? (
        <div
          style={{
            position: 'absolute',
            left: `${region.x * 100}%`,
            top: `${(region.y + region.h) * 100}%`,
            width: `${region.w * 100 * P}%`,
            height: bw,
            backgroundColor: accent,
            boxShadow: `0 0 ${14 / scale}px ${accent}`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: `${region.x * 100}%`,
            top: `${region.y * 100}%`,
            transform: `translateY(-115%)`,
            backgroundColor: accent,
            color: '#0a0c1c',
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 22 / scale,
            padding: `${6 / scale}px ${12 / scale}px`,
            borderRadius: 8 / scale,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, P * 1.6),
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};
