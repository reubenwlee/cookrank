# CookRank: screens and flows (draft for review)

Decisions so far: one-way follow, public profiles, log a cook from the recipe
card (or from the camera button), a custom reaction plus comments on dish
posts, 6 recipes per level, silver on 3 opens the next level, honor system.
Visual direction: **A, the binder** (dark ground, condensed type, foil frames).

## Navigation

Floating tab bar: **Feed · Recipes · Ranks · Profile**, plus a separate
**camera** button on the right (log a cook). The app opens on **Profile**.

## Screens

### First run
1. **Welcome / sign in.** Sign in with Apple (or email). One screen.
2. **Set up profile.** Name, @handle, optional photo.
3. **Your first cards.** Shows the 6 High school chump recipe cards, all
   blank, and how tiers work (bronze 5 · silver 10 · gold 15 · platinum 20 ·
   master 50 · grandmaster 100). One button: go to profile.

### Profile tab
4. **My profile.** Photo, name, level, cooks / followers / following, and
   progress toward the next level ("Silver on 2 more College dormer recipes").
   Two views:
   - **Cards:** the binder, every recipe you've cooked, framed by tier.
   - **Dishes:** every dish photo you've posted, newest first.
5. **Recipe card (mine).** The big foil card, your count, how far to the next
   tier, an **I cooked this** button, then sections:
   recipe (ingredients + steps) · my dishes of it · top 10 · comments.
6. **Followers / following** lists.
7. **Settings.** Edit profile, sign out, delete account, blocked users.

### Logging a cook (the core loop)
8. **Camera.** Full screen. Opens from **I cooked this** (recipe already
   chosen) or from the camera button.
9. **Pick recipe** (only from the camera button). A sheet listing the recipes
   you've unlocked, current level first.
10. **Post.** Photo, recipe, "Cook #11", optional caption. **Post**.
11. **Tier-up moment** (when a cook crosses 5/10/15/20/50/100). The card
    flips in the binder and the new foil sweeps across it, with a haptic.
    *This is the app's signature interaction.*
12. **Level-up moment** (when the 3rd silver lands). The next level's 6 cards
    deal into your binder.

### Feed tab
13. **Feed.** Dish posts from people you follow, newest first: photo, who,
    recipe + tier, "Cook #11", reaction and comment counts.
    If you follow nobody yet: suggested cooks and a search.
14. **Dish post.** The photo, the caption, reactions, and the comment thread.
15. **Find people.** Search by name or @handle.

### Recipes tab
16. **Levels.** The ladder. Your current level open with its 6 cards and
    counts; finished levels collapsed above; locked levels below, each saying
    what opens it.
17. **Recipe card (not cooked yet).** Same as 5, with the recipe up front.

### Ranks tab
18. **Top 10.** Pick a recipe (defaults to your best one). Shows the top 10
    cooks by count, with photo and tier, plus your own position if you're
    outside the top 10. Toggle: **Everyone / Following**.

### Other people
19. **Their profile.** Same as 4, with **Follow** / **Following**.
20. **Their recipe card.** Their count, their dishes of it, and comments on
    the card.

### Shared
21. **Comments sheet.** Used for both dish posts and recipe cards. Each
    comment has a report action.
22. **Report / block.** Apple requires these for apps where users post
    content (App Store guideline 1.2).

## Flows

- **Daily loop:** Profile → tap card → I cooked this → camera → post →
  count +1 (→ tier-up / level-up) → the post appears in followers' feeds.
- **Quick log:** camera button → snap → pick recipe → post.
- **Social:** Feed → dish post → react / comment → tap name → their profile →
  follow → their card → comment on the card.
- **Progress:** Recipes → current level → card → cook it. Ranks → recipe →
  top 10 → tap a cook → their profile.

## Not in the MVP
Recipe variations, user-submitted recipes and menus, the reviewer workflow,
private accounts, DMs.
