const { FACTS, missing, offlineAdvisor, Q } = require('../shared/lincah');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

function systemPrompt(profile) {
  const need = missing(profile || {});
  return [
    'Kamu adalah "Bintang", asisten AI Star Car (mobil listrik di Indonesia). Gaya: hangat, singkat, Bahasa Indonesia santai-sopan, maksimal 2 kalimat.',
    'Tugasmu mengenali 4 hal tentang calon pembeli: km (jarak harian, angka), seats (jumlah penumpang, angka), budget (rupiah penuh, angka), home (boolean: bisa pasang charger pribadi).',
    `Profil saat ini: ${JSON.stringify(profile || {})}. Yang belum diketahui berikutnya: ${need || 'semua sudah lengkap'}.`,
    'Tanyakan SATU hal per giliran. Jika pesan user memuat info baru, masukkan ke "profile". Jika user bertanya hal lain tentang EV/Star Car, jawab singkat memakai fakta di bawah lalu kembali ke pertanyaan. Jika semua lengkap, ucapkan terima kasih dan katakan paket sedang disiapkan.',
    'Jangan menyebut harga, cicilan, atau angka yang tidak ada di fakta; sistem akan menghitungnya.',
    `Fakta: ${FACTS}`,
    'Balas HANYA JSON valid tanpa teks lain: {"reply": string, "profile": {field baru saja}, "quick": [2-4 saran jawaban singkat]}.',
  ].join('\n');
}

function parseJson(text) {
  const t = String(text).replace(/```json|```/g, '').trim();
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s === -1 || e === -1) return null;
  try { return JSON.parse(t.slice(s, e + 1)); } catch { return null; }
}

function sanitize(profile) {
  const out = {};
  const n = (v) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : null);
  if (n(profile.km)) out.km = Math.min(profile.km, 1000);
  if (n(profile.seats)) out.seats = Math.min(Math.round(profile.seats), 9);
  if (n(profile.budget)) out.budget = profile.budget;
  if (typeof profile.home === 'boolean') out.home = profile.home;
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = req.body || {};
  const profile = body.profile || {};
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-12)
    .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 500) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length) return res.status(400).json({ error: 'messages kosong' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(200).json(offlineAdvisor(messages, profile));

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: systemPrompt(profile), messages }),
    });
    if (!r.ok) throw new Error('Anthropic ' + r.status);
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    const parsed = parseJson(text);
    if (!parsed || typeof parsed.reply !== 'string') {
      return res.status(200).json({ reply: text.slice(0, 400) || Q.km.text, profile: {}, quick: [], mode: 'claude' });
    }
    const got = sanitize(parsed.profile || {});
    return res.status(200).json({
      reply: parsed.reply,
      profile: got,
      quick: Array.isArray(parsed.quick) ? parsed.quick.slice(0, 4).map(String) : [],
      mode: 'claude',
    });
  } catch (e) {
    // Gagal memanggil Claude: turun ke mode offline agar percakapan tetap jalan.
    return res.status(200).json(offlineAdvisor(messages, profile));
  }
};
