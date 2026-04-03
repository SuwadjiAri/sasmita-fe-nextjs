'use client';

import { useEffect, useState } from 'react';

interface Ad {
  id: number;
  name: string;
  slotId?: string;
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

  if (!ad || !ad.slotId) return null;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4 text-center my-6">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Iklan</p>
      <div dangerouslySetInnerHTML={{ __html: ad.slotId }} />
    </div>
  );
}
