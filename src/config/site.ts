// Dipakai src/middleware.ts. Ubah di Vercel > Environment Variables, lalu Redeploy.
export const isDevelopmentMode =
  process.env.NEXT_PUBLIC_DEV_MODE === 'true' ||
  process.env.NEXT_PUBLIC_DEV_MODE === '1';
