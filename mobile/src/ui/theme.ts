import { useColorScheme } from 'react-native';
import type { TierKey } from '@/game/rules';

// Tokens from design/mockup.html. Light like Instagram; the food photos and
// the tier frames carry the colour, and the accent only marks the cook action.
const light = {
  ground: '#FFFFFF',
  raised: '#F3F3F2',
  ink: '#111112',
  ink2: '#5E5E63',
  ink3: '#8A8A8F',
  rule: '#E6E6E8',
  accent: '#C8410E',
  onAccent: '#FFFFFF',
  scrim: 'rgba(0,0,0,0.32)',
};

const dark: typeof light = {
  ground: '#000000',
  raised: '#1C1C1E',
  ink: '#F4F4F5',
  ink2: '#A3A3A8',
  ink3: '#7C7C82',
  rule: '#2C2C2E',
  accent: '#FF7A3D',
  onAccent: '#1A0800',
  scrim: 'rgba(0,0,0,0.55)',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

/** Foil gradients for each tier frame, light to dark with a highlight band. */
export const FOIL: Record<Exclude<TierKey, 'blank'>, readonly [string, string, string, string]> = {
  bronze: ['#E7AE84', '#A9663B', '#E2A57A', '#6E3D1E'],
  silver: ['#F1F2F3', '#B5BABF', '#F4F5F6', '#80878E'],
  gold: ['#FBE39A', '#D5A53E', '#FCE7A6', '#9C6E1C'],
  platinum: ['#F2F7F8', '#C3D3DA', '#F6FBFC', '#9FB4BE'],
  master: ['#D9675A', '#8E2219', '#E07A6C', '#5A0F0A'],
  grandmaster: ['#2A241A', '#7A6334', '#F3D47E', '#2A241A'],
};
export const FOIL_STOPS = [0, 0.38, 0.54, 1] as const;

/** A flat representative colour per tier, for small marks like progress segments. */
export const TIER_SOLID: Record<TierKey, string> = {
  blank: '#C9C9CC', bronze: '#A9663B', silver: '#9DA3A9', gold: '#D5A53E', platinum: '#9FB4BE', master: '#8E2219', grandmaster: '#7A6334',
};

export const DISPLAY_FONT = 'ArchivoCondensed';

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24, gap: 32, rest: 48 };
export const MARGIN = 20;
