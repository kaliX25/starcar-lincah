import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Sheet, T, Btn, Chip, Row, Card, Progress, IconCircle, Pill } from './ui';
import { useTheme, sans } from './theme';
import { useStore } from './store';
import { useNav } from './nav';
import { api } from './api';
import { quote, rp } from '../shared/lincah';
import { nextDays, longDate } from './util';

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <T v="caps" sub style={{ marginBottom: 8 }}>{label}</T>
      {children}
    </View>
  );
}

function Done({ title, body, code, children }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <IconCircle name="checkmark" size={64} />
      <T v="title" style={{ marginTop: 14, textAlign: 'center' }}>{title}</T>
      <T v="body" sub style={{ marginTop: 6, textAlign: 'center' }}>{body}</T>
      {code ? <View style={{ marginTop: 12 }}><Pill label={`Kode ${code}`} tone="mute" icon="ticket-outline" /></View> : null}
      <View style={{ width: '100%', marginTop: 18 }}>{children}</View>
    </View>
  );
}

function QuoteSheet({ onClose }) {
  const { state } = useStore();
  const { openSheet } = useNav();
  const th = useTheme();
  const rec = state.rec;
  const [dp, setDp] = useState(10);
  const [tenor, setTenor] = useState(60);
  if (!rec) return null;
  const q = quote(rec.model, { dpPct: dp, tenor });
  const gap = q.gap;
  return (
    <>
      <T v="body" sub style={{ marginBottom: 14 }}>{rec.model.name} · {rp(rec.model.price)}</T>
      <Field label="Uang muka"><Row>{[5, 10, 20, 30].map((v) => <Chip key={v} label={`${v}%`} active={dp === v} onPress={() => setDp(v)} />)}</Row></Field>
      <Field label="Tenor"><Row>{[36, 48, 60, 84].map((v) => <Chip key={v} label={`${v} bln`} active={tenor === v} onPress={() => setTenor(v)} />)}</Row></Field>
      <Card>
        <T v="caps" sub>Cicilan per bulan</T>
        <T v="num" style={{ marginTop: 4 }}>{rp(q.install)}</T>
        <T v="small" sub style={{ marginTop: 2 }}>DP {rp(q.dp)}</T>
        <View style={{ height: 1, backgroundColor: th.line, marginVertical: 14 }} />
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <T v="body" sub>Hemat energi (bensin → listrik)</T><T v="body" color={th.primary} style={{ fontWeight: '700' }}>−{rp(q.saving)}</T>
        </Row>
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap', marginTop: 6 }}>
          <T v="body" style={{ fontWeight: '700' }}>Beban bersih</T><T v="body" style={{ fontWeight: '700' }}>{rp(q.net)}</T>
        </Row>
      </Card>
      <Card>
        <T v="heading" style={{ marginBottom: 12 }}>Total biaya bulanan vs bensin sekelas</T>
        <T v="small" sub style={{ marginBottom: 4 }}>Mobil bensin (asumsi harga 78% EV, BBM ±Rp1,2 jt)</T>
        <Progress pct={100} color={th.sub} />
        <T v="small" style={{ marginTop: 4, marginBottom: 12 }}>{rp(q.petrolTotal)}</T>
        <T v="small" sub style={{ marginBottom: 4 }}>{rec.model.name} (listrik ±Rp300 rb)</T>
        <Progress pct={(q.evTotal / Math.max(q.petrolTotal, q.evTotal)) * 100} />
        <T v="small" style={{ marginTop: 4 }}>{rp(q.evTotal)}</T>
        <T v="small" sub style={{ marginTop: 12 }}>
          {gap <= 0 ? `Lebih hemat ${rp(-gap)} per bulan.` : `Selisih ${rp(gap)} per bulan; mengecil bila DP lebih besar atau tenor lebih panjang.`} Angka ilustrasi, bukan penawaran kredit.
        </T>
      </Card>
      <Card tone="primary">
        <Row style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <IconCircle name="shield-checkmark-outline" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <T v="heading">Buyback dijamin 65%</T>
            <T v="body" sub style={{ marginTop: 2 }}>Setelah 3 tahun nilainya {rp(q.buyback)}, bisa jadi DP EV berikutnya.</T>
          </View>
        </Row>
      </Card>
      <Btn title="Jadwalkan test drive" icon="calendar-outline" onPress={() => { onClose(); setTimeout(() => openSheet('testdrive'), 250); }} />
    </>
  );
}

function TestDriveSheet({ onClose }) {
  const { state, actions } = useStore();
  const { go } = useNav();
  const days = nextDays(5, 1);
  const [day, setDay] = useState(days[0]);
  const [route, setRoute] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const th = useTheme();
  const rec = state.rec;

  const confirm = async () => {
    setBusy(true);
    const r = await api.book({ kind: 'testdrive', date: day.ts, route });
    actions.addEntry('testdrive', `Test drive ${rec ? rec.model.name : 'Star Car'}`, `${day.label}${route ? ' · rute ' + route : ' · rute harianmu'}`, { code: r.code });
    setRes(r); setBusy(false);
  };

  if (res) {
    return (
      <Done title="Test drive terjadwal" body={`${day.label} · kami ikuti rute harianmu`} code={res.code}>
        {!state.car && rec ? (
          <Btn title="Lanjut jadi pemilik (demo)" icon="key-outline" onPress={() => { actions.adoptCar(rec); onClose(); go('today'); }} />
        ) : null}
        <Btn kind="ghost" title="Tutup" onPress={onClose} />
      </Done>
    );
  }
  return (
    <>
      <T v="body" sub style={{ marginBottom: 16 }}>Test drive di rute yang kamu lewati tiap hari, supaya terasa seperti pemakaian sebenarnya.</T>
      <Field label="Tanggal"><Row>{days.map((d) => <Chip key={d.ts} label={d.label} active={day.ts === d.ts} onPress={() => setDay(d)} />)}</Row></Field>
      <Field label="Rute harian (opsional)">
        <TextInput value={route} onChangeText={setRoute} placeholder="mis. Bekasi → Sudirman" placeholderTextColor={th.sub} style={{ backgroundColor: th.surface, color: th.ink, borderRadius: 14, padding: 14, fontSize: 15, fontFamily: sans }} />
      </Field>
      <Btn title={busy ? 'Menjadwalkan…' : 'Konfirmasi'} onPress={confirm} disabled={busy} />
    </>
  );
}

function ServiceSheet({ onClose }) {
  const { state, actions } = useStore();
  const days = nextDays(5, 3);
  const [day, setDay] = useState(days[0]);
  const [mobile, setMobile] = useState(false);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    const r = await api.book({ kind: 'service', date: day.ts, mobile });
    actions.addEntry('service', 'Servis berkala dijadwalkan', `${day.label} · ${mobile ? 'Mobile service ke rumah' : 'Bengkel Star Car Kuningan'}`, { code: r.code });
    setRes(r); setBusy(false);
  };
  if (res) return <Done title="Servis terjadwal" body={`${day.label} · ${mobile ? 'Teknisi datang ke rumahmu' : 'Bengkel Star Car Kuningan'}`} code={res.code}><Btn title="Selesai" onPress={onClose} /></Done>;
  return (
    <>
      <T v="body" sub style={{ marginBottom: 16 }}>Servis berkala {state.car ? `${state.car.nextServiceKm.toLocaleString('id-ID')} km` : ''}, termasuk cek baterai untuk sertifikat digital.</T>
      <Field label="Tanggal"><Row>{days.map((d) => <Chip key={d.ts} label={d.label} active={day.ts === d.ts} onPress={() => setDay(d)} />)}</Row></Field>
      <Field label="Lokasi">
        <Row>
          <Chip icon="construct-outline" label="Bengkel" active={!mobile} onPress={() => setMobile(false)} />
          <Chip icon="home-outline" label="Mobile service" active={mobile} onPress={() => setMobile(true)} />
        </Row>
      </Field>
      <Btn title={busy ? 'Memproses…' : 'Konfirmasi booking'} onPress={confirm} disabled={busy} />
    </>
  );
}

function ChargeSheet({ station, onClose }) {
  const { actions } = useStore();
  const [slot, setSlot] = useState(null);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const th = useTheme();

  const confirm = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await api.book({ kind: 'charge', stationId: station.id, slot });
      actions.addEntry('booking', `Slot charger ${station.name}`, `Hari ini pukul ${slot} · ${station.kw} kW`, { code: r.code });
      setRes(r);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  if (res) return <Done title="Slot terkonfirmasi" body={`${station.name} · pukul ${slot}`} code={res.code}><Btn title="Selesai" onPress={onClose} /></Done>;
  return (
    <>
      <T v="body" sub style={{ marginBottom: 6 }}>{station.area} · {station.plugs} colokan · {station.kw} kW · mitra {station.partner}</T>
      <View style={{ marginBottom: 16 }}><Pill label={`Perkiraan antre ${station.wait} menit tanpa booking`} tone={station.wait > 15 ? 'danger' : 'primary'} icon="time-outline" /></View>
      <Field label="Pilih jam">
        <Row>{station.slots.map((s) => (
          <Pressable key={s.t} disabled={!s.free} onPress={() => setSlot(s.t)} style={{ opacity: s.free ? 1 : 0.4, marginRight: 8, marginBottom: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, backgroundColor: slot === s.t ? th.primary : th.surface2 }}>
            <T v="body" color={slot === s.t ? th.primaryInk : th.ink} style={{ fontWeight: '700', textDecorationLine: s.free ? 'none' : 'line-through' }}>{s.t}</T>
          </Pressable>
        ))}</Row>
      </Field>
      {err ? <T v="small" color={th.danger} style={{ marginBottom: 10 }}>{err}</T> : null}
      <Btn title={busy ? 'Memproses…' : slot ? `Booking pukul ${slot}` : 'Pilih jam dulu'} disabled={!slot || busy} onPress={confirm} />
    </>
  );
}

function CertSheet({ onClose }) {
  const { state, dispatch, actions } = useStore();
  const th = useTheme();
  const car = state.car;
  if (!car) return null;
  const grade = car.soh >= 90 ? 'A' : car.soh >= 80 ? 'B' : 'C';
  const issue = () => {
    const cert = { no: `SC-BAT-${car.soh}-${new Date().getFullYear()}`, grade, soh: car.soh, ts: Date.now() };
    dispatch({ type: 'CAR', car: { certificate: cert } });
    actions.addEntry('battery', 'Sertifikat baterai diterbitkan', `Grade ${grade} · kesehatan ${car.soh}% · ${cert.no}`);
  };
  const c = car.certificate;
  return (
    <>
      <Card tone={c ? 'primary' : undefined}>
        <T v="caps" sub>Sertifikat Baterai Star Car</T>
        <T v="num" style={{ marginTop: 6 }}>Grade {grade}</T>
        <T v="body" sub style={{ marginTop: 2 }}>Kesehatan baterai {car.soh}% dari kapasitas awal</T>
        <View style={{ marginTop: 12 }}><Progress pct={car.soh} /></View>
        {c ? <T v="small" sub style={{ marginTop: 12 }}>No. {c.no} · terbit {longDate(new Date(c.ts))}</T> : null}
      </Card>
      <T v="small" sub style={{ marginBottom: 16 }}>Dicek saat servis. Risiko dibagi dengan mitra asuransi, dan mobil dijual kembali sebagai mobil bekas bersertifikat.</T>
      {c ? <Btn title="Tutup" kind="soft" onPress={onClose} /> : <Btn title="Terbitkan sertifikat" icon="ribbon-outline" onPress={issue} />}
    </>
  );
}

function ActionsSheet({ onClose }) {
  const { go, openSheet } = useNav();
  const { state } = useStore();
  const th = useTheme();
  const items = [
    { icon: 'flash-outline', t: 'Booking charger', b: 'Hindari antre, pilih slot', fn: () => go('charge') },
    { icon: 'construct-outline', t: 'Booking servis', b: 'Bengkel atau mobile service', fn: () => openSheet('service'), need: 'car' },
    { icon: 'ribbon-outline', t: 'Sertifikat baterai', b: 'Jaga nilai jual kembali', fn: () => openSheet('cert'), need: 'car' },
    { icon: 'sparkles-outline', t: 'Tanya Bintang', b: 'Asisten AI Star Car', fn: () => go('advisor') },
  ].filter((i) => !i.need || state.car);
  return (
    <>
      {items.map((i) => (
        <Pressable key={i.t} onPress={() => { onClose(); setTimeout(i.fn, 250); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
          <IconCircle name={i.icon} size={46} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <T v="heading">{i.t}</T>
            <T v="small" sub>{i.b}</T>
          </View>
        </Pressable>
      ))}
    </>
  );
}

const TITLES = { quote: 'Rincian biaya', testdrive: 'Test drive', service: 'Booking servis', charge: 'Booking charger', cert: 'Baterai', actions: 'Mau apa hari ini?' };

export function SheetHost({ sheet, onClose }) {
  const name = sheet && sheet.name;
  const p = (sheet && sheet.props) || {};
  const body = { quote: QuoteSheet, testdrive: TestDriveSheet, service: ServiceSheet, charge: ChargeSheet, cert: CertSheet, actions: ActionsSheet }[name];
  const Body = body;
  return (
    <Sheet visible={!!sheet} onClose={onClose} title={name === 'charge' && p.station ? p.station.name : TITLES[name]}>
      {Body ? <Body {...p} onClose={onClose} /> : null}
    </Sheet>
  );
}
