'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import jaTranslations from '@/locales/ja.json';
import koTranslations from '@/locales/ko.json';
import { isRTL } from '@/utils/formatters';

// Define the available languages
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

interface LanguageContextType {
  language: LanguageCode;
  isRTL: boolean;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLanguageName: (code: LanguageCode) => string;
  availableLanguages: LanguageCode[];
}

// Map of translations by language code
const translations: Record<LanguageCode, any> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ja: jaTranslations,
  ko: koTranslations
};

// Map of language names
const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  ko: '한국어'
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  isRTL: false,
  setLanguage: () => {},
  t: (key) => key,
  getLanguageName: (code) => languageNames[code],
  availableLanguages: ['en', 'es', 'fr', 'de', 'ja', 'ko']
});

// Create the Language Provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLanguage 
}) => {
  // Get initial language from localStorage or browser settings or default to 'en'
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const rtl = isRTL(language);

  useEffect(() => {
    const setInitialLanguage = () => {
      // Priority: 1. URL param, 2. initialLanguage prop, 3. localStorage, 4. browser language, 5. default 'en'
      
      // 1. Check URL param if available
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as LanguageCode | null;
      
      if (langParam && Object.keys(translations).includes(langParam)) {
        return langParam;
      }
      
      // 2. Check initialLanguage prop
      if (initialLanguage && Object.keys(translations).includes(initialLanguage)) {
        return initialLanguage;
      }
      
      // 3. Check localStorage
      const savedLanguage = localStorage.getItem('language') as LanguageCode | null;
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        return savedLanguage;
      }
      
      // 4. Check browser language
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      if (browserLang && Object.keys(translations).includes(browserLang)) {
        return browserLang;
      }
      
      // 5. Default to English
      return 'en';
    };
    
    const detectedLanguage = setInitialLanguage();
    setLanguageState(detectedLanguage);
  }, [initialLanguage]);

  // Effect to update document direction based on RTL
  useEffect(() => {
    if (rtl) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }, [rtl]);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function with support for nested keys (e.g., 'common.save')
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if the key doesn't exist in the current language
        let fallbackValue = translations.en;
        for (const fallbackKey of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            return key; // Return the key itself if not found in any language
          }
        }
        value = fallbackValue;
        break;
      }
    }

    // If the final value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }

    // Replace params in the translation string if provided
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, value);
    }

    return value;
  };

  const getLanguageName = (code: LanguageCode): string => {
    return languageNames[code] || code;
  };

  const availableLanguages = Object.keys(translations) as LanguageCode[];

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        isRTL: rtl,
        setLanguage, 
        t, 
        getLanguageName,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;

// HOC to get translations directly in components
export const withTranslation = <P extends object>(
  Component: React.ComponentType<P & { t: (key: string, params?: Record<string, string | number>) => string }>
) => {
  return (props: P) => {
    const { t } = useLanguage();
    return <Component {...props} t={t} />;
  };
}; 