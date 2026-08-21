import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../api/articleApi';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Eye, 
  Sparkles, 
  Tag, 
  ArrowRight,
  Loader2,
  FileText
} from 'lucide-react';

const CATEGORIES = ['All', 'Tech & Coding', 'Aptitude & Logic', 'Study Skills', 'AI & Future Tech'];

const ArticleCatalog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles(
          selectedCategory === 'All' ? '' : selectedCategory,
          searchTerm
        );
        if (data.data?.articles) {
          setArticles(data.data.articles);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadArticles, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Hero Header */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden text-center space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800/50 text-xs font-semibold text-brand-400">
          <BookOpen className="w-3.5 h-3.5" />
          EduSphere Knowledge Base
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Informative Articles for <span className="gradient-text">Self-Paced Learning</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Explore expertly curated guides, aptitude strategy breakdowns, technology architecture tutorials, and learning productivity hacks.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
          <p className="text-sm">Loading knowledge base articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No articles found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <Link
              key={art._id}
              to={`/articles/${art.slug}`}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-[11px] font-semibold text-brand-400">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTimeMinutes} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      {art.views} views
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  By <span className="text-slate-200 font-medium">{art.authorName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default ArticleCatalog;
