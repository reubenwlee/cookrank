import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { timeAgo } from '@/game/view';
import { useStore } from '@/store/store';
import { Avatar, BackButton, Empty, RoundButton } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

export default function Messages() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useStore();
  const threads = [...state.threads].sort((a, b) => (b.messages.at(-1)?.at ?? '').localeCompare(a.messages.at(-1)?.at ?? ''));
  return (
    <View style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <BackButton />
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>Messages</Text>
        <RoundButton icon="addp" label="New message" onPress={() => router.push('/search')} />
      </View>
      <FlatList
        data={threads}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Empty title="No messages yet" body="Message a cook from their profile or a post." />}
        renderItem={({ item }) => {
          const u = state.users[item.userId];
          const last = item.messages.at(-1);
          return (
            <Pressable onPress={() => router.push(`/messages/${item.userId}`)} style={({ pressed }) => [s.row, { opacity: pressed ? 0.7 : 1 }]}>
              <Avatar photo={u?.avatar} name={u?.name} size={52} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{u?.handle}</Text>
                <Text style={{ fontSize: 15, color: c.ink2 }} numberOfLines={1}>
                  {last ? `${last.from === 'me' ? 'You: ' : ''}${last.text} · ${timeAgo(last.at)}` : ''}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 10 },
});
