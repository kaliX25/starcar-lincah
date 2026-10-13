import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C } from './src/ui';
import Learn from './src/screens/Learn';
import Installment from './src/screens/Installment';
import Next from './src/screens/Next';
import Charge from './src/screens/Charge';
import Assist from './src/screens/Assist';
import Harvest from './src/screens/Harvest';

const TABS = [
  { k: 'L', n: 'Learn', c: Learn },
  { k: 'I', n: 'Installment', c: Installment },
  { k: 'N', n: 'Next', c: Next },
  { k: 'C', n: 'Charge', c: Charge },
  { k: 'A', n: 'Assist', c: Assist },
  { k: 'H', n: 'Harvest', c: Harvest },
];

export default function App() {
  const [i, setI] = useState(0);
  const Screen = TABS[i].c;
  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="dark" />
      <View style={s.top}>
        <Text style={s.brand}>Star Car</Text>
        <Text style={s.tag}>LINCAH · Sustainable Mobility</Text>
      </View>
      <ScrollView contentContainerStyle={s.body} key={i}>
        <Screen />
      </ScrollView>
      <View style={s.tabs}>
        {TABS.map((t, idx) => (
          <Pressable key={t.k} style={s.tab} onPress={() => setI(idx)}>
            <View style={[s.dot, idx === i && s.dotOn]}>
              <Text style={[s.dotT, idx === i && { color: '#fff' }]}>{t.k}</Text>
            </View>
            <Text style={[s.tabT, idx === i && { color: C.primaryDark, fontWeight: '700' }]} numberOfLines={1}>{t.n}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const web = Platform.OS === 'web' ? { height: '100vh', maxWidth: 480, width: '100%', alignSelf: 'center' } : {};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? 28 : 0, ...web },
  top: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.line },
  brand: { fontSize: 18, fontWeight: '800', color: C.primaryDark },
  tag: { fontSize: 11, color: C.mute },
  body: { padding: 16, paddingBottom: 32 },
  tabs: { flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 6 },
  tab: { flex: 1, alignItems: 'center' },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EEF3F1', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: C.primary },
  dotT: { fontWeight: '800', color: C.mute },
  tabT: { fontSize: 10, color: C.mute, marginTop: 2 },
});
