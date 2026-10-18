import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS, RECIPE_BY_ID, type Recipe } from '@/data/recipes';
import {
  DAILY_COOK_LIMIT, RANK_UNLOCK_MIN, TIERS, childrenOf, descendantsOf, familyCount, isRecipeOpen, nextTier, rootOf, tierFor, unlockTierFor,
} from '@/game/rules';
import { countLine, coverOf, latestPhoto, longDate } from '@/game/view';
import { ME, canCookToday, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { BackButton, Display, FramedPhoto, Grid3, RecipeTile, RoundButton, SectionTitle } from '@/ui/kit';
import { photoSource } from '@/ui/photos';
import { TierUp } from '@/ui/TierUp';
import { MARGIN, useColors } from '@/ui/theme';

export default function RecipeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; user?: string }>();
  const { state, dispatch } = useStore();
  const [showHow, setShowHow] = useState(false);

  const recipe = RECIPE_BY_ID[params.id];
  const userId = params.user ?? ME;
  const owner = state.users[userId];
  if (!recipe || !owner) return null;

  const mine = userId === ME;
  const counts = owner.counts;
  const count = counts[recipe.id] ?? 0;
  const tier = tierFor(count);
  const nt = nextTier(count);
  const open = isRecipeOpen(recipe.id, counts);
  const root = rootOf(recipe.id);
  const isBase = !recipe.parentId;
  const starred = state.starred.includes(recipe.id);
  const cooks = state.posts.filter((p) => p.userId === userId && p.recipeId === recipe.id);
  const photo = latestPhoto(state.posts, userId, [recipe.id]) ?? coverOf(recipe);
  const prevMin = [...TIERS].reverse().find((t) => t.min <= count)?.min ?? 0;
  const pct = nt ? (count - prevMin) / (nt.tier.min - prevMin) : 1;

  const cook = () => {
    if (!open) return;
    if (!canCookToday(state, recipe.id)) {
      Alert.alert('That’s 10 today', `You can log ${DAILY_COOK_LIMIT} cooks of a recipe a day. Come back tomorrow.`);
      return;
    }
    router.push(`/cook/${recipe.id}`);
  };

  // Variation rows: this recipe's children, then theirs, and so on.
  const rows: Recipe[][] = [];
  let level = childrenOf(recipe.id);
  while (level.length) {
    rows.push(level);
    level = level.flatMap((v) => childrenOf(v.id));
  }
  const unlock = unlockTierFor(recipe.rank);

  return (
    <View style={{ flex: 1, backgroundColor: c.ground }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 40 }}>
        <View style={s.nav}>
          <BackButton />
          {mine && open ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable accessibilityLabel={starred ? 'Unstar' : 'Star'} onPress={() => dispatch({ type: 'star', recipeId: recipe.id })} style={[s.round, { backgroundColor: c.raised }]}>
                <Icon name="star" color={starred ? c.accent : c.ink} fill={starred ? c.accent : undefined} />
              </Pressable>
              <RoundButton icon="plus" label="Cook this recipe" filled onPress={cook} />
            </View>
          ) : null}
        </View>

        <FramedPhoto tier={tier.key} photo={photo} radius={30} pad={4} aspect={4 / 3} style={{ marginHorizontal: 16, marginTop: 4 }} />

        <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
          <Text style={[s.k, { color: c.ink2 }]}>
            {mine ? '' : `@${owner.handle} · `}{RANKS[recipe.rank]} · {isBase ? '' : `Variation of ${RECIPE_BY_ID[recipe.parentId!].name} · `}Difficulty {recipe.difficulty} of 5
          </Text>
          <Text style={[s.h1, { color: c.ink }]}>{recipe.name}</Text>
        </View>

        {open ? (
          <>
            <View style={s.count}>
              <Display size={76} style={{ lineHeight: 64 }}>{count}</Display>
              <View style={{ paddingBottom: 2 }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>{count === 0 ? 'Not cooked yet' : tier.name}</Text>
                <Text style={{ fontSize: 13, color: c.ink2 }}>
                  {nt ? `${nt.remaining} more cook${nt.remaining === 1 ? '' : 's'} for ${nt.tier.name.toLowerCase()}` : 'Top tier'}
                </Text>
              </View>
            </View>
            <View style={[s.bar, { backgroundColor: c.rule }]}>
              <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', backgroundColor: c.ink }} />
            </View>
            <Text style={[s.fam, { color: c.ink2 }]}>
              {isBase ? (
                <>
                  {root.name.split(',')[0]} family: <Text style={{ color: c.ink, fontWeight: '600' }}>{familyCount(root.id, counts)} cooks</Text> across {1 + descendantsOf(root.id).filter((v) => (counts[v.id] ?? 0) > 0).length} recipes
                </>
              ) : (
                <>
                  Every cook also counts toward <Text style={{ color: c.ink, fontWeight: '600' }}>{root.name}</Text> ({familyCount(root.id, counts)})
                </>
              )}
            </Text>
          </>
        ) : (
          <Text style={[s.fam, { color: c.ink2, marginTop: 20 }]}>
            {recipe.parentId
              ? `Opens at ${unlock.name.toLowerCase()} (${RANK_UNLOCK_MIN[recipe.rank]} cooks) on ${RECIPE_BY_ID[recipe.parentId].name}.`
              : `Opens with the ${RANKS[recipe.rank]} rank.`}
          </Text>
        )}

        {rows.length > 0 && (
          <View style={s.sec}>
            <SectionTitle title="Variations" sub={`${unlock.name} on a recipe opens the row below it.`} />
            {rows.map((row, i) => {
              const parentsOpen = row.some((v) => isRecipeOpen(v.id, counts));
              return (
                <View key={i}>
                  {i > 0 || !parentsOpen ? (
                    <View style={s.rowLabel}>
                      {!parentsOpen && <Icon name="lock" size={16} color={c.ink2} />}
                      <Text style={{ fontSize: 12, color: c.ink2 }}>
                        {parentsOpen ? 'Next row' : i === 0 ? `Opens at ${unlock.name.toLowerCase()} on this recipe` : `Next row: ${unlock.name.toLowerCase()} on the variation above it`}
                      </Text>
                    </View>
                  ) : null}
                  <Grid3>
                    {row.map((v) => {
                      const vOpen = isRecipeOpen(v.id, counts);
                      const n = counts[v.id] ?? 0;
                      const t = tierFor(n);
                      return (
                        <RecipeTile
                          key={v.id}
                          name={v.name}
                          tier={t.key}
                          photo={latestPhoto(state.posts, userId, [v.id]) ?? coverOf(v)}
                          state={!vOpen ? 'locked' : n > 0 ? 'cooked' : 'new'}
                          line={vOpen ? countLine(n, t.key, nextTier(n)?.remaining) : `Difficulty ${v.difficulty}`}
                          onPress={() => router.push(mine ? `/recipe/${v.id}` : `/recipe/${v.id}?user=${userId}`)}
                        />
                      );
                    })}
                  </Grid3>
                  <View style={{ height: 8 }} />
                </View>
              );
            })}
          </View>
        )}

        <View style={[s.sec, { paddingTop: rows.length ? 28 : 40 }]}>
          <Pressable onPress={() => setShowHow((x) => !x)} style={[s.lrow, { borderColor: c.rule }]}>
            <Text style={{ flex: 1, fontSize: 17, color: c.ink }}>How to cook it</Text>
            <Text style={{ fontSize: 15, color: c.ink2 }}>{recipe.ingredients.length} ingredients · {recipe.time}</Text>
            <View style={{ transform: [{ rotate: showHow ? '90deg' : '0deg' }] }}>
              <Icon name="chevr" size={18} color={c.ink2} />
            </View>
          </Pressable>
          {showHow && (
            <View style={{ paddingTop: 16, gap: 20 }}>
              <View style={{ gap: 6 }}>
                {recipe.ingredients.map((x) => (
                  <Text key={x} style={{ fontSize: 15, lineHeight: 20, color: c.ink }}>·  {x}</Text>
                ))}
              </View>
              <View style={{ gap: 12 }}>
                {recipe.steps.map((x, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                    <Display size={22} style={{ width: 18, lineHeight: 22 }}>{i + 1}</Display>
                    <Text style={{ flex: 1, fontSize: 15, lineHeight: 21, color: c.ink }}>{x}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {open && (
          <View style={[s.sec, { paddingTop: 40 }]}>
            <SectionTitle title={mine ? 'Your cooks' : `${owner.handle}’s cooks`} sub={cooks.length ? `${cooks.length} photo${cooks.length === 1 ? '' : 's'}, newest first` : undefined} />
            {cooks.length === 0 ? (
              <Text style={{ fontSize: 15, lineHeight: 20, color: c.ink2 }}>
                {mine ? 'Cook it, take a photo, and it lands here. Tap + to log your first.' : 'No photos of this one yet.'}
              </Text>
            ) : (
              cooks.map((p) => (
                <Pressable key={p.id} onPress={() => router.push(`/post/${p.id}`)} style={[s.cook, { borderColor: c.rule }]}>
                  <Image source={photoSource(p.photo)} style={s.thumb} contentFit="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: c.ink2 }}>Cook #{p.cookNumber} · {longDate(p.createdAt)}</Text>
                    {p.description ? <Text style={{ fontSize: 15, lineHeight: 20, color: c.ink, marginTop: 2 }}>{p.description}</Text> : null}
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <TierUp
        visible={state.celebration?.recipeId === recipe.id && mine}
        from={state.celebration?.from ?? 'blank'}
        to={tier.key}
        toName={tier.name}
        recipeName={recipe.name}
        count={count}
        photo={photo}
        extra={state.celebration?.extra ?? []}
        onClose={() => dispatch({ type: 'celebrated' })}
      />
    </View>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  k: { fontSize: 13, lineHeight: 18 },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.6, marginTop: 4 },
  count: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, paddingHorizontal: MARGIN, paddingTop: 18 },
  bar: { marginHorizontal: MARGIN, marginTop: 14, height: 4, borderRadius: 2, overflow: 'hidden' },
  fam: { marginHorizontal: MARGIN, marginTop: 14, fontSize: 15, lineHeight: 20 },
  sec: { paddingHorizontal: MARGIN, paddingTop: 44 },
  rowLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginBottom: 10 },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  cook: { flexDirection: 'row', gap: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  thumb: { width: 72, height: 72, borderRadius: 12 },
});
