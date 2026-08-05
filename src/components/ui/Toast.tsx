'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { create } from 'zustand';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  show: (message: string, type?: 'success' | 'error' | 'info') => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  show: (message, type = 'info') => {
    set({ message, type, visible: true });
  },
  hide: () => set({ visible: false }),
}));

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-800 text-white',
  error: 'bg-red-800 text-white',
  info: 'bg-tinta-900 text-white',
};

const iconStyles = {
  success: 'text-green-300',
  error: 'text-red-300',
  info: 'text-emas-300',
};

export default function Toast() {
  const { message, type, visible, hide } = useToast();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(hide, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, hide]);

  if (!visible) return null;

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-[100] max-w-sm transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div
        role="status"
        className={`flex items-start gap-3 rounded-lg p-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] ${styles[type]}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[type]}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={() => { setShow(false); setTimeout(hide, 300); }} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
