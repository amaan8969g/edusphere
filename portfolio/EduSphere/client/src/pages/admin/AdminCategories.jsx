import React, { useEffect, useState } from 'react';
import { createCategory, deleteCategory, fetchCategories } from '../../api/categoryApi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCategories();
      if (res.data?.categories) setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createCategory(form);
    setForm({ name: '', description: '', icon: '' });
    await load();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    await load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Category Management</h1>
        <p className="text-slate-400 text-sm">Create and remove course categories.</p>
      </div>

      <form onSubmit={handleCreate} className="glass-card p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon (e.g. BookOpen)" className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white md:col-span-2" />
        <button type="submit" className="md:col-span-4 px-4 py-3 rounded-xl bg-brand-600 text-white font-semibold">Add Category</button>
      </form>

      {loading ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-white font-semibold">{cat.name}</div>
                <div className="text-xs text-slate-400">{cat.description}</div>
              </div>
              <button onClick={() => handleDelete(cat._id)} className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
