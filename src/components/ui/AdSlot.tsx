'use client';

import { useEffect, useState } from 'react';

interface Ad {
  id: number;
  name: string;
  slotId?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
  isActive: boolean;
}

export default function AdSlot({ position }: { position: string }) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ads/active`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data) {
          const found = data.data.find((a: Ad) => a.position === position);
          if (found) setAd(found);
        }
      })
      .catch(() => {});
  }, [position]);

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
