'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && ['c', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'F12') e.preventDefault();
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('').catch(() => {});
        setBlurred(true);
        setTimeout(() => setBlurred(false), 2000);
      }
    };

    const handleBlur = () => setBlurred(true);
    const handleFocus = () => setBlurred(false);
    const handleDragStart = (e: DragEvent) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const watermarkText = user?.email || 'SASMITA.COM';

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        filter: blurred ? 'blur(20px)' : 'none',
      }}
    >
      {/* Watermark overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 150px,
            rgba(0,0,0,0.02) 150px,
            rgba(0,0,0,0.02) 151px
          )`,
        }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap text-gray-300/20 font-bold text-sm select-none"
            style={{
              transform: 'rotate(-35deg)',
              top: `${i * 120 + 20}px`,
              left: '-100px',
              right: '-100px',
              textAlign: 'center',
              letterSpacing: '8px',
            }}
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <span key={j} className="mx-16">{watermarkText}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Print protection */}
      <style>{`@media print { .content-protected { display: none !important; } }`}</style>

      <div className="content-protected">
        {children}
      </div>
    </div>
  );
}
