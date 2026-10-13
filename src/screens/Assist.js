import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Chip, Impact, Header, Btn, Bar, Row, C } from '../ui';

const ITEMS = [
  { t: 'Servis berkala 20.000 km', left: 1200, note: 'Perkiraan 3 minggu lagi' },
  { t: 'Cek cairan pendingin baterai', left: 400, note: 'Disarankan dalam 10 hari' },
  { t: 'Rotasi & tekanan ban', left: 2500, note: 'Sebulan lagi' },
];

export default function Assist() {
  const [mobile, setMobile] = useState(false);
  const [date, setDate] = useState(null);
  const [done, setDone] = useState(false);

  return (
    <View>
      <Header letter="A" word="Assist" problem="Data pelanggan tersebar dan servis masih menunggu rusak." />
      <Card>
        <H>Pengingat servis otomatis</H>
        <Sub>Satu ID pelanggan menyatukan 7 sumber data.</Sub>
        {ITEMS.map((i) => (
          <View key={i.t} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: '700', color: C.ink, marginBottom: 4 }}>{i.t}</Text>
            <Bar pct={100 - i.left / 30} color={i.left < 500 ? C.accent : C.primary} />
            <Text style={{ color: C.mute, fontSize: 12, marginTop: 2 }}>{i.left} km lagi · {i.note}</Text>
          </View>
        ))}
      </Card>
      <Card>
        <H>Booking servis</H>
        <Row>
          {['Sen 20/10', 'Rab 22/10', 'Jum 24/10'].map((d) => (
            <Chip key={d} label={d} active={date === d} onPress={() => { setDate(d); setDone(false); }} />
          ))}
        </Row>
        <Row>
          <Chip label="Datang ke bengkel" active={!mobile} onPress={() => setMobile(false)} />
          <Chip label="Mobile service" active={mobile} onPress={() => setMobile(true)} />
        </Row>
        <Btn title={date ? 'Konfirmasi booking' : 'Pilih tanggal dulu'} onPress={() => date && setDone(true)} />
        {done && (
          <Text style={{ color: C.primaryDark, marginTop: 8, fontWeight: '700' }}>
            ✓ {mobile ? 'Teknisi datang ke rumah' : 'Bengkel Star Car Kuningan'} · {date}
          </Text>
        )}
      </Card>
      <Impact>Biaya maintenance -8% · Kerusakan tak terduga -15% · Retensi servis +20%</Impact>
    </View>
  );
}
