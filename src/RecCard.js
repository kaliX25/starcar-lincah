import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Btn, Row, Ionicons } from './ui';
import { useNav } from './nav';
import { rpJt } from '../shared/lincah';

export default function RecCard({ rec, compact }) {
  const { openSheet } = useNav();
  const q = rec.quote;
  return (
    <View style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 14 }}>
      <LinearGradient colors={['#5B21B6', '#A21CAF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 20 }}>
        <Ionicons name="car-sport" size={120} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -10, top: 6 }} />
        <T v="caps" color="rgba(255,255,255,0.7)">Paket untukmu</T>
        <T v="display" color="#fff" style={{ marginTop: 4 }}>{rec.model.name}</T>
        <T v="body" color="rgba(255,255,255,0.8)">{rec.model.tag} · {rec.model.seats} kursi · {rec.model.range} km</T>
        <Row style={{ marginTop: 18, flexWrap: 'nowrap' }}>
          <View style={{ flex: 1 }}>
            <T v="small" color="rgba(255,255,255,0.7)">Cicilan / bulan</T>
            <T v="heading" color="#fff" style={{ fontSize: 17 }}>{rpJt(q.install)}</T>
          </View>
          <View style={{ flex: 1 }}>
            <T v="small" color="rgba(255,255,255,0.7)">Beban bersih</T>
            <T v="heading" color="#fff" style={{ fontSize: 17 }}>{rpJt(q.net)}</T>
          </View>
          <View style={{ flex: 1 }}>
            <T v="small" color="rgba(255,255,255,0.7)">Buyback 3 thn</T>
            <T v="heading" color="#fff" style={{ fontSize: 17 }}>{rpJt(q.buyback)}</T>
          </View>
        </Row>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 }}>
          <Ionicons name="flash-outline" size={16} color="rgba(255,255,255,0.85)" style={{ marginTop: 2, marginRight: 8 }} />
          <T v="small" color="rgba(255,255,255,0.9)" style={{ flex: 1 }}>{rec.charging}</T>
        </View>
        {rec.overBudget ? <T v="small" color="#FFD79A" style={{ marginTop: 10 }}>Catatan: model ini di atas budgetmu, tapi satu-satunya yang cukup kursi.</T> : null}
      </LinearGradient>
      <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
        <Btn kind="soft" title="Rincian biaya" icon="calculator-outline" onPress={() => openSheet('quote')} style={{ flex: 1, margin: 10, marginRight: 5, marginTop: 10 }} />
        <Btn title="Test drive" icon="calendar-outline" onPress={() => openSheet('testdrive')} style={{ flex: 1, margin: 10, marginLeft: 5, marginTop: 10 }} />
      </View>
    </View>
  );
}
