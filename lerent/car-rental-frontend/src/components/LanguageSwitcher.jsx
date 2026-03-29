import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'hu', label: 'Magyar',     flag: '🇭🇺' },
];

// variant="header" (default) — compact button, dropdown right-aligned
// variant="sidebar" — full-width button, dropdown left-aligned
const LanguageSwitcher = ({ onSelect, variant = 'header' }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setOpen(false);
    onSelect?.();
  };

  const isSidebar = variant === 'sidebar';

  return (
    <div ref={ref} className={`relative ${isSidebar ? 'w-full' : ''}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 border border-gray-500 rounded-lg hover:border-[#fa9208] transition-colors duration-200 text-white text-sm font-bold ${
          isSidebar
            ? 'w-full px-4 py-3 justify-between'
            : 'px-3 py-1.5'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{current.flag}</span>
          <span>{isSidebar ? current.label : current.code.toUpperCase()}</span>
        </div>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute mt-2 w-44 rounded-lg border border-gray-700 overflow-hidden z-[60] shadow-xl ${
            isSidebar ? 'left-0' : 'right-0'
          }`}
          style={{ backgroundColor: '#111' }}
        >
          {LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                language === code
                  ? 'text-[#fa9208] bg-white/5'
                  : 'text-white hover:bg-white/5 hover:text-[#fa9208]'
              }`}
            >
              <span className="text-base leading-none">{flag}</span>
              <span className="font-medium">{label}</span>
              {language === code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#fa9208]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
