import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { familyCount, rootOf } from '@/game/rules';
import { useStore } from '@/store/store';
import { BackButton, Button } from '@/ui/kit';
import { ProfileBody } from '@/ui/Profile';
import { useColors } from '@/ui/theme';

export default function UserScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const user = state.users[id];
  if (!user) return null;
  const following = state.following.includes(user.id);
  // Seeded cooks pin their five biggest recipe families.
  const pins = Object.keys(user.counts)
    .map((rid) => rootOf(rid).id)
    .filter((rid, i, a) => a.indexOf(rid) === i)
    .sort((a, b) => familyCount(b, user.counts) - familyCount(a, user.counts))
    .slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <BackButton />
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>{user.handle}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <ProfileBody
          user={user}
          pins={pins}
          actions={
            <>
              <Button title={following ? 'Following' : 'Follow'} kind={following ? 'secondary' : 'primary'} style={{ flex: 1 }} onPress={() => dispatch({ type: 'follow', userId: user.id })} />
              <Button title="Message" style={{ flex: 1 }} onPress={() => router.push(`/messages/${user.id}`)} />
            </>
          }
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
});
