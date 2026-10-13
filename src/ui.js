import React from 'react';
import { View, Text, Pressable, Modal, ScrollView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, sans } from './theme';

export { Ionicons };

const VARIANTS = {
  display: { fontFamily: serif, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontFamily: serif, fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontFamily: serif, fontSize: 19, lineHeight: 25, fontWeight: '700' },
  body: { fontFamily: sans, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: sans, fontSize: 13, lineHeight: 18 },
  caps: { fontFamily: sans, fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  num: { fontFamily: serif, fontSize: 28, lineHeight: 32, fontWeight: '700' },
};

export function T({ v = 'body', sub, color, style, children, ...rest }) {
  const th = useTheme();
  return <Text {...rest} style={[VARIANTS[v], { color: color || (sub ? th.sub : th.ink) }, style]}>{children}</Text>;
}

export function Card({ children, style, onPress, tone }) {
  const th = useTheme();
  const bg = tone === 'primary' ? th.primarySoft : tone === 'accent' ? th.accentSoft : th.surface;
  const Comp = onPress ? Pressable : View;
  return (
    <Comp onPress={onPress} style={[{ backgroundColor: bg, borderRadius: 22, padding: 18, marginBottom: 14, boxShadow: `0 6px 24px ${th.shadow}` }, style]}>
      {children}
    </Comp>
  );
}

export function Btn({ title, onPress, kind = 'primary', icon, style, disabled }) {
  const th = useTheme();
  const bg = kind === 'primary' ? th.primary : kind === 'soft' ? th.primarySoft : 'transparent';
  const fg = kind === 'primary' ? th.primaryInk : th.primary;
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={({ pressed }) => [{ backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, style]}>
      {icon ? <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 8 }} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: 15, fontFamily: sans }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, icon, tone }) {
  const th = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, marginBottom: 8, backgroundColor: active ? th.primary : tone === 'ghost' ? 'transparent' : th.surface2, borderWidth: tone === 'ghost' ? 1 : 0, borderColor: th.primary }}>
      {icon ? <Ionicons name={icon} size={14} color={active ? th.primaryInk : th.primary} style={{ marginRight: 6 }} /> : null}
      <Text style={{ color: active ? th.primaryInk : tone === 'ghost' ? th.primary : th.ink, fontWeight: '600', fontSize: 13, fontFamily: sans }}>{label}</Text>
    </Pressable>
  );
}

export const Row = ({ children, style }) => <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }, style]}>{children}</View>;

export function Pill({ label, tone = 'primary', icon }) {
  const th = useTheme();
  const map = { primary: [th.primarySoft, th.primary], accent: [th.accentSoft, th.accent], danger: [th.dangerSoft, th.danger], mute: [th.surface2, th.sub] };
  const [bg, fg] = map[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bg, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, alignSelf: 'flex-start' }}>
      {icon ? <Ionicons name={icon} size={12} color={fg} style={{ marginRight: 4 }} /> : null}
      <Text style={{ color: fg, fontSize: 12, fontWeight: '700', fontFamily: sans }}>{label}</Text>
    </View>
  );
}

export function Progress({ pct, color, height = 8 }) {
  const th = useTheme();
  return (
    <View style={{ height, borderRadius: height, backgroundColor: th.surface2, overflow: 'hidden' }}>
      <View style={{ height, width: `${Math.max(2, Math.min(100, pct))}%`, borderRadius: height, backgroundColor: color || th.primary }} />
    </View>
  );
}

export function IconCircle({ name, tone = 'primary', size = 40 }) {
  const th = useTheme();
  const map = { primary: [th.primarySoft, th.primary], accent: [th.accentSoft, th.accent], danger: [th.dangerSoft, th.danger], mute: [th.surface2, th.sub] };
  const [bg, fg] = map[tone];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.5} color={fg} />
    </View>
  );
}

export function Segmented({ options, value, onChange }) {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: th.surface2, borderRadius: 14, padding: 4, marginBottom: 16 }}>
      {options.map((o) => (
        <Pressable key={o.key} onPress={() => onChange(o.key)} style={{ flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: value === o.key ? th.surface : 'transparent', boxShadow: value === o.key ? `0 2px 8px ${th.shadow}` : undefined }}>
          <Text style={{ fontWeight: '700', fontSize: 13, color: value === o.key ? th.ink : th.sub, fontFamily: sans }}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Sheet({ visible, onClose, title, children }) {
  const th = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(8,14,11,0.45)', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 480, maxHeight: '88%', backgroundColor: th.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 10 }}>
          <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: th.line, marginBottom: 12 }} />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
            {title ? <T v="title" style={{ marginBottom: 14 }}>{title}</T> : null}
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const Empty = ({ icon, title, body, children }) => (
  <View style={{ alignItems: 'center', paddingVertical: 36, paddingHorizontal: 12 }}>
    <IconCircle name={icon} size={64} />
    <T v="heading" style={{ marginTop: 16, textAlign: 'center' }}>{title}</T>
    <T v="body" sub style={{ marginTop: 6, textAlign: 'center', marginBottom: 18 }}>{body}</T>
    {children}
  </View>
);
