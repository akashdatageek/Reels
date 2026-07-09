/**
 * Light / dark palette. Chosen per reel via `theme` in reel.json.
 * Editorial white for data/research/explainer content; dark for
 * launches/drama/atmosphere.
 */
export interface Palette {
  bg: string;
  bgLight: string;
  text: string;
  textDim: string;
  panel: string;
  panelBorder: string;
  /** grain blend mode + opacity tuned per background */
  grainBlend: 'overlay' | 'multiply';
  grainOpacity: number;
}

export const DARK: Palette = {
  bg: '#0a0c1c',
  bgLight: '#181c34',
  text: '#f5f7ff',
  textDim: 'rgba(245,247,255,0.72)',
  panel: '#181c34',
  panelBorder: 'rgba(255,255,255,0.10)',
  grainBlend: 'overlay',
  grainOpacity: 0.055,
};

export const LIGHT: Palette = {
  bg: '#f5f4f0', // warm paper, not pure white
  bgLight: '#ffffff',
  text: '#16171d',
  textDim: 'rgba(22,23,29,0.60)',
  panel: '#ffffff',
  panelBorder: 'rgba(0,0,0,0.10)',
  grainBlend: 'multiply',
  grainOpacity: 0.04,
};

export const getPalette = (theme?: string): Palette =>
  theme === 'light' ? LIGHT : DARK;
