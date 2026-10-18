// Demo world for the prototype: other cooks, their posts, comments and a DM
// thread. Replaced by Firebase later; kept pure so it can be checked in Node.

import { BASE_IDS_BY_RANK, RECIPE_BY_ID, type PhotoKey } from './recipes.ts';
import { RANK_UNLOCK_MIN, type Counts } from '../game/rules.ts';

export type Photo = { kind: 'asset'; key: PhotoKey } | { kind: 'uri'; uri: string };

export type User = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  city: string;
  country: string;
  avatar?: Photo;
  counts: Counts;
  followers: number;
};

export type Post = {
  id: string;
  userId: string;
  recipeId: string;
  cookNumber: number;
  photo: Photo;
  description: string;
  createdAt: string;
  likes: number;
};

export type Comment = { id: string; postId: string; userId: string; text: string; createdAt: string };
export type Message = { from: 'me' | 'them'; text: string; at: string };
export type Thread = { id: string; userId: string; messages: Message[] };

export const CITIES: { city: string; country: string }[] = [
  { city: 'Columbus', country: 'United States' },
  { city: 'New York', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'Chicago', country: 'United States' },
  { city: 'Austin', country: 'United States' },
  { city: 'Seattle', country: 'United States' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Manchester', country: 'United Kingdom' },
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Paris', country: 'France' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Manila', country: 'Philippines' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Mumbai', country: 'India' },
];

const asset = (key: PhotoKey): Photo => ({ kind: 'asset', key });

/** Counts that open every rank below `rank`: the unlock tier on the first 3 base recipes of each. */
function opened(rank: number): Counts {
  const c: Counts = {};
  for (let r = 0; r < rank; r++) for (const id of BASE_IDS_BY_RANK[r].slice(0, 3)) c[id] = RANK_UNLOCK_MIN[r];
  return c;
}

const plus = (base: Counts, extra: Counts): Counts => {
  const c = { ...base };
  for (const [k, v] of Object.entries(extra)) c[k] = Math.max(c[k] ?? 0, v);
  return c;
};

type U = [id: string, name: string, city: string, bio: string, avatar: PhotoKey, followers: number, counts: Counts];

const U_SPECS: U[] = [
  ['jun.kitchen', 'Jun Park', 'Columbus', 'Korean home cooking, mostly for my roommates.', 'bibimbap', 4120,
    plus(opened(5), { bibimbap: 164, 'egg-fried-rice': 120, 'kimchi-fried-rice': 96, 'eggs-toast': 140, 'pad-thai': 61, 'chicken-katsu': 58, 'smash-burgers': 41, 'pan-seared-salmon': 33 })],
  ['dani_bakes', 'Dani Alvarez', 'Columbus', 'Date night is every night if you cook it.', 'salmon', 2880,
    plus(opened(4), { 'pan-seared-salmon': 120, 'mushroom-risotto': 74, pancakes: 150, 'blueberry-pancakes': 104, 'lava-cake': 60, 'chicken-piccata': 40 })],
  ['ramen.ryo', 'Ryo Tanaka', 'Columbus', 'Only ramen. Every ramen.', 'ramen-tonkotsu', 3104,
    { 'instant-ramen': 120, 'ramen-egg-drop': 101, 'budae-ramen': 140, 'cheese-ramen': 100, 'spicy-miso-ramen': 66, 'brisket-ramen': 104, 'kimchi-butter-ramen': 100, 'tonkotsu-style-ramen': 97 }],
  ['coop.cooks', 'Cooper Hale', 'Columbus', 'Smash burgers and nothing to prove.', 'burger', 980,
    plus(opened(3), { 'smash-burgers': 160, 'patty-melt': 80, 'grilled-cheese': 90, 'chicken-katsu': 22 })],
  ['lena.preps', 'Lena Fischer', 'Columbus', 'Sunday is prep day. Five lunches, one hour.', 'grainbowl', 1450,
    plus(opened(2), { 'chicken-rice-bowls': 130, 'turkey-chili': 88, 'overnight-oats': 160, 'sheet-pan-chicken': 70, 'lentil-soup': 51 })],
  ['marcus.m', 'Marcus Moore', 'Columbus', 'Fried things, mostly.', 'katsu', 610,
    plus(opened(3), { 'chicken-katsu': 120, 'egg-fried-rice': 70, quesadilla: 60 })],
  ['sofia.r', 'Sofia Rossi', 'Columbus', 'Nonna would have opinions.', 'porkchop', 455,
    plus(opened(2), { 'tomato-penne': 120, 'penne-arrabbiata': 66, 'vodka-penne': 62, 'baked-meatballs': 50 })],
  ['big.nate', 'Nate Brooks', 'Columbus', 'Rice cooker evangelist.', 'friedrice', 233,
    plus(opened(1), { 'egg-fried-rice': 112, 'kimchi-fried-rice': 41, 'pineapple-fried-rice': 30 })],
  ['priya.cooks', 'Priya Nair', 'Columbus', 'Learning one dish at a time.', 'shrimp', 380,
    plus(opened(2), { 'garlic-shrimp-pasta': 75, 'shrimp-scampi': 38, 'lentil-soup': 60 })],
  ['ava.eats', 'Ava Chen', 'Columbus', 'First apartment, first knife.', 'pancakes', 41,
    { pancakes: 14, 'eggs-toast': 9, 'grilled-cheese': 6 }],
  ['mateo.ny', 'Mateo Cruz', 'New York', 'Tiny kitchen, big pot.', 'tacos', 5210,
    plus(opened(6), { 'sheet-pan-tacos': 200, 'fish-tacos': 140, 'birria-tacos': 88, 'burrito-bowl': 150, 'beef-broccoli': 90, 'green-curry': 70 })],
  ['hannah.la', 'Hannah Kim', 'Los Angeles', 'Plants, mostly. Sometimes brisket.', 'grainbowl', 2240,
    plus(opened(5), { 'chicken-rice-bowls': 180, 'overnight-oats': 200, shakshuka: 80, bibimbap: 77, 'roast-chicken': 40 })],
  ['tomas.chi', 'Tomas Novak', 'Chicago', 'Deep dish is a casserole.', 'meatballs', 1870,
    plus(opened(4), { 'homemade-pizza': 140, 'baked-meatballs': 150, 'swedish-meatballs': 70, 'smash-burgers': 60 })],
  ['bea.atx', 'Beatriz Lima', 'Austin', 'Brisket on weekends.', 'tacos', 1330,
    plus(opened(4), { 'sheet-pan-tacos': 150, 'chicken-wraps': 120, 'buffalo-wraps': 80, 'steak-pan-sauce': 30 })],
  ['eli.sea', 'Eli Warren', 'Seattle', 'Salmon season lasts all year here.', 'salmon', 1010,
    plus(opened(4), { 'pan-seared-salmon': 140, 'mushroom-risotto': 30, 'eggs-toast': 120 })],
  ['noah.nyc', 'Noah Levi', 'New York', 'Bagels and everything after.', 'eggs', 760,
    plus(opened(3), { 'eggs-toast': 150, 'avocado-egg-toast': 90, 'eggs-benedict': 44 })],
  ['zoe.chi', 'Zoe Martin', 'Chicago', 'Mostly pasta.', 'penne', 540,
    plus(opened(2), { 'tomato-penne': 140, 'vodka-penne': 80, 'garlic-shrimp-pasta': 40 })],
  ['min.seoul', 'Minji Seo', 'Seoul', 'Budae jjigae for the whole floor.', 'ramen-budae', 8800,
    plus(opened(7), { 'budae-ramen': 300, bibimbap: 260, 'kimchi-fried-rice': 240, gyoza: 120, 'mapo-tofu': 90 })],
  ['kenji.tokyo', 'Kenji Mori', 'Tokyo', 'Tonkotsu, slowly.', 'ramen-tonkotsu', 7400,
    plus(opened(7), { 'tonkotsu-scratch': 160, 'chicken-katsu': 220, gyoza: 140, 'instant-ramen': 200 })],
  ['olivia.ldn', 'Olivia Hart', 'London', 'Sunday roast, every Sunday.', 'porkchop', 3900,
    plus(opened(6), { 'roast-chicken': 160, 'beef-bourguignon': 60, 'pork-chops-apples': 110, 'steak-pan-sauce': 90 })],
  ['liam.tor', 'Liam Roy', 'Toronto', 'Poutine is a food group.', 'burger', 1600,
    plus(opened(4), { 'smash-burgers': 170, 'patty-melt': 90, 'chicken-katsu': 40 })],
];

export const SEED_USERS: User[] = U_SPECS.map(([id, name, city, bio, avatar, followers, counts]) => ({
  id, handle: id, name, bio, city, country: CITIES.find((c) => c.city === city)!.country, avatar: asset(avatar), counts, followers,
}));

const daysAgo = (now: Date, d: number, h = 19, m = 0) => {
  const t = new Date(now);
  t.setDate(t.getDate() - d);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
};

/** Posts from other cooks, newest first. */
export function seedPosts(now: Date): Post[] {
  const P = (id: string, userId: string, recipeId: string, cookNumber: number, photo: PhotoKey, description: string, d: number, h: number, likes: number): Post =>
    ({ id, userId, recipeId, cookNumber, photo: asset(photo), description, createdAt: daysAgo(now, d, h), likes });
  return [
    P('p-jun-1', 'jun.kitchen', 'bibimbap', 164, 'bibimbap', 'Gochujang from the Korean market on 5th. The crispy rice at the bottom is the whole point.', 0, 17, 128),
    P('p-dani-1', 'dani_bakes', 'pan-seared-salmon', 120, 'salmon', 'Skin finally crisp all the way across. Butter, thyme, one lemon.', 0, 13, 87),
    P('p-ryo-1', 'ramen.ryo', 'brisket-ramen', 104, 'ramen-brisket', 'Brisket braised overnight. Bean sprouts went in raw this time.', 1, 21, 342),
    P('p-lena-1', 'lena.preps', 'chicken-rice-bowls', 130, 'grainbowl', 'Five lunches done before noon.', 1, 11, 64),
    P('p-coop-1', 'coop.cooks', 'smash-burgers', 160, 'burger', 'Two patties, one slice. Do not touch them for two minutes.', 2, 20, 151),
    P('p-nate-1', 'big.nate', 'egg-fried-rice', 112, 'friedrice', 'Yesterday\'s rice is the only rice.', 2, 22, 23),
    P('p-ryo-2', 'ramen.ryo', 'budae-ramen', 140, 'ramen-budae', 'Spam, two kinds of sausage, kimchi, one slice of cheese on top.', 3, 19, 289),
    P('p-marcus-1', 'marcus.m', 'chicken-katsu', 120, 'katsu', 'Panko from the Japanese grocery is worth the trip.', 4, 18, 45),
    P('p-priya-1', 'priya.cooks', 'garlic-shrimp-pasta', 75, 'shrimp', 'Shrimp out after a minute a side. Lesson learned.', 5, 20, 31),
    P('p-sofia-1', 'sofia.r', 'pork-chops-apples', 1, 'porkchop', 'Not on my rank yet, cooked it anyway for my dad\'s birthday.', 6, 19, 58),
  ];
}

export function seedComments(now: Date): Comment[] {
  const C = (id: string, postId: string, userId: string, text: string, d: number, h: number): Comment =>
    ({ id, postId, userId, text, createdAt: daysAgo(now, d, h) });
  return [
    C('c1', 'p-jun-1', 'big.nate', 'Is that the red tub gochujang? Mine always ends up too sweet.', 0, 18),
    C('c2', 'p-jun-1', 'jun.kitchen', 'Same one. Cut it with a splash of rice vinegar.', 0, 18),
    C('c3', 'p-jun-1', 'lena.preps', 'Sixty-four cooks of one dish. Respect.', 0, 19),
    C('c4', 'p-ryo-1', 'coop.cooks', 'How long on the brisket?', 1, 22),
    C('c5', 'p-ryo-1', 'ramen.ryo', 'Two and a half hours, then overnight in the liquid.', 1, 22),
    C('c6', 'p-coop-1', 'marcus.m', 'Cast iron or griddle?', 2, 21),
    C('c7', 'p-dani-1', 'priya.cooks', 'That skin. Teach me.', 0, 14),
  ];
}

/** The demo account's counts, matching the design mockups. */
export const DEMO_COUNTS: Counts = {
  'eggs-toast': 23, 'instant-ramen': 12, 'ramen-egg-drop': 4, 'budae-ramen': 2, 'grilled-cheese': 11, quesadilla: 10,
  'tomato-penne': 4, pancakes: 2, 'egg-fried-rice': 17, 'chicken-wraps': 3, 'sheet-pan-tacos': 1,
};

const DEMO_NOTES: Record<string, string[]> = {
  'instant-ramen': ['Last egg in the fridge and a spoon of chili crisp. Hall B smells like garlic now.', 'Too much water again. Still ate all of it.', 'Tried it dry like the packet says not to.'],
  'egg-fried-rice': ['Day-old rice from the dining hall. It works.', 'Finally got the rice to crisp.'],
  'eggs-toast': ['Runny yolk, no broken edges.', '', 'Chili flakes from the pizza place.'],
};

/** Every cook of the demo account as a post, recipes interleaved, 3 a day going back in time. */
export function demoPosts(now: Date, userId: string): Post[] {
  const posts: Post[] = [];
  const left: Record<string, number> = { ...DEMO_COUNTS };
  let slot = 0;
  while (Object.values(left).some((n) => n > 0)) {
    for (const recipeId of Object.keys(left)) {
      const i = left[recipeId];
      if (i <= 0) continue;
      const r = RECIPE_BY_ID[recipeId];
      const photo = r.cover ?? (r.parentId ? RECIPE_BY_ID[r.parentId].cover : undefined) ?? 'eggs';
      const notes = DEMO_NOTES[recipeId] ?? [];
      posts.push({
        id: `p-me-${recipeId}-${i}`, userId, recipeId, cookNumber: i, photo: asset(photo),
        description: notes[DEMO_COUNTS[recipeId] - i] ?? '',
        createdAt: daysAgo(now, Math.floor(slot / 3) + 1, 21 - (slot % 3) * 3, (slot * 7) % 60), likes: (slot * 5) % 17,
      });
      left[recipeId] = i - 1;
      slot++;
    }
  }
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function seedThreads(now: Date): Thread[] {
  return [
    {
      id: 't-jun', userId: 'jun.kitchen', messages: [
        { from: 'them', text: 'Saw your fried rice. Try a splash of fish sauce at the end.', at: daysAgo(now, 1, 20) },
        { from: 'me', text: 'Doing that tonight. How much?', at: daysAgo(now, 1, 20, 12) },
        { from: 'them', text: 'Half a teaspoon. Less than you think.', at: daysAgo(now, 1, 20, 15) },
      ],
    },
  ];
}
