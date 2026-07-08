import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {Reel} from './Reel';
import {FPS, H, W} from './theme';
import type {ReelProps} from './types';
import defaultReel from './example/reel.json';
import defaultCaptions from './example/captions.json';
import type {CaptionGroup, ReelSpec} from './types';

/**
 * Duration is derived from the reel spec passed via --props, so the
 * composition always matches the narration audio exactly.
 */
const calculateMetadata: CalculateMetadataFunction<ReelProps> = ({props}) => {
  const total = props.reel.scenes.reduce((acc, s) => acc + s.duration, 0);
  return {
    durationInFrames: Math.max(1, Math.round(total * FPS)),
    fps: FPS,
    width: W,
    height: H,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={30 * FPS}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        reel: defaultReel as ReelSpec,
        captions: defaultCaptions as CaptionGroup[],
      }}
    />
  );
};
