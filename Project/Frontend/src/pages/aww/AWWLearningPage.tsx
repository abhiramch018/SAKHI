import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { learningApi } from '../../lib/api';
import { Course, LearningProgress } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  HelpCircle,
  Award,
  Video,
  Sparkles,
  Check
} from 'lucide-react';

export const AWWLearningPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressList, setProgressList] = useState<LearningProgress[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [crs, prg] = await Promise.all([
        learningApi.getCourses(),
        learningApi.getAWWProgress(user?.id || 'aww_01')
      ]);
      setCourses(crs);
      setProgressList(prg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openCourse = (c: Course) => {
    setActiveCourse(c);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectQuizAnswer = (qIdx: number, opt: string) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const handleEvaluateQuiz = async () => {
    if (!activeCourse) return;
    setIsSaving(true);

    let correctCount = 0;
    activeCourse.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / activeCourse.questions.length) * 100);
    setQuizScore(scorePercentage);
    setQuizSubmitted(true);

    try {
      await learningApi.updateProgress(user?.id || 'aww_01', activeCourse._id, {
        completed: scorePercentage >= 50,
        quizScore: scorePercentage
      });
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-teal-200">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>AWW Continuous Professional Development</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Bite-Sized Training Modules
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Watch 3-minute video lessons on maternal nutrition and take quick quizzes to earn certification points.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c) => {
          const isDone = progressList.some(p => (typeof p.course === 'object' ? p.course?._id : p.course) === c._id && p.completed);

          return (
            <Card
              key={c._id}
              hoverable
              onClick={() => openCourse(c)}
              className="space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
                  {isDone ? (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 inline" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      In Progress
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-teal-700" /> Video Lesson
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-900" /> {c.questions?.length || 2} Quiz Questions
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-blue-900 flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-blue-900" /> Start Module
                </span>
                <span className="text-[10px] text-slate-400">3–5 mins</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* COURSE PLAYER & QUIZ MODAL */}
      {activeCourse && (
        <Modal
          isOpen={!!activeCourse}
          onClose={() => setActiveCourse(null)}
          title={activeCourse.title}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Video Player */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Video className="w-4 h-4 text-teal-700" />
                <span>1. Watch Video Lesson</span>
              </h4>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                <iframe
                  src={activeCourse.videoUrl}
                  title={activeCourse.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Quiz Section */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-900" />
                <span>2. Knowledge Check Quiz</span>
              </h4>

              {activeCourse.questions.map((q, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="font-bold text-xs text-slate-900">
                    Q{idx + 1}: {q.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = quizAnswers[idx] === opt;
                      const isCorrect = quizSubmitted && opt === q.correctAnswer;
                      const isWrong = quizSubmitted && isSelected && opt !== q.correctAnswer;

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectQuizAnswer(idx, opt)}
                          disabled={quizSubmitted}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : isWrong
                              ? 'border-rose-500 bg-rose-50 text-rose-800'
                              : isSelected
                              ? 'border-blue-900 bg-blue-50 text-blue-900 ring-2 ring-blue-900/20'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-900" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {quizSubmitted && quizScore !== null && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
                  <div className="font-black text-lg text-emerald-800">
                    Quiz Score: {quizScore}%
                  </div>
                  <p className="text-xs text-emerald-700">
                    {quizScore >= 50
                      ? 'Congratulations! Module marked as completed.'
                      : 'You can review the video and retry the quiz.'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {!quizSubmitted ? (
                  <Button
                    onClick={handleEvaluateQuiz}
                    variant="warm"
                    isLoading={isSaving}
                    disabled={Object.keys(quizAnswers).length < activeCourse.questions.length}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={() => setActiveCourse(null)} variant="primary">
                    Close Module
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

