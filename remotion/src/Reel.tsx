import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Captions} from './components/Captions';
import {HookCard} from './scenes/HookCard';
import {ImageScene} from './scenes/ImageScene';
import {OutroCard} from './scenes/OutroCard';
import {SplitCompare} from './scenes/SplitCompare';
import {StatCallout} from './scenes/StatCallout';
import {BG, DEFAULT_ACCENT} from './theme';
import type {ReelProps, Scene} from './types';

const SCENE_COMPONENTS: Record<
  Scene['type'],
  React.FC<{scene: Scene; accent: string}>
> = {
  HookCard,
  ImageScene,
  StatCallout,
  SplitCompare,
  OutroCard,
};

/** Reads the reel spec (passed as input props) and sequences the scenes. */
export const Reel: React.FC<ReelProps> = ({reel, captions}) => {
  const {fps} = useVideoConfig();
  const accent = reel.accentColor ?? DEFAULT_ACCENT;

  let cursor = 0;
  const sequenced = reel.scenes.map((scene, i) => {
    const from = cursor;
    const frames = Math.max(1, Math.round(scene.duration * fps));
    cursor += frames;
    return {scene, from, frames, key: i};
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      {sequenced.map(({scene, from, frames, key}) => {
        const Comp = SCENE_COMPONENTS[scene.type];
        if (!Comp) return null;
        return (
          <Sequence key={key} from={from} durationInFrames={frames} name={`${key}-${scene.type}`}>
            <Comp scene={{...scene, handle: scene.handle ?? reel.handle}} accent={accent} />
          </Sequence>
        );
      })}
      <Captions captions={captions ?? []} accent={accent} />
    </AbsoluteFill>
  );
};
