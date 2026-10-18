import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { timeAgo } from '@/game/view';
import { ME, useMe, useStore } from '@/store/store';
import { Avatar, BackButton } from '@/ui/kit';
import { PostCard } from '@/ui/PostCard';
import { MARGIN, useColors } from '@/ui/theme';

export default function PostScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const me = useMe();
  const [text, setText] = useState('');
  const post = state.posts.find((p) => p.id === id);
  if (!post) return null;
  const owner = state.users[post.userId];
  const comments = state.comments.filter((x) => x.postId === post.id);

  const send = () => {
    if (!text.trim()) return;
    dispatch({ type: 'comment', postId: post.id, text });
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <BackButton />
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>Post</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <PostCard post={post} full />
        <View style={[s.sep, { borderTopColor: c.rule }]}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>Comments</Text>
        </View>
        {comments.length === 0 && <Text style={{ color: c.ink2, fontSize: 15, paddingHorizontal: MARGIN, paddingVertical: 12 }}>No comments yet. Say something nice.</Text>}
        {comments.map((cm) => {
          const u = state.users[cm.userId];
          return (
            <View key={cm.id} style={s.cm}>
              <Pressable onPress={() => router.push(cm.userId === ME ? '/profile' : `/user/${cm.userId}`)}>
                <Avatar photo={u?.avatar} name={u?.name} size={34} />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: c.ink }}>
                  {u?.handle ?? 'someone'} <Text style={{ fontWeight: '400', color: c.ink2 }}>{timeAgo(cm.createdAt)}</Text>
                </Text>
                <Text style={{ fontSize: 15, lineHeight: 20, color: c.ink, marginTop: 1 }}>{cm.text}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
      <View style={[s.input, { borderTopColor: c.rule, paddingBottom: insets.bottom + 10 }]}>
        <Avatar photo={me.avatar} name={me.name} size={34} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={`Add a comment for ${owner?.handle ?? 'them'}`}
          placeholderTextColor={c.ink2}
          style={[s.field, { borderColor: c.rule, color: c.ink }]}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable onPress={send} disabled={!text.trim()} hitSlop={8}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: c.accent, opacity: text.trim() ? 1 : 0.4 }}>Post</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  sep: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: MARGIN, paddingTop: 16, paddingBottom: 4 },
  cm: { flexDirection: 'row', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 10 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  field: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 },
});
