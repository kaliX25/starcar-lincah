import React from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Btn, Ionicons } from '../ui';
import { useStore } from '../store';
import { useNav } from '../nav';

const POINTS = [
  { i: 'sparkles-outline', t: 'Paket yang pas', b: 'Bintang, asisten AI, menyusun mobil, cicilan, dan charging dari kebiasaanmu.' },
  { i: 'shield-checkmark-outline', t: 'Tenang soal jual kembali', b: 'Buyback dijamin 65% setelah 3 tahun.' },
  { i: 'flash-outline', t: 'Charge tanpa antre', b: 'Booking slot langsung dari aplikasi.' },
];

export default function Welcome() {
  const { dispatch } = useStore();
  const { go } = useNav();
  const start = () => { dispatch({ type: 'ONBOARD' }); go('advisor'); };
  return (
    <LinearGradient colors={['#0A5F46', '#0F3D4A', '#0B2230']} style={{ flex: 1, padding: 28, justifyContent: 'space-between' }}>
      <View style={{ marginTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
          <Ionicons name="star" size={18} color="#F5C26B" />
          <T v="caps" color="rgba(255,255,255,0.85)" style={{ marginLeft: 8 }}>Star Car</T>
        </View>
        <T v="display" color="#fff" style={{ fontSize: 40, lineHeight: 46 }}>Mobil listrik yang pas untuk harimu.</T>
        <T v="body" color="rgba(255,255,255,0.75)" style={{ marginTop: 14, fontSize: 17, lineHeight: 25 }}>
          Dari memilih, mencicil, mengisi daya, sampai menjual kembali. Satu aplikasi yang menemani seluruh perjalananmu.
        </T>
      </View>
      <View>
        {POINTS.map((p) => (
          <View key={p.t} style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Ionicons name={p.i} size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <T v="heading" color="#fff" style={{ fontSize: 16 }}>{p.t}</T>
              <T v="small" color="rgba(255,255,255,0.7)">{p.b}</T>
            </View>
          </View>
        ))}
        <Btn kind="soft" title="Mulai dengan Bintang" icon="sparkles" onPress={start} style={{ backgroundColor: '#fff', marginTop: 8 }} />
        <Pressable onPress={() => dispatch({ type: 'ONBOARD' })} style={{ alignItems: 'center', padding: 14 }}>
          <T v="body" color="rgba(255,255,255,0.8)" style={{ fontWeight: '600' }}>Lihat-lihat dulu</T>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
