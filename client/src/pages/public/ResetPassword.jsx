import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Eye, EyeOff, Loader2, CheckCircle2, KeyRound } from 'lucide-react';

const ResetPassword = () => {
  const { token: urlToken } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState(urlToken || '');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const finalToken = urlToken || tokenInput;
    if (!finalToken) {
      setError('Please provide a valid password reset token.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await resetPassword(finalToken, data.password);
      const { user, token } = response.data;
      setSuccess(true);

      // Auto-login user after 1.5s
      setTimeout(() => {
        login(user, response.token || token);
        if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (user.role === 'instructor') navigate('/instructor/dashboard', { replace: true });
        else navigate('/student/dashboard', { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Reset password error:', err);
      const msg = err.response?.data?.message || 'Invalid or expired reset token. Please request a new one.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Set New Password</h2>
          <p className="text-sm text-slate-400">Create a secure new password for your EduSphere account</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {success ? (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Password Reset Complete!</h3>
              <p className="text-xs text-slate-400">
                Your password has been successfully updated. Signing you in and redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Reset Token field if not in URL */}
                {!urlToken && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Reset Token
                    </label>
                    <div className="relative">
                      <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Paste reset token here"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      {...register('password', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                      })}
                      className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: (val) => val === password || 'Passwords do not match',
                      })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Reset Password & Sign In'
                  )}
                </button>

              </form>

              <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                Back to{' '}
                <Link to="/login" className="font-semibold text-brand-400 hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
