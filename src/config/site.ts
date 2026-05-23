/**
 * Konfigurasi status situs.
 *
 * `isDevelopmentMode` mengatur apakah seluruh situs ditutup dan diganti
 * halaman "Sedang Dalam Pengembangan".
 *
 * Diatur lewat environment variable `NEXT_PUBLIC_DEV_MODE`:
 *   - "true" / "1"        -> mode pengembangan AKTIF (situs diblokir)
 *   - "false" / kosong    -> situs berjalan normal
 *
 * Cara mengubah di produksi (devsasmita.arifsuwadji.net):
 *   Vercel -> Settings -> Environment Variables -> NEXT_PUBLIC_DEV_MODE
 *   ubah nilainya, lalu Redeploy.
 */
export const isDevelopmentMode =
  process.env.NEXT_PUBLIC_DEV_MODE === 'true' ||
  process.env.NEXT_PUBLIC_DEV_MODE === '1';
