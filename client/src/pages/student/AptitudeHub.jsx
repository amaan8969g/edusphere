import React, { useState, useEffect } from 'react';
import { fetchAptitudeQuizzes } from '../../api/quizApi';
import QuizTakeModal from './QuizTakeModal';
import { 
  Brain, 
  BookOpen, 
  Calculator, 
  Sigma, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Play,
  Loader2,
  Award
} from 'lucide-react';

const APTITUDE_DOMAINS = [
  {
    key: 'verbal-ability',
    title: 'Verbal Ability & Reading Comprehension',
    desc: 'Vocabulary, analogies, sentence correction, and reading comprehension passages.',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
  },
  {
    key: 'logical-reasoning',
    title: 'Logical Reasoning & Analytical Thinking',
    desc: 'Number sequences, syllogisms, coding-decoding, blood relations, and seating arrangements.',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500/30',
  },
  {
    key: 'arithmetic',
    title: 'Arithmetic & Speed Calculation',
    desc: 'Percentages, work & time rates, simple/compound interest, and profit-loss shortcuts.',
    icon: Calculator,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
  },
  {
    key: 'quantitative-aptitude',
    title: 'Quantitative Aptitude & Algebra',
    desc: 'Quadratic equations, coordinate geometry, permutations, probability, and speed-distance.',
    icon: Sigma,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
  },
];

const AptitudeHub = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuizId, setActiveQuizId] = useState(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await fetchAptitudeQuizzes();
        if (res.data?.quizzes) {
          setQuizzes(res.data.quizzes);
        }
      } catch (err) {
        console.error('Failed to load aptitude quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const getQuizForDomain = (key) => {
    return quizzes.find((q) => q.aptitudeCategory === key);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
              <Award className="w-3.5 h-3.5" />
              Skill Assessment Suite
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Aptitude & Practice <span className="gradient-text">Test Hub</span> 🎯
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Sharpen your analytical, verbal, and numerical skills with time-bound practice assessments and instant score feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Aptitude Cards Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
          <p className="text-sm">Loading practice tests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {APTITUDE_DOMAINS.map((domain) => {
            const quiz = getQuizForDomain(domain.key);
            const Icon = domain.icon;

            return (
              <div
                key={domain.key}
                className={`glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 hover:${domain.borderColor} transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${domain.color} flex items-center justify-center text-white shadow-glow`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {quiz && (
                      <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        {quiz.timeLimitMinutes} Mins
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {quiz ? (
                      <span className="text-slate-300 font-medium">
                        {quiz.questions?.length || 4} Questions • Passing: {quiz.passingScore}%
                      </span>
                    ) : (
                      'Practice Test Ready'
                    )}
                  </div>

                  <button
                    onClick={() => quiz && setActiveQuizId(quiz._id)}
                    disabled={!quiz}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${domain.color} hover:shadow-glow transition-all flex items-center gap-2`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start Assessment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuizId && (
        <QuizTakeModal
          quizId={activeQuizId}
          onClose={() => setActiveQuizId(null)}
        />
      )}

    </div>
  );
};

export default AptitudeHub;
