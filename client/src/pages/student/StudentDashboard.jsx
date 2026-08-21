import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle,
  BrainCircuit,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import { fetchMyEnrollments } from '../../api/enrollmentApi';
import { fetchMyCertificates } from '../../api/certificateApi';
import CertificateView from '../../components/certificate/CertificateView';
import AINotesQuizModal from '../../components/ai/AINotesQuizModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [enrollRes, certRes] = await Promise.allSettled([
          fetchMyEnrollments(),
          fetchMyCertificates(),
        ]);

        if (enrollRes.status === 'fulfilled' && enrollRes.value?.data?.enrollments) {
          setEnrollments(enrollRes.value.data.enrollments);
        }
        if (certRes.status === 'fulfilled' && certRes.value?.data?.certificates) {
          setCertificates(certRes.value.data.certificates);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const displayedEnrollments = enrollments.filter((e) => e && e.course && typeof e.course !== 'string');
  const enrolledCount = displayedEnrollments.length;
  const completedCount = displayedEnrollments.filter((e) => e.isCompleted).length;
  const certificatesCount = certificates.length;

  const handleOpenCertificate = (cert) => {
    setSelectedCert(cert);
    setCertModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              Student Learning Hub
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Track course progress, view verified certificates, and generate custom AI study quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/student/classes"
              className="px-4 py-2.5 rounded-xl font-semibold text-brand-200 bg-brand-950/80 border border-brand-800/60 hover:bg-brand-900 transition-all flex items-center gap-1.5 text-xs"
            >
              Virtual Classes
            </Link>

            <Link
              to="/student/aptitude"
              className="px-4 py-2.5 rounded-xl font-semibold text-emerald-200 bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900 transition-all flex items-center gap-1.5 text-xs"
            >
              Aptitude Practice
            </Link>

            <Link
              to="/articles"
              className="px-4 py-2.5 rounded-xl font-semibold text-amber-200 bg-amber-950/80 border border-amber-800/60 hover:bg-amber-900 transition-all flex items-center gap-1.5 text-xs"
            >
              Knowledge Articles
            </Link>

            <button
              onClick={() => setQuizModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-purple-200 bg-purple-950/80 border border-purple-800/60 hover:bg-purple-900 transition-all flex items-center gap-1.5 text-xs shadow-glow-purple"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              AI Notes Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{enrolledCount}</div>
            <div className="text-xs text-slate-400 font-medium">Enrolled Courses</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{completedCount}</div>
            <div className="text-xs text-slate-400 font-medium">Completed Courses</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{certificatesCount}</div>
            <div className="text-xs text-slate-400 font-medium">Earned Certificates</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Active AI</div>
            <div className="text-xs text-slate-400 font-medium">Tutor & Quiz Ready</div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-brand-400" />
            Continue Learning
          </h3>

          {loading ? (
            <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center text-slate-400">Loading learning progress...</div>
          ) : displayedEnrollments.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-600">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-200">No active enrollments yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our catalog to enroll in courses, complete lessons, and earn verifiable certificates.
                </p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedEnrollments.map((e) => (
                <div key={e._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img src={e.course?.thumbnail || '/placeholder.png'} alt={e.course?.title || 'Course'} className="w-20 h-12 object-cover rounded-lg border border-slate-800" />
                    <div>
                      <div className="text-sm font-bold text-white">{e.course?.title || 'Untitled Course'}</div>
                      <div className="text-xs text-slate-400">{e.course?.instructor?.name || 'Instructor'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Progress: <span className="text-brand-400 font-bold">{e.progressPercentage || 0}%</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/student/course/${e.course._id}/learn`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all"
                    >
                      Classroom
                    </Link>
                    <Link
                      to={`/courses/${e.course?.slug || ''}`}
                      className="px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earned Certificates & AI Sidebar */}
        <div className="space-y-6">
          
          {/* Earned Certificates List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              My Certificates ({certificatesCount})
            </h3>

            <div className="glass-panel p-6 rounded-3xl border border-amber-900/40 space-y-4">
              {certificatesCount === 0 ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-800/40 mx-auto flex items-center justify-center text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400">Complete 100% of course lessons to earn official verifiable certificates!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-amber-800/30 flex items-center justify-between hover:border-amber-600/50 transition-all"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-bold text-amber-300 truncate">{cert.course?.title || 'Certificate'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{cert.certificateCode}</div>
                      </div>
                      <button
                        onClick={() => handleOpenCertificate(cert)}
                        className="p-2 rounded-xl bg-amber-950 text-amber-300 hover:bg-amber-900 text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active AI Quiz Generator Card */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Active AI Quiz Studio</h4>
                <p className="text-[11px] text-purple-300 font-medium">Instant Self-Assessment</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your study notes or lesson summaries to let EduSphere AI generate interactive multi-choice quizzes instantly!
            </p>

            <button
              onClick={() => setQuizModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-glow-purple flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Quiz
            </button>
          </div>

        </div>

      </div>

      {/* AI Quiz Generator Modal */}
      <AINotesQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
      />

      {/* Certificate Viewer Modal */}
      {certModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setCertModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <CertificateView certificate={selectedCert} />
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
