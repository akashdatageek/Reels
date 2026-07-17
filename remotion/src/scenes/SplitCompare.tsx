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
import {AmbientBackground} from '../components/AmbientBackground';
import {SceneBackground} from '../components/SceneBackground';
import {Backdrop} from '../components/Backdrop';
import {RevealText} from '../components/RevealText';
import {usePalette} from '../components/ThemeContext';
import {FONT_BODY, FONT_DISPLAY, SAFE_BOTTOM, SAFE_TOP} from '../theme';
import type {Scene} from '../types';

const Panel: React.FC<{
  title?: string;
  text?: string;
  image?: string;
  accent: string;
  from: 'left' | 'right';
  highlight?: boolean;
}> = ({title, text, image, accent, from, highlight}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pal = usePalette();
  const slide = spring({frame, fps, config: {damping: 16, stiffness: 90}});
  const x = interpolate(slide, [0, 1], [from === 'left' ? -560 : 560, 0]);

  return (
    <div
      style={{
        flex: 1,
        margin: 18,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: pal.panel,
        border: highlight ? `4px solid ${accent}` : `4px solid ${pal.panelBorder}`,
        transform: `translateX(${x}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {image ? (
        <Img
          src={staticFile(image)}
          style={{width: '100%', height: 420, objectFit: 'cover'}}
        />
      ) : null}
      <div style={{padding: 40}}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 56,
            color: highlight ? accent : pal.text,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </div>
        {text ? (
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.3,
              color: pal.textDim,
            }}
          >
            {text}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Before/after, X vs Y — two panels slide in from opposite sides. */
export const SplitCompare: React.FC<{scene: Scene; accent: string; secondary?: string}> = ({
  scene,
  accent,
  secondary,
}) => {
  const second = secondary ?? accent;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pal = usePalette();
  const vsIn = spring({frame: frame - 8, fps, config: {damping: 10}});

  return (
    <AbsoluteFill>
      {scene.background ? <SceneBackground src={scene.background} /> : scene.backdrop ? <Backdrop src={scene.backdrop} /> : null}
      <AmbientBackground accent={accent} secondary={second} seed={6} transparent={Boolean(scene.background || scene.backdrop)} />
      <AbsoluteFill
        style={{
          paddingTop: SAFE_TOP,
          paddingBottom: SAFE_BOTTOM,
          justifyContent: 'center',
        }}
      >
      {scene.text ? (
        <RevealText
          text={scene.text}
          style={{
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 64,
            color: pal.text,
            textTransform: 'uppercase',
            marginBottom: 30,
            paddingLeft: 60,
            paddingRight: 60,
          }}
        />
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column', height: 1000, position: 'relative'}}>
        <Panel
          title={scene.leftTitle}
          text={scene.leftText}
          image={scene.leftImage}
          accent={accent}
          from="left"
        />
        <Panel
          title={scene.rightTitle}
          text={scene.rightText}
          image={scene.rightImage}
          accent={accent}
          from="right"
          highlight
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${vsIn})`,
            width: 130,
            height: 130,
            borderRadius: '50%',
            backgroundColor: accent,
            color: pal.bgLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 52,
            zIndex: 2,
          }}
        >
          VS
        </div>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
