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
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
  info: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-indigo-500',
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
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${styles[type]}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[type]}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={() => { setShow(false); setTimeout(hide, 300); }} className="p-0.5 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
