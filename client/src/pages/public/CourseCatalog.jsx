import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../../api/courseApi';
import { fetchCategories } from '../../api/categoryApi';
import { Search, BookOpen, Filter, Sparkles, Star, User, Layers, ArrowRight } from 'lucide-react';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res.data?.categories) setCategories(res.data.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedLevel) params.level = selectedLevel;

        const res = await fetchCourses(params);
        if (res.data?.courses) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadCourses, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore <span className="gradient-text">Masterclass Courses</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Learn from industry leaders through structured video lectures, AI study support, and verifiable certificates.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses by topic, skill, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category & Level Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card p-4 rounded-3xl border border-slate-800 animate-pulse space-y-4">
              <div className="w-full h-48 bg-slate-800 rounded-2xl" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No courses match your criteria</h3>
          <p className="text-slate-400 text-xs">Try clearing filters or searching for another topic.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="glass-card rounded-3xl border border-slate-800 overflow-hidden hover:border-brand-500/50 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-brand-400">
                  {course.level}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                    {course.category?.name || 'Development'}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {course.instructor?.name ? course.instructor.name.charAt(0) : 'I'}
                    </div>
                    <span className="text-xs text-slate-300 font-medium">
                      {course.instructor?.name || 'Instructor'}
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course.slug || course._id}`}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-all flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CourseCatalog;
