import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { sk, en, hu } from '../i18n';

const translations = { sk, en, hu };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('lerent-lang') || 'sk';
    } catch {
      return 'sk';
    }
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('lerent-lang', lang);
    } catch {
      // localStorage not available
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    if (language === 'sk') setLanguage('en');
    else if (language === 'en') setLanguage('hu');
    else setLanguage('sk');
  }, [language, setLanguage]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value == null) return key;
      value = value[k];
    }
    return value ?? key;
  }, [language]);

  // Helper for backend objects that return both language versions (e.g. nameEn / name)
  // Usage: tf(obj, 'name') → obj.nameEn (if EN) || obj.name (fallback); SK/HU use obj.name
  const tf = useCallback((obj, field) => {
    if (!obj) return '';
    if (language === 'hu') {
      return obj[`${field}Hu`] || obj[field] || '';
    }
    if (language === 'en') {
      return obj[`${field}En`] || obj[field] || '';
    }
    return obj[field] || '';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
    tf,
    isEn: language === 'en',
    isSk: language === 'sk',
    isHu: language === 'hu',
    locale: language === 'en' ? 'en-GB' : language === 'hu' ? 'hu-HU' : 'sk-SK'
  }), [language, setLanguage, toggleLanguage, t, tf]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
