const { CHARGERS, slotsFor } = require('../shared/lincah');

// Validasi booking terhadap kapasitas slot. Belum ada database: kode konfirmasi bersifat stateless.
module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  if (b.kind === 'charge') {
    const st = CHARGERS.find((c) => c.id === b.stationId);
    if (!st) return res.status(404).json({ error: 'Stasiun tidak ditemukan' });
    const hour = parseInt(String(b.slot || '').slice(0, 2), 10);
    const slot = slotsFor(st, Number.isFinite(hour) ? hour : 0).find((s) => s.t === b.slot);
    if (!slot || !slot.free) return res.status(409).json({ error: 'Slot sudah penuh, pilih jam lain' });
  }
  const code = 'SC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  res.status(200).json({ ok: true, code });
};
