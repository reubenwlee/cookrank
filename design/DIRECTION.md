# CookRank: direction

## Brief (from the interview, 2026-10-17)

- **What / who:** a social cooking app for **young adults learning to cook**
  (high school, college, first apartment). You keep a count of how many times
  you've cooked each recipe, and every cook is a photo of the finished dish on
  your profile. Friends follow each other, visit profiles, and comment on
  recipe cards and on individual dish posts.
- **No "survival" mechanic.** No lives, no streak punishment.
- **Core screen:** *your profile / card collection.* Each recipe is a
  trading card whose **frame changes with mastery**:
  blank (0), bronze (5), silver (10), gold (15), platinum (20),
  master (50), grandmaster (100).
- **Progression:** levels High school chump → College dormer → Meal prepper →
  Hobbyist → Date night → Junior chef → Real chef → Expert chef → Master chef →
  Grandmaster chef. Each level has a set of recipes; **silver on N of them**
  unlocks the next level.
- **Feel:** like Instagram / TikTok: a social profile, a feed, photos first.
- **Brand:** nothing exists yet besides the name. Design it all.
- **v1 MVP scope:** log a cook + photo with card tiers; levels and unlocks;
  friends, feed, comments; top-10 leaderboards per recipe.
  Post-MVP: recipe variations, user-submitted recipes and menus.
- **Recipes:** written by us, bundled, editable in the backend later.
- **Anti-cheat:** honor system.
- **Build:** React Native (Expo) for iOS and Android, Firebase (Auth, Firestore, Storage).
- **Superseded:** the screen list and rules now live in `FLOW.md` (2026-10-18). The look
  moved from the dark binder to minimal light, like Instagram, keeping A's foil tier
  frames and condensed display numerals (`mockup.html`).
- **Imagery:** stand-in food photography from Unsplash (verified, stored in
  `img/`). In the product the imagery is **the users' own dish photos**.
- **Rendering caveat:** this design was made on Linux. Apple's SF Pro is
  substituted with Inter in renders; display faces are real (loaded from
  `fonts/`).
