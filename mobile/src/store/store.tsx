// App state for the prototype: one reducer, persisted to the phone with
// AsyncStorage. Every action here maps to a Firestore write in the real app.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import {
  CITIES, DEMO_COUNTS, SEED_USERS, demoPosts, seedComments, seedPosts, seedThreads,
  type Comment, type Photo, type Post, type Thread, type User,
} from '@/data/seed';
import { RANKS, RECIPE_BY_ID } from '@/data/recipes';
import { DAILY_COOK_LIMIT, cookOutcome, currentRank, masteryPoints, tierFor, type Counts, type TierKey } from '@/game/rules';

export const ME = 'me';
const KEY = 'cookrank/state/v1';

export type Submission = { id: string; name: string; parentId?: string; rank: number; difficulty: number; ingredients: string; steps: string; photo?: Photo; createdAt: string; status: 'In review' };

export type State = {
  ready: boolean;
  onboarded: boolean;
  users: Record<string, User>;
  posts: Post[];
  comments: Comment[];
  liked: string[];
  following: string[];
  starred: string[];
  pinned: string[];
  threads: Thread[];
  submissions: Submission[];
  settings: { previewCreate: boolean; ignoreDailyLimit: boolean };
  /** A tier-up or unlock waiting to be shown on the recipe page. */
  celebration: { recipeId: string; from: TierKey; extra: string[] } | null;
};

const empty: State = {
  ready: false, onboarded: false, users: {}, posts: [], comments: [], liked: [], following: [], starred: [], pinned: [],
  threads: [], submissions: [], settings: { previewCreate: false, ignoreDailyLimit: false }, celebration: null,
};

type Profile = { name: string; handle: string; city: string; bio?: string };

type Action =
  | { type: 'hydrate'; state: State | null }
  | { type: 'start'; profile: Profile; demo: boolean }
  | { type: 'cook'; recipeId: string; photo: Photo; description: string }
  | { type: 'celebrated' }
  | { type: 'like'; postId: string }
  | { type: 'comment'; postId: string; text: string }
  | { type: 'follow'; userId: string }
  | { type: 'star'; recipeId: string }
  | { type: 'pins'; recipeIds: string[] }
  | { type: 'profile'; patch: Partial<Pick<User, 'name' | 'handle' | 'bio' | 'city' | 'avatar'>> }
  | { type: 'message'; userId: string; text: string }
  | { type: 'submit'; submission: Omit<Submission, 'id' | 'createdAt' | 'status'> }
  | { type: 'setting'; key: keyof State['settings']; value: boolean }
  | { type: 'reset' };

const uid = () => Math.random().toString(36).slice(2, 10);
const cityCountry = (city: string) => CITIES.find((c) => c.city === city)?.country ?? '';

function start(profile: Profile, demo: boolean): State {
  const now = new Date();
  const me: User = {
    id: ME, handle: profile.handle, name: profile.name, bio: profile.bio ?? '', city: profile.city, country: cityCountry(profile.city),
    counts: demo ? { ...DEMO_COUNTS } : {}, followers: demo ? 214 : 0,
    avatar: demo ? { kind: 'asset', key: 'eggs' } : undefined,
  };
  const users: Record<string, User> = { [ME]: me };
  for (const u of SEED_USERS) users[u.id] = u;
  return {
    ...empty,
    ready: true,
    onboarded: true,
    users,
    posts: [...(demo ? demoPosts(now, ME) : []), ...seedPosts(now)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    comments: seedComments(now),
    following: demo ? ['jun.kitchen', 'dani_bakes', 'ramen.ryo', 'lena.preps', 'coop.cooks', 'big.nate', 'marcus.m', 'priya.cooks', 'sofia.r'] : [],
    starred: demo ? ['egg-fried-rice', 'budae-ramen', 'tomato-penne'] : [],
    pinned: demo ? ['eggs-toast', 'egg-fried-rice', 'instant-ramen', 'quesadilla'] : [],
    threads: demo ? seedThreads(now) : [],
  };
}

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'hydrate':
      return a.state ? { ...empty, ...a.state, ready: true, celebration: null } : { ...empty, ready: true };
    case 'start':
      return start(a.profile, a.demo);
    case 'reset':
      return { ...empty, ready: true };
    case 'cook': {
      const me = s.users[ME];
      const n = (me.counts[a.recipeId] ?? 0) + 1;
      const o = cookOutcome(a.recipeId, me.counts);
      const extra = [
        ...(o.rankUp !== null ? [`${RANKS[o.rankUp]} is open`] : []),
        ...o.openedVariations.map((v) => `New variation: ${v.name}`),
      ];
      const celebration = o.tierUp || extra.length ? { recipeId: a.recipeId, from: tierFor(n - 1).key, extra } : null;
      const post: Post = {
        id: `p-${uid()}`, userId: ME, recipeId: a.recipeId, cookNumber: n, photo: a.photo,
        description: a.description.trim(), createdAt: new Date().toISOString(), likes: 0,
      };
      return { ...s, users: { ...s.users, [ME]: { ...me, counts: { ...me.counts, [a.recipeId]: n } } }, posts: [post, ...s.posts], celebration };
    }
    case 'celebrated':
      return { ...s, celebration: null };
    case 'like':
      return {
        ...s,
        liked: toggle(s.liked, a.postId),
        posts: s.posts.map((p) => (p.id === a.postId ? { ...p, likes: p.likes + (s.liked.includes(a.postId) ? -1 : 1) } : p)),
      };
    case 'comment':
      return { ...s, comments: [...s.comments, { id: uid(), postId: a.postId, userId: ME, text: a.text.trim(), createdAt: new Date().toISOString() }] };
    case 'follow': {
      const was = s.following.includes(a.userId);
      const u = s.users[a.userId];
      return { ...s, following: toggle(s.following, a.userId), users: { ...s.users, [a.userId]: { ...u, followers: u.followers + (was ? -1 : 1) } } };
    }
    case 'star':
      return { ...s, starred: toggle(s.starred, a.recipeId) };
    case 'pins':
      return { ...s, pinned: a.recipeIds };
    case 'profile': {
      const me = { ...s.users[ME], ...a.patch };
      if (a.patch.city) me.country = cityCountry(a.patch.city);
      return { ...s, users: { ...s.users, [ME]: me } };
    }
    case 'message': {
      const msg = { from: 'me' as const, text: a.text.trim(), at: new Date().toISOString() };
      const t = s.threads.find((x) => x.userId === a.userId);
      const threads = t
        ? s.threads.map((x) => (x === t ? { ...x, messages: [...x.messages, msg] } : x))
        : [{ id: `t-${uid()}`, userId: a.userId, messages: [msg] }, ...s.threads];
      return { ...s, threads };
    }
    case 'submit':
      return { ...s, submissions: [{ ...a.submission, id: uid(), createdAt: new Date().toISOString(), status: 'In review' }, ...s.submissions] };
    case 'setting':
      return { ...s, settings: { ...s.settings, [a.key]: a.value } };
  }
}

const Ctx = createContext<{ state: State; dispatch: (a: Action) => void } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, empty);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => dispatch({ type: 'hydrate', state: raw ? (JSON.parse(raw) as State) : null }))
      .catch(() => dispatch({ type: 'hydrate', state: null }));
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}

export const useMe = () => useStore().state.users[ME];

const localDay = (iso: string) => new Date(iso).toDateString();

/** How many times I've cooked this recipe today, for the 10-a-day limit. */
export function cooksToday(state: State, recipeId: string): number {
  const today = new Date().toDateString();
  return state.posts.filter((p) => p.userId === ME && p.recipeId === recipeId && localDay(p.createdAt) === today).length;
}

export function canCookToday(state: State, recipeId: string): boolean {
  return state.settings.ignoreDailyLimit || cooksToday(state, recipeId) < DAILY_COOK_LIMIT;
}

export type Board = 'city' | 'country' | 'world';

export type BoardRow = { user: User; points: number; cooks: number; place: number };

export function leaderboard(state: State, board: Board): BoardRow[] {
  const me = state.users[ME];
  const rows = Object.values(state.users)
    .filter((u) => board === 'world' || (board === 'city' ? u.city === me.city : u.country === me.country))
    .map((u) => ({ user: u, points: masteryPoints(u.counts), cooks: Object.values(u.counts).reduce((a, b) => a + b, 0), place: 0 }))
    .sort((a, b) => b.points - a.points || b.cooks - a.cooks);
  rows.forEach((r, i) => (r.place = i + 1));
  return rows;
}

/** Leaderboard members (top 10 in their country or the world) get the Create tab. */
export function isLeaderboardMember(state: State): boolean {
  if (state.settings.previewCreate) return true;
  return (['country', 'world'] as const).some((b) => (leaderboard(state, b).find((r) => r.user.id === ME)?.place ?? 99) <= 10);
}

export const rankOf = (u: User) => currentRank(u.counts);
export const recipeName = (id: string) => RECIPE_BY_ID[id]?.name ?? id;
export { cityCountry };
export type { Counts };
