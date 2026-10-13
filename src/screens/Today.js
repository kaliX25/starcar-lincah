import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Card, Btn, Row, Pill, Progress, IconCircle, Ionicons } from '../ui';
import { useTheme } from '../theme';
import { useStore } from '../store';
import { useNav } from '../nav';
import RecCard from '../RecCard';
import { greeting, longDate, dayKey, dayLabel, timeLabel } from '../util';

const KIND = {
  delivery: { icon: 'key-outline', tone: 'primary' },
  charge: { icon: 'flash-outline', tone: 'accent' },
  booking: { icon: 'calendar-outline', tone: 'primary' },
  service: { icon: 'construct-outline', tone: 'mute' },
  battery: { icon: 'ribbon-outline', tone: 'primary' },
  testdrive: { icon: 'speedometer-outline', tone: 'primary' },
  advisor: { icon: 'sparkles-outline', tone: 'primary' },
};

function CarHero({ car }) {
  const { go, openSheet } = useNav();
  const km = Math.round((car.range * car.battery) / 100 * 0.85);
  const mins = Math.round(((80 - Math.min(car.battery, 80)) / 100) * car.kwh / 1.2);
  return (
    <View style={{ borderRadius: 26, overflow: 'hidden', marginBottom: 14 }}>
      <LinearGradient colors={['#0B6E4F', '#0F3D4A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 22 }}>
        <Ionicons name="car-sport" size={150} color="rgba(255,255,255,0.07)" style={{ position: 'absolute', right: -16, top: 10 }} />
        <T v="caps" color="rgba(255,255,255,0.7)">{car.name}</T>
        <Row style={{ alignItems: 'flex-end', marginTop: 6 }}>
          <T v="display" color="#fff" style={{ fontSize: 44, lineHeight: 52 }}>{car.battery}</T>
          <T v="heading" color="rgba(255,255,255,0.8)" style={{ marginBottom: 8, marginLeft: 4 }}>% · ±{km} km</T>
        </Row>
        <View style={{ marginTop: 10 }}><Progress pct={car.battery} color="#7FE3B8" height={10} /></View>
        <T v="small" color="rgba(255,255,255,0.75)" style={{ marginTop: 10 }}>Ke 80% sekitar {mins} menit di charger cepat</T>
        <Row style={{ marginTop: 16 }}>
          <Pressable onPress={() => go('charge')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 }}>
            <Ionicons name="flash" size={15} color="#0B6E4F" style={{ marginRight: 6 }} /><T v="small" color="#0B6E4F" style={{ fontWeight: '700' }}>Cari charger</T>
          </Pressable>
          <Pressable onPress={() => openSheet('service')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 }}>
            <Ionicons name="construct" size={15} color="#fff" style={{ marginRight: 6 }} /><T v="small" color="#fff" style={{ fontWeight: '700' }}>Booking servis</T>
          </Pressable>
        </Row>
      </LinearGradient>
    </View>
  );
}

function Attention({ car }) {
  const { openSheet } = useNav();
  const left = car.nextServiceKm - car.odometer;
  const th = useTheme();
  return (
    <View style={{ marginBottom: 6 }}>
      <T v="caps" sub style={{ marginBottom: 10 }}>Perlu perhatian</T>
      <Card onPress={() => openSheet('service')}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <IconCircle name="construct-outline" tone={left < 2000 ? 'accent' : 'mute'} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <T v="heading" style={{ fontSize: 16 }}>Servis berkala dalam {left.toLocaleString('id-ID')} km</T>
            <View style={{ marginVertical: 8 }}><Progress pct={(car.odometer / car.nextServiceKm) * 100} color={th.accent} /></View>
            <T v="small" sub>Prediksi Bintang: ±3 minggu lagi. Ketuk untuk booking.</T>
          </View>
        </Row>
      </Card>
      {!car.certificate ? (
        <Card onPress={() => openSheet('cert')}>
          <Row style={{ flexWrap: 'nowrap' }}>
            <IconCircle name="ribbon-outline" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T v="heading" style={{ fontSize: 16 }}>Terbitkan sertifikat baterai</T>
              <T v="small" sub>Menjaga nilai jual kembali mobilmu.</T>
            </View>
            <Ionicons name="chevron-forward" size={18} color={th.sub} />
          </Row>
        </Card>
      ) : null}
    </View>
  );
}

function Entry({ e }) {
  const th = useTheme();
  const k = KIND[e.kind] || KIND.advisor;
  return (
    <Card>
      <Row style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
        <IconCircle name={k.icon} tone={k.tone} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <T v="heading" style={{ fontSize: 17 }}>{e.title}</T>
          {e.body ? <T v="body" sub style={{ marginTop: 2 }}>{e.body}</T> : null}
          <Row style={{ marginTop: 8 }}>
            <T v="small" sub>{timeLabel(e.ts)}</T>
            {e.code ? <View style={{ marginLeft: 10 }}><Pill label={e.code} tone="mute" /></View> : null}
          </Row>
        </View>
      </Row>
    </Card>
  );
}

export default function Today() {
  const { state } = useStore();
  const { go } = useNav();
  const th = useTheme();
  const groups = [];
  state.entries.forEach((e) => {
    const k = dayKey(e.ts);
    const g = groups[groups.length - 1];
    if (g && g.k === k) g.items.push(e); else groups.push({ k, ts: e.ts, items: [e] });
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <T v="caps" sub>{longDate()}</T>
      <T v="display" style={{ marginTop: 4, marginBottom: 20 }}>{greeting()}</T>

      {state.car ? (
        <>
          <CarHero car={state.car} />
          <Attention car={state.car} />
        </>
      ) : state.rec ? (
        <>
          <RecCard rec={state.rec} />
        </>
      ) : (
        <Card tone="primary" onPress={() => go('advisor')}>
          <IconCircle name="sparkles" size={44} />
          <T v="title" style={{ marginTop: 14 }}>Temukan Star Car yang pas</T>
          <T v="body" sub style={{ marginTop: 4, marginBottom: 14 }}>Ngobrol 1 menit dengan Bintang. Kami susun mobil, cicilan, dan charging sesuai kebiasaanmu.</T>
          <Btn title="Mulai ngobrol" icon="chatbubble-ellipses-outline" onPress={() => go('advisor')} />
        </Card>
      )}

      <T v="caps" sub style={{ marginTop: 14, marginBottom: 10 }}>Jurnal</T>
      {groups.length === 0 ? (
        <T v="body" sub>Aktivitasmu akan tercatat di sini: test drive, charging, servis, dan sertifikat baterai.</T>
      ) : groups.map((g) => (
        <View key={g.k}>
          <T v="heading" style={{ marginBottom: 10, marginTop: 6 }}>{dayLabel(g.ts)}</T>
          {g.items.map((e) => <Entry key={e.id} e={e} />)}
        </View>
      ))}
    </ScrollView>
  );
}
