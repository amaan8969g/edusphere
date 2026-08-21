import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  BrainCircuit, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-brand-400 backdrop-blur-md shadow-glow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Enterprise LMS Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master New Skills with <br className="hidden sm:inline" />
              <span className="gradient-text">Intelligent Learning</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              EduSphere combines structured course modules, interactive assessments, AI-driven study assistance, and QR-verifiable certificates to deliver an uncompromised learning experience.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                Browse Catalog
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-200 glass-card hover:bg-slate-800/80 transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                Get Started Free
              </Link>
            </div>

            {/* Stats Band */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 border-t border-slate-800/60 mt-12">
              <div className="p-4 glass-card rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1">Verified Completion</div>
              </div>
              <div className="p-4 glass-card rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-brand-400">24/7</div>
                <div className="text-xs text-slate-400 mt-1">AI Tutor Availability</div>
              </div>
              <div className="p-4 glass-card rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-purple-400">QR</div>
                <div className="text-xs text-slate-400 mt-1">Authentic Certificates</div>
              </div>
              <div className="p-4 glass-card rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-emerald-400">RBAC</div>
                <div className="text-xs text-slate-400 mt-1">Secure Multi-Role Access</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">Engineered for Excellence</h2>
            <p className="text-slate-400 text-sm">
              Discover the standout capabilities powering EduSphere LMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-brand-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Study Assistant</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Integrated AI tutor providing contextual answers to lesson questions and automatically generating practice quizzes from study notes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">QR Verified Certificates</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate tamper-proof completion certificates embedded with cryptographic SHA-256 signatures and instant QR code verification.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Classroom</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Stream structured video lectures, read PDF study guides, attempt timed quizzes, and submit graded assignments with instructor feedback.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
