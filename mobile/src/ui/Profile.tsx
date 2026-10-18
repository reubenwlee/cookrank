// The profile body shared by "Me" and someone else's profile: stats, bio,
// pinned recipes (like Instagram highlights) and the grid of posts.

import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { RANKS, RECIPE_BY_ID } from '@/data/recipes';
import type { User } from '@/data/seed';
import { currentRank, familyCount, masteryPoints, rootOf, tierFor, totalCooks } from '@/game/rules';
import { coverOf, latestPhoto } from '@/game/view';
import { ME, leaderboard, useStore } from '@/store/store';
import { Icon } from './Icon';
import { Avatar, TierFrame } from './kit';
import { photoSource } from './photos';
import { MARGIN, useColors } from './theme';

export function ProfileBody({ user, actions, pins, editPins }: { user: User; actions: ReactNode; pins: string[]; editPins?: () => void }) {
  const c = useColors();
  const { state } = useStore();
  const posts = state.posts.filter((p) => p.userId === user.id);
  const following = user.id === ME ? state.following.length : Math.round(user.followers / 37) + 12;
  const tops = Object.entries(user.counts)
    .map(([id]) => rootOf(id).id)
    .filter((id, i, a) => a.indexOf(id) === i)
    .sort((a, b) => familyCount(b, user.counts) - familyCount(a, user.counts))
    .slice(0, 2)
    .map((id) => RECIPE_BY_ID[id].name);
  const cityPlace = leaderboard(state, 'city').find((r) => r.user.id === user.id)?.place;
  const cell = (Dimensions.get('window').width - 4) / 3;

  return (
    <View>
      <View style={s.head}>
        <Avatar photo={user.avatar} name={user.name} size={86} />
        <View style={s.stats}>
          <Stat n={totalCooks(user.counts)} label="cooks" />
          <Stat n={user.followers} label="followers" />
          <Stat n={following} label="following" />
        </View>
      </View>
      <Text style={[s.name, { color: c.ink }]}>{user.name}</Text>
      <Text style={[s.line, { color: c.ink2 }]}>
        {RANKS[currentRank(user.counts)]} · {masteryPoints(user.counts).toLocaleString()} mastery points{cityPlace && cityPlace <= 10 ? ` · #${cityPlace} in ${user.city}` : ''}
      </Text>
      {user.bio ? <Text style={[s.line, { color: c.ink, marginTop: 6 }]}>{user.bio}</Text> : null}
      {tops.length > 0 && (
        <Text style={[s.line, { color: c.ink2, marginTop: 4 }]}>
          Top dishes: <Text style={{ color: c.ink, fontWeight: '600' }}>{tops.join(', ')}</Text>
        </Text>
      )}
      <View style={s.actions}>{actions}</View>

      {(pins.length > 0 || editPins) && (
        <View style={s.pins}>
          {pins.map((id) => {
            const r = RECIPE_BY_ID[id];
            if (!r) return null;
            const n = r.parentId ? user.counts[id] ?? 0 : familyCount(id, user.counts);
            return (
              <Pressable key={id} style={s.pin} onPress={() => router.push(user.id === ME ? `/recipe/${id}` : `/recipe/${id}?user=${user.id}`)}>
                <TierFrame tier={tierFor(n).key} radius={32} pad={3}>
                  <Image source={photoSource(latestPhoto(state.posts, user.id, [id]) ?? coverOf(r))} style={[s.pinImg, { borderColor: c.ground, backgroundColor: c.raised }]} contentFit="cover" />
                </TierFrame>
                <Text style={[s.pinLabel, { color: c.ink }]} numberOfLines={1}>{r.name.split(',')[0]}</Text>
              </Pressable>
            );
          })}
          {editPins && (
            <Pressable style={s.pin} onPress={editPins}>
              <View style={[s.pinAdd, { borderColor: c.ink3 }]}>
                <Icon name="plus" color={c.ink2} />
              </View>
              <Text style={[s.pinLabel, { color: c.ink }]}>{pins.length ? 'Edit' : 'Pin'}</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={s.grid}>
        {posts.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/post/${p.id}`)}>
            <Image source={photoSource(p.photo)} style={{ width: cell, height: cell * 4 / 3, backgroundColor: c.raised }} contentFit="cover" />
          </Pressable>
        ))}
      </View>
      {posts.length === 0 && (
        <Text style={{ color: c.ink2, fontSize: 15, textAlign: 'center', padding: 32 }}>
          {user.id === ME ? 'Your cooks show up here. Open a recipe on Home and tap + to log one.' : 'No posts yet.'}
        </Text>
      )}
    </View>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 17, fontWeight: '700', color: c.ink, fontVariant: ['tabular-nums'] }}>{n.toLocaleString()}</Text>
      <Text style={{ fontSize: 13, color: c.ink }}>{label}</Text>
    </View>
  );
}


const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: MARGIN, paddingTop: 12 },
  stats: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '600', paddingHorizontal: MARGIN, paddingTop: 14 },
  line: { fontSize: 15, lineHeight: 20, paddingHorizontal: MARGIN, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: MARGIN, paddingTop: 14 },
  pins: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 20, flexWrap: 'wrap' },
  pin: { width: 64, alignItems: 'center' },
  pinImg: { width: 58, height: 58, borderRadius: 29, borderWidth: 2 },
  pinAdd: { width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  pinLabel: { fontSize: 12, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 20 },
});
