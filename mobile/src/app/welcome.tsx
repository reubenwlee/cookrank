import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS } from '@/data/recipes';
import { TIERS } from '@/game/rules';
import { useStore } from '@/store/store';
import { CityPicker, Field, cleanHandle } from '@/ui/Fields';
import { Button, Display } from '@/ui/kit';
import { MARGIN, TIER_SOLID, useColors } from '@/ui/theme';

export default function Welcome() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { dispatch } = useStore();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('Columbus');
  const ok = name.trim().length > 0 && handle.length >= 3;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32, paddingHorizontal: MARGIN }} keyboardShouldPersistTaps="handled">
        <Display size={34}>CookRank</Display>
        <Display size={58} style={{ textTransform: 'uppercase', marginTop: 20, lineHeight: 54 }}>{RANKS[0]}</Display>
        <Text style={[s.p, { color: c.ink2 }]}>
          Everyone starts here. Cook a recipe, post a photo, and it counts. Five cooks makes a card bronze; bronze on three of a rank’s six recipes opens the next rank.
        </Text>
        <View style={s.tiers}>
          {TIERS.slice(1).map((t) => (
            <View key={t.key} style={{ alignItems: 'center', gap: 6 }}>
              <View style={[s.dot, { backgroundColor: TIER_SOLID[t.key] }]} />
              <Text style={{ fontSize: 11, color: c.ink2 }}>{t.min}</Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 16, marginTop: 36 }}>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" />
          <Field label="Username" value={handle} onChangeText={(t) => setHandle(cleanHandle(t))} placeholder="e.g. theo.cooks" autoCapitalize="none" autoCorrect={false} />
        </View>
        <Text style={[s.h, { color: c.ink }]}>Home city</Text>
        <Text style={{ fontSize: 13, color: c.ink2, marginBottom: 10 }}>Your city and country leaderboards.</Text>
        <CityPicker value={city} onChange={setCity} />

        <Button
          title="Start cooking"
          kind="primary"
          disabled={!ok}
          style={s.cta}
          onPress={() => dispatch({ type: 'start', demo: false, profile: { name: name.trim(), handle, city } })}
        />
        <Button
          title="Try it with a demo account"
          style={[s.cta, { marginTop: 10 }]}
          onPress={() => dispatch({ type: 'start', demo: true, profile: { name: 'Theo Marsh', handle: 'theo.cooks', city: 'Columbus', bio: 'Hall B shared kitchen. One pan, one hob that works.' } })}
        />
        <Text style={{ fontSize: 13, color: c.ink2, textAlign: 'center', marginTop: 10 }}>
          The demo starts at College dormer with 89 cooks, friends and a feed.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  p: { fontSize: 17, lineHeight: 23, marginTop: 16 },
  tiers: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  dot: { width: 34, height: 34, borderRadius: 10 },
  h: { fontSize: 20, fontWeight: '700', marginTop: 36, marginBottom: 4 },
  cta: { height: 52, borderRadius: 26, marginTop: 32 },
});
