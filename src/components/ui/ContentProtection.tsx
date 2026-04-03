'use client';

import { useEffect, useState } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+A
      if (e.ctrlKey && ['c', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('').catch(() => {});
        setBlurred(true);
        setTimeout(() => setBlurred(false), 2000);
      }
    };

    // Blur content when window loses focus (potential screenshot)
    const handleBlur = () => {
      setBlurred(true);
    };

    const handleFocus = () => {
      setBlurred(false);
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

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

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        filter: blurred ? 'blur(20px)' : 'none',
      }}
    >
      {/* Invisible overlay to prevent drag selection */}
      <div className="absolute inset-0 z-10 pointer-events-none" />
      {children}
    </div>
  );
}
