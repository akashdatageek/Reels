import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {usePalette} from './ThemeContext';

/**
 * The one shared wrapper for the "no text on a bare canvas" rule: a
 * topic-relevant image rendered UNDER a legibility scrim — darkened, slightly
 * blurred, with a gradient pushing contrast toward the text zones (headline
 * block up top, caption band at the bottom).
 *
 * Background is ambience, not information: it carries ~15-25% visual weight
 * and is deliberately STATIC — no drift, no zoom, no pulse. (Backdrop.tsx is
 * the legacy drifting variant; this one exists because the editorial style
 * bans idle motion, and the screening gate would flag a trembling backdrop.)
 *
 * Evidence rule: an image used here is decoration. It may be blurred and
 * darkened freely — which is exactly why it can never BE the scene's
 * evidence; the bit-exact copy in the media card serves that role, and
 * preflight refuses a scene whose background equals its figure path.
 */
export const SceneBackground: React.FC<{src: string}> = ({src}) => {
  const pal = usePalette();
  const bg = pal.bg;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // blur must be strong enough to melt TEXT in a background (tweet
          // crops, article screenshots) into texture — the screening gate's
          // R8 failed a 2.5px blur as text-on-text
          filter: 'brightness(0.34) saturate(0.7) blur(10px)',
          transform: 'scale(1.06)', // hide the blur's soft edge, statically
        }}
      />
      {/* flat tint pulls the image toward the theme canvas */}
      <AbsoluteFill style={{backgroundColor: `${bg}a6`}} />
      {/* gradient scrim: heaviest over the headline block and caption band */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${bg}e6 0%, ${bg}a6 30%, ${bg}40 55%, ${bg}8c 78%, ${bg}d9 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
