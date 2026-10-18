import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { CITIES } from '@/data/seed';
import { Icon } from './Icon';
import { MARGIN, useColors } from './theme';

export function Field({ label, ...props }: { label: string } & TextInputProps) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, color: c.ink2 }}>{label}</Text>
      <TextInput placeholderTextColor={c.ink3} {...props} style={[s.input, { backgroundColor: c.raised, color: c.ink }, props.style]} />
    </View>
  );
}

/** Home city, which decides the city and country leaderboards. */
export function CityPicker({ value, onChange }: { value: string; onChange: (city: string) => void }) {
  const c = useColors();
  return (
    <View style={[s.group, { backgroundColor: c.raised }]}>
      {CITIES.map((x, i) => {
        const on = x.city === value;
        return (
          <Pressable key={x.city} onPress={() => onChange(x.city)} style={[s.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.rule }]}>
            <Text style={{ flex: 1, fontSize: 17, color: c.ink }}>{x.city}</Text>
            <Text style={{ fontSize: 15, color: c.ink2 }}>{x.country}</Text>
            <View style={{ width: 24, alignItems: 'flex-end' }}>{on ? <Icon name="check" size={20} color={c.accent} strokeWidth={2.2} /> : null}</View>
          </Pressable>
        );
      })}
    </View>
  );
}

export const cleanHandle = (s: string) => s.toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 24);

const s = StyleSheet.create({
  input: { height: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 17 },
  group: { borderRadius: 22, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 16 },
});

export { MARGIN };
