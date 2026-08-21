import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, updateUserRole } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({ search, role });
      if (res.data?.users) setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, role]);

  const setUserRole = async (id, nextRole) => {
    setBusyId(id);
    try {
      await updateUserRole(id, { role: nextRole, isApprovedInstructor: nextRole === 'instructor' ? true : undefined });
      await load();
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Accounts</h1>
        <p className="text-slate-400 text-sm">Search users and change roles.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white">
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-white font-semibold">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
                <div className="text-[11px] text-brand-400 capitalize">{user.role}{user.role === 'instructor' && !user.isApprovedInstructor ? ' (pending approval)' : ''}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setUserRole(user._id, 'student')} disabled={busyId === user._id} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">Student</button>
                <button onClick={() => setUserRole(user._id, 'instructor')} disabled={busyId === user._id} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">Instructor</button>
                <button onClick={() => setUserRole(user._id, 'admin')} disabled={busyId === user._id} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">Admin</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
