import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, H, Sub, Chip, Impact, Header, Bar, Label, Row, C, rp } from '../ui';

export default function Installment() {
  const [price, setPrice] = useState(420e6);
  const [dpPct, setDp] = useState(10);
  const [tenor, setTenor] = useState(60);

  const loan = price * (1 - dpPct / 100);
  const install = (loan * (1 + 0.085 * (tenor / 12))) / tenor;
  const fuelPetrol = 1200000;
  const powerEv = 300000;
  const saving = fuelPetrol - powerEv;
  const net = install - saving;
  const petrolTotal = install * 0.62 + fuelPetrol; // mobil bensin sepadan: harga stiker lebih rendah
  const evTotal = install + powerEv;

  return (
    <View>
      <Header letter="I" word="Installment" problem="58% terganjal harga awal karena cicilan dihitung dari harga stiker." />
      <Card>
        <H>Kalkulator TCO bulanan</H>
        <Sub>Cicilan dihitung bersama penghematan BBM.</Sub>
        <Label>Harga mobil</Label>
        <Row>{[285e6, 420e6, 560e6].map((v) => <Chip key={v} label={rp(v)} active={price === v} onPress={() => setPrice(v)} />)}</Row>
        <Label>DP</Label>
        <Row>{[5, 10, 20, 30].map((v) => <Chip key={v} label={`${v}%`} active={dpPct === v} onPress={() => setDp(v)} />)}</Row>
        <Label>Tenor</Label>
        <Row>{[36, 48, 60, 84].map((v) => <Chip key={v} label={`${v} bln`} active={tenor === v} onPress={() => setTenor(v)} />)}</Row>
        <Text style={{ color: C.ink, marginTop: 4 }}>DP: {rp((price * dpPct) / 100)}</Text>
      </Card>

      <Card>
        <H>Total biaya bulanan</H>
        <Text style={{ color: C.mute, marginBottom: 4 }}>Mobil bensin (cicilan + BBM ±Rp1,2 jt)</Text>
        <Bar pct={100} color="#9CA3AF" />
        <Text style={{ color: C.ink, marginBottom: 10, marginTop: 4 }}>{rp(petrolTotal)}</Text>
        <Text style={{ color: C.mute, marginBottom: 4 }}>Star Car EV (cicilan + listrik ±Rp300 rb)</Text>
        <Bar pct={(evTotal / petrolTotal) * 100} />
        <Text style={{ color: C.ink, marginTop: 4, fontWeight: '700' }}>{rp(evTotal)}</Text>
        <Text style={{ color: C.mute, marginTop: 10 }}>
          Cicilan EV {rp(install)} − hemat energi {rp(saving)} = beban bersih {rp(net)}/bln
        </Text>
        <Text style={{ color: C.mute, marginTop: 6, fontSize: 11 }}>Angka ilustrasi untuk demo, bukan penawaran kredit.</Text>
      </Card>
      <Impact>Beban bersih -Rp900 rb/bulan · Konversi +10% · NPL &lt; 2%</Impact>
    </View>
  );
}
