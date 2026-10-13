import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uid } from './util';

const KEY = 'starcar.v2';
const init = { hydrated: false, onboarded: false, profile: {}, messages: [], rec: null, car: null, entries: [] };

function reducer(s, a) {
  switch (a.type) {
    case 'HYDRATE': return { ...init, ...a.state, hydrated: true };
    case 'ONBOARD': return { ...s, onboarded: true };
    case 'MSG': return { ...s, messages: [...s.messages, ...a.msgs] };
    case 'PROFILE': return { ...s, profile: { ...s.profile, ...a.profile } };
    case 'REC': return { ...s, rec: a.rec };
    case 'ENTRY': return { ...s, entries: [a.entry, ...s.entries].sort((x, y) => y.ts - x.ts) };
    case 'ENTRIES': return { ...s, entries: [...a.entries, ...s.entries].sort((x, y) => y.ts - x.ts) };
    case 'CAR': return { ...s, car: { ...s.car, ...a.car } };
    case 'RESET_CHAT': return { ...s, profile: {}, messages: [], rec: null };
    case 'RESET': return { ...init, hydrated: true, onboarded: true };
    default: return s;
  }
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export const mkEntry = (kind, title, body, extra = {}) => ({ id: uid(), ts: Date.now(), kind, title, body, ...extra });
const daysAgo = (n, h = 10) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 12, 0, 0); return d.getTime(); };

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => dispatch({ type: 'HYDRATE', state: raw ? JSON.parse(raw) : {} }))
      .catch(() => dispatch({ type: 'HYDRATE', state: {} }));
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...rest } = state;
    AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => {});
  }, [state]);

  const actions = useMemo(() => ({
    addEntry: (kind, title, body, extra) => dispatch({ type: 'ENTRY', entry: mkEntry(kind, title, body, extra) }),
    // Demo: menjadikan rekomendasi sebagai mobil milik pengguna beserta riwayat awal.
    adoptCar: (rec) => {
      const m = rec.model;
      dispatch({ type: 'CAR', car: { modelId: m.id, name: m.name, range: m.range, kwh: m.kwh, battery: 64, odometer: 18420, nextServiceKm: 20000, soh: 96, certificate: null, since: daysAgo(45) } });
      dispatch({
        type: 'ENTRIES',
        entries: [
          { id: uid(), ts: daysAgo(45), kind: 'delivery', title: `${m.name} resmi jadi milikmu`, body: `Paket ${rec.quote.tenor} bulan, buyback 65% dijamin setelah 3 tahun.` },
          { id: uid(), ts: daysAgo(12, 18), kind: 'charge', title: 'Charging di Kuningan City', body: '36 menit · 31 kWh · antre 4 menit' },
          { id: uid(), ts: daysAgo(2, 9), kind: 'service', title: 'Pengingat servis 20.000 km', body: 'Bintang memprediksi servis berkala dalam ±3 minggu.' },
        ],
      });
    },
  }), []);

  return <Ctx.Provider value={{ state, dispatch, actions }}>{children}</Ctx.Provider>;
}
