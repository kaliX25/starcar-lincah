import React, { useMemo, useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { NavCtx } from './src/nav';
import { useFonts } from 'expo-font';
import { useTheme, FONT_FILES } from './src/theme';
import { Ionicons, T } from './src/ui';
import { SheetHost } from './src/sheets';
import Welcome from './src/screens/Welcome';
import Today from './src/screens/Today';
import Advisor from './src/screens/Advisor';
import Charge from './src/screens/Charge';
import Garage from './src/screens/Garage';

const TABS = [
  { k: 'today', n: 'Hari ini', i: 'journal', c: Today },
  { k: 'advisor', n: 'Bintang', i: 'sparkles', c: Advisor },
  { k: 'charge', n: 'Charge', i: 'flash', c: Charge },
  { k: 'garage', n: 'Garasi', i: 'car-sport', c: Garage },
];

function Shell() {
  const { state } = useStore();
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('today');
  const [sheet, setSheet] = useState(null);
  const nav = useMemo(() => ({
    tab, go: setTab,
    openSheet: (name, props) => setSheet({ name, props }),
    closeSheet: () => setSheet(null),
  }), [tab]);

  if (!state.hydrated) return <View style={{ flex: 1, backgroundColor: th.bg }} />;
  const Screen = TABS.find((t) => t.k === tab).c;

  return (
    <NavCtx.Provider value={nav}>
      <View style={{ flex: 1, backgroundColor: th.bg, paddingTop: insets.top }}>
        <StatusBar style={th.dark ? 'light' : 'dark'} />
        {!state.onboarded ? <Welcome /> : (
          <>
            <View style={{ flex: 1 }}><Screen key={tab} /></View>
            {tab === 'today' ? (
              <Pressable onPress={() => nav.openSheet('actions')} style={{ position: 'absolute', right: 20, bottom: 92 + insets.bottom, width: 58, height: 58, borderRadius: 29, backgroundColor: th.primary, alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(124,58,237,0.45)' }}>
                <Ionicons name="add" size={30} color={th.primaryInk} />
              </Pressable>
            ) : null}
            <View style={{ flexDirection: 'row', backgroundColor: th.surface, paddingTop: 8, paddingBottom: 8 + insets.bottom, borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: `0 -6px 24px ${th.shadow}` }}>
              {TABS.map((t) => {
                const on = tab === t.k;
                return (
                  <Pressable key={t.k} onPress={() => setTab(t.k)} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
                    <Ionicons name={on ? t.i : `${t.i}-outline`} size={23} color={on ? th.primary : th.sub} />
                    <T v="small" color={on ? th.primary : th.sub} style={{ fontSize: 11, marginTop: 2, fontWeight: on ? '700' : '500' }}>{t.n}</T>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
        <SheetHost sheet={sheet} onClose={nav.closeSheet} />
      </View>
    </NavCtx.Provider>
  );
}

export default function App() {
  const th = useTheme();
  const [fontsLoaded] = useFonts(FONT_FILES);
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: th.bg }} />;
  const web = Platform.OS === 'web';
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: web ? (th.dark ? '#000' : '#E4DAF7') : th.bg, alignItems: 'center' }}>
        <View style={[{ flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden' }, web ? { height: '100vh', boxShadow: '0 0 60px rgba(0,0,0,0.12)' } : null]}>
          <StoreProvider><Shell /></StoreProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
