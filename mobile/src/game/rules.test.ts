/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_IDS_BY_RANK, RECIPES, RECIPE_BY_ID } from '../data/recipes.ts';
import {
  cookOutcome, currentRank, familyCount, isRankOpen, isRecipeOpen, masteryPoints, nextTier, rankProgress, tierFor,
} from './rules.ts';

test('tiers follow the thresholds', () => {
  assert.equal(tierFor(0).key, 'blank');
  assert.equal(tierFor(4).key, 'blank');
  assert.equal(tierFor(5).key, 'bronze');
  assert.equal(tierFor(14).key, 'silver');
  assert.equal(tierFor(20).key, 'platinum');
  assert.equal(tierFor(99).key, 'master');
  assert.equal(tierFor(100).key, 'grandmaster');
  assert.deepEqual(nextTier(12), { tier: tierFor(15), remaining: 3 });
  assert.equal(nextTier(100), null);
});

test('catalogue: 10 ranks of 6, variations inherit their root rank', () => {
  assert.equal(BASE_IDS_BY_RANK.length, 10);
  for (const ids of BASE_IDS_BY_RANK) assert.equal(ids.length, 6);
  assert.equal(new Set(RECIPES.map((r) => r.id)).size, RECIPES.length);
  assert.equal(RECIPE_BY_ID['tonkotsu-style-ramen'].rank, 0);
  assert.equal(RECIPE_BY_ID['kimchi-fried-rice'].rank, 1);
  for (const r of RECIPES) if (r.parentId) assert.ok(RECIPE_BY_ID[r.parentId], r.id);
});

test('bronze on 3 of 6 opens rank 2; 2 is not enough', () => {
  const c = { 'eggs-toast': 5, 'grilled-cheese': 5 };
  assert.equal(isRankOpen(1, c), false);
  assert.equal(currentRank(c), 0);
  const c2 = { ...c, quesadilla: 5 };
  assert.equal(rankProgress(0, c2), 3);
  assert.equal(isRankOpen(1, c2), true);
  assert.equal(currentRank(c2), 1);
});

test('variation cooks count toward the family total for rank progress', () => {
  const c = { 'eggs-toast': 5, 'grilled-cheese': 5, 'instant-ramen': 5, 'budae-ramen': 2 };
  assert.equal(familyCount('instant-ramen', c), 7);
  assert.equal(rankProgress(0, { 'eggs-toast': 5, 'grilled-cheese': 5, 'instant-ramen': 3, 'ramen-egg-drop': 2 }), 3);
});

test('ranks 5-7 need silver, Expert gold, Master x50', () => {
  const progressTo = (rank: number, n: number) =>
    Object.fromEntries(BASE_IDS_BY_RANK.slice(0, rank).flatMap((ids) => ids.slice(0, 3).map((id) => [id, n])));
  // Bronze is enough through Hobbyist (rank index 3) -> Date night open.
  assert.equal(currentRank(progressTo(4, 5)), 4);
  // Date night recipes at bronze do not open Junior chef.
  assert.equal(isRankOpen(5, { ...progressTo(4, 5), 'pan-seared-salmon': 5, 'steak-pan-sauce': 5, 'mushroom-risotto': 5 }), false);
  assert.equal(isRankOpen(5, { ...progressTo(4, 5), 'pan-seared-salmon': 10, 'steak-pan-sauce': 10, 'mushroom-risotto': 10 }), true);
  // Everything at x50 still stops at Master chef (Master chef recipes need x50 to open Grandmaster).
  assert.equal(currentRank(progressTo(9, 50)), 9);
  assert.equal(currentRank(progressTo(8, 15)), 8);
  assert.equal(currentRank(progressTo(8, 14)), 7);
});

test('variations open at the rank tier on the parent own count', () => {
  assert.equal(isRecipeOpen('budae-ramen', { 'instant-ramen': 4 }), false);
  assert.equal(isRecipeOpen('budae-ramen', { 'instant-ramen': 5 }), true);
  assert.equal(isRecipeOpen('brisket-ramen', { 'instant-ramen': 5, 'budae-ramen': 4 }), false);
  assert.equal(isRecipeOpen('brisket-ramen', { 'instant-ramen': 5, 'budae-ramen': 5 }), true);
  // A rank-2 recipe stays shut while its rank is locked.
  assert.equal(isRecipeOpen('egg-fried-rice', {}), false);
});

test('mastery points = difficulty x cooks', () => {
  assert.equal(masteryPoints({ 'eggs-toast': 10, 'egg-fried-rice': 3, 'brisket-ramen': 2 }), 10 + 6 + 6);
});

test('a ramen grandmaster outranks a silver-everywhere junior chef, as in the brief', () => {
  const ramen = Object.fromEntries(
    ['instant-ramen', 'ramen-egg-drop', 'budae-ramen', 'cheese-ramen', 'spicy-miso-ramen', 'brisket-ramen', 'kimchi-butter-ramen', 'tonkotsu-style-ramen'].map((id) => [id, 100]),
  );
  const junior = Object.fromEntries(BASE_IDS_BY_RANK.slice(0, 6).flat().map((id) => [id, 10]));
  assert.equal(currentRank(ramen), 0);
  assert.ok(currentRank(junior) >= 5);
  assert.ok(masteryPoints(ramen) > masteryPoints(junior));
});

test('cookOutcome reports tier-ups, rank-ups and new variations', () => {
  const o = cookOutcome('quesadilla', { 'eggs-toast': 5, 'grilled-cheese': 5, quesadilla: 4 });
  assert.equal(o.tierUp?.key, 'bronze');
  assert.equal(o.rankUp, 1);
  assert.deepEqual(o.openedVariations.map((r) => r.id), ['chicken-quesadilla']);
  assert.equal(cookOutcome('quesadilla', { quesadilla: 6 }).tierUp, null);
});
