// Shared building blocks: tier frames, recipe tiles, avatars, buttons, headers.

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { Photo } from '@/data/seed';
import type { TierKey } from '@/game/rules';
import { Icon, type IconName } from './Icon';
import { photoSource } from './photos';
import { DISPLAY_FONT, FOIL, FOIL_STOPS, MARGIN, useColors } from './theme';

/** The tier frame: a foil gradient ring around its content, or a hairline for blank. */
export function TierFrame({ tier, radius, pad = 3, style, children }: { tier: TierKey; radius: number; pad?: number; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const c = useColors();
  if (tier === 'blank') {
    return <View style={[{ borderRadius: radius, padding: 1, backgroundColor: c.rule }, style]}>{children}</View>;
  }
  return (
    <LinearGradient colors={FOIL[tier]} locations={FOIL_STOPS} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius, padding: pad }, style]}>
      {children}
    </LinearGradient>
  );
}

/** A square photo inside its tier frame. */
export function FramedPhoto({ tier, photo, radius = 14, pad = 3, size, aspect = 1, style }: { tier: TierKey; photo?: Photo; radius?: number; pad?: number; size?: number; aspect?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const inner = tier === 'blank' ? radius - 1 : radius - pad;
  return (
    <TierFrame tier={tier} radius={radius} pad={pad} style={[size ? { width: size } : null, style]}>
      <Image source={photoSource(photo)} style={{ width: '100%', aspectRatio: aspect, borderRadius: inner, backgroundColor: c.raised }} contentFit="cover" transition={150} />
    </TierFrame>
  );
}

export type TileState = 'cooked' | 'new' | 'locked';

/** A recipe in a grid: framed photo, name, count line. */
export function RecipeTile({ name, tier, photo, state, line, onPress, hideName }: { name: string; tier: TierKey; photo?: Photo; state: TileState; line?: string; onPress?: () => void; hideName?: boolean }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
      {state === 'cooked' ? (
        <FramedPhoto tier={tier} photo={photo} />
      ) : state === 'new' ? (
        <View style={[styles.square, { backgroundColor: c.raised }]}>
          <Icon name="plus" color={c.ink3} />
        </View>
      ) : (
        <View style={[styles.square, { borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.ink3 }]}>
          <Text style={[styles.q, { color: c.ink2 }]}>?</Text>
        </View>
      )}
      {!hideName && (
        <Text style={[styles.tileName, { color: state === 'locked' ? c.ink2 : c.ink }]} numberOfLines={2}>
          {name}
        </Text>
      )}
      {line ? <Text style={[styles.tileLine, { color: c.ink2 }]} numberOfLines={1}>{line}</Text> : null}
    </Pressable>
  );
}

/** Lays children out 3 to a row with even gaps. */
export function Grid3({ children, gap = 10, rowGap = 16 }: { children: ReactNode[]; gap?: number; rowGap?: number }) {
  const rows: ReactNode[][] = [];
  children.forEach((ch, i) => (i % 3 === 0 ? rows.push([ch]) : rows[rows.length - 1].push(ch)));
  return (
    <View style={{ gap: rowGap }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap }}>
          {row}
          {Array.from({ length: 3 - row.length }).map((_, j) => <View key={`f${j}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}

export function Avatar({ photo, size = 44, name }: { photo?: Photo; size?: number; name?: string }) {
  const c = useColors();
  if (!photo) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.raised, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: c.ink2, fontWeight: '600', fontSize: size * 0.38 }}>{(name ?? '?').slice(0, 1).toUpperCase()}</Text>
      </View>
    );
  }
  return <Image source={photoSource(photo)} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.raised }} contentFit="cover" />;
}

/** A 44pt round toolbar button. */
export function RoundButton({ icon, onPress, filled, label }: { icon: IconName; onPress?: () => void; filled?: boolean; label: string }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.round, { backgroundColor: filled ? c.accent : c.raised, opacity: pressed ? 0.7 : 1 }]}
    >
      <Icon name={icon} color={filled ? c.onAccent : c.ink} />
    </Pressable>
  );
}

export function BackButton() {
  return <RoundButton icon="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />;
}

export function Button({ title, onPress, kind = 'secondary', disabled, style }: { title: string; onPress?: () => void; kind?: 'primary' | 'secondary'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const primary = kind === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, { backgroundColor: primary ? c.accent : c.raised, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 }, style]}
    >
      <Text style={{ color: primary ? c.onAccent : c.ink, fontSize: 15, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, on, onPress, icon, muted }: { label: string; on?: boolean; onPress?: () => void; icon?: IconName; muted?: boolean }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { borderColor: on ? c.ink : c.rule, backgroundColor: on ? c.ink : 'transparent' }]}
    >
      {icon ? <Icon name={icon} size={16} color={on ? c.ground : muted ? c.ink2 : c.ink} /> : null}
      <Text style={{ color: on ? c.ground : muted ? c.ink2 : c.ink, fontSize: 15, fontWeight: '500' }}>{label}</Text>
    </Pressable>
  );
}

/** iOS-style segmented control. */
export function Segmented<T extends string>({ options, value, onChange, style }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return (
    <View style={[styles.seg, { backgroundColor: c.raised }, style]}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[styles.segItem, on && { backgroundColor: c.ground, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 }]}>
            <Text style={{ color: c.ink, fontSize: 13, fontWeight: on ? '600' : '500' }} numberOfLines={1}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function LargeTitle({ children, right }: { children: string; right?: ReactNode }) {
  const c = useColors();
  return (
    <View style={styles.ltRow}>
      <Text style={[styles.lt, { color: c.ink }]}>{children}</Text>
      {right}
    </View>
  );
}

/** The condensed display face, used for rank names and big counts. */
export function Display({ children, size, style }: { children: ReactNode; size: number; style?: StyleProp<TextStyle> }) {
  const c = useColors();
  return <Text style={[{ fontFamily: DISPLAY_FONT, fontSize: size, lineHeight: size * 0.95, color: c.ink, letterSpacing: -0.5 }, style]}>{children}</Text>;
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  const c = useColors();
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: c.ink }}>{title}</Text>
      {sub ? <Text style={{ fontSize: 13, lineHeight: 18, color: c.ink2, marginTop: 4 }}>{sub}</Text> : null}
    </View>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  const c = useColors();
  return (
    <View style={{ paddingHorizontal: MARGIN, paddingVertical: 48, alignItems: 'center', gap: 8 }}>
      <Text style={{ fontSize: 17, fontWeight: '600', color: c.ink, textAlign: 'center' }}>{title}</Text>
      {body ? <Text style={{ fontSize: 15, lineHeight: 20, color: c.ink2, textAlign: 'center' }}>{body}</Text> : null}
      {action ? <View style={{ marginTop: 12 }}>{action}</View> : null}
    </View>
  );
}

export const TAB_BAR_SPACE = 110;

export const styles = StyleSheet.create({
  square: { width: '100%', aspectRatio: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  q: { fontFamily: DISPLAY_FONT, fontSize: 32 },
  tileName: { fontSize: 13, lineHeight: 16, fontWeight: '600', marginTop: 8, letterSpacing: -0.1 },
  tileLine: { fontSize: 12, lineHeight: 16, marginTop: 1 },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  btn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  seg: { flexDirection: 'row', padding: 2, borderRadius: 18, height: 36 },
  segItem: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  ltRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: MARGIN, paddingTop: 8 },
  lt: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.4 },
});
