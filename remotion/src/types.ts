export type SceneType =
  | 'HookCard'
  | 'ImageScene'
  | 'StatCallout'
  | 'SplitCompare'
  | 'TerminalScene'
  | 'ChartScene'
  | 'FigureScene'
  | 'OutroCard';

export interface FigureAnnotation {
  /** short callout line that fades in on a timeline to explain the figure */
  text: string;
  /** optional: highlight color word/marker */
  emphasis?: boolean;
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
  /** In HookCard, wrap words in *asterisks* to render them in the accent color. */
  text?: string;
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
  /** Path relative to the story output folder (or assets/...). */
  image?: string;
  /** If set and no image exists, generate_images.py creates one. */
  imagePrompt?: string;
  kenBurns?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right';
  /** StatCallout */
  stat?: string;
  label?: string;
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
