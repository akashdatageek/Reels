export type SceneType =
  | 'HookCard'
  | 'ImageScene'
  | 'StatCallout'
  | 'SplitCompare'
  | 'TerminalScene'
  | 'ChartScene'
  | 'FigureScene'
  | 'OutroCard';

/** A sticker/emoji that pops onto a scene for personality. */
export interface Sticker {
  /** emoji or a very short label ("!!", "⚡", "🤯") */
  text: string;
  /** normalized center position, 0..1 */
  x: number;
  y: number;
  /** fraction of the scene (0..1) when it pops in (default ~0.1) */
  at?: number;
  /** tilt in degrees */
  rotate?: number;
  /** font size in px (default 96) */
  size?: number;
}

/** News-style lower-third strip (e.g. a source credit). */
export interface LowerThird {
  title: string;
  subtitle?: string;
}

export interface FigureAnnotation {
  /** short callout line that fades in on a timeline to explain the figure */
  text: string;
  /** optional: highlight color word/marker */
  emphasis?: boolean;
}

/** A rectangle inside a figure image, normalized 0..1 (x,y = top-left). */
export interface FigureRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * One "camera move" on a FigureScene: at `at` (fraction 0..1 of the scene) the
 * view eases to `region` (zoom-in) and optionally draws a highlight + label on
 * it — so the reel zooms into the exact part of a chart as the voice hits it.
 * Omit `region` for a full-frame step (zoom back out).
 */
export interface FigureFocus {
  /** when this step becomes active, as a fraction 0..1 of the scene duration */
  at: number;
  /** region to zoom to; omit → full frame */
  region?: FigureRegion;
  /** mark drawn on the region while focused. box/circle/underline draw on;
   *  spotlight dims the rest; marker sweeps a highlighter; circleDraw is a
   *  hand-drawn scribble ring. */
  highlight?: 'box' | 'circle' | 'underline' | 'spotlight' | 'marker' | 'circleDraw';
  /** short label pinned to the region */
  label?: string;
}

export interface TerminalLine {
  /** command = typed with $ prompt · output = printed · comment = dim · success = accent bold */
  kind: 'command' | 'output' | 'comment' | 'success';
  text: string;
}

export interface ChartItem {
  label: string;
  value: number;
  /** e.g. "%", "x", "s" — appended to the counted-up value */
  suffix?: string;
  /** the bar rendered in the accent color (the story's subject) */
  highlight?: boolean;
}

export interface Scene {
  type: SceneType;
  /** Seconds. Set by tts.py from real audio duration. */
  duration: number;
  /** Seconds into voice.mp3 where this scene's audio starts (set by tts.py). */
  audioStart?: number;
  /** How this scene ENTERS at its cut (sync-safe — no timing overlap). Omit to
   *  auto-rotate per scene index so cuts never repeat. */
  transition?: 'punch' | 'slide' | 'pushUp' | 'whip' | 'wipe' | 'none';
  /** In HookCard, wrap words in *asterisks* to render them in the accent color. */
  text?: string;
  /** HookCard title animation. Omit to auto-rotate so text never animates the
   *  same way twice. rise = word-by-word lift · typewriter = typed · pop =
   *  bouncy scale-in · marker = highlighter swipe behind emphasized words. */
  textStyle?: 'rise' | 'typewriter' | 'pop' | 'marker';
  /** Motion background behind text/data scenes. aurora (default) · beams
   *  (drifting light streaks) · dots (denser field) · plain. */
  bgStyle?: 'aurora' | 'beams' | 'dots' | 'plain';
  /** Emoji/text stickers that pop onto this scene for personality. */
  stickers?: Sticker[];
  /** News-style lower-third strip on this scene (e.g. a source credit). */
  lowerThird?: LowerThird;
  voiceSegment?: string;
  /** Aesthetic background image behind text/data scenes (Hook/Stat/Split);
   *  rendered darkened with a scrim so type stays readable. */
  backdrop?: string;
  /** If set and no backdrop exists, generate_images.py creates one. */
  backdropPrompt?: string;
  /** TerminalScene: the lines to type/print (title bar text comes from `text`). */
  terminal?: TerminalLine[];
  /** ChartScene: bars, top-to-bottom (title from `text`, footnote from `label`). */
  chart?: ChartItem[];
  /** FigureScene: a real source image (chart/diagram/screenshot) to show. */
  figure?: string;
  /** FigureScene: source credit line under the figure. */
  figureCredit?: string;
  /** FigureScene: explanation callouts that fade in over the scene. */
  annotations?: FigureAnnotation[];
  /** FigureScene: timed zoom/highlight moves onto parts of the figure. */
  figureFocus?: FigureFocus[];
  /** Path relative to the story output folder (or assets/...). */
  image?: string;
  /** If set and no image exists, generate_images.py creates one. */
  imagePrompt?: string;
  /** EDIT MODE (b-roll ONLY, never evidence): a real fetched asset to edit.
   *  With editPrompt set, generate_images.py sends this image + the
   *  instruction to Nano Banana and writes images/edit_<hash>.png into
   *  `image`. The original file is never overwritten; preflight refuses any
   *  `figure` that enters the edit path. */
  baseImage?: string;
  /** The edit instruction (extend to 9:16, match grade, remove distractions —
   *  never add content that changes what the photo depicts). */
  editPrompt?: string;
  kenBurns?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right';
  /** StatCallout */
  stat?: string;
  label?: string;
  /** StatCallout viz: ring (default halo) · donut (arc fills to the fraction) ·
   *  bar (horizontal fill). donut/bar need stat to be a % or an a/b fraction. */
  statVariant?: 'ring' | 'donut' | 'bar';
  /** SplitCompare */
  leftTitle?: string;
  rightTitle?: string;
  leftImage?: string;
  rightImage?: string;
  leftText?: string;
  rightText?: string;
  /** OutroCard */
  handle?: string;
  /** OutroCard brand logo (path relative to the story public dir). */
  logo?: string;
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export interface CaptionGroup {
  start: number;
  end: number;
  scene: number;
  words: CaptionWord[];
}

export interface ReelSpec {
  title: string;
  voiceover?: string;
  music?: string;
  accentColor?: string;
  /** Second acid-palette color; gradients run accent -> secondary. */
  secondaryColor?: string;
  /** Extra style words for every image prompt (replaces the default vibe words). */
  imageStyle?: string;
  /** Brand logo (staged as logo.png by assemble.sh); shown on the OutroCard. */
  logo?: string;
  /** 'bold' (default, loud acid look) or 'moody' (cinematic restraint). */
  vibe?: 'bold' | 'moody';
  /** Optional TTS delivery direction override (read by tts.py). Falls back to a
   *  per-vibe preset: bold = brisk news energy, moody = slow and intimate. */
  voiceStyle?: string;
  /** 'dark' (default, atmospheric) or 'light' (editorial white — data/research). */
  theme?: 'dark' | 'light';
  handle?: string;
  scenes: Scene[];
  totalDuration?: number;
}

export interface ReelProps {
  reel: ReelSpec;
  captions: CaptionGroup[];
  /** Absolute or staticFile-resolvable base for scene image paths. */
  [key: string]: unknown;
}
