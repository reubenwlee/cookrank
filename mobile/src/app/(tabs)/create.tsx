// Create (MVP+): leaderboard members submit recipes for review. In the
// prototype a submission is stored on the phone with status "In review".

import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RANKS, RECIPES, RECIPE_BY_ID } from '@/data/recipes';
import { isRecipeOpen } from '@/game/rules';
import { useMe, useStore } from '@/store/store';
import { Field } from '@/ui/Fields';
import { Button, Chip, LargeTitle } from '@/ui/kit';
import { MARGIN, useColors } from '@/ui/theme';

export default function Create() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();
  const me = useMe();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [rank, setRank] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const bases = RECIPES.filter((r) => isRecipeOpen(r.id, me.counts)).slice(0, 24);
  const ok = name.trim() && ingredients.trim() && steps.trim();

  const submit = () => {
    dispatch({ type: 'submit', submission: { name: name.trim(), parentId, rank: parentId ? RECIPE_BY_ID[parentId].rank : rank, difficulty, ingredients, steps } });
    setName(''); setIngredients(''); setSteps(''); setParentId(undefined);
    Alert.alert('Sent for review', 'The CookRank team reviews every recipe before it goes live. Once published it stays credited to you.');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <LargeTitle>New recipe</LargeTitle>
        <Text style={[s.note, { color: c.ink2 }]}>
          Leaderboard members can add recipes. Once the team approves it, it stays credited to @{me.handle}, even if you leave the leaderboard.
        </Text>
        <View style={{ paddingHorizontal: MARGIN, gap: 16, paddingTop: 16 }}>
          <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Kimchi butter ramen" />
        </View>

        <Text style={[s.h, { color: c.ink }]}>Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          <Chip label="New base recipe" on={!parentId} onPress={() => setParentId(undefined)} />
          {bases.map((r) => (
            <Chip key={r.id} label={`Variation of ${r.name}`} on={parentId === r.id} onPress={() => setParentId(r.id)} />
          ))}
        </ScrollView>

        {!parentId && (
          <>
            <Text style={[s.h, { color: c.ink }]}>Chef rank</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
              {RANKS.map((r, i) => <Chip key={r} label={r} on={rank === i} onPress={() => setRank(i)} />)}
            </ScrollView>
          </>
        )}

        <Text style={[s.h, { color: c.ink }]}>Difficulty</Text>
        <View style={[s.chips, { flexDirection: 'row' }]}>
          {[1, 2, 3, 4, 5].map((d) => (
            <Pressable key={d} onPress={() => setDifficulty(d)} style={[s.dot, { backgroundColor: d <= difficulty ? c.ink : c.rule }]} accessibilityLabel={`Difficulty ${d}`} />
          ))}
          <Text style={{ color: c.ink2, fontSize: 15, marginLeft: 8 }}>{difficulty} of 5</Text>
        </View>

        <View style={{ paddingHorizontal: MARGIN, gap: 16, paddingTop: 20 }}>
          <Field label="Ingredients, one per line" value={ingredients} onChangeText={setIngredients} multiline style={{ height: 120, paddingTop: 12 }} />
          <Field label="Steps, one per line" value={steps} onChangeText={setSteps} multiline style={{ height: 160, paddingTop: 12 }} />
          <Button title="Submit for review" kind="primary" disabled={!ok} onPress={submit} style={{ height: 52, borderRadius: 26 }} />
        </View>

        {state.submissions.length > 0 && (
          <>
            <Text style={[s.h, { color: c.ink, paddingTop: 36 }]}>Your submissions</Text>
            {state.submissions.map((x) => (
              <View key={x.id} style={[s.sub, { borderBottomColor: c.rule }]}>
                <Text style={{ flex: 1, fontSize: 17, color: c.ink }}>{x.name}</Text>
                <Text style={{ fontSize: 13, color: c.ink2 }}>{x.status}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  note: { fontSize: 13, lineHeight: 18, paddingHorizontal: MARGIN, paddingTop: 6 },
  h: { fontSize: 15, fontWeight: '600', paddingHorizontal: MARGIN, paddingTop: 24, paddingBottom: 10 },
  chips: { gap: 8, paddingHorizontal: MARGIN, alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14 },
  sub: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: MARGIN, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
});
