import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Btn, Chip, Impact, Header, Label, Row, C, rp } from '../ui';

const MODELS = [
  { name: 'Star City', price: 285e6, range: 320, seats: 4, note: 'Compact, lincah di dalam kota' },
  { name: 'Star Family', price: 420e6, range: 450, seats: 7, note: 'Keluarga besar, bagasi luas' },
  { name: 'Star Cruiser', price: 560e6, range: 600, seats: 5, note: 'Jarak jauh, fast charging' },
];

export default function Learn() {
  const [km, setKm] = useState(40);
  const [seats, setSeats] = useState(4);
  const [home, setHome] = useState(true);
  const [budget, setBudget] = useState(450e6);
  const [res, setRes] = useState(null);
  const [td, setTd] = useState(false);

  const recommend = () => {
    const need = km * 3; // buffer 3 hari pemakaian
    let pool = MODELS.filter((m) => m.seats >= seats && m.price <= budget * 1.1);
    if (!pool.length) pool = MODELS.filter((m) => m.seats >= seats);
    const pick = pool.find((m) => m.range >= need) || pool[pool.length - 1];
    const monthly = (pick.price * 0.85 * 1.09) / 60;
    setRes({ pick, monthly, dp: pick.price * 0.15, extra: km > 80 });
    setTd(false);
  };

  return (
    <View>
      <Header letter="L" word="Learn" ai problem="35% batal setelah test drive karena penawaran tidak sesuai kebutuhan." />
      <Card>
        <H>Ceritakan kebutuhan Anda</H>
        <Sub>AI advisor memakai profil CRM + rute harian untuk menyusun paket personal.</Sub>
        <Label>Jarak harian</Label>
        <Row>{[20, 40, 80, 120].map((v) => <Chip key={v} label={`${v} km`} active={km === v} onPress={() => setKm(v)} />)}</Row>
        <Label>Penumpang</Label>
        <Row>{[2, 4, 5, 7].map((v) => <Chip key={v} label={`${v} orang`} active={seats === v} onPress={() => setSeats(v)} />)}</Row>
        <Label>Budget</Label>
        <Row>{[300e6, 450e6, 600e6].map((v) => <Chip key={v} label={rp(v)} active={budget === v} onPress={() => setBudget(v)} />)}</Row>
        <Label>Bisa pasang charger di rumah?</Label>
        <Row>
          <Chip label="Ya" active={home} onPress={() => setHome(true)} />
          <Chip label="Tidak" active={!home} onPress={() => setHome(false)} />
        </Row>
        <Btn title="Rekomendasikan paket" onPress={recommend} />
      </Card>

      {res && (
        <Card style={{ borderColor: C.primary }}>
          <H>Paket untuk Anda: {res.pick.name}</H>
          <Sub>{res.pick.note} · jangkauan {res.pick.range} km · {res.pick.seats} kursi</Sub>
          <Text style={{ color: C.ink }}>Harga: {rp(res.pick.price)}</Text>
          <Text style={{ color: C.ink }}>DP 15%: {rp(res.dp)}</Text>
          <Text style={{ color: C.ink, fontWeight: '700' }}>Cicilan 60 bln: ±{rp(res.monthly)}/bln</Text>
          <Text style={{ color: C.ink, marginTop: 6 }}>
            Charging: {home ? 'wallbox rumah (hemat, isi malam hari)' : 'booking slot charger umum via aplikasi'}
            {res.extra && home ? ' + paket charger umum untuk perjalanan jauh' : ''}
          </Text>
          <Btn kind="ghost" title={td ? 'Test drive dijadwalkan ✓' : 'Jadwalkan test drive di rute harian'} onPress={() => setTd(true)} />
        </Card>
      )}
      <Impact>Drop-off 35% → 25% · Konversi +12% · CAC Rp8,5 jt → Rp6,4 jt</Impact>
    </View>
  );
}
