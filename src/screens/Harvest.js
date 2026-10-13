import React from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Impact, Header, Bar, C } from '../ui';

const STAGES = [
  { t: 'Dikumpulkan dari Next', n: 120, done: true },
  { t: 'Dipakai ulang di stasiun Charge', n: 84, done: true },
  { t: 'Didaur ulang', n: 36, done: false },
];
const SUPPLIERS = [
  { n: 'PT Sel Baterai Nusantara', pct: 100 },
  { n: 'PT Logam Hijau', pct: 82 },
  { n: 'CV Plastik Daur', pct: 55 },
];

export default function Harvest() {
  return (
    <View>
      <Header letter="H" word="Harvest" problem="Emisi supplier tidak terukur dan baterai bekas belum dikelola." />
      <Card>
        <H>Siklus baterai bekas</H>
        <Sub>Baterai bekas masih menyimpan hingga 80% kapasitas awal.</Sub>
        {STAGES.map((s) => (
          <View key={s.t} style={{ marginBottom: 8 }}>
            <Text style={{ color: C.ink, fontWeight: '600', marginBottom: 4 }}>{s.done ? '✓ ' : '• '}{s.t}: {s.n} unit</Text>
            <Bar pct={(s.n / 120) * 100} color={s.done ? C.primary : C.accent} />
          </View>
        ))}
        <Text style={{ color: C.mute, fontSize: 12 }}>Setiap baterai punya ID & tertelusur. (Data demo)</Text>
      </Card>
      <Card>
        <H>Pelaporan emisi supplier</H>
        {SUPPLIERS.map((s) => (
          <View key={s.n} style={{ marginBottom: 8 }}>
            <Text style={{ color: C.ink, marginBottom: 4 }}>{s.n}: {s.pct}%</Text>
            <Bar pct={s.pct} color={s.pct === 100 ? C.primary : C.accent} />
          </View>
        ))}
        <Text style={{ color: C.mute, fontSize: 12 }}>Template emisi standar. Rata-rata 79%, target 100%. (Data demo)</Text>
      </Card>
      <Impact>Pelaporan supplier 68% → 100% · Biaya penyimpanan energi -40% · 100% baterai tertelusur</Impact>
    </View>
  );
}
