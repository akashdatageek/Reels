import {createContext, useContext} from 'react';

/**
 * Reel-wide vibe:
 *  - 'bold'  — loud acid-duotone Gen-Z look (news default)
 *  - 'moody' — cinematic restraint: serif type, dusk palette, soft motion,
 *              heavy grain, no sticker captions
 */
export type Vibe = 'bold' | 'moody';

export const VibeContext = createContext<Vibe>('bold');
export const useVibe = (): Vibe => useContext(VibeContext);
