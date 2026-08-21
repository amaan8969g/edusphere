import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import { GraduationCap, Mail, Loader2, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await forgotPassword(data.email);
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      const msg = err.response?.data?.message || 'No registered user found with that email address.';
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
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
          <p className="text-sm text-slate-400">Enter your registered email to reset your account password</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {resetToken ? (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Reset Token Generated</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A password reset token has been created for your account. Click below to enter your new password.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Reset Code / Token</span>
                <span className="font-mono text-xs font-bold text-amber-300 break-all block">{resetToken}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/reset-password/${resetToken}`)}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-glow-emerald transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                Set New Password
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
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
                      Generating Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <KeyRound className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                Remembered your password?{' '}
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

export default ForgotPassword;
