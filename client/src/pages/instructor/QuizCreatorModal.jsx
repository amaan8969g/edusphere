import React, { useState } from 'react';
import { createCustomQuiz } from '../../api/quizApi';
import { 
  X, 
  Plus, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  Award
} from 'lucide-react';

const QuizCreatorModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [isAptitude, setIsAptitude] = useState(false);
  const [aptitudeCategory, setAptitudeCategory] = useState('none');

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (qIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a quiz title.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        setErrorMsg(`Question #${i + 1} text cannot be empty.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!questions[i].options[j].trim()) {
          setErrorMsg(`Question #${i + 1} option ${j + 1} cannot be empty.`);
          return;
        }
      }
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await createCustomQuiz({
        title,
        learningObjective,
        timeLimitMinutes: Number(timeLimitMinutes),
        passingScore: Number(passingScore),
        isAptitude,
        aptitudeCategory: isAptitude ? aptitudeCategory : 'none',
        questions,
      });

      if (res.data?.quiz) {
        if (onSuccess) onSuccess(res.data.quiz);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            Customized Quiz Designer
          </h2>
          <p className="text-xs text-slate-400">
            Create time-bound assessments with auto-evaluation and learning objective feedback.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quiz Title</label>
              <input
                type="text"
                placeholder="e.g. Asynchronous JavaScript & Promises Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Learning Objective</label>
              <input
                type="text"
                placeholder="e.g. Verify understanding of event loops, async/await, and error handling."
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Passing Score (%)</label>
              <input
                type="number"
                min={10}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Questions Builder Section */}
          <div className="space-y-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Questions List ({questions.length})</h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-xs font-semibold text-purple-300 hover:bg-purple-900/60 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 relative">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Question #{qIdx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter question statement..."
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctOptionIndex === oIdx}
                        onChange={() => handleQuestionChange(qIdx, 'correctOptionIndex', oIdx)}
                        className="accent-purple-500"
                        title="Mark as correct option"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none ${
                          q.correctOptionIndex === oIdx ? 'border-purple-500 text-purple-200 font-medium' : 'border-slate-800'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Answer Explanation (shown after submission)..."
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Publish Quiz'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default QuizCreatorModal;
