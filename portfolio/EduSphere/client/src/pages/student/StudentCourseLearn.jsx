import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseBySlug } from '../../api/courseApi';
import { toggleCompleteLesson, fetchMyEnrollments } from '../../api/enrollmentApi';
import { CheckCircle2, Circle, ArrowLeft, BookOpen, Award } from 'lucide-react';
import { fetchCourseCertificate } from '../../api/certificateApi';
import CertificateView from '../../components/certificate/CertificateView';

const StudentCourseLearn = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    const loadClassroom = async () => {
      try {
        const courseRes = await fetchCourseBySlug(id);
        const payload = courseRes && courseRes.data ? courseRes.data : courseRes;
        const courseObj = payload?.course || payload;
        if (courseObj) setCourse(courseObj);

        // Load enrollment progress
        const enrollRes = await fetchMyEnrollments();
        if (enrollRes.data?.enrollments) {
          const myEnrollment = enrollRes.data.enrollments.find(
            (e) => e.course?._id === courseObj?._id || e.course?._id === id || e.course === id
          );
          if (myEnrollment) {
            setCompletedLessons(myEnrollment.completedLessons || []);
            setProgressPercentage(myEnrollment.progressPercentage || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load classroom:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClassroom();
  }, [id]);

  const handleToggleLesson = async (lessonId) => {
    if (!course || updating) return;
    setUpdating(true);
    try {
      const res = await toggleCompleteLesson(course._id, lessonId);
      if (res.data?.enrollment) {
        setCompletedLessons(res.data.enrollment.completedLessons || []);
        setProgressPercentage(res.data.enrollment.progressPercentage || 0);
      }
    } catch (err) {
      console.error('Failed to toggle lesson:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const res = await fetchCourseCertificate(course._id);
      if (res.data?.certificate) {
        setCertificateData(res.data.certificate);
        setCertModalOpen(true);
      }
    } catch (err) {
      alert('Must complete 100% of lessons to receive certificate!');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading classroom environment...</div>;
  if (!course) return <div className="p-8 text-center text-slate-400">Course not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/student/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <p className="text-xs text-slate-400">{course.subtitle || course.description}</p>
          </div>
        </div>

        {progressPercentage >= 100 && (
          <button
            onClick={handleClaimCertificate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 font-bold text-slate-950 text-xs shadow-glow flex items-center gap-1.5 animate-pulse"
          >
            <Award className="w-4 h-4" />
            Claim Certificate
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Player & Lessons */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white text-sm mb-3">Lesson Player</h3>
            <div className="rounded-xl h-64 sm:h-80 overflow-hidden bg-black relative flex items-center justify-center">
              {(() => {
                const firstModuleLesson = course.modules?.[0]?.lessons?.[0];
                const firstLesson = course.lessons?.[0] || firstModuleLesson;
                const getYouTubeId = (urlOrId) => {
                  if (!urlOrId) return null;
                  if (/^[A-Za-z0-9_\-]{6,}$/.test(urlOrId)) return urlOrId;
                  const m = String(urlOrId).match(/(?:v=|youtu\.be\/(?:watch\?v=)?|embed\/)([A-Za-z0-9_\-]{6,})/);
                  return m ? m[1] : null;
                };

                const lessonVideoId = getYouTubeId(firstLesson?.videoId || firstLesson?.videoUrl);
                const courseVideoId = getYouTubeId(course?.youtubeVideoId);
                const videoId = lessonVideoId || courseVideoId;

                if (videoId) {
                  return (
                    <iframe
                      title={course.title}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  );
                }

                return <div className="text-slate-500 text-xs">Standard Sample Video Stream</div>;
              })()}
            </div>
          </div>

          {/* Module & Lesson List */}
          <div className="space-y-3">
            {course.modules?.map((mod, i) => (
              <div key={mod._id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-900/80 font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Module {i + 1}: {mod.title}</span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {mod.lessons?.map((les) => {
                    const isDone = completedLessons.some((id) => String(id) === String(les._id));

                    return (
                      <div key={les._id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors">
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                          )}
                          <div>
                            <div className={`text-sm font-semibold ${isDone ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                              {les.title}
                            </div>
                            <div className="text-[11px] text-slate-400">{les.duration || '10'} mins</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleLesson(les._id)}
                          disabled={updating}
                          className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-brand-600 text-white hover:bg-brand-500 shadow-glow'
                          }`}
                        >
                          {isDone ? 'Completed' : 'Mark as Complete'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Progress Sidebar */}
        <aside className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Course Progress</div>
            <div className="text-3xl font-extrabold text-brand-400">{progressPercentage}%</div>
            
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-brand-500 h-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="text-[11px] text-slate-500">
              {completedLessons.length} lessons completed. Mark all lessons completed to receive your official certificate.
            </div>
          </div>

          {course.instructor && (
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Instructor</div>
              <div className="text-sm font-bold text-white">{course.instructor.name}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{course.instructor.bio || 'Experienced course instructor'}</div>
            </div>
          )}
        </aside>

      </div>

      {/* Certificate Modal */}
      {certModalOpen && certificateData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setCertModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <CertificateView certificate={certificateData} />
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentCourseLearn;
