import type { ImageSource } from 'expo-image';
import type { PhotoKey } from '@/data/recipes';
import type { Photo } from '@/data/seed';

// Stand-in food photography (Unsplash) bundled with the prototype. In the
// product these are the users' own dish photos.
const ASSETS: Record<PhotoKey, number> = {
  eggs: require('../../assets/food/eggs.jpg'),
  grilledcheese: require('../../assets/food/grilledcheese.jpg'),
  quesadilla: require('../../assets/food/quesadilla.jpg'),
  ramen: require('../../assets/food/ramen.jpg'),
  penne: require('../../assets/food/penne.jpg'),
  pancakes: require('../../assets/food/pancakes.jpg'),
  friedrice: require('../../assets/food/friedrice.jpg'),
  wrap: require('../../assets/food/wrap.jpg'),
  tacos: require('../../assets/food/tacos.jpg'),
  bowl: require('../../assets/food/bowl.jpg'),
  meatballs: require('../../assets/food/meatballs.jpg'),
  shrimp: require('../../assets/food/shrimp.jpg'),
  'ramen-egg': require('../../assets/food/ramen-egg.jpg'),
  'ramen-budae': require('../../assets/food/ramen-budae.jpg'),
  'ramen-cheese': require('../../assets/food/ramen-cheese.jpg'),
  'ramen-brisket': require('../../assets/food/ramen-brisket.jpg'),
  'ramen-tonkotsu': require('../../assets/food/ramen-tonkotsu.jpg'),
  'noodles-fried': require('../../assets/food/noodles-fried.jpg'),
  bibimbap: require('../../assets/food/bibimbap.jpg'),
  burger: require('../../assets/food/burger.jpg'),
  katsu: require('../../assets/food/katsu.jpg'),
  porkchop: require('../../assets/food/porkchop.jpg'),
  salmon: require('../../assets/food/salmon.jpg'),
  grainbowl: require('../../assets/food/grainbowl.jpg'),
};

export const SAMPLE_KEYS = Object.keys(ASSETS) as PhotoKey[];

export function photoSource(p: Photo | undefined): ImageSource | number | undefined {
  if (!p) return undefined;
  return p.kind === 'asset' ? ASSETS[p.key] : { uri: p.uri };
}
