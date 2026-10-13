import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { T, Card, Btn, Chip, Row, Pill, Progress, IconCircle, Ionicons } from '../ui';
import { useTheme } from '../theme';
import { useNav } from '../nav';
import { api } from '../api';

const hourNow = () => new Date().getHours();

function MapView({ stations, selected, onSelect }) {
  const th = useTheme();
  return (
    <View style={{ height: 210, borderRadius: 22, backgroundColor: th.surface2, overflow: 'hidden', marginBottom: 14 }}>
      {[20, 40, 60, 80].map((p) => (
        <View key={'h' + p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 1, backgroundColor: th.line }} />
      ))}
      {[25, 50, 75].map((p) => (
        <View key={'v' + p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, backgroundColor: th.line }} />
      ))}
      <View style={{ position: 'absolute', left: '50%', top: '52%', marginLeft: -7, marginTop: -7, width: 14, height: 14, borderRadius: 7, backgroundColor: '#3B82F6', borderWidth: 3, borderColor: '#fff' }} />
      {stations.map((s) => {
        const good = s.wait <= 15;
        const on = selected === s.id;
        return (
          <Pressable key={s.id} onPress={() => onSelect(s.id)} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, marginLeft: -20, marginTop: -16, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: good ? th.primary : th.danger, borderRadius: 14, paddingVertical: 5, paddingHorizontal: 9, borderWidth: on ? 3 : 0, borderColor: th.ink }}>
              <Ionicons name="flash" size={12} color="#fff" />
              <T v="small" color="#fff" style={{ fontWeight: '700', marginLeft: 3 }}>{s.wait}m</T>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Charge() {
  const { openSheet } = useNav();
  const th = useTheme();
  const [hour, setHour] = useState(hourNow());
  const [data, setData] = useState(null);
  const [sel, setSel] = useState(null);

  useEffect(() => { let on = true; api.chargers(hour).then((d) => on && setData(d)); return () => { on = false; }; }, [hour]);

  const hours = [{ h: hourNow(), l: 'Sekarang' }, ...[18, 19, 21].filter((h) => h !== hourNow()).map((h) => ({ h, l: `${h}.00` }))];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <T v="caps" sub>Charge · AI</T>
      <T v="display" style={{ marginTop: 4, marginBottom: 4 }}>Isi daya tanpa antre</T>
      <T v="body" sub style={{ marginBottom: 16 }}>Prediksi antrean memakai pola jam sibuk dan kapasitas tiap stasiun.</T>

      <Row>{hours.map((o) => <Chip key={o.l} label={o.l} icon={o.l === 'Sekarang' ? 'time-outline' : undefined} active={hour === o.h} onPress={() => setHour(o.h)} />)}</Row>

      {!data ? <T v="body" sub style={{ marginVertical: 40, textAlign: 'center' }}>Memuat stasiun…</T> : (
        <>
          <MapView stations={data.stations} selected={sel} onSelect={setSel} />
          {data.stations.map((s) => (
            <Card key={s.id} onPress={() => setSel(s.id)} style={sel === s.id ? { borderWidth: 2, borderColor: th.primary } : null}>
              <Row style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <IconCircle name="flash-outline" tone={s.wait <= 15 ? 'primary' : 'danger'} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <T v="heading" style={{ fontSize: 17 }}>{s.name}</T>
                  <T v="small" sub>{s.area} · {s.plugs} colokan · {s.kw} kW · mitra {s.partner}</T>
                  <View style={{ marginTop: 8 }}>
                    <Pill label={s.wait <= 15 ? `Antre ±${s.wait} menit` : `Ramai · antre ±${s.wait} menit`} tone={s.wait <= 15 ? 'primary' : 'danger'} icon="time-outline" />
                  </View>
                </View>
              </Row>
              <Btn kind="soft" title="Booking slot" icon="calendar-outline" style={{ marginTop: 14 }} onPress={() => openSheet('charge', { station: s })} />
            </Card>
          ))}

          <T v="caps" sub style={{ marginTop: 16, marginBottom: 6 }}>Usulan lokasi baru · AI</T>
          <T v="small" sub style={{ marginBottom: 12 }}>Dihitung dari permintaan terhadap kapasitas sekitar. Dibangun bersama partner agar capex per titik turun ±40%.</T>
          {data.sites.map((s) => (
            <Card key={s.id}>
              <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <T v="heading" style={{ fontSize: 16, flex: 1, paddingRight: 8 }}>{s.name}</T>
                <Pill label={`Skor ${s.demand}`} tone="accent" />
              </Row>
              <View style={{ marginVertical: 10 }}><Progress pct={s.demand} color={th.accent} /></View>
              <T v="small" sub>Charger terdekat {s.gapKm} km · calon mitra: {s.partner}</T>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}
