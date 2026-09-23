import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PingXLogo } from '../common/PingXLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SignInPage({ onNavigateToLanding, onNavigateToRegister, onAuthSuccess }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrUser.trim()) {
      setError('Please enter your email address or username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(emailOrUser.trim(), password);
      setLoading(false);
      addToast('Welcome back to PingX! Successfully signed in.', 'success');
      if (onAuthSuccess) onAuthSuccess();
      else onNavigateToLanding();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid credentials. Please verify your email/username and password.');
      addToast(err.message || 'Sign in failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 group cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>
        <button
          onClick={onNavigateToLanding}
          className="cursor-pointer"
        >
          <PingXLogo className="h-9 flex items-center" showText={true} textClassName="text-xl text-slate-900" />
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-6 py-8 flex-1 flex items-center justify-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Left Hero Column: Light Lavender / Dashboard Tone with High Contrast Text */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#f8f7ff] border-r border-[#e6e2f8] p-10 flex-col justify-between relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-[#7256c3]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-[#6366f1]/10 blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified & Encrypted</span>
              </div>
              
              <h2 className="text-3xl font-extrabold font-heading leading-tight tracking-tight text-slate-900">
                One platform for genuine conversations and real deals.
              </h2>
              
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Join thousands who use PingX every day for live group messaging, encrypted voice notes, and instant price alerts across India's top stores.
              </p>
            </div>

            {/* Visual Feature Proof Card */}
            <div className="space-y-3 pt-6 border-t border-[#e6e2f8] relative z-10">
              <div className="bg-white rounded-2xl p-3.5 border border-[#e6e2f8] shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                      alt="Raman Raj"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-none">Raman Raj</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">● Active in PingX Chat</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7256c3] bg-violet-50 px-2 py-0.5 rounded-full font-bold">
                    Encrypted
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f8f7ff] border border-[#e6e2f8] text-[11px] text-slate-800 space-y-1">
                  <p className="leading-snug">
                    "Hey! The price scanner just found ₹2,000 off on the Sony headphones! 🎧"
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right">10:42 AM</span>
                </div>

                {/* Verified Deal Drop Snapshot */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
                    alt="Sony Headphones"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">Sony WH-1000XM5 ANC</p>
                    <p className="text-[10px] text-slate-500">Amazon: <strong className="text-[#7256c3]">₹26,990</strong> <span className="line-through text-slate-400">₹28,990</span></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#7256c3] text-white shrink-0">
                    -₹2,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Sign in to your account
                </h1>
                <p className="text-sm text-slate-500">
                  Welcome back! Please enter your details below.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Username */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="alex@example.com or alex99"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => addToast('Password reset instructions sent to your email.', 'info')}
                      className="text-xs font-semibold text-[#7256c3] hover:text-[#5b43a2] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7256c3] focus:ring-[#7256c3] border-slate-300 cursor-pointer accent-[#7256c3]"
                  />
                  <label htmlFor="rememberMe" className="text-xs font-medium text-slate-600 cursor-pointer">
                    Keep me signed in on this device
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-lg shadow-[#7256c3]/25 bg-[#7256c3] hover:bg-[#6348b6] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In to PingX
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Social Login Options */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs hover:border-[#7256c3]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      login('apple.id@icloud.com', 'SecurePass123!');
                      addToast('Signed in via Apple ID!', 'success');
                      if (onAuthSuccess) onAuthSuccess();
                    }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs hover:border-[#7256c3]"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.94-12-14.58-6.19-9.58-11.05-20.73-14.58-33.45-3.53-12.72-5.3-24.36-5.3-34.92 0-14.48 3.56-26.65 10.68-36.5 7.12-9.85 16.27-14.88 27.46-15.09 5.64 0 11.53 1.48 17.67 4.45 6.14 2.97 10.05 4.51 11.73 4.62 1.3.11 5.37-1.46 12.22-4.71 6.84-3.25 12.75-4.68 17.72-4.29 13.06.87 23.36 5.89 30.9 15.06-11.54 6.96-17.15 16.48-16.83 28.56.32 9.57 4.09 17.65 11.31 24.24 7.22 6.59 15.65 10.35 25.3 11.28-2.06 6.31-4.78 12.87-8.15 19.68zM119.22 33.39c0-7.39 2.68-14.34 8.04-20.85 5.36-6.51 12-10.74 19.92-12.69.87 6.96-.92 13.91-5.36 20.85-4.44 6.94-10.97 11.45-19.59 13.53-.44-.28-1.57-.46-3.01-.84z"/>
                    </svg>
                    Apple ID
                  </button>
                </div>
              </div>

              {/* Toggle to Register */}
              <div className="pt-2 text-center text-xs text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-bold text-[#7256c3] hover:text-[#5b43a2] underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PingX. All rights reserved. Encrypted & Privacy Preserving.
      </footer>

      {/* Google Sign-In Modal Popup */}
      {showGoogleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowGoogleModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <h3 className="font-extrabold text-sm text-slate-900 font-heading">Sign in with Google</h3>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">Choose an account to continue to PingX:</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  login('raman@pingx.app', '123');
                  setShowGoogleModal(false);
                  addToast('Signed in via Google as Raman Raj!', 'success', 2500);
                  if (onAuthSuccess) onAuthSuccess();
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50 hover:bg-white transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Raman Raj"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-900">Raman Raj</p>
                  <p className="text-[11px] text-slate-500">raman@pingx.app</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('mr.mohitkumar004@gmail.com', '123');
                  setShowGoogleModal(false);
                  addToast('Signed in via Google as Mohit Kumar!', 'success', 2500);
                  if (onAuthSuccess) onAuthSuccess();
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50 hover:bg-white transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-900">Mohit Kumar</p>
                  <p className="text-[11px] text-slate-500">mr.mohitkumar004@gmail.com</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Google will share your name, email address, and profile picture with PingX.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignInPage;
