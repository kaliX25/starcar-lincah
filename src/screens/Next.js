import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Chip, Impact, Header, Bar, Btn, Row, C, rp } from '../ui';

export default function Next() {
  const [soh, setSoh] = useState(94);
  const [issued, setIssued] = useState(false);
  const price = 420e6;
  const buyback = price * 0.65;
  const grade = soh >= 90 ? 'A' : soh >= 80 ? 'B' : 'C';

  return (
    <View>
      <Header letter="N" word="Next" problem="49% konsumen takut harga jual kembali anjlok." />
      <Card>
        <H>Kesehatan baterai (saat servis)</H>
        <Sub>Pilih hasil cek SoH untuk simulasi sertifikat digital.</Sub>
        <Row>
          {[96, 94, 88, 82].map((v) => (
            <Chip key={v} label={`${v}%`} active={soh === v} onPress={() => { setSoh(v); setIssued(false); }} />
          ))}
        </Row>
        <Bar pct={soh} color={soh >= 90 ? C.primary : C.accent} />
        <Text style={{ color: C.ink, marginTop: 6 }}>Grade baterai: <Text style={{ fontWeight: '800' }}>{grade}</Text> · SoH {soh}%</Text>
        <Btn title={issued ? 'Sertifikat diterbitkan ✓' : 'Terbitkan sertifikat digital'} onPress={() => setIssued(true)} />
      </Card>

      {issued && (
        <Card style={{ borderColor: C.primary }}>
          <H>Sertifikat Baterai Star Car</H>
          <Text style={{ color: C.ink }}>No: SC-BAT-{soh}-2026</Text>
          <Text style={{ color: C.ink }}>Kondisi: Grade {grade} ({soh}% kapasitas)</Text>
          <Text style={{ color: C.mute, marginTop: 4, fontSize: 12 }}>
            Risiko dibagi dengan mitra asuransi · dijual sebagai mobil bekas bersertifikat.
          </Text>
        </Card>
      )}

      <Card>
        <H>Jaminan buyback 3 tahun</H>
        <Text style={{ color: C.ink }}>Harga beli: {rp(price)}</Text>
        <Text style={{ color: C.ink, fontWeight: '700' }}>Nilai jual kembali dijamin 65%: {rp(buyback)}</Text>
        <Text style={{ color: C.primaryDark, marginTop: 6 }}>
          Bisa jadi DP EV berikutnya: {rp(buyback)} (cukup untuk DP 30% model Rp420 jt berikutnya)
        </Text>
      </Card>
      <Impact>Resale dijamin 65% · Konsumen ragu 49% → 30% · Trade-in +20%</Impact>
    </View>
  );
}
