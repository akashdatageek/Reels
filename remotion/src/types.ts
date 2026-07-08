export type SceneType =
  | 'HookCard'
  | 'ImageScene'
  | 'StatCallout'
  | 'SplitCompare'
  | 'OutroCard';

export interface Scene {
  type: SceneType;
  /** Seconds. Set by tts.py from real audio duration. */
  duration: number;
  /** Seconds into voice.mp3 where this scene's audio starts (set by tts.py). */
  audioStart?: number;
  text?: string;
  voiceSegment?: string;
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
