import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  Users, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Layers,
  FileCheck
} from 'lucide-react';
import QuizCreatorModal from './QuizCreatorModal';
import ArticleCreatorModal from './ArticleCreatorModal';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleQuizSuccess = () => {
    setFeedbackMsg('Custom quiz created and published successfully!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleArticleSuccess = () => {
    setFeedbackMsg('Self-paced learning article published to knowledge base!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-xs font-semibold text-purple-400">
              <GraduationCap className="w-3.5 h-3.5" />
              Instructor Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Instructor Dashboard, <span className="gradient-text">{user?.name}</span>! 🎓
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Manage virtual classrooms, design customized quizzes, publish self-paced articles, and track student performance.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/instructor/classes"
              className="px-4 py-2.5 rounded-xl font-semibold text-purple-200 bg-purple-950/80 border border-purple-800/60 hover:bg-purple-900 transition-all flex items-center gap-1.5 text-xs shadow-glow-purple"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Virtual Classes
            </Link>

            <button
              onClick={() => setQuizModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-brand-200 bg-brand-950/80 border border-brand-800/60 hover:bg-brand-900 transition-all flex items-center gap-1.5 text-xs"
            >
              <HelpCircle className="w-4 h-4 text-brand-400" />
              Create Quiz
            </button>

            <button
              onClick={() => setArticleModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-amber-200 bg-amber-950/80 border border-amber-800/60 hover:bg-amber-900 transition-all flex items-center gap-1.5 text-xs"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              Publish Article
            </button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Instructor Approval Banner */}
      {!user?.isApprovedInstructor ? (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-sm flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-200">Approval Pending</h4>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Your instructor application is currently under review by an administrator. Once approved, you will be able to publish courses to the public catalog.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Your instructor account is approved! You have full access to course authoring & class management.</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <Link to="/instructor/classes" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Virtual Classes</div>
            <div className="text-xs text-slate-400 font-medium">Manage Roster & Code</div>
          </div>
        </Link>

        <button onClick={() => setQuizModalOpen(true)} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-brand-500/50 transition-all flex items-center gap-4 text-left group">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Quiz Designer</div>
            <div className="text-xs text-slate-400 font-medium">Custom Time-bound Tests</div>
          </div>
        </button>

        <button onClick={() => setArticleModalOpen(true)} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all flex items-center gap-4 text-left group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Publish Articles</div>
            <div className="text-xs text-slate-400 font-medium">Self-Paced Content</div>
          </div>
        </button>

        <Link to="/courses" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Course Catalog</div>
            <div className="text-xs text-slate-400 font-medium">Browse Materials</div>
          </div>
        </Link>

      </div>

      {/* Modals */}
      {quizModalOpen && (
        <QuizCreatorModal
          onClose={() => setQuizModalOpen(false)}
          onSuccess={handleQuizSuccess}
        />
      )}

      {articleModalOpen && (
        <ArticleCreatorModal
          onClose={() => setArticleModalOpen(false)}
          onSuccess={handleArticleSuccess}
        />
      )}

    </div>
  );
};

export default InstructorDashboard;
