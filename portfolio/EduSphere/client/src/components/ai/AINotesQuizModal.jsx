import React, { useState } from 'react';
import { generateQuizFromNotes } from '../../api/aiApi';
import { Sparkles, X, BrainCircuit, CheckCircle2, XCircle, ArrowRight, RefreshCw, FileText, Loader2 } from 'lucide-react';

const AINotesQuizModal = ({ isOpen, onClose }) => {
  const [notesText, setNotesText] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!notesText.trim() || notesText.trim().length < 20) {
      setError('Please enter at least 20 characters of study notes to generate a quiz.');
      return;
    }

    setLoading(true);
    setError('');
    setQuizData(null);
    setUserAnswers({});
    setSubmitted(false);

    try {
      const res = await generateQuizFromNotes({ notesText, numQuestions });
      if (res.data?.questions) {
        setQuizData(res.data.questions);
      } else {
        setError('Failed to generate quiz questions. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating AI quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) correct++;
    });
    return correct;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-purple-800/40 p-6 sm:p-8 relative bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AI Notes Quiz Generator
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-[10px] font-bold text-purple-300 border border-purple-800">
                ACTIVE AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">Paste your study notes or lesson transcripts to instantly test your knowledge.</p>
          </div>
        </div>

        {/* Input Form if quiz is not generated yet */}
        {!quizData && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                Study Notes / Transcript Text
              </label>
              <textarea
                rows={6}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste key concepts, lecture notes, or study text here (min 20 characters)..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Questions:</span>
                {[3, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumQuestions(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      numQuestions === num
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || notesText.trim().length < 20}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs disabled:opacity-50 hover:shadow-glow-purple flex items-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Generating Quiz...' : 'Generate Practice Quiz'}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}
          </form>
        )}

        {/* Quiz Display */}
        {quizData && (
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between bg-purple-950/40 p-4 rounded-2xl border border-purple-900/60">
              <span className="text-xs font-bold text-purple-300">
                Generated {quizData.length} Practice Questions
              </span>
              <button
                onClick={() => setQuizData(null)}
                className="text-xs text-slate-400 hover:text-white underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Notes
              </button>
            </div>

            <div className="space-y-6">
              {quizData.map((q, qIdx) => (
                <div key={qIdx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 flex items-center justify-center flex-shrink-0 text-[11px]">
                      {qIdx + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.correctOptionIndex;

                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-600/50';
                      if (submitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-700 text-emerald-200';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-700 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-950/80 border-purple-500 text-purple-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && q.explanation && (
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-purple-300">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit / Score Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(userAnswers).length < quizData.length}
                  className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-purple-500 transition-all"
                >
                  Submit Quiz Answers ({Object.keys(userAnswers).length}/{quizData.length})
                </button>
              ) : (
                <div className="w-full flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400">Quiz Completed!</div>
                    <div className="text-lg font-extrabold text-white">
                      Score: <span className="text-purple-400">{calculateScore()}</span> / {quizData.length}
                    </div>
                  </div>
                  <button
                    onClick={() => setQuizData(null)}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
                  >
                    Try Another Topic
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AINotesQuizModal;
