import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export const C = {
  bg: '#F4F7F6', card: '#FFFFFF', ink: '#0F2A24', mute: '#5E726C',
  primary: '#0E9F6E', primaryDark: '#067A54', accent: '#F59E0B', line: '#E2EAE7', danger: '#DC2626',
};

export const rp = (n) => 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

export const H = ({ children }) => <Text style={s.h}>{children}</Text>;

export const Sub = ({ children }) => <Text style={s.sub}>{children}</Text>;

export const Label = ({ children }) => <Text style={s.label}>{children}</Text>;

export const Row = ({ children }) => <View style={s.row}>{children}</View>;

export const Btn = ({ title, onPress, kind = 'primary', style }) => (
  <Pressable onPress={onPress} style={[s.btn, kind === 'ghost' && s.btnGhost, style]}>
    <Text style={[s.btnT, kind === 'ghost' && { color: C.primaryDark }]}>{title}</Text>
  </Pressable>
);

export const Chip = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={[s.chip, active && s.chipOn]}>
    <Text style={[s.chipT, active && { color: '#fff' }]}>{label}</Text>
  </Pressable>
);

export const Bar = ({ pct, color = C.primary }) => (
  <View style={s.barBg}>
    <View style={[s.barFg, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color }]} />
  </View>
);

export const Impact = ({ children }) => (
  <View style={s.impact}>
    <Text style={s.impactT}>Target dampak</Text>
    <Text style={s.impactB}>{children}</Text>
  </View>
);

export const Header = ({ letter, word, ai, problem }) => (
  <View style={s.hdr}>
    <View style={s.letter}><Text style={s.letterT}>{letter}</Text></View>
    <View style={{ flex: 1 }}>
      <Text style={s.hdrT}>{word}{ai ? '  ·  AI' : ''}</Text>
      <Text style={s.hdrP}>{problem}</Text>
    </View>
  </View>
);

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.line },
  h: { fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 8 },
  sub: { fontSize: 13, color: C.mute, marginBottom: 8, lineHeight: 18 },
  label: { fontWeight: '600', color: C.ink, marginTop: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  btn: { backgroundColor: C.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnGhost: { backgroundColor: '#E7F6F0' },
  btnT: { color: '#fff', fontWeight: '700' },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#EEF3F1', marginRight: 8, marginBottom: 8 },
  chipOn: { backgroundColor: C.primary },
  chipT: { color: C.ink, fontWeight: '600', fontSize: 13 },
  barBg: { height: 10, borderRadius: 6, backgroundColor: '#E5ECE9', overflow: 'hidden' },
  barFg: { height: 10, borderRadius: 6 },
  impact: { backgroundColor: '#FFF7E6', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FDE5B0' },
  impactT: { fontSize: 11, fontWeight: '700', color: '#9A6700', textTransform: 'uppercase', marginBottom: 2 },
  impactB: { fontSize: 13, color: C.ink },
  hdr: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  letter: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  letterT: { color: '#fff', fontSize: 24, fontWeight: '800' },
  hdrT: { fontSize: 20, fontWeight: '800', color: C.ink },
  hdrP: { fontSize: 12, color: C.mute, marginTop: 2 },
});
