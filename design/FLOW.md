# CookRank: screens and flows

From the product walkthrough (2026-10-18). Built in **React Native** (iOS and
Android) with Firebase. Look: **minimal and light, like
Instagram**, with a dark mode that follows the phone. The food photos and the
tier frames carry the colour.

## Rules the screens depend on

- **Chef ranks** (levels): High school chump → College dormer → Meal prepper →
  Hobbyist → Date night → Junior chef → Real chef → Expert chef → Master chef →
  Grandmaster chef. **6 base recipes per rank. Reaching the rank's unlock
  tier on 3 of them opens the next rank.**
- **Unlock tier per rank** (easier for beginners), used for both the next
  rank and the variations of that rank's recipes:

  | Ranks | Unlock tier |
  |---|---|
  | High school chump, College dormer, Meal prepper, Hobbyist | Bronze (5) |
  | Date night, Junior chef, Real chef | Silver (10) |
  | Expert chef | Gold (15) |
  | Master chef | Master (50) |
  | Grandmaster chef | Grandmaster (100) |
- **Tiers** by cook count: blank 0 · bronze 5 · silver 10 · gold 15 ·
  platinum 20 · master 50 · grandmaster 100.
- **Variations.** The rank's unlock tier on a recipe opens its first row of
  variations; the same tier on a variation opens the row below it (e.g.
  Ramen → Budae ramen → Brisket ramen with bean sprouts and cilantro).
- A cook of a variation counts toward **that variation's** tier and toward
  the **recipe family's total** (the number on the Home screen).
- **Mastery points** = Σ (recipe difficulty × cook count) over every base
  recipe and variation. Difficulty is set per recipe (1 to 5). The
  leaderboard ranks by mastery points, not by chef rank.
- **Cook limit:** 10 cooks of a recipe per day.
- **Social:** one-way follow, public profiles, likes and comments on posts.

## Bottom bar

**Home · Mastery · Leaderboard · Profile**, plus **Create** for leaderboard
members only (MVP+).

## Screens

1. **Home.** A game-style progression. Current chef rank at the top, with
   mastery points and progress to the next rank. Scrolling down: each rank
   is a bordered block holding its 6 recipes, each with its tier frame and
   cook count. Locked ranks below are mystery blocks with "?" recipes.
2. **Recipe page.** Opened from Home or Mastery. The recipe's tier, count,
   difficulty, progress to the next tier, a **+** button to cook it again,
   the variations tree (open and locked), how to cook it, and every cook of
   it as photos with date and description.
3. **Cook this recipe** (from +). Take or choose a photo, write an optional
   description (150 characters), post. Shows "Cook #13" and how many cooks
   are left today.
4. **Mastery.** Filters: chef rank chips, tier, Base / Variations, and a
   Starred row at the top. Each row opens the recipe page.
5. **Leaderboard.** Region / Country / World. Top cooks by mastery points:
   username, total cooks, top dish, chef rank. Your own place pinned at the
   bottom. Tap a name to open that profile.
6. **Profile: Me.** Chef rank, cooks, mastery points, top dishes, an optional
   bio, pinned recipes (like Instagram highlights), and a grid of all your
   posts.
7. **Profile: Friends.** Posts from the people you follow, with like and
   comment.
8. **Comments.** A sheet on a post.
9. **Someone else's profile.** Like Me, with **Follow**.
10. **Tier-up moment.** When a cook crosses a tier, the frame turns over to
    the new metal (the signature interaction).
11. **Create** (MVP+, leaderboard members): submit a recipe for review;
    it stays credited to you.

Also needed for the App Store, but not drawn yet: sign in, set up profile,
settings, report and block.
