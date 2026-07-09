import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Captions} from './components/Captions';
import {CUT_FLASH_FRAMES, CutFlash} from './components/CutFlash';
import {Grain} from './components/Grain';
import {MusicPulseProvider, usePulse} from './components/MusicPulse';
import {ChartScene} from './scenes/ChartScene';
import {HookCard} from './scenes/HookCard';
import {ImageScene} from './scenes/ImageScene';
import {OutroCard} from './scenes/OutroCard';
import {SplitCompare} from './scenes/SplitCompare';
import {StatCallout} from './scenes/StatCallout';
import {TerminalScene} from './scenes/TerminalScene';
import {BG, DEFAULT_ACCENT, SAFE_TOP} from './theme';
import type {ReelProps, Scene} from './types';

const SCENE_COMPONENTS: Record<
  Scene['type'],
  React.FC<{scene: Scene; accent: string; secondary?: string}>
> = {
  HookCard,
  ImageScene,
  StatCallout,
  SplitCompare,
  TerminalScene,
  ChartScene,
  OutroCard,
};

/** Thin accent progress bar just below the IG top safe zone — a retention
 *  device: viewers can see the reel is short. */
const ProgressBar: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {bass} = usePulse();
  const pct = Math.min(1, frame / Math.max(durationInFrames - 1, 1));
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_TOP - 30,
        left: 60,
        right: 60,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.14)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          borderRadius: 4,
          backgroundColor: accent,
          boxShadow: `0 0 ${18 + bass * 26}px ${accent}aa`,
        }}
      />
    </div>
  );
};

/** Reads the reel spec (passed as input props) and sequences the scenes. */
export const Reel: React.FC<ReelProps> = ({reel, captions}) => {
  const {fps} = useVideoConfig();
  const accent = reel.accentColor ?? DEFAULT_ACCENT;
  const secondary = reel.secondaryColor ?? accent;

  let cursor = 0;
  const sequenced = reel.scenes.map((scene, i) => {
    const from = cursor;
    const frames = Math.max(1, Math.round(scene.duration * fps));
    cursor += frames;
    return {scene, from, frames, key: i};
  });

  return (
    <MusicPulseProvider hasMusic={Boolean(reel.music)}>
      <AbsoluteFill style={{backgroundColor: BG}}>
        {sequenced.map(({scene, from, frames, key}) => {
          const Comp = SCENE_COMPONENTS[scene.type];
          if (!Comp) return null;
          return (
            <Sequence key={key} from={from} durationInFrames={frames} name={`${key}-${scene.type}`}>
              <Comp scene={{...scene, handle: scene.handle ?? reel.handle}} accent={accent} secondary={secondary} />
            </Sequence>
          );
        })}
        {/* accent wipe at every cut (skip the reel's very first frame) */}
        {sequenced.slice(1).map(({from, key}) => (
          <Sequence key={`cut-${key}`} from={from - 3} durationInFrames={CUT_FLASH_FRAMES} name={`cut-${key}`}>
            <CutFlash accent={accent} secondary={secondary} />
          </Sequence>
        ))}
        <Captions captions={captions ?? []} accent={accent} />
        <ProgressBar accent={accent} />
        <Grain />
      </AbsoluteFill>
    </MusicPulseProvider>
  );
};
