// Logika & data bersama (dipakai app dan backend). CommonJS agar bisa diimpor Metro dan Node.

const MODELS = [
  { id: 'city', name: 'Star City', price: 285e6, range: 320, seats: 4, tag: 'Lincah di dalam kota', kwh: 52 },
  { id: 'family', name: 'Star Family', price: 420e6, range: 450, seats: 7, tag: 'Lega untuk keluarga besar', kwh: 78 },
  { id: 'cruiser', name: 'Star Cruiser', price: 560e6, range: 600, seats: 5, tag: 'Jarak jauh, fast charging', kwh: 100 },
];

const FUEL_PER_MONTH = 1200000; // PDF LINCAH: bensin ±Rp1,2 jt
const POWER_PER_MONTH = 300000; // PDF LINCAH: listrik ±Rp300 rb
const BUYBACK = 0.65; // jaminan buyback 3 tahun
const PETROL_PRICE_RATIO = 0.78; // asumsi: mobil bensin sekelas ±78% harga EV

const rp = (n) => 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const rpJt = (n) => 'Rp' + (n / 1e6).toFixed(2).replace('.', ',') + ' jt';
const rpShort =(n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + ' M' : n >= 1e6 ? Math.round(n / 1e5) / 10 + ' jt' : Math.round(n / 1e3) + ' rb');

function quote(model, { dpPct = 10, tenor = 60 } = {}) {
  const loan = model.price * (1 - dpPct / 100);
  const install = Math.round((loan * (1 + 0.085 * (tenor / 12))) / tenor);
  const saving = FUEL_PER_MONTH - POWER_PER_MONTH;
  const petrolInstall = Math.round(((model.price * PETROL_PRICE_RATIO * (1 - dpPct / 100)) * (1 + 0.085 * (tenor / 12))) / tenor);
  const petrolTotal = petrolInstall + FUEL_PER_MONTH;
  const evTotal = install + POWER_PER_MONTH;
  return {
    dp: Math.round((model.price * dpPct) / 100), install, saving, net: install - saving,
    petrolTotal, evTotal, gap: evTotal - petrolTotal, buyback: Math.round(model.price * BUYBACK), dpPct, tenor,
  };
}

const isComplete = (p) => p && p.km != null && p.seats != null && p.budget != null && p.home != null;

function recommend(profile) {
  const need = profile.km * 3; // buffer 3 hari pemakaian
  let pool = MODELS.filter((m) => m.seats >= profile.seats && m.price <= profile.budget * 1.1);
  const overBudget = !pool.length;
  if (overBudget) pool = MODELS.filter((m) => m.seats >= profile.seats);
  if (!pool.length) pool = [MODELS[MODELS.length - 1]];
  const model = pool.find((m) => m.range >= need) || pool[pool.length - 1];
  const q = quote(model, { dpPct: 10, tenor: 60 });
  const longTrips = profile.km > 80;
  const charging = profile.home
    ? longTrips ? 'Wallbox di rumah + paket charger umum untuk perjalanan jauh' : 'Wallbox di rumah, isi daya malam hari'
    : 'Langganan charger umum dengan booking slot di aplikasi';
  return { modelId: model.id, model, quote: q, charging, overBudget, profile: { ...profile } };
}

// ---------- Charger ----------
const CHARGERS = [
  { id: 'kuningan', name: 'Kuningan City', area: 'Setiabudi', x: 62, y: 38, plugs: 8, kw: 150, partner: 'Mall', pop: 2 },
  { id: 'tebet', name: 'SPBU Tebet Raya', area: 'Tebet', x: 76, y: 62, plugs: 2, kw: 60, partner: 'SPBU', pop: 5 },
  { id: 'casablanca', name: 'Casablanca Residence', area: 'Casablanca', x: 36, y: 70, plugs: 6, kw: 100, partner: 'Properti', pop: 3 },
  { id: 'senayan', name: 'Senayan Park', area: 'Senayan', x: 24, y: 30, plugs: 4, kw: 120, partner: 'Kantor', pop: 4 },
];

function peakFactor(hour) {
  if ((hour >= 17 && hour <= 20) || (hour >= 7 && hour <= 9)) return 1;
  if (hour >= 12 && hour <= 13) return 0.55;
  if (hour >= 21 || hour <= 5) return 0.15;
  return 0.35;
}
const predictWait = (st, hour) => Math.min(45, Math.round(3 + (peakFactor(hour) * st.pop * 10) / st.plugs));

function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

function slotsFor(st, hour) {
  const out = [];
  for (let i = 0; i < 6; i++) {
    const m = hour * 60 + i * 30;
    const t = String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + (m % 60 === 0 ? '00' : '30');
    const full = hash(st.id + t) % 100 < peakFactor(Math.floor(m / 60) % 24) * st.pop * 14;
    out.push({ t, free: !full });
  }
  return out;
}

function chargersAt(hour) {
  return CHARGERS.map((st) => ({ ...st, wait: predictWait(st, hour), slots: slotsFor(st, hour) }))
    .sort((a, b) => a.wait - b.wait);
}

// Usulan lokasi baru: skor = permintaan terhadap kapasitas sekitar (heuristik, bukan model ML terlatih).
const SITE_CANDIDATES = [
  { id: 'cipete', name: 'Stasiun MRT Cipete Raya', demand: 94, gapKm: 2.1, partner: 'Operator parkir' },
  { id: 'cikampek', name: 'Rest Area Tol Cikampek KM 57', demand: 88, gapKm: 18, partner: 'Pengelola tol' },
  { id: 'kemang', name: 'Kemang Village', demand: 71, gapKm: 1.4, partner: 'Mall' },
];

// ---------- Advisor (fallback tanpa LLM) ----------
const Q = {
  km: { text: 'Biasanya sehari kamu menempuh berapa kilometer?', quick: ['20 km', '40 km', '80 km', '120 km'] },
  seats: { text: 'Biasanya berapa orang yang ikut di dalam mobil?', quick: ['2 orang', '4 orang', '5 orang', '7 orang'] },
  budget: { text: 'Kisaran budget mobilmu berapa?', quick: ['Rp300 jt', 'Rp450 jt', 'Rp600 jt'] },
  home: { text: 'Di tempat tinggalmu, bisa pasang charger pribadi?', quick: ['Ya, bisa', 'Belum bisa'] },
};
const ORDER = ['km', 'seats', 'budget', 'home'];
const missing = (p) => ORDER.find((k) => p[k] == null);

function extractProfile(text, profile = {}) {
  const t = String(text || '').toLowerCase();
  const out = {};
  let m;
  if ((m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/))) out.budget = parseFloat(m[1].replace(',', '.')) * 1e6;
  else if ((m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m\b|miliar)/))) out.budget = parseFloat(m[1].replace(',', '.')) * 1e9;
  if ((m = t.match(/(\d+)\s*km/))) out.km = parseInt(m[1], 10);
  if ((m = t.match(/(\d+)\s*(?:orang|kursi|seat|penumpang)/))) out.seats = parseInt(m[1], 10);
  if (/(belum|tidak|nggak|gak|ga bisa|apartemen|kost|kos)/.test(t) && /(bisa|charger|pasang|apartemen|kost|kos|belum|tidak|nggak|gak)/.test(t)) out.home = false;
  else if (/(\bya\b|iya|bisa|punya|garasi|ada)/.test(t)) out.home = true;
  const bare = t.match(/^\s*(\d+(?:[.,]\d+)?)\s*$/);
  const need = missing({ ...profile, ...out });
  if (bare && need) {
    const n = parseFloat(bare[1].replace(',', '.'));
    if (need === 'km' && out.km == null) out.km = n;
    else if (need === 'seats' && out.seats == null && n <= 9) out.seats = n;
    else if (need === 'budget' && out.budget == null) out.budget = n < 5000 ? n * 1e6 : n;
  }
  return out;
}

function offlineAdvisor(messages, profile = {}) {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  const got = extractProfile(last ? last.content : '', profile);
  const merged = { ...profile, ...got };
  const next = missing(merged);
  if (!next) {
    return { reply: 'Terima kasih, aku sudah punya gambaran lengkap. Ini paket yang paling pas untuk kebutuhanmu.', profile: got, quick: [], mode: 'offline' };
  }
  const ack = Object.keys(got).length ? 'Noted. ' : 'Maaf, aku belum menangkap itu. ';
  return { reply: ack + Q[next].text, profile: got, quick: Q[next].quick, mode: 'offline' };
}

const FACTS = [
  'Biaya bensin rata-rata ±Rp1,2 jt/bulan vs listrik ±Rp300 rb/bulan.',
  'Star Car menjamin buyback 65% dari harga beli setelah 3 tahun, dan nilai itu bisa jadi DP EV berikutnya.',
  'Sertifikat baterai digital diterbitkan saat servis.',
  'Di Jakarta 1 SPKLU melayani ±47 mobil listrik; di aplikasi pengguna bisa booking slot charger agar antre ≤15 menit.',
  'Baterai bekas masih menyimpan hingga 80% kapasitas dan dipakai ulang di stasiun charging sebelum didaur ulang.',
  'Model: ' + MODELS.map((m) => `${m.name} (${m.seats} kursi, jangkauan ${m.range} km)`).join('; ') + '. Harga dan cicilan dihitung oleh sistem, jangan disebutkan angkanya.',
].join(' ');

module.exports = {
  MODELS, CHARGERS, SITE_CANDIDATES, FACTS, FUEL_PER_MONTH, POWER_PER_MONTH, BUYBACK, PETROL_PRICE_RATIO,
  rp, rpJt, rpShort, quote, recommend, isComplete, chargersAt, predictWait, slotsFor, extractProfile, offlineAdvisor, missing, Q,
};
