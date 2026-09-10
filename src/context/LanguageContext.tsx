import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { translations, TranslationKey, getCategoryLabel } from '../locales/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  tCat: (catJa: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'lang_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ja') {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
    return 'ja';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore storage access errors
    }
  }, []);

  // Dynamically update <html lang="..."> for SEO and screen reader accuracy
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[lang] || translations.ja;
    let text: string = dict[key] || translations.ja[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  }, [lang]);

  const tCat = useCallback((catJa: string): string => {
    return getCategoryLabel(catJa, lang);
  }, [lang]);

  const value = {
    lang,
    setLang,
    t,
    tCat
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
