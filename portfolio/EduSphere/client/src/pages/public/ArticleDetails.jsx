import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug } from '../../api/articleApi';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  User, 
  Calendar, 
  Tag, 
  BookOpen, 
  Loader2,
  Share2,
  Check
} from 'lucide-react';

const ArticleDetails = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchArticleBySlug(slug);
        if (res.data?.article) {
          setArticle(res.data.article);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-slate-400">The requested learning article could not be found.</p>
        <Link to="/articles" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back Button */}
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </Link>

      {/* Article Header Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <span className="px-3.5 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
            {article.category}
          </span>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              {article.readTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" />
              {article.views} views
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                {article.authorName ? article.authorName.charAt(0).toUpperCase() : 'E'}
              </div>
              <span className="text-slate-200 font-semibold">{article.authorName}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6 text-slate-200 leading-relaxed text-sm sm:text-base">
        {article.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-white pt-4 border-b border-slate-800 pb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-bold text-white pt-4 border-b border-slate-800 pb-2">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Tags Footer */}
      {article.tags && article.tags.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-3">
          <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ArticleDetails;
