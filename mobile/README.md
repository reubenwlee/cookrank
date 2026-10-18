# CookRank app (MVP prototype)

React Native + Expo (SDK 58), runs on iPhone and Android. The design and rules
it implements are in [`../design/FLOW.md`](../design/FLOW.md) and
[`../design/mockup.html`](../design/mockup.html).

## Try it on your phone

1. Install **Expo Go** on your phone (App Store or Google Play).
2. On your computer, with Node.js 20 or newer:

   ```sh
   cd mobile
   npm install
   npx expo start
   ```

3. Scan the QR code: with the Camera app on iPhone, or from inside Expo Go on
   Android. Phone and computer need to be on the same Wi-Fi. If they can't
   see each other, run `npx expo start --tunnel` instead.

On the welcome screen, either make your own account (starts at High school
chump with nothing cooked) or tap **Try it with a demo account** (Theo, 89
cooks in, College dormer, following 9 cooks, with a feed and a DM thread).

## What works

- **Home:** chef rank, mastery points, progress to the next rank, every rank
  as a block of 6 recipes with tier frames and family counts; locked ranks
  are hidden "?" blocks.
- **Recipe page:** count, tier, progress to the next tier, star, **+** to
  cook, the variation tree (locked rows show what opens them), how to cook it,
  and every cook with photo, date and description.
- **New cook:** camera, photo library, or a bundled sample photo (handy on a
  simulator); a 150-character description; the 10-a-day limit.
- **Tier-up moment:** the card turns over to its new metal with a light sweep
  and haptics, and lists any rank or variation it opened.
- **Mastery:** rank chips, Base / Variations, tier filter, starred recipes.
- **Leaderboard:** your city, country and world by mastery points, with your
  own place pinned when you're outside the top 10.
- **Profile:** Me (stats, bio, pinned recipes, post grid) and Friends (feed
  with likes and comments). Other cooks' profiles with Follow and Message.
- **DMs, search, settings** (edit profile, home city, reset).
- **Create** (MVP+): appears for the top 10 in your country or the world.
  Turn on *Preview the Create tab* in settings to see it sooner.
- Light and dark mode follow the phone.

## Not real yet

Everything is stored **on the phone** (AsyncStorage). The other cooks, their
posts and comments are seeded demo data, and messages don't reach anyone.
Firebase (Auth, Firestore, Storage) is the next step: every store action in
`src/store/store.tsx` maps to one Firestore write. The food photos are
stand-ins from Unsplash.

## Code map

| Path | What |
|---|---|
| `src/data/recipes.ts` | 10 ranks × 6 recipes, variation trees, difficulty, ingredients, steps |
| `src/game/rules.ts` | Tiers, per-rank unlock tiers, rank and variation unlocks, mastery points |
| `src/game/rules.test.ts` | Rule tests (`npm test`) |
| `src/data/seed.ts` | Demo cooks, posts, comments, DMs |
| `src/store/store.tsx` | App state, persistence, leaderboards |
| `src/app/` | Screens (Expo Router: one file per route) |
| `src/ui/` | Theme, icons, tier frames, tiles, post card, tier-up animation |

## Checks

```sh
npm test            # game rules
npm run typecheck
npx expo lint
npx expo-doctor
```
