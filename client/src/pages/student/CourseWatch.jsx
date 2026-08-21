import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseBySlug } from '../../api/courseApi';
import { toggleCompleteLesson, fetchMyEnrollments } from '../../api/enrollmentApi';
import { fetchCourseCertificate } from '../../api/certificateApi';
import AIAssistantDrawer from '../../components/ai/AIAssistantDrawer';
import ChatWidget from '../../components/chat/ChatWidget';
import CertificateView from '../../components/certificate/CertificateView';
import QuizTakeModal from './QuizTakeModal';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Layers, 
  ArrowLeft,
  HelpCircle,
  BrainCircuit,
  X
} from 'lucide-react';

const CourseWatch = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    const loadClassroomData = async () => {
      try {
        const courseRes = await fetchCourseBySlug(courseId);
        if (courseRes.data?.course) {
          const c = courseRes.data.course;
          setCourse(c);

          // Default first lesson: prefer modules -> lessons; fallback to course.lessons
          const firstFromModules = c.modules?.[0]?.lessons?.[0];
          const firstFromLessons = c.lessons?.[0];
          if (firstFromModules) {
            setActiveLesson(firstFromModules);
          } else if (firstFromLessons) {
            setActiveLesson(firstFromLessons);
          }
        }

        // Load enrollment progress
        const enrollRes = await fetchMyEnrollments();
        if (enrollRes.data?.enrollments) {
          const myEnrollment = enrollRes.data.enrollments.find(
            (e) => e.course?._id === courseId || e.course === courseId
          );
          if (myEnrollment) {
            setCompletedLessons(myEnrollment.completedLessons || []);
            setProgressPercentage(myEnrollment.progressPercentage || 0);
          }
        }

        // Send analytics event: course.view
        try {
          await fetch('/api/v1/analytics/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token')) },
            body: JSON.stringify({ eventType: 'course.view', payload: { courseId } }),
          });
        } catch (e) {}
      } catch (err) {
        console.error('Failed to load classroom:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClassroomData();
  }, [courseId]);

  const handleToggleComplete = async (lessonId) => {
    try {
      const res = await toggleCompleteLesson(courseId, lessonId);
      if (res.data?.enrollment) {
        setCompletedLessons(res.data.enrollment.completedLessons || []);
        setProgressPercentage(res.data.enrollment.progressPercentage || 0);
      }

      // Analytics: lesson.complete
      try {
        await fetch('/api/v1/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (sessionStorage.getItem('edusphere_token') || localStorage.getItem('edusphere_token')) },
          body: JSON.stringify({ eventType: 'lesson.complete', payload: { courseId, lessonId } }),
        });
      } catch (e) {}
    } catch (err) {
      console.error('Failed to update completion status:', err);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const res = await fetchCourseCertificate(courseId);
      if (res.data?.certificate) {
        setCertificateData(res.data.certificate);
        setCertModalOpen(true);
      }
    } catch (err) {
      console.error('Certificate error:', err);
      alert('Must complete 100% of lessons to receive certificate!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Loading Classroom environment...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400 space-y-4">
        <h2 className="text-2xl font-bold text-white">Course classroom unavailable</h2>
        <Link to="/student/dashboard" className="text-brand-400 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const isLessonCompleted = activeLesson && completedLessons.some((id) => String(id) === String(activeLesson._id));

  return (
    <div className="min-h-[90vh] bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Header Bar */}
      <div className="glass-panel px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/student/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-brand-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-base font-bold text-white line-clamp-1">{course.title}</h2>
            <div className="text-xs text-slate-400">Active Lesson: {activeLesson?.title || 'Overview'}</div>
          </div>
        </div>

        {/* Progress & Certificate Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-300">Course Progress</span>
            <span className="text-xs font-bold text-brand-400">{progressPercentage}% Completed</span>
          </div>

          {progressPercentage >= 100 ? (
            <button
              onClick={handleClaimCertificate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 font-bold text-slate-950 text-xs shadow-glow-purple flex items-center gap-1.5 animate-pulse"
            >
              <Award className="w-4 h-4" />
              Claim Certificate
            </button>
          ) : (
            <div className="w-32 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-brand-500 h-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          <button
            onClick={() => setAiDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold hover:bg-purple-900 transition-all flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            AI Tutor Assistant
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4">
        
        {/* Main Lesson Content Area */}
        <div className="lg:col-span-3 p-6 space-y-6 flex flex-col justify-between">
          
          {/* Player Display */}
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 bg-black aspect-video relative flex items-center justify-center">
            {activeLesson?.type === 'pdf' ? (
              <div className="p-10 text-center space-y-4">
                <FileText className="w-16 h-16 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">{activeLesson.title} (PDF Resource)</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{activeLesson.content || 'Download or view lesson notes.'}</p>
              </div>
            ) : (
              (() => {
                // Determine YouTube video id: prefer activeLesson.videoUrl, fallback to course.youtubeVideoId
                const getYouTubeId = (url) => {
                  if (!url) return null;
                  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{6,})/);
                  return m ? m[1] : null;
                };

                const lessonVideoId = getYouTubeId(activeLesson?.videoUrl);
                const courseVideoId = course?.youtubeVideoId || null;
                const videoId = lessonVideoId || courseVideoId;

                if (videoId) {
                  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  return (
                    <iframe
                      title={activeLesson?.title || course?.title}
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  );
                }

                // Fallback: show thumbnail or placeholder
                return (
                  <div className="text-center space-y-4">
                    <PlayCircle className="w-20 h-20 text-brand-500 mx-auto animate-pulse" />
                    <h3 className="text-xl font-bold text-white">{activeLesson?.title || 'Select a Lesson'}</h3>
                    <p className="text-xs text-slate-400 font-mono">Stream URL: {activeLesson?.videoUrl || 'Standard Sample Video Stream'}</p>
                  </div>
                );
              })()
            )}
          </div>

          {/* Action Bar Below Player */}
          {activeLesson && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeLesson.content || 'Watch the lecture carefully and attempt practice quizzes.'}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuizModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-brand-400" />
                  Practice Quiz
                </button>

                <button
                  onClick={() => handleToggleComplete(activeLesson._id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isLessonCompleted
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-brand-600 text-white hover:bg-brand-500 shadow-glow'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isLessonCompleted ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Lesson Sidebar */}
        <div className="glass-panel border-l border-slate-800/80 p-6 space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            Curriculum Breakdown
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[75vh]">
            {(() => {
            const modules = course.modules && course.modules.length ? course.modules : [{ _id: 'fallback', title: 'Lessons', lessons: course.lessons || [] }];
            return modules.map((mod, mIdx) => (
              <div key={mod._id} className="space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Module {mIdx + 1}: {mod.title}
                </div>

                <div className="space-y-1.5">
                  {mod.lessons?.map((les) => {
                    const isDone = completedLessons.some((id) => String(id) === String(les._id));
                    const isActive = activeLesson?._id === les._id;

                    return (
                      <button
                        key={les._id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-glow'
                            : 'glass-card text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] opacity-75">{les.duration}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
          </div>
        </div>

      </div>

      {/* Chat Widget */}
      <div className="p-6">
        <ChatWidget room={`course-${courseId}`} />
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        lessonTitle={activeLesson?.title}
        courseTitle={course?.title}
      />

      {/* Quiz Modal */}
      {quizModalOpen && activeLesson && (
        <QuizTakeModal
          lessonId={activeLesson._id}
          onClose={() => setQuizModalOpen(false)}
        />
      )}

      {/* Certificate Modal */}
      {certModalOpen && certificateData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setCertModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <CertificateView certificate={certificateData} />
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseWatch;
