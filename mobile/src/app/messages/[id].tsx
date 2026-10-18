import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/store/store';
import { Avatar, BackButton } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

export default function Chat() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);
  const user = state.users[id];
  const thread = state.threads.find((t) => t.userId === id);
  if (!user) return null;

  const send = () => {
    if (!text.trim()) return;
    dispatch({ type: 'message', userId: id, text });
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={[s.nav, { borderBottomColor: c.rule }]}>
        <BackButton />
        <Pressable onPress={() => router.push(`/user/${id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginLeft: 8 }}>
          <Avatar photo={user.avatar} name={user.name} size={32} />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{user.name}</Text>
            <Text style={{ fontSize: 12, color: c.ink2 }}>@{user.handle}</Text>
          </View>
        </Pressable>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 16, gap: 6 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        {!thread && <Text style={{ color: c.ink2, fontSize: 15, textAlign: 'center', paddingVertical: 32 }}>Start a conversation with {user.handle}.</Text>}
        {thread?.messages.map((m, i) => {
          const mine = m.from === 'me';
          return (
            <View key={i} style={[s.bubble, mine ? { alignSelf: 'flex-end', backgroundColor: c.accent } : { alignSelf: 'flex-start', backgroundColor: c.raised }]}>
              <Text style={{ fontSize: 15, lineHeight: 20, color: mine ? c.onAccent : c.ink }}>{m.text}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={[s.input, { borderTopColor: c.rule, paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={c.ink2}
          style={[s.field, { borderColor: c.rule, color: c.ink }]}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable onPress={send} disabled={!text.trim()} hitSlop={8}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: c.accent, opacity: text.trim() ? 1 : 0.4 }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  nav: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  field: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 },
});
