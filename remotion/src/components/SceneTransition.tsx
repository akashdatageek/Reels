import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../types';

export const TRANSITION_FRAMES = 12;

export type TransitionKind = NonNullable<Scene['transition']>;

/** Auto-rotation so consecutive cuts never use the same move. */
const ROTATION: TransitionKind[] = ['punch', 'slide', 'pushUp', 'wipe', 'whip'];
export const transitionFor = (scene: Scene, index: number): TransitionKind =>
  scene.transition ?? ROTATION[index % ROTATION.length];

/**
 * A scene ENTER animation, played over the first ~0.4s of the scene and settling
 * to identity — so it never overlaps neighbours and leaves audioStart sync
 * untouched. Gives each cut a distinct "edited" feel (slide, push, punch-in,
 * whip-pan, wipe). Pairs with the accent CutFlash already drawn at each cut.
 */
export const SceneTransition: React.FC<{
  kind: TransitionKind;
  children: React.ReactNode;
}> = ({kind, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // eased 0..1 over the transition; settles to exactly 1 (→ identity)
  const p = spring({frame, fps, config: {damping: 200, stiffness: 120}, durationInFrames: TRANSITION_FRAMES + 4});

  let style: React.CSSProperties = {};
  switch (kind) {
    case 'punch':
      style = {transform: `scale(${interpolate(p, [0, 1], [1.14, 1])})`, opacity: Math.min(1, p * 2.5)};
      break;
    case 'slide':
      style = {transform: `translateX(${(1 - p) * 100}%)`};
      break;
    case 'pushUp':
      style = {transform: `translateY(${(1 - p) * 75}%)`, opacity: Math.min(1, p * 3)};
      break;
    case 'whip': {
      const e = 1 - p;
      style = {transform: `translateX(${e * -55}%)`, filter: `blur(${e * 14}px)`, opacity: Math.min(1, p * 1.6)};
      break;
    }
    case 'wipe':
      style = {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`};
      break;
    case 'none':
    default:
      style = {};
  }

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
