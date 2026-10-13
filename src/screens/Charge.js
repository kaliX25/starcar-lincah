import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Chip, Impact, Header, Btn, Row, C } from '../ui';

const STATIONS = [
  { id: 1, name: 'Mall Kuningan City', km: 1.2, queue: 5, plugs: 8, partner: 'Mitra Mall', slots: ['18:00', '18:30', '19:00'], ai: 92 },
  { id: 2, name: 'SPBU Tebet Raya', km: 3.4, queue: 28, plugs: 2, partner: 'SPBU', slots: ['19:30', '20:00'], ai: 40 },
  { id: 3, name: 'Apartemen Casablanca', km: 4.8, queue: 10, plugs: 6, partner: 'Properti', slots: ['18:15', '19:15', '20:15'], ai: 78 },
];

export default function Charge() {
  const [booked, setBooked] = useState(null);
  const [open, setOpen] = useState(null);

  return (
    <View>
      <Header letter="C" word="Charge" ai problem="42% pengguna sulit cari charger, antre 25–40 menit." />
      <Card>
        <H>Charger terdekat</H>
        <Sub>Skor AI = kecocokan lokasi dengan permintaan & kapasitas. Booking slot untuk menghindari antre.</Sub>
        {STATIONS.map((s) => (
          <View key={s.id} style={{ borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', color: C.ink }}>{s.name}</Text>
              <Text style={{ color: C.mute }}>{s.km} km</Text>
            </View>
            <Text style={{ color: s.queue > 15 ? C.danger : C.primaryDark, marginTop: 2 }}>
              Antre ±{s.queue} menit · {s.plugs} colokan · skor AI {s.ai}
            </Text>
            <Text style={{ color: C.mute, fontSize: 12 }}>Dibangun bersama {s.partner}</Text>
            <Btn kind="ghost" title={open === s.id ? 'Tutup' : 'Pilih slot'} onPress={() => setOpen(open === s.id ? null : s.id)} />
            {open === s.id && (
              <Row>
                {s.slots.map((t) => (
                  <Chip key={t} label={t} active={booked && booked.id === s.id && booked.t === t} onPress={() => setBooked({ id: s.id, t, name: s.name })} />
                ))}
              </Row>
            )}
          </View>
        ))}
      </Card>
      {booked && (
        <Card style={{ borderColor: C.primary }}>
          <H>Booking terkonfirmasi ✓</H>
          <Text style={{ color: C.ink }}>{booked.name} · pukul {booked.t}</Text>
        </Card>
      )}
      <Card>
        <H>Lokasi usulan AI (belum dibangun)</H>
        <Text style={{ color: C.ink }}>• Parkir Stasiun MRT Cipete Raya: permintaan tinggi, 0 SPKLU dalam 2 km</Text>
        <Text style={{ color: C.ink }}>• Rest area Tol Cikampek KM 57: rute mudik padat</Text>
        <Text style={{ color: C.mute, marginTop: 6, fontSize: 12 }}>Dibangun bersama partner agar capex per titik turun 40%.</Text>
      </Card>
      <Impact>Antre ≤15 menit · Kesulitan cari charger 42% → 20% · Capex per titik -40%</Impact>
    </View>
  );
}
