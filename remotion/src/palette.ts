/**
 * Theme palettes, chosen per reel via `theme` in reel.json.
 *  - editorial-dark (DEFAULT for new reels): warm near-black canvas, off-white
 *    type, one warm accent — the "editorial card" document look.
 *  - light: editorial warm-white for data/research explainers.
 *  - dark: legacy navy look (kept for older reels).
 */
export interface Palette {
  kind: 'dark' | 'light' | 'editorial';
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
  kind: 'dark',
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
  kind: 'light',
  bg: '#f5f4f0', // warm paper, not pure white
  bgLight: '#ffffff',
  text: '#16171d',
  textDim: 'rgba(22,23,29,0.60)',
  panel: '#ffffff',
  panelBorder: 'rgba(0,0,0,0.10)',
  grainBlend: 'multiply',
  grainOpacity: 0.04,
};

export const EDITORIAL: Palette = {
  kind: 'editorial',
  bg: '#0d0b09', // warm near-black
  bgLight: '#181410',
  text: '#f2ede4', // warm off-white
  textDim: 'rgba(242,237,228,0.64)',
  panel: '#161210',
  panelBorder: 'rgba(242,237,228,0.10)',
  grainBlend: 'overlay',
  grainOpacity: 0.05,
};

export const getPalette = (theme?: string): Palette =>
  theme === 'light' ? LIGHT : theme === 'editorial-dark' ? EDITORIAL : DARK;
