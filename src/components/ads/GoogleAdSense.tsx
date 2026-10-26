'use client';

import Script from 'next/script';
import { useAuthStore } from '@/stores/auth-store';

export default function GoogleAdSense({ clientId }: { clientId?: string }) {
  const { user } = useAuthStore();

  // Akun berbayar (subscriber) dibebaskan dari seluruh iklan AdSense
  if (!clientId || user?.is_subscribed) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
