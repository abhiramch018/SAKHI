export type AppLanguage = 'en' | 'hi' | 'mr';

const RECOGNITION_LANG: Record<AppLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

type RecognitionCtor = new () => SpeechRecognition;

function getRecognitionCtor(): RecognitionCtor | null {
  const w = window as Window & {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function createSpeechRecognition(language: AppLanguage): SpeechRecognition | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = RECOGNITION_LANG[language];
  recognition.maxAlternatives = 1;
  return recognition;
}

export function getRecognitionLanguage(language: AppLanguage): string {
  return RECOGNITION_LANG[language];
}
