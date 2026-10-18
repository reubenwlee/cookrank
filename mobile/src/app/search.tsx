import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS, RECIPES } from '@/data/recipes';
import { currentRank, isRecipeOpen, tierFor } from '@/game/rules';
import { coverOf } from '@/game/view';
import { ME, useMe, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { Avatar, BackButton, Button, FramedPhoto } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

export default function Search() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();
  const me = useMe();
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const people = Object.values(state.users)
    .filter((u) => u.id !== ME && (!term || u.handle.includes(term) || u.name.toLowerCase().includes(term)))
    .sort((a, b) => b.followers - a.followers)
    .slice(0, term ? 20 : 8);
  // Only recipes you can see: locked ranks stay hidden.
  const recipes = term ? RECIPES.filter((r) => isRecipeOpen(r.id, me.counts) && r.name.toLowerCase().includes(term)).slice(0, 12) : [];

  return (
    <View style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <BackButton />
        <View style={[s.field, { backgroundColor: c.raised }]}>
          <Icon name="search" size={18} color={c.ink2} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search cooks and recipes" placeholderTextColor={c.ink2} autoFocus autoCapitalize="none" style={{ flex: 1, fontSize: 17, color: c.ink }} />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {recipes.length > 0 && <Text style={[s.h, { color: c.ink }]}>Recipes</Text>}
        {recipes.map((r) => (
          <Pressable key={r.id} onPress={() => router.push(`/recipe/${r.id}`)} style={s.row}>
            <FramedPhoto tier={tierFor(me.counts[r.id] ?? 0).key} photo={coverOf(r)} size={44} radius={10} pad={2} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, color: c.ink }}>{r.name}</Text>
              <Text style={{ fontSize: 13, color: c.ink2 }}>{RANKS[r.rank]}{r.parentId ? ' · Variation' : ''}</Text>
            </View>
          </Pressable>
        ))}
        <Text style={[s.h, { color: c.ink }]}>{term ? 'Cooks' : 'Popular cooks'}</Text>
        {people.map((u) => {
          const following = state.following.includes(u.id);
          return (
            <View key={u.id} style={s.row}>
              <Pressable onPress={() => router.push(`/user/${u.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <Avatar photo={u.avatar} name={u.name} size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{u.handle}</Text>
                  <Text style={{ fontSize: 13, color: c.ink2 }} numberOfLines={1}>{u.name} · {RANKS[currentRank(u.counts)]} · {u.city}</Text>
                </View>
              </Pressable>
              <Button title={following ? 'Following' : 'Follow'} kind={following ? 'secondary' : 'primary'} onPress={() => dispatch({ type: 'follow', userId: u.id })} />
            </View>
          );
        })}
        {people.length === 0 && <Text style={{ color: c.ink2, fontSize: 15, paddingHorizontal: MARGIN }}>No cooks match “{q}”.</Text>}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, height: 56 },
  field: { flex: 1, height: 44, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14 },
  h: { fontSize: 15, fontWeight: '600', paddingHorizontal: MARGIN, paddingTop: 20, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 8 },
});
