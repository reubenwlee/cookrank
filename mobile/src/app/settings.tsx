import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useMe, useStore } from '@/store/store';
import { CityPicker, Field, cleanHandle } from '@/ui/Fields';
import { Avatar, BackButton, Button } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

export default function Settings() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();
  const me = useMe();
  const [name, setName] = useState(me.name);
  const [handle, setHandle] = useState(me.handle);
  const [bio, setBio] = useState(me.bio);

  const save = () => {
    dispatch({ type: 'profile', patch: { name: name.trim() || me.name, handle: handle.length >= 3 ? handle : me.handle, bio: bio.trim() } });
  };

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6 }).catch(() => null);
    if (res && !res.canceled && res.assets[0]) dispatch({ type: 'profile', patch: { avatar: { kind: 'uri', uri: res.assets[0].uri } } });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <View style={s.nav}>
        <BackButton />
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>Profile and settings</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: MARGIN, paddingBottom: insets.bottom + 40, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', gap: 10 }}>
          <Avatar photo={me.avatar} name={me.name} size={86} />
          <Button title="Change photo" onPress={pickAvatar} />
        </View>
        <Field label="Name" value={name} onChangeText={setName} onEndEditing={save} />
        <Field label="Username" value={handle} onChangeText={(t) => setHandle(cleanHandle(t))} onEndEditing={save} autoCapitalize="none" autoCorrect={false} />
        <Field label="Bio" value={bio} onChangeText={(t) => setBio(t.slice(0, 150))} onEndEditing={save} multiline style={{ height: 88, paddingTop: 12 }} />
        <Button title="Save profile" kind="primary" onPress={() => { save(); Alert.alert('Saved'); }} />

        <Text style={[s.h, { color: c.ink }]}>Home city</Text>
        <CityPicker value={me.city} onChange={(city) => dispatch({ type: 'profile', patch: { city } })} />

        <Text style={[s.h, { color: c.ink }]}>Prototype</Text>
        <View style={[s.group, { backgroundColor: c.raised }]}>
          <Toggle
            label="Preview the Create tab"
            sub="It normally appears only for the top 10 in your country or the world."
            value={state.settings.previewCreate}
            onChange={(v) => dispatch({ type: 'setting', key: 'previewCreate', value: v })}
          />
          <Toggle
            label="Ignore the 10 cooks a day limit"
            sub="For testing tier-ups quickly."
            value={state.settings.ignoreDailyLimit}
            onChange={(v) => dispatch({ type: 'setting', key: 'ignoreDailyLimit', value: v })}
            divider
          />
        </View>
        <Button
          title="Sign out and reset"
          onPress={() =>
            Alert.alert('Reset CookRank?', 'This deletes everything on this phone and returns to the welcome screen.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'reset' }) },
            ])
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Toggle({ label, sub, value, onChange, divider }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void; divider?: boolean }) {
  const c = useColors();
  return (
    <View style={[s.row, divider && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.rule }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, color: c.ink }}>{label}</Text>
        <Text style={{ fontSize: 13, color: c.ink2, marginTop: 2 }}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.accent }} />
    </View>
  );
}

const s = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  h: { fontSize: 20, fontWeight: '700', marginTop: 20 },
  group: { borderRadius: 22, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
});
