import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { RECIPES } from '@/data/recipes';
import { familyCount, tierFor } from '@/game/rules';
import { coverOf, latestPhoto } from '@/game/view';
import { ME, useMe, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { FramedPhoto } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

const MAX_PINS = 5;

export default function Pins() {
  const c = useColors();
  const { state, dispatch } = useStore();
  const me = useMe();
  const [picked, setPicked] = useState<string[]>(state.pinned);
  const cooked = RECIPES.filter((r) => (me.counts[r.id] ?? 0) > 0);
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_PINS ? [...p, id] : p));

  return (
    <View style={{ flex: 1, backgroundColor: c.ground }}>
      <View style={s.bar}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Text style={{ fontSize: 17, color: c.ink }}>Cancel</Text></Pressable>
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>Pinned recipes</Text>
        <Pressable onPress={() => { dispatch({ type: 'pins', recipeIds: picked }); router.back(); }} hitSlop={10}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: c.accent }}>Done</Text>
        </Pressable>
      </View>
      <Text style={{ fontSize: 13, color: c.ink2, paddingHorizontal: MARGIN, paddingBottom: 8 }}>Pick up to {MAX_PINS}. They sit at the top of your profile.</Text>
      <FlatList
        data={cooked}
        keyExtractor={(r) => r.id}
        ListEmptyComponent={<Text style={{ color: c.ink2, fontSize: 15, padding: MARGIN }}>Cook something first, then pin it here.</Text>}
        renderItem={({ item }) => {
          const n = item.parentId ? me.counts[item.id] ?? 0 : familyCount(item.id, me.counts);
          const on = picked.includes(item.id);
          return (
            <Pressable onPress={() => toggle(item.id)} style={s.row}>
              <FramedPhoto tier={tierFor(n).key} photo={latestPhoto(state.posts, ME, [item.id]) ?? coverOf(item)} size={48} radius={10} pad={2} />
              <Text style={{ flex: 1, fontSize: 17, color: c.ink }}>{item.name}</Text>
              <View style={[s.check, { borderColor: on ? c.accent : c.ink3, backgroundColor: on ? c.accent : 'transparent' }]}>
                {on ? <Icon name="check" size={16} color={c.onAccent} strokeWidth={2.4} /> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: MARGIN, height: 60 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: MARGIN, paddingVertical: 8 },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
