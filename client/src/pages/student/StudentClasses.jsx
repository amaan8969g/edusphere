import React, { useState, useEffect } from 'react';
import { fetchStudentClasses, joinVirtualClass } from '../../api/virtualClassApi';
import { 
  Users, 
  Plus, 
  BookOpen, 
  Megaphone, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  Sparkles,
  Key
} from 'lucide-react';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await fetchStudentClasses();
      if (res.data?.classes) {
        setClasses(res.data.classes);
        if (res.data.classes.length > 0 && !selectedClass) {
          setSelectedClass(res.data.classes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load student classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;

    setJoining(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await joinVirtualClass(classCodeInput.trim());
      if (res.data?.virtualClass) {
        setSuccessMsg(res.message || 'Successfully joined virtual classroom!');
        setClassCodeInput('');
        setTimeout(() => {
          setJoinModalOpen(false);
          setSuccessMsg('');
          loadClasses();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to join class. Check code.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
            <Users className="w-3.5 h-3.5" />
            Virtual Classrooms
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My <span className="gradient-text">Virtual Classes</span> 📚
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Access instructor announcements, classroom stream updates, enrolled peers, and class materials.
          </p>
        </div>

        <button
          onClick={() => setJoinModalOpen(true)}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:shadow-glow transition-all flex items-center gap-2 text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Join Class with Code
        </button>
      </div>

      {/* Main Content Layout */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
          <p className="text-sm">Loading virtual classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Not Enrolled in Any Virtual Class</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get a 6-character class code from your teacher to join their virtual classroom stream.
            </p>
          </div>
          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-500 transition-colors inline-flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            Enter Class Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Enrolled Classes Sidebar List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Enrolled Classrooms</h3>
            <div className="space-y-3">
              {classes.map((cls) => (
                <button
                  key={cls._id}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedClass?._id === cls._id
                      ? 'bg-brand-950/80 border-brand-500 shadow-glow-purple'
                      : 'glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-400 uppercase">
                      {cls.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Code: {cls.code}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">{cls.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Instructor: {cls.instructor?.name || 'Faculty'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Class Stream & Announcements View */}
          {selectedClass && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Selected Class Header Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
                    {selectedClass.subject}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedClass.enrolledStudents?.length || 0} Enrolled Students
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedClass.title}</h2>
                {selectedClass.description && (
                  <p className="text-xs text-slate-400">{selectedClass.description}</p>
                )}
              </div>

              {/* Announcements Stream */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  Class Stream & Announcements
                </h3>

                {selectedClass.announcements?.length === 0 ? (
                  <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                    No announcements posted in this classroom yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedClass.announcements?.map((ann, idx) => (
                      <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {ann.content}
                        </p>
                        <div className="text-[11px] text-brand-400 font-medium">
                          Posted by {ann.authorName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Join Class Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-6 relative">
            <button
              onClick={() => {
                setJoinModalOpen(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Join Virtual Class</h3>
              <p className="text-xs text-slate-400">Ask your teacher for the 6-character class code and enter it below.</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class Code</label>
                <input
                  type="text"
                  placeholder="e.g. EDU-8F3A"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-brand-500 uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={joining || !classCodeInput.trim()}
                className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Classroom'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentClasses;
