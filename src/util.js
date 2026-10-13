const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
};
export const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
export const dayLabel = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const diff = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
  if (diff === 0) return 'Hari ini';
  if (diff === 1) return 'Kemarin';
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
export const timeLabel = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`; };
export const longDate = (d = new Date()) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// Tanggal-tanggal ke depan untuk pilihan booking.
export const nextDays = (n = 5, skip = 1) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + skip + i);
    return { ts: d.getTime(), label: `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
  });

export const uid = () => Math.random().toString(36).slice(2, 10);
