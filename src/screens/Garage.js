import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { T, Card, Btn, Row, Pill, Progress, IconCircle, Segmented, Empty } from '../ui';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import { rp, quote, MODELS } from '../../shared/lincah';
import { dayLabel } from '../util';

function Servis({ car, entries }) {
  const { openSheet } = useNav();
  const th = useTheme();
  const left = car.nextServiceKm - car.odometer;
  const items = [
    { t: 'Servis berkala 20.000 km', km: left, tone: left < 2000 ? 'accent' : 'mute' },
    { t: 'Cek cairan pendingin baterai', km: 400, tone: 'accent' },
    { t: 'Rotasi & tekanan ban', km: 2500, tone: 'mute' },
  ];
  const past = entries.filter((e) => e.kind === 'service');
  return (
    <>
      <T v="body" sub style={{ marginBottom: 14 }}>Bintang memprediksi kebutuhan servis dari odometer dan pola pakai, jadi kamu tidak menunggu rusak.</T>
      {items.map((i) => (
        <Card key={i.t}>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <T v="heading" style={{ fontSize: 16, flex: 1 }}>{i.t}</T>
            <Pill label={`${i.km.toLocaleString('id-ID')} km`} tone={i.tone} />
          </Row>
          <View style={{ marginTop: 10 }}><Progress pct={100 - i.km / 30} color={i.tone === 'accent' ? th.accent : th.primary} /></View>
        </Card>
      ))}
      <Btn title="Booking servis" icon="calendar-outline" onPress={() => openSheet('service')} />
      {past.length ? <T v="caps" sub style={{ marginTop: 22, marginBottom: 10 }}>Riwayat</T> : null}
      {past.map((e) => (
        <Card key={e.id}><T v="heading" style={{ fontSize: 16 }}>{e.title}</T><T v="small" sub>{dayLabel(e.ts)} · {e.body}</T></Card>
      ))}
    </>
  );
}

function Baterai({ car, rec }) {
  const { openSheet } = useNav();
  const grade = car.soh >= 90 ? 'A' : car.soh >= 80 ? 'B' : 'C';
  const model = (rec && rec.model) || MODELS.find((m) => m.id === car.modelId) || MODELS[1];
  const q = quote(model, { dpPct: 10, tenor: 60 });
  return (
    <>
      <Card>
        <T v="caps" sub>Kesehatan baterai</T>
        <Row style={{ alignItems: 'flex-end', marginTop: 4 }}>
          <T v="display" style={{ fontSize: 48, lineHeight: 52 }}>{car.soh}%</T>
          <View style={{ marginBottom: 8, marginLeft: 10 }}><Pill label={`Grade ${grade}`} tone="primary" icon="ribbon-outline" /></View>
        </Row>
        <View style={{ marginVertical: 12 }}><Progress pct={car.soh} height={10} /></View>
        <Btn kind="soft" title={car.certificate ? 'Lihat sertifikat digital' : 'Terbitkan sertifikat digital'} icon="ribbon-outline" onPress={() => openSheet('cert')} />
      </Card>
      <Card tone="primary">
        <Row style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <IconCircle name="shield-checkmark-outline" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <T v="heading">Nilai jual kembali dijamin</T>
            <T v="num" style={{ marginTop: 6 }}>{rp(q.buyback)}</T>
            <T v="body" sub style={{ marginTop: 4 }}>65% dari harga beli {rp(model.price)} setelah 3 tahun. Bisa dipakai sebagai DP EV Star Car berikutnya.</T>
          </View>
        </Row>
      </Card>
      <T v="small" sub>Mobil bekas dijual dengan sertifikat baterai, risikonya dibagi dengan mitra asuransi.</T>
    </>
  );
}

function Dampak({ car }) {
  const th = useTheme();
  const co2 = Math.round(car.odometer * 0.08);
  const stages = [
    { t: 'Baterai bekas dikumpulkan dari Next', n: 120, tone: 'primary' },
    { t: 'Dipakai ulang di stasiun charging', n: 84, tone: 'primary' },
    { t: 'Didaur ulang', n: 36, tone: 'accent' },
  ];
  return (
    <>
      <Card tone="primary">
        <T v="caps" sub>Perkiraan emisi yang kamu hemat</T>
        <T v="display" style={{ marginTop: 4 }}>{co2.toLocaleString('id-ID')} kg CO₂</T>
        <T v="small" sub style={{ marginTop: 4 }}>Dari {car.odometer.toLocaleString('id-ID')} km, asumsi selisih ±0,08 kg/km vs mobil bensin. Perkiraan kasar.</T>
      </Card>
      <T v="caps" sub style={{ marginTop: 10, marginBottom: 10 }}>Di balik layar: baterai bekas</T>
      <Card>
        <T v="small" sub style={{ marginBottom: 12 }}>Baterai bekas masih menyimpan hingga 80% kapasitas, jadi dipakai ulang sebelum didaur ulang. (Data demo)</T>
        {stages.map((s) => (
          <View key={s.t} style={{ marginBottom: 12 }}>
            <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap', marginBottom: 6 }}><T v="small" style={{ flex: 1 }}>{s.t}</T><T v="small" sub>{s.n} unit</T></Row>
            <Progress pct={(s.n / 120) * 100} color={s.tone === 'accent' ? th.accent : th.primary} />
          </View>
        ))}
      </Card>
      <Card>
        <T v="heading" style={{ marginBottom: 8 }}>Pelaporan emisi supplier</T>
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap', marginBottom: 6 }}><T v="small" sub>Sebelum</T><T v="small" sub>Target</T></Row>
        <Progress pct={68} color={th.accent} />
        <T v="small" sub style={{ marginTop: 8 }}>68% supplier melapor, menuju 100% dengan template standar. 100% baterai tertelusur.</T>
      </Card>
    </>
  );
}

export default function Garage() {
  const { state } = useStore();
  const { go } = useNav();
  const [tab, setTab] = useState('servis');
  const car = state.car;
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <T v="caps" sub>Garasi</T>
      <T v="display" style={{ marginTop: 4, marginBottom: 16 }}>{car ? car.name : 'Mobilmu'}</T>
      {!car ? (
        <Empty icon="car-sport-outline" title="Belum ada mobil" body="Setelah test drive dan memilih paket, servis, baterai, dan nilai jual kembali mobilmu muncul di sini.">
          <Btn title="Cari mobil dengan Bintang" icon="sparkles" onPress={() => go('advisor')} />
        </Empty>
      ) : (
        <>
          <Segmented value={tab} onChange={setTab} options={[{ key: 'servis', label: 'Servis' }, { key: 'baterai', label: 'Baterai & Nilai' }, { key: 'dampak', label: 'Dampak' }]} />
          {tab === 'servis' ? <Servis car={car} entries={state.entries} /> : tab === 'baterai' ? <Baterai car={car} rec={state.rec} /> : <Dampak car={car} />}
        </>
      )}
    </ScrollView>
  );
}
