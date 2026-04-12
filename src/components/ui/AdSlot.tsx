'use client';

import { useEffect, useState, createContext, useContext } from 'react';

interface Ad {
  id: number;
  name: string;
  slotId?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
  isActive: boolean;
}

const AdsContext = createContext<Ad[] | null>(null);

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ads/active`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data) setAds(data.data);
      })
      .catch(() => {});
  }, []);

  return <AdsContext.Provider value={ads}>{children}</AdsContext.Provider>;
}

export default function AdSlot({ position }: { position: string }) {
  const contextAds = useContext(AdsContext);
  const [fallbackAd, setFallbackAd] = useState<Ad | null>(null);

  // Fallback: fetch sendiri jika tidak dibungkus AdsProvider
  useEffect(() => {
    if (contextAds !== null) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ads/active`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data) {
          const found = data.data.find((a: Ad) => a.position === position);
          if (found) setFallbackAd(found);
        }
      })
      .catch(() => {});
  }, [position, contextAds]);

  const ad = contextAds ? contextAds.find(a => a.position === position) : fallbackAd;

  if (!ad) return null;
  if (!ad.imageUrl && !ad.slotId) return null;

  return (
    <div className="my-6 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Iklan</p>
      {ad.imageUrl ? (
        ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-block rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <img src={ad.imageUrl} alt={ad.name} className="max-w-full h-auto rounded-xl" />
          </a>
        ) : (
          <div className="inline-block rounded-xl overflow-hidden">
            <img src={ad.imageUrl} alt={ad.name} className="max-w-full h-auto rounded-xl" />
          </div>
        )
      ) : ad.slotId ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4" dangerouslySetInnerHTML={{ __html: ad.slotId }} />
      ) : null}
    </div>
  );
}
