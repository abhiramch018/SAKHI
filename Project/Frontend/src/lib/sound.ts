export const speechHelper = {
  speak: (text: string, lang: 'en' | 'hi' | 'mr' = 'en', onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/[-•]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    const speakWithVoice = () => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      const langMap: Record<string, string[]> = {
        hi: ['hi-IN', 'hi'],
        mr: ['mr-IN', 'mr'],
        en: ['en-IN', 'en-GB', 'en-US', 'en'],
      };

      const preferred = langMap[lang] || langMap.en;
      utterance.lang = preferred[0];

      const voice = voices.find((v) =>
        preferred.some((code) => v.lang.toLowerCase().startsWith(code.toLowerCase()))
      );
      if (voice) utterance.voice = voice;

      utterance.rate = lang === 'en' ? 0.95 : 0.9;
      utterance.pitch = 1.0;

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakWithVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speakWithVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  },

  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
};
