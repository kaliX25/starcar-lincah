# Star Car (LINCAH) - Prototype

Satu aplikasi terpadu (React Native + Expo) untuk solusi **LINCAH: Star Car Sustainable Mobility**.

Alur: Welcome → **Bintang** (AI advisor, Claude) → paket EV + cicilan + buyback 65% → test drive → mode pemilik:
**Hari ini** (jurnal + status mobil), **Charge** (prediksi antre + booking slot), **Garasi** (servis prediktif, sertifikat baterai, dampak).

## Jalankan lokal

```bash
npm install
cp .env.example .env     # isi ANTHROPIC_API_KEY (opsional)
npm run api              # backend lokal di :3001
npm run web              # app di :8081
```

Tanpa `ANTHROPIC_API_KEY`, Bintang berjalan di mode offline (percakapan berbasis aturan). Dengan key, percakapan memakai Claude; angka harga/cicilan tetap dihitung kode, bukan LLM.

## Struktur

- `src/` - app (layar, tema, store dengan AsyncStorage)
- `api/` - fungsi serverless gaya Vercel: `advisor`, `chargers`, `book`
- `shared/lincah.js` - model data & logika (dipakai app dan backend)
- `server/dev.js` - server lokal yang memuat handler `api/`

## Deploy (Vercel)

Set env `ANTHROPIC_API_KEY` di project Vercel, lalu `npx vercel deploy --prod`.

Catatan: data pengguna disimpan di perangkat (belum ada database); booking mengembalikan kode konfirmasi tanpa penyimpanan server. Data demo.
