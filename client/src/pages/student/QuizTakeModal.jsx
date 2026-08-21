import React, { useState, useEffect, useRef } from 'react';
import { fetchQuizByLesson, fetchQuizById, submitQuiz } from '../../api/quizApi';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  ShieldAlert, 
  Lock,
  Check,
  RotateCcw
} from 'lucide-react';

const QuizTakeModal = ({ lessonId, quizId, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Security Proctoring & Timer States
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [tabSwitchesCount, setTabSwitchesCount] = useState(0);
  const [securityWarning, setSecurityWarning] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        let res;
        if (quizId) {
          res = await fetchQuizById(quizId);
        } else if (lessonId) {
          res = await fetchQuizByLesson(lessonId);
        }
        if (res?.data?.quiz) {
          const loadedQuiz = res.data.quiz;
          setQuiz(loadedQuiz);
          const limitSecs = (loadedQuiz.timeLimitMinutes || 10) * 60;
          setSecondsRemaining(limitSecs);
          setTotalSeconds(limitSecs);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId, quizId]);

  // Tab switch & focus loss proctoring tracker
  useEffect(() => {
    if (!quiz || result) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchesCount((prev) => prev + 1);
        setSecurityWarning(true);
        setTimeout(() => setSecurityWarning(false), 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quiz, result]);

  // Countdown timer logic
  useEffect(() => {
    if (secondsRemaining === null || secondsRemaining <= 0 || result || submitting) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, result, submitting]);

  const handleOptionSelect = (qIdx, oIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([k, v]) => ({
        questionIndex: parseInt(k, 10),
        selectedOption: v,
      }));

      const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

      const res = await submitQuiz(quiz._id, formattedAnswers, {
        tabSwitchesCount,
        timeSpentSeconds,
        autoSubmitted: isAuto,
      });

      if (res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    if (secs === null) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-800 overflow-hidden p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto select-none"
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Warning Toast */}
        {securityWarning && (
          <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-800 text-amber-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold">Security Proctoring Alert:</span> Tab switch detected! ({tabSwitchesCount} recorded). Please remain on the assessment window.
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
            <p className="text-sm">Loading quiz questions...</p>
          </div>
        ) : !quiz ? (
          <div className="py-20 text-center text-slate-400">No quiz questions available for this assessment.</div>
        ) : result ? (
          
          /* Quiz Results View with Instant Performance Feedback */
          <div className="space-y-6 py-4">
            
            <div className="text-center space-y-3">
              {result.attempt?.passed ? (
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white">
                  {result.attempt?.passed ? 'Assessment Passed! 🎉' : 'Passing Threshold Not Reached'}
                </h3>
                <p className="text-4xl font-black text-brand-400">{result.attempt?.score}% Score</p>
                <p className="text-xs text-slate-400">
                  Answered {result.correctCount} out of {result.totalQuestions} questions correctly.
                </p>
              </div>

              {/* Security Audit Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span>Tab Switches: <strong className="text-slate-200">{result.attempt?.tabSwitchesCount || 0}</strong></span>
                <span>•</span>
                <span>Time Taken: <strong className="text-slate-200">{result.attempt?.timeSpentSeconds || 0}s</strong></span>
                {result.attempt?.autoSubmitted && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">Auto-Submitted on Time Expiry</span>
                  </>
                )}
              </div>
            </div>

            {/* Detailed Question Review & Explanations */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h4 className="text-sm font-bold text-slate-200">Question Performance & Explanations</h4>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {result.detailedResults?.map((resItem, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border ${
                      resItem.isCorrect ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-rose-950/20 border-rose-800/40'
                    } space-y-2`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {idx + 1}. {resItem.questionText}
                      </span>
                      {resItem.isCorrect ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-900/60 text-[10px] font-bold text-rose-400">
                          Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-300">
                        Your answer: <span className="font-semibold">{resItem.options[resItem.selectedOption] || 'None'}</span>
                      </p>
                      {!resItem.isCorrect && (
                        <p className="text-emerald-400">
                          Correct answer: <span className="font-semibold">{resItem.options[resItem.correctOptionIndex]}</span>
                        </p>
                      )}
                      {resItem.explanation && (
                        <p className="text-slate-400 text-[11px] italic pt-1 border-t border-slate-800/60 mt-1">
                          Explanation: {resItem.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 transition-colors"
            >
              Close & Return
            </button>

          </div>
        ) : (
          
          /* Active Quiz Taking View */
          <div className="space-y-6">
            
            {/* Header with Title & Security Countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-400" />
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Passing score: {quiz.passingScore}%</p>
              </div>

              {/* Time-bound Countdown Timer */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono text-sm font-bold ${
                  secondsRemaining < 60 ? 'bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-brand-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" />
                  Proctored Session
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {quiz.questions?.map((q, qIdx) => (
                <div key={qIdx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-sm font-semibold text-slate-200">
                    {qIdx + 1}. {q.questionText}
                  </div>

                  <div className="space-y-2">
                    {q.options?.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          answers[qIdx] === oIdx
                            ? 'bg-brand-950/80 border-brand-500 text-white font-medium shadow-glow-purple'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={answers[qIdx] === oIdx}
                          onChange={() => handleOptionSelect(qIdx, oIdx)}
                          className="accent-brand-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || Object.keys(answers).length === 0}
              className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Quiz Answers'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default QuizTakeModal;
