/**
 * Fonts: Archivo Black / Inter / JetBrains Mono are installed as SYSTEM fonts
 * by scripts/install_fonts.sh (browser-side font loading is unreliable in
 * headless renders). Run it once after `npm install`.
 *
 * Design rules baked in:
 *  - IG safe zones: UI covers ~top 250px and ~bottom 320px of 1080x1920
 *  - max 2 fonts (display + body; mono only inside TerminalScene), one accent
 */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const SAFE_TOP = 250;
export const SAFE_BOTTOM = 320;

export const BG = '#0a0c1c';
export const BG_LIGHT = '#181c34';
export const TEXT = '#f5f7ff';
export const TEXT_DIM = 'rgba(245,247,255,0.72)';
export const DEFAULT_ACCENT = '#00E5FF';

export const FONT_DISPLAY = '"Archivo Black", "Arial Black", Impact, sans-serif';
export const FONT_BODY = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", "Courier New", monospace';
