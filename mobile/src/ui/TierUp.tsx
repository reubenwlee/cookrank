// The signature moment (design/mockup.html, frame 10): the card turns over on
// its vertical axis, lands in the new metal, and one sweep of light crosses
// the foil. Reduce Motion gets a cross-fade with the same haptics.

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Photo } from '@/data/seed';
import type { TierKey } from '@/game/rules';
import { Button, Display, FramedPhoto } from './kit';
import { useColors } from './theme';

const haptic = (f: () => Promise<void>) => {
  if (Platform.OS !== 'web') f().catch(() => {});
};

type Props = {
  visible: boolean; from: TierKey; to: TierKey; toName: string; recipeName: string; count: number; photo?: Photo; extra: string[]; onClose: () => void;
};

export function TierUp(props: Props) {
  const c = useColors();
  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onClose}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} onPress={props.onClose} />
      {/* Mounted fresh each time it opens, so the animation always starts from the old tier. */}
      {props.visible && <Moment {...props} />}
    </Modal>
  );
}

function Moment({ from, to, toName, recipeName, count, photo, extra, onClose }: Props) {
  const c = useColors();
  const [turn] = useState(() => new Animated.Value(0));
  const [sweep] = useState(() => new Animated.Value(0));
  const [label] = useState(() => new Animated.Value(0));
  const [rotateY] = useState(() => turn.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '90deg', '0deg'] }));
  const [translateX] = useState(() => sweep.interpolate({ inputRange: [0, 1], outputRange: [-260, 260] }));
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      if (reduce) {
        setLanded(true);
        Animated.timing(label, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
        return;
      }
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(turn, { toValue: 0.5, duration: 130, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(() => {
        if (cancelled) return;
        setLanded(true);
        Animated.spring(turn, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }).start();
        haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
        Animated.parallel([
          Animated.timing(sweep, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(label, { toValue: 1, duration: 260, delay: 160, useNativeDriver: true }),
        ]).start();
      });
    });
    return () => {
      cancelled = true;
    };
  }, [turn, sweep, label]);

  return (
    <View style={s.center} pointerEvents="box-none">
      <View style={[s.panel, { backgroundColor: c.ground }]}>
        <Animated.View style={{ width: 200, transform: [{ perspective: 800 }, { rotateY }] }}>
          <View style={{ overflow: 'hidden', borderRadius: 22 }}>
            <FramedPhoto tier={landed ? to : from} photo={photo} radius={22} pad={5} />
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateX }, { rotate: '20deg' }] }]}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.75)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                style={{ width: 90, height: 400, marginTop: -100 }}
              />
            </Animated.View>
          </View>
        </Animated.View>
        <Animated.View style={{ opacity: label, alignItems: 'center', marginTop: 24 }}>
          <Display size={52} style={{ textTransform: 'uppercase' }}>{toName}</Display>
          <Text style={{ color: c.ink2, fontSize: 15, marginTop: 6, textAlign: 'center' }}>
            {recipeName} · {count} cooks
          </Text>
          {extra.map((line) => (
            <Text key={line} style={{ color: c.ink, fontSize: 15, fontWeight: '600', marginTop: 10, textAlign: 'center' }}>{line}</Text>
          ))}
        </Animated.View>
        <Button title="Done" kind="primary" onPress={onClose} style={{ alignSelf: 'stretch', marginTop: 28, height: 50, borderRadius: 25 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  panel: { width: '100%', maxWidth: 360, borderRadius: 32, padding: 24, alignItems: 'center' },
});
