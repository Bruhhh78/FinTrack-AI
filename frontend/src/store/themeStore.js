import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'dark' | 'light'

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        document.documentElement.setAttribute('data-theme', next);
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },

      // Call once on app boot to apply persisted theme
      applyTheme: () => {
        const t = get().theme;
        document.documentElement.setAttribute('data-theme', t);
      },
    }),
    {
      name: 'fintrack-theme',
    }
  )
);

export default useThemeStore;
