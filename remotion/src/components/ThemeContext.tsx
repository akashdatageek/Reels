import {createContext, useContext} from 'react';
import {DARK, Palette} from '../palette';

/** Reel-wide palette (light/dark), provided at the Reel root. */
export const ThemeContext = createContext<Palette>(DARK);
export const usePalette = (): Palette => useContext(ThemeContext);
