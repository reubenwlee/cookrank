// CookRank's game rules, as agreed in design/FLOW.md. Pure functions over a
// map of recipe id -> cook count, so they run the same on device and in tests.

import { BASE_IDS_BY_RANK, RANKS, RECIPES, RECIPE_BY_ID, type Recipe } from '../data/recipes.ts';

export type Counts = Record<string, number>;

export const TIERS = [
  { key: 'blank', name: 'Blank', min: 0 },
  { key: 'bronze', name: 'Bronze', min: 5 },
  { key: 'silver', name: 'Silver', min: 10 },
  { key: 'gold', name: 'Gold', min: 15 },
  { key: 'platinum', name: 'Platinum', min: 20 },
  { key: 'master', name: 'Master', min: 50 },
  { key: 'grandmaster', name: 'Grandmaster', min: 100 },
] as const;

export type Tier = (typeof TIERS)[number];
export type TierKey = Tier['key'];

/** The tier a rank's recipes must reach to open the next rank and their own variations. */
export const RANK_UNLOCK_MIN = [5, 5, 5, 5, 10, 10, 10, 15, 50, 100];
/** How many of a rank's 6 base recipes must reach its unlock tier to open the next rank. */
export const RECIPES_TO_UNLOCK = 3;
export const DAILY_COOK_LIMIT = 10;

export function tierFor(count: number): Tier {
  let t: Tier = TIERS[0];
  for (const tier of TIERS) if (count >= tier.min) t = tier;
  return t;
}

/** The next tier and how many cooks it needs, or null at grandmaster. */
export function nextTier(count: number): { tier: Tier; remaining: number } | null {
  const tier = TIERS.find((t) => t.min > count);
  return tier ? { tier, remaining: tier.min - count } : null;
}

export function unlockTierFor(rank: number): Tier {
  return tierFor(RANK_UNLOCK_MIN[rank]);
}

export const childrenOf = (id: string): Recipe[] => RECIPES.filter((r) => r.parentId === id);

/** Every variation under a base recipe, at any depth. */
export function descendantsOf(id: string): Recipe[] {
  const out: Recipe[] = [];
  const walk = (pid: string) => {
    for (const c of childrenOf(pid)) {
      out.push(c);
      walk(c.id);
    }
  };
  walk(id);
  return out;
}

export function rootOf(id: string): Recipe {
  let r = RECIPE_BY_ID[id];
  while (r.parentId) r = RECIPE_BY_ID[r.parentId];
  return r;
}

/** A base recipe's own cooks plus every cook of its variations. */
export function familyCount(baseId: string, counts: Counts): number {
  return (counts[baseId] ?? 0) + descendantsOf(baseId).reduce((n, v) => n + (counts[v.id] ?? 0), 0);
}

/** How many of a rank's base recipes have reached its unlock tier (by family total). */
export function rankProgress(rank: number, counts: Counts): number {
  return BASE_IDS_BY_RANK[rank].filter((id) => familyCount(id, counts) >= RANK_UNLOCK_MIN[rank]).length;
}

export function isRankOpen(rank: number, counts: Counts): boolean {
  if (rank <= 0) return true;
  if (rank >= RANKS.length) return false;
  return isRankOpen(rank - 1, counts) && rankProgress(rank - 1, counts) >= RECIPES_TO_UNLOCK;
}

/** The highest open rank: the user's chef rank. */
export function currentRank(counts: Counts): number {
  let r = 0;
  while (r + 1 < RANKS.length && isRankOpen(r + 1, counts)) r++;
  return r;
}

/**
 * A base recipe is open when its rank is. A variation is open when its parent
 * has its own (not family) count at the rank's unlock tier.
 */
export function isRecipeOpen(id: string, counts: Counts): boolean {
  const r = RECIPE_BY_ID[id];
  if (!r || !isRankOpen(r.rank, counts)) return false;
  if (!r.parentId) return true;
  return isRecipeOpen(r.parentId, counts) && (counts[r.parentId] ?? 0) >= RANK_UNLOCK_MIN[r.rank];
}

/** Σ difficulty × cooks over every recipe and variation. */
export function masteryPoints(counts: Counts): number {
  let p = 0;
  for (const [id, n] of Object.entries(counts)) p += (RECIPE_BY_ID[id]?.difficulty ?? 0) * n;
  return p;
}

export const totalCooks = (counts: Counts): number => Object.values(counts).reduce((a, b) => a + b, 0);

/** The base recipe family with the most cooks. */
export function topDish(counts: Counts): Recipe | null {
  let best: Recipe | null = null;
  let bestN = 0;
  for (const ids of BASE_IDS_BY_RANK)
    for (const id of ids) {
      const n = familyCount(id, counts);
      if (n > bestN) [best, bestN] = [RECIPE_BY_ID[id], n];
    }
  return best;
}

/** What a new cook of `id` changes, for the tier-up and rank-up moments. */
export function cookOutcome(id: string, before: Counts) {
  const after = { ...before, [id]: (before[id] ?? 0) + 1 };
  const fromTier = tierFor(before[id] ?? 0);
  const toTier = tierFor(after[id]);
  const rankBefore = currentRank(before);
  const rankAfter = currentRank(after);
  const opened = RECIPES.filter((r) => r.parentId && !isRecipeOpen(r.id, before) && isRecipeOpen(r.id, after));
  return {
    after,
    tierUp: toTier.min > fromTier.min ? toTier : null,
    rankUp: rankAfter > rankBefore ? rankAfter : null,
    openedVariations: opened,
  };
}
