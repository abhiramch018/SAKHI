import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { chatApi } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { speechHelper } from '../../lib/sound';
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  AppLanguage,
} from '../../lib/speechRecognition';
import { SakhiLogoMark } from '../../components/common/SakhiLogoMark';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import { Button } from '../../components/ui/Button';
import {
  Send,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PanelRightOpen,
  X,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
  retryQuery?: string;
}

const TOPIC_GROUPS = [
  {
    title: 'Maternal Nutrition',
    topics: [
      'Which local vegetables provide high iron and calcium?',
      'What foods should a pregnant woman eat in the first trimester?',
    ],
  },
  {
    title: 'IFA Compliance',
    topics: [
      'How should a mother manage nausea while taking IFA tablets?',
      'How to counsel mothers on IFA adherence?',
    ],
  },
  {
    title: 'Danger Signs',
    topics: [
      'What are the 3 critical danger signs in the 3rd trimester?',
      'What pregnancy symptoms require urgent referral?',
    ],
  },
  {
    title: 'Hospital Referral',
    topics: [
      'When should a pregnant woman be referred urgently via 108?',
      'What information should I give when referring to PHC?',
    ],
  },
];

const TODAY_TOPICS = [
  'IFA adherence counselling',
  'Pregnancy danger signs',
  'Nutrition during pregnancy',
  'When to refer to hospital',
];

const EMPTY_HINTS = [
  'Maternal nutrition',
  'IFA adherence',
  'Pregnancy danger signs',
  'Hospital referral',
  'Child health',
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function QuickReferencePanel({
  onSelect,
  className = '',
}: {
  onSelect: (q: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="shrink-0 px-3 py-2.5 border-b border-slate-200 bg-slate-50">
        <h2 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
          Suggested for today&apos;s work
        </h2>
        <ul className="mt-1.5 space-y-0.5">
          {TODAY_TOPICS.map((topic) => (
            <li key={topic}>
              <button
                type="button"
                onClick={() => onSelect(topic)}
                className="w-full text-left text-[11px] text-slate-600 hover:text-blue-900 hover:bg-white px-1.5 py-1 transition-colors"
              >
                • {topic}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2.5">
        <h2 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">
          Counselling Topics
        </h2>
        <div className="space-y-3">
          {TOPIC_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onSelect(topic)}
                    className="w-full text-left text-[11px] leading-snug text-slate-700 bg-white border border-slate-200 hover:border-blue-900 hover:text-blue-900 px-2 py-1.5 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-3 py-2 border-t border-slate-200 text-[10px] text-slate-500">
        <span className="font-semibold text-slate-600">Knowledge support:</span> Maternal &amp; Child Health
      </div>
    </div>
  );
}

export const AWWAskPage: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [topicsOpen, setTopicsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const voiceSupported = isSpeechRecognitionSupported();
  const hasConversation = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      speechHelper.stop();
    };
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    speechHelper.stop();
    setSpeakingId(null);
  }, []);

  const handleSpeak = useCallback(
    (messageId: string, text: string) => {
      if (speakingId === messageId) {
        stopSpeaking();
        return;
      }
      stopSpeaking();
      setSpeakingId(messageId);
      speechHelper.speak(text, language as AppLanguage, () => setSpeakingId(null));
    },
    [language, speakingId, stopSpeaking]
  );

  const sendMessage = useCallback(
    async (queryText: string) => {
      const textToSend = queryText.trim();
      if (!textToSend || isLoading) return;

      stopSpeaking();
      stopListening();

      const userMsg: ChatMessage = {
        id: 'u_' + Date.now(),
        sender: 'user',
        text: textToSend,
        timestamp: formatTime(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputQuery('');
      setVoiceTranscript('');
      setIsLoading(true);

      try {
        const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';
        const reply = await chatApi.ask(textToSend, langName);

        setMessages((prev) => [
          ...prev,
          {
            id: 'b_' + Date.now(),
            sender: 'bot',
            text: reply,
            timestamp: formatTime(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: 'b_' + Date.now(),
            sender: 'bot',
            text: 'SAKHI AI is temporarily unavailable.\n\nPlease check your connection and try again.',
            timestamp: formatTime(),
            isError: true,
            retryQuery: textToSend,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, language, stopListening, stopSpeaking]
  );

  const startListening = useCallback(() => {
    if (!voiceSupported) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    setVoiceError(null);
    stopListening();
    stopSpeaking();

    const recognition = createSpeechRecognition(language as AppLanguage);
    if (!recognition) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    recognitionRef.current = recognition;
    setIsListening(true);
    setVoiceTranscript('');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      const combined = (final || interim).trim();
      setVoiceTranscript(combined);
      if (final) setInputQuery(final.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted') {
        setVoiceError(
          event.error === 'not-allowed'
            ? 'Microphone permission denied. Please allow microphone access.'
            : 'Voice input failed. Please try again or type your question.'
        );
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      inputRef.current?.focus();
    };

    try {
      recognition.start();
    } catch {
      setVoiceError('Unable to start voice input. Please try again.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [language, stopListening, stopSpeaking, voiceSupported]);

  const clearChat = () => {
    stopListening();
    stopSpeaking();
    setMessages([]);
    setInputQuery('');
    setVoiceTranscript('');
    setVoiceError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputQuery);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white border border-slate-200 pb-14 md:pb-0">
      {/* Compact page header */}
      <header className="shrink-0 border-b border-slate-200 px-4 py-2 bg-white">
        <nav
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1"
          aria-label="Breadcrumb"
        >
          AWW Portal <span className="text-slate-300 mx-1">/</span> Counselling{' '}
          <span className="text-slate-300 mx-1">/</span>{' '}
          <span className="text-slate-600">Counselling Assistant</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h1 className="text-base font-bold text-slate-900">AWW Counselling Assistant</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 border border-slate-200 px-2 py-0.5 bg-slate-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Available
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageToggle minimal />
            <Link to="/aww/counselling/new">
              <Button variant="primary" size="sm">
                Start Counselling
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setTopicsOpen(true)}
              className="lg:hidden p-2 border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Open counselling topics"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
          Evidence-based guidance for maternal and child health counselling. AI-assisted support for field workers.
        </p>
      </header>

      {/* Main workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Chat column */}
        <div className="flex flex-col min-h-0 min-w-0 border-r border-slate-200">
          <div className="shrink-0 px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                Counselling Session
              </div>
              <div className="text-[10px] text-slate-500">Maternal &amp; Child Health Support</div>
            </div>
            <button
              type="button"
              onClick={clearChat}
              disabled={!hasConversation && !inputQuery}
              className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 disabled:opacity-40"
              aria-label="Clear conversation"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          {/* Messages — only this area scrolls */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-3 bg-[#f8f9fb]"
            role="log"
            aria-live="polite"
            aria-label="Counselling conversation"
          >
            {!hasConversation && !isLoading && (
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <SakhiLogoMark size={28} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">SAKHI AI</div>
                    <div className="text-[10px] text-slate-500">Maternal &amp; Child Health Counselling Assistant</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-3">How can I support your counselling work today?</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Ask about:</p>
                <ul className="text-[11px] text-slate-600 space-y-0.5">
                  {EMPTY_HINTS.map((hint) => (
                    <li key={hint}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="shrink-0 mt-1">
                      <SakhiLogoMark size={22} />
                    </div>
                  )}

                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.sender === 'bot' && (
                      <div className="text-[9px] font-bold text-teal-800 uppercase tracking-widest mb-0.5">
                        SAKHI
                      </div>
                    )}

                    <div
                      className={`text-[13px] leading-relaxed px-3 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-blue-900 text-white text-left'
                          : msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900'
                          : 'bg-white border border-slate-200 text-slate-800'
                      } whitespace-pre-line`}
                    >
                      {msg.text}
                      {msg.isError && msg.retryQuery && (
                        <button
                          type="button"
                          onClick={() => sendMessage(msg.retryQuery!)}
                          className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-800 hover:underline"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                      {msg.sender === 'bot' && !msg.isError && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="text-slate-400 hover:text-blue-900 p-0.5"
                          aria-label={speakingId === msg.id ? 'Stop reading aloud' : 'Listen to response'}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="shrink-0 mt-1">
                    <SakhiLogoMark size={22} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-teal-800 uppercase tracking-widest mb-0.5">
                      SAKHI
                    </div>
                    <div className="bg-white border border-slate-200 px-3 py-2 text-[13px] text-slate-600 flex items-center gap-2">
                      <span className="flex gap-0.5" aria-hidden="true">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </span>
                      SAKHI is preparing guidance…
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer — fixed at bottom of chat panel */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5">
            {isListening && (
              <div className="mb-2 flex items-center justify-between gap-2 px-2 py-1.5 bg-teal-50 border border-teal-200 text-[11px] text-teal-900">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
                  </span>
                  Listening… speak your question
                </span>
                <button
                  type="button"
                  onClick={stopListening}
                  className="font-semibold text-teal-800 hover:underline"
                >
                  Stop
                </button>
              </div>
            )}

            {voiceTranscript && isListening && (
              <p className="mb-2 text-[11px] text-slate-600 px-1 italic truncate">
                &ldquo;{voiceTranscript}&rdquo;
              </p>
            )}

            {voiceError && (
              <p className="mb-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1">
                {voiceError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={!voiceSupported && !isListening}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-2 border text-[11px] font-semibold transition-colors ${
                  isListening
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-blue-900 hover:text-blue-900'
                } disabled:opacity-50`}
                aria-label={isListening ? 'Stop voice input' : 'Ask by voice'}
                title={voiceSupported ? 'Ask by voice' : 'Voice not supported'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isListening ? 'Stop' : 'Voice'}</span>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Type your counselling question..."
                className="flex-1 min-w-0 px-3 py-2 border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 bg-white"
                aria-label="Counselling question"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLoading}
                disabled={!inputQuery.trim() || isLoading}
                leftIcon={<Send className="w-3.5 h-3.5" />}
                aria-label="Send message"
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Right quick reference — desktop */}
        <aside className="hidden lg:flex flex-col min-h-0 bg-slate-50/80">
          <QuickReferencePanel onSelect={(q) => sendMessage(q)} className="h-full" />
        </aside>
      </div>

      {/* Mobile / tablet topics drawer */}
      {topicsOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setTopicsOpen(false)} />
          <div className="relative w-[min(300px,90vw)] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col">
            <div className="shrink-0 px-3 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Quick Reference</span>
              <button
                type="button"
                onClick={() => setTopicsOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800"
                aria-label="Close topics panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <QuickReferencePanel
              onSelect={(q) => {
                setTopicsOpen(false);
                sendMessage(q);
              }}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
