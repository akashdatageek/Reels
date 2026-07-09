import React, {createContext, useContext} from 'react';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';

/**
 * Audio-reactive pulse: FFT of the reel's music track, sampled per frame.
 * `bass` follows kick/low-end energy, `energy` the full spectrum — both 0..1.
 * Every scene reads them via usePulse() so graphics resonate with the beat.
 * Degrades to 0 when no music file exists (visuals fall back to static).
 */
export interface Pulse {
  bass: number;
  energy: number;
}

const PulseContext = createContext<Pulse>({bass: 0, energy: 0});

export const usePulse = (): Pulse => useContext(PulseContext);

/** Mount once at the top level of the Reel (absolute frame = music position). */
export const MusicPulseProvider: React.FC<{
  hasMusic: boolean;
  children: React.ReactNode;
}> = ({hasMusic, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Hooks must run unconditionally; useAudioData tolerates a missing file
  // only if we never ask for it, so point at a real file or a silent one.
  const audioData = useAudioData(hasMusic ? staticFile('music.mp3') : staticFile('voice.mp3'));

  let pulse: Pulse = {bass: 0, energy: 0};
  if (audioData && hasMusic) {
    // the mux loops the track under the voice, so loop the analysis too
    const musicFrames = Math.max(1, Math.floor(audioData.durationInSeconds * fps) - 1);
    const spectrum = visualizeAudio({
      audioData,
      frame: frame % musicFrames,
      fps,
      numberOfSamples: 32,
      smoothing: true,
    });
    const bassRaw = (spectrum[0] + spectrum[1] + spectrum[2] + spectrum[3]) / 4;
    const energyRaw = spectrum.reduce((a, b) => a + b, 0) / spectrum.length;
    pulse = {
      bass: Math.min(1, bassRaw * 2.4),
      energy: Math.min(1, energyRaw * 3.2),
    };
  }

  return <PulseContext.Provider value={pulse}>{children}</PulseContext.Provider>;
};
