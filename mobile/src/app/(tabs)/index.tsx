import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_IDS_BY_RANK, RANKS } from '@/data/recipes';
import { RECIPES_TO_UNLOCK, currentRank, descendantsOf, isRankOpen, masteryPoints, nextTier, rankProgress, totalCooks, unlockTierFor } from '@/game/rules';
import { countLine, familyTile } from '@/game/view';
import { ME, useMe, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { Display, Grid3, RecipeTile, RoundButton } from '@/ui/kit';
import { MARGIN, TIER_SOLID, useColors } from '@/ui/theme';

export default function Home() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useStore();
  const me = useMe();
  const counts = me.counts;
  const rank = currentRank(counts);
  const progress = rankProgress(rank, counts);
  const unlockTier = unlockTierFor(rank);
  const last = rank === RANKS.length - 1;
  const need = Math.max(0, RECIPES_TO_UNLOCK - progress);

  return (
    <ScrollView style={{ backgroundColor: c.ground }} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}>
      <View style={s.nav}>
        <Display size={28}>CookRank</Display>
        <RoundButton icon="search" label="Search" onPress={() => router.push('/search')} />
      </View>

      <View style={{ paddingHorizontal: MARGIN }}>
        <Text style={[s.k, { color: c.ink2 }]}>Chef rank {rank + 1} of {RANKS.length}</Text>
        <Display size={58} style={{ textTransform: 'uppercase', marginTop: 6, lineHeight: 54 }}>{RANKS[rank]}</Display>
        <Text style={[s.pts, { color: c.ink2 }]}>
          <Text style={{ color: c.ink, fontWeight: '700' }}>{masteryPoints(counts).toLocaleString()}</Text> mastery points ·{' '}
          <Text style={{ color: c.ink, fontWeight: '700' }}>{totalCooks(counts)}</Text> cooks
        </Text>
        <View style={s.prog}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {Array.from({ length: RECIPES_TO_UNLOCK }).map((_, i) => (
              <View key={i} style={[s.seg, { backgroundColor: i < progress ? TIER_SOLID[unlockTier.key] : c.rule }]} />
            ))}
          </View>
          <Text style={[s.progText, { color: c.ink2 }]}>
            {last
              ? `${unlockTier.name} on ${need} more recipes to master the last rank`
              : need > 0
                ? `${unlockTier.name} on ${need} more ${RANKS[rank]} recipe${need === 1 ? '' : 's'} opens ${RANKS[rank + 1]}`
                : `${RANKS[rank + 1]} is open`}
          </Text>
        </View>
      </View>

      {RANKS.map((name, r) => {
        const open = isRankOpen(r, counts);
        const done = open && rankProgress(r, counts) >= RECIPES_TO_UNLOCK;
        const now = r === rank;
        return (
          <View key={name} style={[s.block, { borderColor: now ? c.ink : c.rule, borderWidth: now ? 1.5 : 1 }]}>
            <View style={s.hd}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, lineHeight: 16, color: c.ink2 }}>Rank {r + 1}{now ? ' · now' : ''}</Text>
                <Text style={{ fontSize: 20, lineHeight: 25, fontWeight: '700', letterSpacing: -0.4, marginTop: 2, color: open ? c.ink : c.ink2 }}>
                  {open ? name : 'Locked rank'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {open ? (
                  done ? (
                    <>
                      <Icon name="check" size={18} color={c.ink2} />
                      <Text style={[s.st, { color: c.ink2 }]}>Complete</Text>
                    </>
                  ) : (
                    <Text style={[s.st, { color: c.ink2 }]}>{rankProgress(r, counts)} of {RECIPES_TO_UNLOCK} {unlockTierFor(r).name.toLowerCase()}</Text>
                  )
                ) : (
                  <>
                    <Icon name="lock" size={18} color={c.ink2} />
                    <Text style={[s.st, { color: c.ink2 }]}>{unlockTierFor(r).name} to clear</Text>
                  </>
                )}
              </View>
            </View>
            <Grid3>
              {BASE_IDS_BY_RANK[r].map((id) => {
                const t = familyTile(id, counts, state.posts, ME, [id, ...descendantsOf(id).map((v) => v.id)]);
                return (
                  <RecipeTile
                    key={id}
                    name={t.recipe.name}
                    tier={t.tier}
                    photo={t.photo}
                    state={t.state}
                    hideName={!open}
                    line={open ? countLine(t.count, t.tier, nextTier(t.count)?.remaining) : undefined}
                    onPress={open ? () => router.push(`/recipe/${id}`) : undefined}
                  />
                );
              })}
            </Grid3>
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: MARGIN, paddingRight: 16 },
  k: { fontSize: 13, lineHeight: 18, marginTop: 6 },
  pts: { fontSize: 15, lineHeight: 20, marginTop: 10 },
  prog: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  seg: { width: 28, height: 6, borderRadius: 3 },
  progText: { flex: 1, fontSize: 13, lineHeight: 18 },
  block: { marginHorizontal: 16, marginTop: 28, borderRadius: 26, paddingTop: 16, paddingHorizontal: 14, paddingBottom: 20 },
  hd: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 2, paddingBottom: 16, gap: 8 },
  st: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
});
