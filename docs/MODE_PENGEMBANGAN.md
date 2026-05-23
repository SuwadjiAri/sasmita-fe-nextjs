# Mode Pengembangan (Maintenance) — SASMITA.COM

Situs bisa ditutup sementara dan diganti halaman **"Sedang Dalam Pengembangan"**
yang memblokir seluruh halaman. Toggle-nya lewat environment variable
`NEXT_PUBLIC_DEV_MODE`.

| Nilai | Efek |
|-------|------|
| `true` atau `1` | Mode pengembangan **AKTIF** — seluruh situs diblokir |
| `false` / kosong / tidak diset | Situs berjalan **normal** |

---

## Cara mengubah di Vercel (devsasmita.arifsuwadji.net)

1. Buka [vercel.com](https://vercel.com) → pilih project SASMITA.
2. Masuk ke **Settings → Environment Variables**.
3. Cari / tambahkan variabel:
   - **Key:** `NEXT_PUBLIC_DEV_MODE`
   - **Value:** `true` (untuk menyalakan) atau `false` (untuk mematikan)
   - **Environment:** pilih sesuai kebutuhan (Production / Preview).
4. **Save.**
5. **Redeploy** agar perubahan berlaku:
   - Tab **Deployments** → deployment terbaru → menu **⋯** → **Redeploy**, atau
   - Push commit baru ke remote `production` (deploy berjalan otomatis).

> ⚠️ `NEXT_PUBLIC_*` di-inline saat build, jadi mengubah nilainya **wajib redeploy**.
> Tidak cukup hanya Save.

---

## Cara tes di lokal

1. Edit `.env.local`:
   ```env
   NEXT_PUBLIC_DEV_MODE=true
   ```
2. Restart dev server (gunakan flag webpack sesuai catatan proyek):
   ```bash
   npm run dev -- --webpack
   ```
3. Buka `http://localhost:3000` — akan tampil halaman pengembangan.
4. Kembalikan ke `false` untuk situs normal.

---

## Catatan penting

- ⚠️ Saat mode aktif, **seluruh situs** terblokir — termasuk halaman **login** dan
  **dashboard admin**. Admin tidak bisa login selama mode menyala. Matikan dulu
  mode pengembangan jika perlu mengelola konten.

---

## File terkait

| File | Peran |
|------|-------|
| `src/config/site.ts` | Membaca `NEXT_PUBLIC_DEV_MODE` → `isDevelopmentMode` |
| `src/components/DevelopmentScreen.tsx` | Tampilan halaman "Sedang Dalam Pengembangan" |
| `src/app/layout.tsx` | Menampilkan `DevelopmentScreen` saat mode aktif |
| `.env.example` | Dokumentasi default variabel |
