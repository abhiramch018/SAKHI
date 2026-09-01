import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';
import { beneficiaryApi, counsellingApi, decisionTreeApi, aiApi, chatApi, reportApi, getApiErrorMessage } from '../../lib/api';
import { getTierQuestions } from '../../lib/counsellingQuestions';
import { getLanguageLabel } from '../../lib/language';
import { downloadReportPdf } from '../../lib/reportPdf';
import { AiGuidancePanel } from '../../components/aww/AiGuidancePanel';
import { Beneficiary, CounsellingEligibility, DecisionTreeResult, Report } from '../../types';
import { speechHelper } from '../../lib/sound';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  HeartPulse,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Send,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Check,
  ShieldAlert,
  Clock,
  User,
  Download,
  FileText,
  Star,
  Lock
} from 'lucide-react';

export const CounsellingFlowPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline, queueSubmission } = useOffline();
  const { language, t } = useLanguage();

  const [step, setStep] = useState<'SELECT' | 'QUESTIONS' | 'GUIDANCE' | 'FEEDBACK' | 'SUCCESS'>('SELECT');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [eligibilityMap, setEligibilityMap] = useState<Record<string, CounsellingEligibility>>({});
  const [previewBeneficiary, setPreviewBeneficiary] = useState<Beneficiary | null>(null);
  const [previousReports, setPreviousReports] = useState<Report[]>([]);
  const [previousReportsLoading, setPreviousReportsLoading] = useState(false);
  const [beneficiariesError, setBeneficiariesError] = useState<string | null>(null);
  const [beneficiariesLoading, setBeneficiariesLoading] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [tier, setTier] = useState<1 | 2 | 3>(1);

  const tierQuestions = useMemo(
    () => getTierQuestions(language, tier),
    [language, tier]
  );

  // Questionnaire state
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);

  // Result state
  const [sessionId, setSessionId] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<DecisionTreeResult | null>(null);
  const [aiGuidanceText, setAiGuidanceText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Embedded doubt chat state
  const [doubtInput, setDoubtInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'aww' | 'ai'; text: string }[]>([]);
  const [isAskingDoubt, setIsAskingDoubt] = useState(false);

  // Generated Report
  const [finalReport, setFinalReport] = useState<Report | null>(null);

  // Beneficiary feedback
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Load beneficiaries
  useEffect(() => {
    const init = async () => {
      setBeneficiariesLoading(true);
      setBeneficiariesError(null);
      try {
        const list = await beneficiaryApi.getAll();
        setBeneficiaries(list);

        const eligibilityEntries = await Promise.all(
          list.map(async (b) => {
            try {
              const elig = await counsellingApi.getEligibility(b._id);
              return [b._id, elig] as const;
            } catch {
              return [b._id, { eligible: true }] as const;
            }
          })
        );
        setEligibilityMap(Object.fromEntries(eligibilityEntries));

        const paramId = searchParams.get('beneficiaryId');
        if (paramId) {
          const found = list.find((b) => b._id === paramId);
          if (found) {
            await handlePreviewBeneficiary(found);
          }
        }
      } catch (err) {
        setBeneficiariesError(getApiErrorMessage(err));
      } finally {
        setBeneficiariesLoading(false);
      }
    };
    init();
  }, [searchParams]);

  const handlePreviewBeneficiary = async (ben: Beneficiary) => {
    setPreviewBeneficiary(ben);
    setPreviousReportsLoading(true);
    try {
      const reports = await reportApi.getByBeneficiary(ben._id);
      setPreviousReports(reports);
    } catch {
      setPreviousReports([]);
    } finally {
      setPreviousReportsLoading(false);
    }
  };

  const handleStartSession = () => {
    if (!previewBeneficiary) return;
    const elig = eligibilityMap[previewBeneficiary._id];
    if (elig && !elig.eligible) return;

    setSelectedBeneficiary(previewBeneficiary);
    const detectedTier: 1 | 2 | 3 =
      previewBeneficiary.monthOfPregnancy <= 3 ? 1 : previewBeneficiary.monthOfPregnancy <= 6 ? 2 : 3;
    setTier(detectedTier);
    setAnswers({});
    setFeedbackRating(0);
    setFeedbackComment('');
    setFinalReport(null);
    setStep('QUESTIONS');
  };

  const formatEligibilityDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleAnswerSelect = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const fetchGuidance = async (evaluation: DecisionTreeResult, lang: typeof language) => {
    setIsLoadingGuidance(true);
    setAiError(null);
    speechHelper.stop();
    setIsSpeaking(false);
    try {
      const guidance = await aiApi.generateGuidance(evaluation, getLanguageLabel(lang));
      setAiGuidanceText(guidance);
    } catch (aiErr) {
      setAiGuidanceText('');
      setAiError(getApiErrorMessage(aiErr));
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  // Re-generate guidance when language changes on the guidance step
  useEffect(() => {
    if (step !== 'GUIDANCE' || !evaluationResult || isOfflineSaved) return;
    fetchGuidance(evaluationResult, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, evaluationResult, language, isOfflineSaved]);

  // Submit questions for clinical evaluation
  const handleEvaluateAndGenerateGuidance = async () => {
    if (!selectedBeneficiary) return;

    const currentQuestions = tierQuestions;
    const formattedAnswers = currentQuestions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || 'NO',
    }));

    setIsSubmitting(true);
    setSubmitError(null);
    setIsOfflineSaved(false);

    try {
      if (!isOnline) {
        queueSubmission({
          beneficiaryId: selectedBeneficiary._id,
          tier: tier,
          answers: formattedAnswers,
          beneficiaryName: selectedBeneficiary.name,
        });
        setSessionId('offline_' + Date.now());
        setIsOfflineSaved(true);
        setEvaluationResult(null);
        setAiGuidanceText('');
        setStep('GUIDANCE');
        return;
      }

      if (!user?.id) {
        throw new Error('Session expired. Please log in again.');
      }

      // Online flow
      const session = await counsellingApi.create({
        beneficiary: selectedBeneficiary._id,
        aww: user.id,
        tier: tier,
        answers: formattedAnswers,
      });
      setSessionId(session._id);

      const evaluation = await decisionTreeApi.evaluate(tier, formattedAnswers);
      setEvaluationResult(evaluation);
      setStep('GUIDANCE');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice narration toggle
  const toggleSpeech = () => {
    if (isSpeaking) {
      speechHelper.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechHelper.speak(aiGuidanceText, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Embedded doubt chat submit
  const handleSendDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;

    const query = doubtInput;
    setDoubtInput('');
    setChatHistory((prev) => [...prev, { sender: 'aww', text: query }]);
    setIsAskingDoubt(true);

    try {
      const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';
      const aiReply = await chatApi.ask(query, langName);
      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: getApiErrorMessage(err) },
      ]);
    } finally {
      setIsAskingDoubt(false);
    }
  };

  // Proceed to feedback step after counselling guidance
  const handleProceedToFeedback = () => {
    if (isOfflineSaved) {
      setStep('SUCCESS');
      return;
    }
    setStep('FEEDBACK');
  };

  // Final step: Mark attendance, save feedback, create report
  const handleSubmitFeedback = async () => {
    if (!selectedBeneficiary || feedbackRating < 1) return;

    if (!evaluationResult || !user?.id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (sessionId && !sessionId.startsWith('offline_')) {
        await counsellingApi.markAttendance(sessionId);
      }

      const rep = await reportApi.create({
        counselling: sessionId,
        beneficiary: selectedBeneficiary._id,
        aww: user.id,
        riskLevel: evaluationResult.riskLevel,
        actions: evaluationResult.actions,
        aiGuidance: aiGuidanceText || `AI guidance unavailable. Follow protocol actions for ${evaluationResult.riskLevel} risk.`,
        beneficiaryFeedback: {
          rating: feedbackRating,
          comment: feedbackComment.trim(),
          submittedAt: new Date().toISOString(),
        },
      });

      setFinalReport(rep);
      setStep('SUCCESS');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress tracker header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-900" />
            <h1 className="font-bold text-slate-900 text-sm sm:text-base">
              {t('counsellingFlowTitle')}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-wrap justify-end">
            <span className={step === 'SELECT' ? 'text-blue-900 underline' : ''}>{t('stepMother')}</span>
            <span>→</span>
            <span className={step === 'QUESTIONS' ? 'text-blue-900 underline' : ''}>{t('stepScreening')}</span>
            <span>→</span>
            <span className={step === 'GUIDANCE' ? 'text-blue-900 underline' : ''}>{t('stepGuidance')}</span>
            <span>→</span>
            <span className={step === 'FEEDBACK' ? 'text-blue-900 underline' : ''}>{t('stepFeedback')}</span>
            <span>→</span>
            <span className={step === 'SUCCESS' ? 'text-emerald-700 underline' : ''}>{t('stepCompleted')}</span>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT BENEFICIARY */}
      {step === 'SELECT' && (
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 1: Select Beneficiary Mother</h2>
            <p className="text-xs text-slate-500">
              Choose the woman you are visiting to automatically tailor the pregnancy tier questionnaire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {beneficiaries.map((ben) => {
              const benTier = ben.monthOfPregnancy <= 3 ? 1 : ben.monthOfPregnancy <= 6 ? 2 : 3;
              const elig = eligibilityMap[ben._id];
              const isEligible = elig?.eligible !== false;
              const isSelected = previewBeneficiary?._id === ben._id;

              return (
                <div
                  key={ben._id}
                  onClick={() => handlePreviewBeneficiary(ben)}
                  className={`p-4 rounded-xl border transition-all space-y-2 cursor-pointer ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20'
                      : isEligible
                      ? 'border-slate-200 hover:border-blue-900 hover:bg-blue-50/40'
                      : 'border-slate-200 bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{ben.name}</span>
                    <Badge variant={benTier === 1 ? 'info' : benTier === 2 ? 'warning' : 'high'} size="sm">
                      Tier {benTier} (Mo {ben.monthOfPregnancy})
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div>Age: {ben.age} · Phone: {ben.phone}</div>
                    <div>Guardian: {ben.guardianName} ({ben.guardianRelation})</div>
                  </div>
                  <div className="pt-1">
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> {t('counsellingAvailable')}
                      </span>
                    ) : elig?.reason === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> {t('counsellingInProgress')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />{' '}
                        {t('counsellingCooldown').replace(
                          '{date}',
                          formatEligibilityDate(elig?.nextAvailableDate)
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {previewBeneficiary && (
            <Card className="bg-slate-50 border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{previewBeneficiary.name}</h3>
                  <p className="text-xs text-slate-500">{t('previousReports')}</p>
                </div>
                {eligibilityMap[previewBeneficiary._id]?.eligible !== false ? (
                  <Button onClick={handleStartSession} variant="warm" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {t('startSession')}
                  </Button>
                ) : (
                  <div className="text-xs text-rose-600 font-semibold text-right max-w-[200px]">
                    {eligibilityMap[previewBeneficiary._id]?.reason === 'IN_PROGRESS'
                      ? t('counsellingInProgress')
                      : t('counsellingCooldown').replace(
                          '{date}',
                          formatEligibilityDate(eligibilityMap[previewBeneficiary._id]?.nextAvailableDate)
                        )}
                  </div>
                )}
              </div>

              {previousReportsLoading ? (
                <p className="text-xs text-slate-400">{t('loadingGuidance')}</p>
              ) : previousReports.length === 0 ? (
                <p className="text-xs text-slate-500">{t('noPreviousReports')}</p>
              ) : (
                <div className="space-y-2">
                  {previousReports.map((rep) => (
                    <div
                      key={rep._id}
                      className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-900 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {new Date(rep.reportDate || rep.createdAt || Date.now()).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-[10px] text-slate-500">{rep.riskLevel} Risk</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReportPdf(rep);
                        }}
                      >
                        {t('downloadPdf')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {!previewBeneficiary && beneficiaries.length > 0 && (
            <p className="text-xs text-slate-400 text-center">{t('selectBeneficiaryFirst')}</p>
          )}

          <div className="pt-2 text-center">
            <Button
              onClick={() => navigate('/aww/beneficiaries')}
              variant="outline"
              size="sm"
            >
              + Register New Woman First
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: QUESTIONNAIRE */}
      {step === 'QUESTIONS' && selectedBeneficiary && (
        <div className="space-y-6">
          {/* Beneficiary & Tier Selector Banner */}
          <Card className="bg-linear-to-r from-blue-900 to-indigo-900 text-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-blue-200 uppercase font-bold">Counselling Session for</span>
                <h2 className="text-xl font-black">{selectedBeneficiary.name}</h2>
                <div className="text-xs text-blue-100">
                  Month {selectedBeneficiary.monthOfPregnancy} · Weight: {selectedBeneficiary.weight}kg · Age: {selectedBeneficiary.age}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Assigned Screening Tier</span>
                <div className="inline-flex rounded-xl bg-white/20 p-1 backdrop-blur-xs">
                  {([1, 2, 3] as const).map((tNum) => (
                    <button
                      key={tNum}
                      type="button"
                      onClick={() => setTier(tNum)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        tier === tNum ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {tNum === 1 ? t('tier1') : tNum === 2 ? t('tier2') : t('tier3')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Screening Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                {t('tierQuestionnaire')
                  .replace('{tier}', String(tier))
                  .replace('{count}', String(tierQuestions.length))}
              </h3>
              <span className="text-xs text-slate-500">{t('tapObservedCondition')}</span>
            </div>

            {tierQuestions.map((q, idx) => {
              const currentAns = answers[q.id];
              return (
                <Card key={q.id} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{q.text}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-8">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswerSelect(q.id, opt.value)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                          currentAns === opt.value
                            ? 'border-blue-900 bg-blue-50 text-blue-900 ring-2 ring-blue-900/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {currentAns === opt.value && <Check className="w-4 h-4 text-blue-900 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep('SELECT')}
            >
              {t('changeBeneficiary')}
            </Button>

            <Button
              variant="warm"
              size="lg"
              onClick={handleEvaluateAndGenerateGuidance}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="shadow-md"
            >
              {t('evaluateGuidance')}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: AI GUIDANCE & RISK ASSESSMENT (or offline saved state) */}
      {step === 'GUIDANCE' && selectedBeneficiary && (isOfflineSaved || evaluationResult) && (
        <div className="space-y-6">
          {isOfflineSaved ? (
            <Card className="p-6 bg-amber-50 border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Clock className="w-5 h-5" />
                <span>Saved Locally — Waiting for Sync</span>
              </div>
              <p className="text-sm text-amber-800">
                Counselling responses for <strong>{selectedBeneficiary.name}</strong> have been saved on this device.
                Risk evaluation and AI guidance will be generated when you reconnect and sync.
              </p>
              <p className="text-xs text-amber-700">
                Status: OFFLINE → SAVED LOCALLY → WAITING FOR SYNC
              </p>
            </Card>
          ) : evaluationResult && (
          <>
          {/* Risk Level Header Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3 ${
              evaluationResult.riskLevel === 'HIGH'
                ? 'bg-gradient-to-r from-rose-900 via-red-800 to-amber-900'
                : evaluationResult.riskLevel === 'MEDIUM'
                ? 'bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800'
                : 'bg-gradient-to-r from-teal-800 via-emerald-800 to-blue-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {t('clinicalAssessmentComplete')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {t('riskCategory')}: {evaluationResult.riskLevel}
                </h2>
                <p className="text-xs text-white/90">
                  {t('beneficiaryLabel')}: <strong>{selectedBeneficiary.name}</strong> ({t('monthLabel')} {selectedBeneficiary.monthOfPregnancy})
                </p>
              </div>
            </div>
          </div>

          {/* Action Checklist */}
          {evaluationResult.actions.length > 0 && (
            <Card className="space-y-3 border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t('protocolActions')}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800">
                {evaluationResult.actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* AI Guidance Panel */}
          <AiGuidancePanel
            guidanceText={aiGuidanceText}
            error={aiError}
            isSpeaking={isSpeaking}
            isLoading={isLoadingGuidance}
            language={language}
            onToggleSpeech={toggleSpeech}
            t={t}
          />

          {/* Inline Doubt Resolution Chat */}
          <Card className="space-y-4 border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {t('askAiDoubt')}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">{t('contextualChat')}</span>
            </div>

            {chatHistory.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'aww' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                        msg.sender === 'aww'
                          ? 'bg-blue-900 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendDoubt} className="flex gap-2">
              <input
                type="text"
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                placeholder="Ask e.g. 'How should she take iron if nausea occurs?'"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isAskingDoubt}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Ask
              </Button>
            </form>
          </Card>
          </>
          )}

          {submitError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              {submitError}
            </div>
          )}

          {/* Complete Visit Button */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-base">{t('finishedCounselling')}</h4>
              <p className="text-xs text-slate-500">
                {t('markAttendanceDesc')}
              </p>
            </div>

            <Button
              onClick={handleProceedToFeedback}
              variant="warm"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
              className="w-full sm:w-auto font-bold shadow-md"
            >
              {isOfflineSaved ? 'Acknowledge & Return' : t('continueToFeedback')}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: BENEFICIARY FEEDBACK */}
      {step === 'FEEDBACK' && selectedBeneficiary && (
        <Card className="space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900">{t('beneficiaryFeedbackTitle')}</h2>
            <p className="text-xs text-slate-500">{t('beneficiaryFeedbackDesc')}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-800">{t('feedbackRating')}</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">{t('feedbackComment')}</label>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="e.g. Mother found the advice helpful and easy to follow..."
            />
          </div>

          {submitError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep('GUIDANCE')}>
              ← Back
            </Button>
            <Button
              variant="warm"
              size="lg"
              onClick={handleSubmitFeedback}
              isLoading={isSubmitting}
              disabled={feedbackRating < 1}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              {t('submitFeedback')}
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: SUCCESS CELEBRATION */}
      {step === 'SUCCESS' && selectedBeneficiary && (
        <Card className="text-center py-10 px-6 space-y-6 max-w-xl mx-auto shadow-xl border-emerald-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              {isOfflineSaved ? 'Session Saved Locally' : 'Counselling Visit Successfully Recorded!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {isOfflineSaved ? (
                <>
                  Responses for <strong>{selectedBeneficiary.name}</strong> are saved on this device and will sync when you are back online.
                </>
              ) : (
                <>
                  Attendance marked for <strong>{selectedBeneficiary.name}</strong>. A full counselling report has been created and synced.
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficiary:</span>
              <span className="font-bold text-slate-800">{selectedBeneficiary.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="font-bold text-blue-900">{evaluationResult?.riskLevel} Risk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-700">
                {isOfflineSaved ? 'Saved Locally — Waiting for Sync' : 'Attendance Verified & Locked'}
              </span>
            </div>
            {!isOfflineSaved && finalReport?.beneficiaryFeedback?.rating && (
              <div className="flex justify-between">
                <span className="text-slate-400">Feedback:</span>
                <span className="font-bold text-amber-600">
                  {'★'.repeat(finalReport.beneficiaryFeedback.rating)} ({finalReport.beneficiaryFeedback.rating}/5)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {finalReport && !isOfflineSaved && (
              <Button
                onClick={() => downloadReportPdf(finalReport)}
                variant="primary"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
              >
                {t('viewDownloadPdf')}
              </Button>
            )}
            <Button
              onClick={() => {
                setStep('SELECT');
                setSelectedBeneficiary(null);
                setPreviewBeneficiary(null);
                setAnswers({});
                setEvaluationResult(null);
                setFeedbackRating(0);
                setFeedbackComment('');
                setFinalReport(null);
              }}
              variant="warm"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Start Another Counselling Visit
            </Button>
            <Button
              onClick={() => navigate('/aww/reports')}
              variant="outline"
              size="md"
            >
              View Reports Archive
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

