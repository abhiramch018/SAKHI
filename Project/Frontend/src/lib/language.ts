import { Language } from './translations';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
};

export const getLanguageLabel = (lang: Language): string => LANGUAGE_LABELS[lang] || 'English';
