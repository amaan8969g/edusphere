import React, { useState, useEffect } from 'react';
import { 
  fetchInstructorClasses, 
  createVirtualClass, 
  addClassAnnouncement, 
  deleteVirtualClass 
} from '../../api/virtualClassApi';
import { 
  Users, 
  Plus, 
  BookOpen, 
  Megaphone, 
  X, 
  Copy, 
  Check, 
  Trash2, 
  Loader2, 
  AlertCircle,
  GraduationCap,
  Send
} from 'lucide-react';

const InstructorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  // Announcement States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [postingAnn, setPostingAnn] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await fetchInstructorClasses();
      if (res.data?.classes) {
        setClasses(res.data.classes);
        if (res.data.classes.length > 0 && !selectedClass) {
          setSelectedClass(res.data.classes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load instructor classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      const res = await createVirtualClass({ title, subject, description });
      if (res.data?.virtualClass) {
        setTitle('');
        setDescription('');
        setCreateModalOpen(false);
        await loadClasses();
        setSelectedClass(res.data.virtualClass);
      }
    } catch (err) {
      console.error('Failed to create class:', err);
    } finally {
      setCreating(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!selectedClass || !annTitle.trim() || !annContent.trim()) return;

    setPostingAnn(true);
    try {
      const res = await addClassAnnouncement(selectedClass._id, annTitle, annContent);
      if (res.data?.announcements) {
        setSelectedClass({
          ...selectedClass,
          announcements: res.data.announcements,
        });
        setAnnTitle('');
        setAnnContent('');
        loadClasses();
      }
    } catch (err) {
      console.error('Failed to post announcement:', err);
    } finally {
      setPostingAnn(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this virtual class?')) return;
    try {
      await deleteVirtualClass(classId);
      setSelectedClass(null);
      loadClasses();
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-xs font-semibold text-purple-400">
            <GraduationCap className="w-3.5 h-3.5" />
            Classroom Authoring
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Virtual Class <span className="gradient-text">Management</span> 🎓
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Create virtual classes, generate student invite codes, track enrolled rosters, and publish course announcements.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-glow-purple transition-all flex items-center gap-2 text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Virtual Class
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm">Loading your virtual classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Virtual Classes Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first virtual classroom to invite students and broadcast stream announcements.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Virtual Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Classes Sidebar List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">My Virtual Classrooms</h3>
            <div className="space-y-3">
              {classes.map((cls) => (
                <button
                  key={cls._id}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedClass?._id === cls._id
                      ? 'bg-purple-950/80 border-purple-500 shadow-glow-purple'
                      : 'glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-purple-400 uppercase">
                      {cls.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Code: {cls.code}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">{cls.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {cls.enrolledStudents?.length || 0} Enrolled Students
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Class Dashboard Panel */}
          {selectedClass && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Selected Class Header Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-xs font-semibold text-purple-400">
                    {selectedClass.subject}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyClassCode(selectedClass.code)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-brand-400 hover:border-brand-500 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode === selectedClass.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Code: {selectedClass.code}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClass(selectedClass._id)}
                      className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white">{selectedClass.title}</h2>
                {selectedClass.description && (
                  <p className="text-xs text-slate-400">{selectedClass.description}</p>
                )}
              </div>

              {/* Post Announcement Form */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  Post Classroom Announcement
                </h3>

                <form onSubmit={handlePostAnnouncement} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Announcement Title (e.g. Midterm Quiz Details)"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Write detailed message for students..."
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={postingAnn || !annTitle.trim() || !annContent.trim()}
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {postingAnn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Broadcast Announcement
                  </button>
                </form>
              </div>

              {/* Roster & Announcement List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Enrolled Students Roster */}
                <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Enrolled Roster ({selectedClass.enrolledStudents?.length || 0})
                  </h4>

                  {selectedClass.enrolledStudents?.length === 0 ? (
                    <p className="text-xs text-slate-500">No students enrolled yet. Share code <span className="font-mono text-purple-400">{selectedClass.code}</span></p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedClass.enrolledStudents?.map((st) => (
                        <div key={st._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs">
                            {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{st.name}</div>
                            <div className="text-[10px] text-slate-400">{st.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Class Announcements */}
                <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    Class Stream ({selectedClass.announcements?.length || 0})
                  </h4>

                  {selectedClass.announcements?.length === 0 ? (
                    <p className="text-xs text-slate-500">No announcements posted yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {selectedClass.announcements?.map((ann, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-xs font-bold text-white">{ann.title}</div>
                          <div className="text-[11px] text-slate-300 line-clamp-2">{ann.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Create Class Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-6 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">Create Virtual Classroom</h3>
              <p className="text-xs text-slate-400">Generate a new virtual classroom and student invite code.</p>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class Title</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms Lab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Aptitude & Logic">Aptitude & Logic</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Syllabus overview or office hours..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating || !title.trim()}
                className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Classroom'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorClasses;
