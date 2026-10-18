import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS, RECIPES, RECIPE_BY_ID, type Recipe } from '@/data/recipes';
import { TIERS, isRankOpen, isRecipeOpen, tierFor, type TierKey } from '@/game/rules';
import { coverOf, latestPhoto } from '@/game/view';
import { ME, useMe, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { Chip, Display, FramedPhoto, LargeTitle, RecipeTile, Segmented } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

type Kind = 'all' | 'base' | 'variations';

export default function Mastery() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useStore();
  const me = useMe();
  const counts = me.counts;
  const [rank, setRank] = useState<number | 'all'>('all');
  const [kind, setKind] = useState<Kind>('all');
  const [tier, setTier] = useState<TierKey | 'any'>('any');

  const list = useMemo(
    () =>
      RECIPES.filter((r) => isRecipeOpen(r.id, counts))
        .filter((r) => rank === 'all' || r.rank === rank)
        .filter((r) => kind === 'all' || (kind === 'base' ? !r.parentId : !!r.parentId))
        .filter((r) => tier === 'any' || tierFor(counts[r.id] ?? 0).key === tier)
        .sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0) || a.rank - b.rank),
    [counts, rank, kind, tier],
  );
  const starred = state.starred.map((id) => RECIPE_BY_ID[id]).filter(Boolean);

  const header = (
    <View>
      <LargeTitle right={<View />}>Mastery</LargeTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        <Chip label="All ranks" on={rank === 'all'} onPress={() => setRank('all')} />
        {RANKS.map((name, r) =>
          isRankOpen(r, counts) ? <Chip key={name} label={name} on={rank === r} onPress={() => setRank(r)} /> : null,
        )}
        {RANKS.some((_, r) => !isRankOpen(r, counts)) && (
          <Chip label={`${RANKS.filter((_, r) => !isRankOpen(r, counts)).length} locked`} icon="lock" muted />
        )}
      </ScrollView>
      <View style={{ paddingHorizontal: MARGIN, paddingTop: 10 }}>
        <Segmented<Kind>
          value={kind}
          onChange={setKind}
          options={[{ value: 'all', label: 'All' }, { value: 'base', label: 'Base' }, { value: 'variations', label: 'Variations' }]}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.chips, { paddingTop: 10 }]}>
        <Chip label="Any tier" on={tier === 'any'} onPress={() => setTier('any')} />
        {TIERS.map((t) => (
          <Chip key={t.key} label={t.name} on={tier === t.key} onPress={() => setTier(t.key)} />
        ))}
      </ScrollView>

      {starred.length > 0 && (
        <>
          <Text style={[s.h4, { color: c.ink }]}>Starred</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: MARGIN }}>
            {starred.map((r) => {
              const n = counts[r.id] ?? 0;
              const t = tierFor(n);
              return (
                <View key={r.id} style={{ width: 92 }}>
                  <RecipeTile
                    name={r.name}
                    tier={t.key}
                    photo={latestPhoto(state.posts, ME, [r.id]) ?? coverOf(r)}
                    state={n > 0 ? 'cooked' : 'new'}
                    line={n > 0 ? `${n} · ${t.name}` : 'Not cooked yet'}
                    onPress={() => router.push(`/recipe/${r.id}`)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
      <View style={s.h4row}>
        <Text style={[s.h4, { color: c.ink, paddingTop: 0, paddingBottom: 0 }]}>{rank === 'all' ? 'All recipes' : RANKS[rank]}</Text>
        <Text style={{ color: c.ink2, fontSize: 15 }}>{list.length} open</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: c.ground }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
      data={list}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={{ color: c.ink2, fontSize: 15, paddingHorizontal: MARGIN }}>Nothing matches these filters yet.</Text>}
      renderItem={({ item }) => <Row recipe={item} />}
    />
  );
}

function Row({ recipe }: { recipe: Recipe }) {
  const c = useColors();
  const { state } = useStore();
  const n = state.users[ME].counts[recipe.id] ?? 0;
  const t = tierFor(n);
  const starred = state.starred.includes(recipe.id);
  return (
    <Pressable onPress={() => router.push(`/recipe/${recipe.id}`)} style={({ pressed }) => [s.row, { opacity: pressed ? 0.7 : 1 }]}>
      <FramedPhoto tier={t.key} photo={latestPhoto(state.posts, ME, [recipe.id]) ?? coverOf(recipe)} size={56} radius={12} pad={2.5} />
      <View style={[s.txt, { borderBottomColor: c.rule }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 17, color: c.ink, flexShrink: 1 }} numberOfLines={1}>{recipe.name}</Text>
            {starred ? <Icon name="star" size={16} color={c.accent} fill={c.accent} /> : null}
          </View>
          <Text style={{ fontSize: 13, color: c.ink2 }} numberOfLines={1}>
            {recipe.parentId ? `Variation of ${RECIPE_BY_ID[recipe.parentId].name}` : `${RANKS[recipe.rank]} · Base`} · Difficulty {recipe.difficulty}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Display size={24} style={{ lineHeight: 24 }}>{n}</Display>
          <Text style={{ fontSize: 12, color: c.ink2 }}>{n === 0 ? 'New' : t.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chips: { gap: 8, paddingHorizontal: MARGIN, paddingTop: 14 },
  h4: { fontSize: 15, fontWeight: '600', paddingHorizontal: MARGIN, paddingTop: 28, paddingBottom: 12 },
  h4row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: MARGIN, paddingTop: 28, paddingBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: MARGIN, paddingVertical: 6 },
  txt: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, minWidth: 0 },
});
