import { Platform } from 'react-native';
import { offlineAdvisor, chargersAt, SITE_CANDIDATES } from '../shared/lincah';

// Produksi (web): API satu origin. Lokal: server/dev.js di :3001. HP: set EXPO_PUBLIC_API_URL.
const isLocalWeb = Platform.OS === 'web' && typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const BASE = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'web' ? (isLocalWeb ? 'http://localhost:3001' : '') : 'http://localhost:3001');

async function call(path, opts = {}, timeout = 15000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(BASE + path, { ...opts, signal: ctl.signal, headers: { 'content-type': 'application/json' } });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(data.error || 'HTTP ' + r.status); e.status = r.status; throw e; }
    return data;
  } finally { clearTimeout(timer); }
}

export const api = {
  // Jika backend tak terjangkau, app tetap jalan dengan logika lokal yang sama (mode offline).
  async advisor(messages, profile) {
    try { return await call('/api/advisor', { method: 'POST', body: JSON.stringify({ messages, profile }) }, 20000); }
    catch { return offlineAdvisor(messages, profile); }
  },
  async chargers(hour) {
    try { return await call('/api/chargers?hour=' + hour); }
    catch { return { hour, stations: chargersAt(hour), sites: SITE_CANDIDATES, offline: true }; }
  },
  async book(payload) {
    try { return await call('/api/book', { method: 'POST', body: JSON.stringify(payload) }); }
    catch (e) {
      if (e.status === 409 || e.status === 404) throw e;
      return { ok: true, code: 'SC-' + Math.random().toString(36).slice(2, 7).toUpperCase(), offline: true };
    }
  },
};
