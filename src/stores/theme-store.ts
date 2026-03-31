import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggle: () => void;
  init: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',

  toggle: () => {
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    });
  },

  init: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved || preferred;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
