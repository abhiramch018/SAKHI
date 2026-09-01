import React from 'react';
import { Sparkles, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Language, translations } from '../../lib/translations';
import { getLanguageLabel } from '../../lib/language';

interface AiGuidancePanelProps {
  guidanceText: string;
  error: string | null;
  isSpeaking: boolean;
  isLoading?: boolean;
  language: Language;
  onToggleSpeech: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const formatLine = (line: string, index: number) => {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('###')) {
    return (
      <h4 key={index} className="text-sm font-bold text-teal-900 mt-4 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
        {trimmed.replace(/^#+\s*/, '')}
      </h4>
    );
  }

  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    return (
      <p key={index} className="text-sm font-bold text-slate-800 mt-3 mb-1">
        {trimmed.replace(/\*\*/g, '')}
      </p>
    );
  }

  if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
    return (
      <li key={index} className="text-sm text-slate-700 leading-relaxed ml-4 list-disc">
        {trimmed.replace(/^[*-]\s*/, '').replace(/\*\*/g, '')}
      </li>
    );
  }

  return (
    <p key={index} className="text-sm text-slate-700 leading-relaxed">
      {trimmed.replace(/\*\*/g, '')}
    </p>
  );
};

export const AiGuidancePanel: React.FC<AiGuidancePanelProps> = ({
  guidanceText,
  error,
  isSpeaking,
  isLoading = false,
  language,
  onToggleSpeech,
  t,
}) => {
  const langLabel = getLanguageLabel(language);

  return (
    <div className="rounded-3xl overflow-hidden border border-teal-200/60 shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-blue-900 px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">{t('counsellingScript')}</h3>
            <span className="text-[10px] text-teal-100 font-medium">{t('verifiedProtocols')}</span>
          </div>
        </div>

        {guidanceText && !error && (
          <button
            type="button"
            onClick={onToggleSpeech}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              isSpeaking
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-white text-teal-900 hover:bg-amber-50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t('stopAudio')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{t('listenGuidance')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Language badge */}
      <div className="px-5 sm:px-6 pt-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          {t('audioInLanguage').replace('{lang}', langLabel)}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-teal-700">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">{t('loadingGuidance')}</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-sm text-rose-700 space-y-2">
            <p className="font-semibold">{t('aiUnavailable')}</p>
            <p className="text-xs">{error}</p>
            <p className="text-xs text-rose-600">{t('followProtocolActions')}</p>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-slate-50 to-white p-5 rounded-2xl border border-slate-100 space-y-1">
            {guidanceText.split('\n').map((line, i) => formatLine(line, i))}
          </div>
        )}
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="px-5 sm:px-6 pb-4">
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
            <span className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-1 bg-teal-600 rounded-full animate-pulse"
                  style={{ height: `${8 + (i % 2) * 6}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            <span className="text-xs font-semibold text-teal-800">
              {t('listenGuidance')} — {langLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
