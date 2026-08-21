import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Shield, Sparkles, Award } from 'lucide-react';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EduSphere</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An enterprise-grade LMS built for next-generation digital learning, powered by AI study assistants and automated course completion certificates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-brand-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/articles" className="hover:text-brand-400 transition-colors">Articles & Guides</Link></li>
              {!isAuthenticated ? (
                <>
                  <li><Link to="/register" className="hover:text-brand-400 transition-colors">Student Registration</Link></li>
                  <li><Link to="/register?role=instructor" className="hover:text-brand-400 transition-colors">Teach on EduSphere</Link></li>
                </>
              ) : (
                <li><Link to={getDashboardRoute()} className="hover:text-brand-400 transition-colors font-medium text-brand-400">My Dashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Portals Section - Role Sensitive */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              {!isAuthenticated ? (
                <>
                  <li><Link to="/login" className="hover:text-brand-400 transition-colors">Student Portal</Link></li>
                  <li><Link to="/login" className="hover:text-brand-400 transition-colors">Instructor Portal</Link></li>
                  <li><Link to="/login" className="hover:text-brand-400 transition-colors">Admin Portal</Link></li>
                </>
              ) : user?.role === 'instructor' ? (
                <>
                  <li><Link to="/instructor/dashboard" className="hover:text-brand-400 transition-colors text-purple-400 font-medium">Instructor Dashboard</Link></li>
                  <li><Link to="/instructor/classes" className="hover:text-brand-400 transition-colors">Virtual Classrooms</Link></li>
                  <li><Link to="/courses" className="hover:text-brand-400 transition-colors">Manage Courses</Link></li>
                </>
              ) : user?.role === 'admin' ? (
                <>
                  <li><Link to="/admin/dashboard" className="hover:text-brand-400 transition-colors text-brand-400 font-medium">Admin Control Center</Link></li>
                  <li><Link to="/admin/users" className="hover:text-brand-400 transition-colors">User Management</Link></li>
                  <li><Link to="/admin/instructors" className="hover:text-brand-400 transition-colors">Instructor Approvals</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/student/dashboard" className="hover:text-brand-400 transition-colors text-emerald-400 font-medium">Student Dashboard</Link></li>
                  <li><Link to="/student/classes" className="hover:text-brand-400 transition-colors">Virtual Classes</Link></li>
                  <li><Link to="/student/aptitude" className="hover:text-brand-400 transition-colors">Aptitude Hub</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Highlights</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-brand-400" />
                AI-Powered Study Mentor
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                Course Completion Certificates
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-indigo-400" />
                RBAC Security System
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EduSphere LMS. Built with MERN Stack & Clean Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
