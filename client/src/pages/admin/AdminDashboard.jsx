import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { approveInstructor, rejectInstructor, fetchAdminStats, fetchPendingInstructors } from '../../api/adminApi';
import { ShieldCheck, Users, UserCheck, BookOpen, FolderTree, TrendingUp, BarChart3 } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, tone = 'brand' }) => (
  <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
    <div
      className={[
        'w-12 h-12 rounded-xl border flex items-center justify-center',
        tone === 'amber' && 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        tone === 'purple' && 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        tone === 'emerald' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        tone === 'indigo' && 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        tone === 'brand' && 'bg-brand-500/10 border-brand-500/20 text-brand-400',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([fetchAdminStats(), fetchPendingInstructors()]);
      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (pendingRes.data?.pendingInstructors) setPendingInstructors(pendingRes.data.pendingInstructors);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (id, action) => {
    setBusyId(id);
    try {
      if (action === 'approve') {
        await approveInstructor(id);
      } else {
        await rejectInstructor(id);
      }
      await loadData();
    } catch (err) {
      console.error(`Failed to ${action} instructor:`, err);
    } finally {
      setBusyId('');
    }
  };

  const activeCompletion = stats?.totalEnrollments ? `${stats.completionRate}%` : '0%';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/50 text-xs font-semibold text-indigo-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Control Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Platform Overview, <span className="gradient-text">{user?.name}</span>! 🛡️
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Monitor revenue, completion rates, instructors, categories, and platform growth from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5">
        <MetricCard icon={Users} label="Total Users" value={loading ? '...' : stats?.totalUsers ?? 0} />
        <MetricCard icon={UserCheck} label="Pending Instructors" value={loading ? '...' : stats?.pendingInstructors ?? 0} tone="amber" />
        <MetricCard icon={BookOpen} label="Published Courses" value={loading ? '...' : stats?.publishedCourses ?? 0} tone="purple" />
        <MetricCard icon={FolderTree} label="Categories" value={loading ? '...' : stats?.totalCategories ?? 0} tone="emerald" />
        <MetricCard icon={TrendingUp} label="Revenue" value={loading ? '...' : `$${Number(stats?.totalRevenue || 0).toFixed(0)}`} tone="indigo" />
        <MetricCard icon={BarChart3} label="Completion Rate" value={loading ? '...' : activeCompletion} tone="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-white">Instructor Approval Queue</h4>
              <p className="text-xs text-slate-400 mt-1">Approve or reject instructor requests before course publishing access is granted.</p>
            </div>
            <Link to="/admin/instructors" className="text-xs font-semibold text-brand-400 hover:underline">Open queue →</Link>
          </div>

          {pendingInstructors.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">No pending instructors.</div>
          ) : (
            <div className="space-y-3">
              {pendingInstructors.slice(0, 3).map((inst) => (
                <div key={inst._id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-950/50">
                  <div>
                    <div className="font-semibold text-white">{inst.name}</div>
                    <div className="text-xs text-slate-400">{inst.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDecision(inst._id, 'approve')} disabled={busyId === inst._id} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60">
                      Approve
                    </button>
                    <button onClick={() => handleDecision(inst._id, 'reject')} disabled={busyId === inst._id} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 disabled:opacity-60">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Actions</h4>
            <div className="space-y-3 text-sm">
              <Link to="/admin/users" className="block px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white">Manage users</Link>
              <Link to="/admin/categories" className="block px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white">Manage categories</Link>
              <Link to="/courses" className="block px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white">View catalog</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
