import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import StudentDashboard from '../pages/student/StudentDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminInstructors from '../pages/admin/AdminInstructors';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCategories from '../pages/admin/AdminCategories';
import ProtectedRoute from '../components/common/ProtectedRoute';
import CourseCatalog from '../pages/public/CourseCatalog';
import CourseDetails from '../pages/public/CourseDetails';
import StudentCourseLearn from '../pages/student/StudentCourseLearn';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import ArticleCatalog from '../pages/public/ArticleCatalog';
import ArticleDetails from '../pages/public/ArticleDetails';
import AptitudeHub from '../pages/student/AptitudeHub';
import StudentClasses from '../pages/student/StudentClasses';
import InstructorClasses from '../pages/instructor/InstructorClasses';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/courses" element={<CourseCatalog />} />
      <Route path="/courses/:slug" element={<CourseDetails />} />
      <Route path="/articles" element={<ArticleCatalog />} />
      <Route path="/articles/:slug" element={<ArticleDetails />} />

      {/* Protected Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/aptitude"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}>
            <AptitudeHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/classes"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}>
            <StudentClasses />
          </ProtectedRoute>
        }
      />

      {/* Protected Student Course Learn Route */}
      <Route path="/student/course/:id/learn" element={<ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}><StudentCourseLearn /></ProtectedRoute>} />

      {/* Protected Instructor Routes */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/classes"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorClasses />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/instructors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInstructors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCategories />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="max-w-7xl mx-auto px-4 py-28 text-center space-y-4">
            <h1 className="text-6xl font-extrabold text-brand-400">404</h1>
            <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
            <p className="text-slate-400">The requested page does not exist.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
