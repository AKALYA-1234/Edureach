import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import translations from '../utils/languages';

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'en',

      setLanguage: (language) => set({ language }),

      t: (key) => {
        const { language } = get();
        return translations[language]?.[key] || translations.en[key] || key;
      },
    }),
    {
      name: 'edureach-language',
    }
  )
);

export default useLanguageStore;
