import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../lib/translations';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
  ];

  if (minimal) {
    return (
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`px-2 py-1 font-medium rounded-md transition-all ${
              language === opt.code
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {opt.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm text-sm">
      <Globe className="w-4 h-4 text-blue-800 ml-1.5" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent border-none text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-2 py-0.5"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="mr">मराठी (Marathi)</option>
      </select>
    </div>
  );
};

