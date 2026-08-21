import React, { useState } from 'react';
import { createArticle } from '../../api/articleApi';
import { 
  X, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const ArticleCreatorModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Coding');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter both title and article body content.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await createArticle({
        title,
        category,
        readTimeMinutes: Number(readTimeMinutes),
        excerpt,
        content,
        tags,
      });

      if (res.data?.article) {
        if (onSuccess) onSuccess(res.data.article);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to publish article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            Publish Informative Article
          </h2>
          <p className="text-xs text-slate-400">
            Write self-paced learning content, exam strategies, or architectural guides.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
            <input
              type="text"
              placeholder="e.g. Modern Clean Architecture with Microservices"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Tech & Coding">Tech & Coding</option>
                <option value="Aptitude & Logic">Aptitude & Logic</option>
                <option value="Study Skills">Study Skills</option>
                <option value="AI & Future Tech">AI & Future Tech</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Read Time (Minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Short Summary</label>
            <input
              type="text"
              placeholder="Brief summary shown on article cards..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Article Content (Markdown supported)</label>
            <textarea
              rows={8}
              placeholder="Use ### for section headings. Write comprehensive content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, WebDev, Architecture"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Article'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ArticleCreatorModal;
