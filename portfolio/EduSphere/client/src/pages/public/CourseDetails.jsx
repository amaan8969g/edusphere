import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCourseBySlug } from '../../api/courseApi';
import { enrollCourse } from '../../api/enrollmentApi';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight,
  User,
  BrainCircuit,
  Lock
} from 'lucide-react';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchCourseBySlug(slug);
        if (res.data?.course) setCourse(res.data.course);
      } catch (err) {
        console.error('Failed to load course details:', err);
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await enrollCourse(course._id);
      navigate(`/student/course/${course._id}/learn`);
    } catch (err) {
      console.error('Enrollment error:', err);
      // If already enrolled, navigate straight to classroom
      navigate(`/student/course/${course._id}/learn`);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
        <Link to="/courses" className="text-brand-400 hover:underline text-sm">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Course Hero Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
                {course.category?.name || 'Development'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                {course.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-400 text-base leading-relaxed">
              {course.subtitle || course.description}
            </p>

            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  {course.instructor?.name ? course.instructor.name.charAt(0) : 'I'}
                </div>
                <span>Created by <strong className="text-slate-200">{course.instructor?.name}</strong></span>
              </div>
            </div>
          </div>

          {/* Card CTA Widget */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden h-40">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Access Type</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {course.price === 0 ? 'FREE ENROLLMENT' : `$${course.price}`}
                </span>
              </div>

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  Full Lifetime Video Access
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  QR Code Verifiable Certificate
                </div>
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  AI Study Tutor Integration
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Curriculum Syllabus View */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-400" />
          Course Curriculum & Syllabus
        </h2>

        {course.modules?.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl border border-slate-800 text-slate-400 text-sm text-center">
            Modules and lessons are currently being structured by the instructor.
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules?.map((mod, i) => (
              <div key={mod._id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-900/80 font-bold text-white text-sm flex items-center justify-between">
                  <span>Module {i + 1}: {mod.title}</span>
                  <span className="text-xs text-slate-400 font-normal">{mod.lessons?.length || 0} lessons</span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {mod.lessons?.map((les) => (
                    <div key={les._id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors">
                      <div className="flex items-center gap-3">
                        {les.type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-amber-400" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-brand-400" />
                        )}
                        <span className="text-slate-200 font-medium">{les.title}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{les.duration} mins</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseDetails;
