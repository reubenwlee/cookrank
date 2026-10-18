import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { masteryPoints } from '@/game/rules';
import { ME, useMe, useStore } from '@/store/store';
import { Avatar, Button, Empty, RoundButton } from '@/ui/kit';
import { PostCard } from '@/ui/PostCard';
import { ProfileBody } from '@/ui/Profile';
import { MARGIN, useColors } from '@/ui/theme';

type Mode = 'friends' | 'me';

export default function Profile() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('me');
  return (
    <View style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <View style={[s.seg, { backgroundColor: c.raised }]}>
          {(['friends', 'me'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[s.segItem, mode === m && { backgroundColor: c.ink }]}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: mode === m ? c.ground : c.ink2 }}>{m === 'me' ? 'Me' : 'Friends'}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <RoundButton icon="send" label="Messages" onPress={() => router.push('/messages')} />
          {mode === 'me' ? (
            <RoundButton icon="menu" label="Settings" onPress={() => router.push('/settings')} />
          ) : (
            <RoundButton icon="addp" label="Find cooks" onPress={() => router.push('/search')} />
          )}
        </View>
      </View>
      {mode === 'me' ? <Me /> : <Friends />}
    </View>
  );
}

function Me() {
  const { state } = useStore();
  const me = useMe();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <ProfileBody
        user={me}
        pins={state.pinned}
        editPins={() => router.push('/pins')}
        actions={
          <>
            <Button title="Edit profile" style={{ flex: 1 }} onPress={() => router.push('/settings')} />
            <Button
              title="Share profile"
              style={{ flex: 1 }}
              onPress={() => Share.share({ message: `I’m @${me.handle} on CookRank, ${masteryPoints(me.counts)} mastery points and counting.` }).catch(() => {})}
            />
          </>
        }
      />
    </ScrollView>
  );
}

function Friends() {
  const c = useColors();
  const { state, dispatch } = useStore();
  const feed = state.posts.filter((p) => state.following.includes(p.userId));
  const suggestions = Object.values(state.users)
    .filter((u) => u.id !== ME && !state.following.includes(u.id) && u.city === state.users[ME].city)
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);

  if (feed.length === 0) {
    return (
      <ScrollView>
        <Empty title="Follow some cooks" body="Posts from people you follow show up here. These cooks are near you." />
        {suggestions.map((u) => (
          <View key={u.id} style={s.sugg}>
            <Pressable onPress={() => router.push(`/user/${u.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <Avatar photo={u.avatar} name={u.name} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{u.handle}</Text>
                <Text style={{ fontSize: 13, color: c.ink2 }} numberOfLines={1}>{u.bio}</Text>
              </View>
            </Pressable>
            <Button title="Follow" kind="primary" onPress={() => dispatch({ type: 'follow', userId: u.id })} />
          </View>
        ))}
      </ScrollView>
    );
  }
  return <FlatList data={feed} keyExtractor={(p) => p.id} renderItem={({ item }) => <PostCard post={item} />} />;
}

const s = StyleSheet.create({
  nav: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  seg: { flexDirection: 'row', padding: 3, borderRadius: 22, height: 44, width: 184 },
  segItem: { flex: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  sugg: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 8 },
});
