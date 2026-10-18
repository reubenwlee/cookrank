import { File, Directory, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECIPE_BY_ID } from '@/data/recipes';
import type { Photo } from '@/data/seed';
import { DAILY_COOK_LIMIT, nextTier, tierFor } from '@/game/rules';
import { coverOf } from '@/game/view';
import { cooksToday, useMe, useStore } from '@/store/store';
import { Icon } from '@/ui/Icon';
import { FramedPhoto } from '@/ui/kit';
import { SAMPLE_KEYS, photoSource } from '@/ui/photos';
import { MARGIN, useColors } from '@/ui/theme';

const MAX = 150;

/** Copy a picked photo out of the picker's cache so it survives restarts. */
function keep(uri: string): string {
  if (Platform.OS === 'web') return uri;
  try {
    const dir = new Directory(Paths.document, 'cooks');
    if (!dir.exists) dir.create();
    const dest = new File(dir, `${Date.now()}.jpg`);
    new File(uri).copy(dest);
    return dest.uri;
  } catch {
    return uri;
  }
}

export default function NewCook() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const me = useMe();
  const recipe = RECIPE_BY_ID[id];
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [text, setText] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  if (!recipe) return null;

  const count = me.counts[id] ?? 0;
  const n = count + 1;
  const nt = nextTier(n);
  const today = cooksToday(state, id);

  const pick = async (from: 'camera' | 'library') => {
    try {
      if (from === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Camera is off', 'Allow camera access in Settings to photograph your dish, or pick one from your library.');
          return;
        }
      }
      const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.7 };
      const res = from === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
      if (!res.canceled && res.assets[0]) setPhoto({ kind: 'uri', uri: keep(res.assets[0].uri) });
    } catch {
      Alert.alert('No camera here', 'This device can’t open the camera. Pick a photo from your library or use a sample.');
    }
  };

  const post = () => {
    if (!photo) return;
    dispatch({ type: 'cook', recipeId: id, photo, description: text });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground }}>
      <View style={[s.bar, { paddingTop: Platform.OS === 'ios' ? 8 : insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ height: 44, justifyContent: 'center' }}>
          <Text style={{ fontSize: 17, color: c.ink }}>Cancel</Text>
        </Pressable>
        <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink }}>New cook</Text>
        <Pressable onPress={post} disabled={!photo} style={[s.post, { backgroundColor: c.accent, opacity: photo ? 1 : 0.4 }]}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: c.onAccent }}>Post</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <View style={s.rec}>
          <FramedPhoto tier={tierFor(count).key} photo={coverOf(recipe)} size={48} radius={10} pad={2} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{recipe.name}</Text>
            <Text style={{ fontSize: 13, color: c.ink2 }}>
              Cook #{n}{nt ? ` · ${nt.remaining === 0 ? '' : `${nt.remaining} more after this for ${nt.tier.name.toLowerCase()}`}` : ''}
              {tierFor(n).min > tierFor(count).min ? ` · this one makes it ${tierFor(n).name.toLowerCase()}` : ''}
            </Text>
          </View>
        </View>

        {photo ? (
          <Pressable onPress={() => setPhoto(null)} style={{ marginHorizontal: 16 }}>
            <Image source={photoSource(photo)} style={{ width: '100%', aspectRatio: 4 / 5, borderRadius: 22 }} contentFit="cover" />
          </Pressable>
        ) : (
          <View style={[s.empty, { borderColor: c.ink3 }]}>
            <Icon name="cam" size={32} color={c.ink2} />
            <Text style={{ fontSize: 15, color: c.ink2, textAlign: 'center' }}>Add a photo of what you cooked.{'\n'}It’s what makes the cook count.</Text>
          </View>
        )}

        <View style={s.btns}>
          <Pill icon="cam" label={photo ? 'Retake' : 'Camera'} onPress={() => pick('camera')} />
          <Pill icon="photo" label="Library" onPress={() => pick('library')} />
          <Pill label="Sample photo" onPress={() => setShowSamples((x) => !x)} />
        </View>
        {showSamples && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 12 }}>
            {SAMPLE_KEYS.map((k) => (
              <Pressable key={k} accessibilityLabel={`Sample photo ${k}`} onPress={() => { setPhoto({ kind: 'asset', key: k }); setShowSamples(false); }}>
                <Image source={photoSource({ kind: 'asset', key: k })} style={{ width: 64, height: 64, borderRadius: 10 }} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <TextInput
          value={text}
          onChangeText={(t) => setText(t.slice(0, MAX))}
          placeholder="Say something about it (optional)"
          placeholderTextColor={c.ink2}
          multiline
          maxLength={MAX}
          style={[s.desc, { color: c.ink, borderTopColor: c.rule }]}
        />
        <View style={s.meta}>
          <Text style={{ fontSize: 13, color: c.ink2 }}>
            Today’s {ordinal(today + 1)} of {DAILY_COOK_LIMIT} cooks of this recipe
          </Text>
          <Text style={{ fontSize: 13, color: c.ink2 }}>{text.length} / {MAX}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Pill({ icon, label, onPress }: { icon?: 'cam' | 'photo'; label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.pill, { backgroundColor: c.raised, opacity: pressed ? 0.7 : 1 }]}>
      {icon ? <Icon name={icon} size={18} color={c.ink} /> : null}
      <Text style={{ fontSize: 15, fontWeight: '500', color: c.ink }}>{label}</Text>
    </Pressable>
  );
}

const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: MARGIN, paddingBottom: 8 },
  post: { height: 44, paddingHorizontal: 20, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  rec: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: MARGIN, paddingVertical: 14 },
  empty: { marginHorizontal: 16, aspectRatio: 4 / 5, borderRadius: 22, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  btns: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12, flexWrap: 'wrap' },
  pill: { height: 44, paddingHorizontal: 16, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8 },
  desc: { marginHorizontal: MARGIN, marginTop: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, fontSize: 17, lineHeight: 23, minHeight: 70, textAlignVertical: 'top' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: MARGIN, paddingTop: 10 },
});
