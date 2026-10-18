import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS } from '@/data/recipes';
import { currentRank, topDish } from '@/game/rules';
import { ME, leaderboard, useMe, useStore, type Board, type BoardRow } from '@/store/store';
import { Avatar, Display, LargeTitle, RoundButton, Segmented } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

const TOP = 10;

export default function Leaderboard() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useStore();
  const me = useMe();
  const [board, setBoard] = useState<Board>('city');
  const rows = leaderboard(state, board);
  const top = rows.slice(0, TOP);
  const mine = rows.find((r) => r.user.id === ME)!;
  const pinned = mine.place > TOP;

  return (
    <View style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <LargeTitle right={<RoundButton icon="search" label="Find cooks" onPress={() => router.push('/search')} />}>Leaderboard</LargeTitle>
      <View style={{ paddingHorizontal: MARGIN, paddingTop: 14 }}>
        <Segmented<Board>
          value={board}
          onChange={setBoard}
          options={[{ value: 'city', label: me.city || 'City' }, { value: 'country', label: me.country || 'Country' }, { value: 'world', label: 'World' }]}
        />
      </View>
      <Text style={[s.cap, { color: c.ink2 }]}>Ranked by mastery points: each recipe’s difficulty × its cooks, added up.</Text>
      <FlatList
        data={top}
        keyExtractor={(r) => r.user.id}
        renderItem={({ item }) => <Row row={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      {pinned && (
        <View style={[s.you, { borderTopColor: c.rule, backgroundColor: c.ground }]}>
          <Row row={mine} />
        </View>
      )}
    </View>
  );
}

function Row({ row }: { row: BoardRow }) {
  const c = useColors();
  const { user, points, cooks, place } = row;
  const isMe = user.id === ME;
  const top = topDish(user.counts);
  return (
    <Pressable
      onPress={() => router.push(isMe ? '/profile' : `/user/${user.id}`)}
      style={({ pressed }) => [s.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Display size={place <= 3 ? 24 : 20} style={{ width: 30, textAlign: 'center', lineHeight: 26 }}>{place}</Display>
      <Avatar photo={user.avatar} name={user.name} size={44} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }} numberOfLines={1}>{user.handle}{isMe ? ' · you' : ''}</Text>
        <Text style={{ fontSize: 13, lineHeight: 18, color: c.ink2 }} numberOfLines={2}>
          {RANKS[currentRank(user.counts)]}{top ? ` · ${top.name}` : ''}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink, fontVariant: ['tabular-nums'] }}>{points.toLocaleString()}</Text>
        <Text style={{ fontSize: 12, color: c.ink2, fontVariant: ['tabular-nums'] }}>{cooks.toLocaleString()} cooks</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  cap: { fontSize: 13, lineHeight: 18, paddingHorizontal: MARGIN, paddingTop: 12, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 9 },
  you: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 4 },
});
