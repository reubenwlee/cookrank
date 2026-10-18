// Helpers that combine the game rules with app state for the screens.

import { RECIPE_BY_ID, type Recipe } from '@/data/recipes';
import type { Photo, Post } from '@/data/seed';
import { familyCount, isRecipeOpen, tierFor, type Counts, type TierKey } from './rules';

/** The newest photo this user posted of the recipe (or of any variation, for a family). */
export function latestPhoto(posts: Post[], userId: string, ids: string[]): Photo | undefined {
  return posts.find((p) => p.userId === userId && ids.includes(p.recipeId))?.photo;
}

export function coverOf(r: Recipe): Photo | undefined {
  if (r.cover) return { kind: 'asset', key: r.cover };
  return undefined;
}

export type TileModel = { recipe: Recipe; count: number; tier: TierKey; state: 'cooked' | 'new' | 'locked'; photo?: Photo };

/** A base recipe on the Home grid: counts and tier from the whole family. */
export function familyTile(id: string, counts: Counts, posts: Post[], userId: string, familyIds: string[]): TileModel {
  const recipe = RECIPE_BY_ID[id];
  const count = familyCount(id, counts);
  const open = isRecipeOpen(id, counts);
  return {
    recipe, count, tier: tierFor(count).key,
    state: !open ? 'locked' : count > 0 ? 'cooked' : 'new',
    photo: latestPhoto(posts, userId, familyIds) ?? coverOf(recipe),
  };
}

export function countLine(count: number, tier: TierKey, nextRemaining?: number): string {
  if (count === 0) return 'Not cooked yet';
  if (tier === 'blank') return nextRemaining ? `${count} · ${nextRemaining} to bronze` : `${count} cooks`;
  return `${count} · ${tier[0].toUpperCase()}${tier.slice(1)}`;
}

export function timeAgo(iso: string, now = new Date()): string {
  const s = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  const d = Math.floor(s / 86400);
  return d < 7 ? `${d}d` : new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
