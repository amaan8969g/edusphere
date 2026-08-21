import React, { useEffect, useState } from 'react';
import { approveInstructor, fetchPendingInstructors, rejectInstructor } from '../../api/adminApi';

const AdminInstructors = () => {
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingInstructors();
      if (res.data?.pendingInstructors) setPendingInstructors(res.data.pendingInstructors);
    } catch (err) {
      console.error('Failed to load instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, decision) => {
    setBusyId(id);
    try {
      if (decision === 'approve') await approveInstructor(id);
      else await rejectInstructor(id);
      await load();
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Instructor Approval Queue</h1>
        <p className="text-slate-400 text-sm">Approve new instructors to enable course creation.</p>
      </div>

      {loading ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-slate-400">Loading...</div>
      ) : pendingInstructors.length === 0 ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-slate-400">No pending instructor requests.</div>
      ) : (
        <div className="space-y-3">
          {pendingInstructors.map((inst) => (
            <div key={inst._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-white font-semibold">{inst.name}</div>
                <div className="text-xs text-slate-400">{inst.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => act(inst._id, 'approve')} disabled={busyId === inst._id} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60">Approve</button>
                <button onClick={() => act(inst._id, 'reject')} disabled={busyId === inst._id} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 disabled:opacity-60">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
