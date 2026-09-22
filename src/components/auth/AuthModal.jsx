import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';

export function AuthModal({ onEnterApp }) {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    register,
    startGuestSession
  } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      alert("Please enter your email or username.");
      return;
    }
    login(loginEmail, loginPassword);
    setAuthModalOpen(false);
    if (onEnterApp) onEnterApp();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert("Please fill in Name and Email.");
      return;
    }
    register({
      name: regName,
      username: regUsername || regName.toLowerCase().replace(/\s+/g, ''),
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });
    setAuthModalOpen(false);
    if (onEnterApp) onEnterApp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1f1633] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative space-y-6 text-white overflow-hidden glass-panel">
        
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Header */}
        <div className="text-center space-y-1 relative z-10 pt-2">
          <h2 className="text-2xl font-black font-heading tracking-tight uppercase text-white button-cap-tracked">
            {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-xs text-gray-400">
            {authMode === 'login' ? 'Access your PingX workspace' : 'Join PingX real-time ecosystem'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl text-xs font-black border border-white/10">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer uppercase button-cap-tracked ${
              authMode === 'login' ? 'bg-[#6a5fc1] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer uppercase button-cap-tracked ${
              authMode === 'register' ? 'bg-[#6a5fc1] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Email or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#c2ef4e] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. mohit@pingx.app or raman"
                  className="w-full glass-input pl-10 pr-4 py-2.5 text-white font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#c2ef4e] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full glass-input pl-10 pr-4 py-2.5 text-white font-bold outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-discord-green py-3.5 rounded-2xl text-xs font-black uppercase tracking-wide cursor-pointer shadow-xl flex items-center justify-center gap-2 mt-2 button-cap-tracked"
            >
              Sign In <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Mohit"
                className="w-full glass-input px-3.5 py-2.5 text-white font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Username Handle *</label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="e.g. mohit"
                className="w-full glass-input px-3.5 py-2.5 text-white font-bold outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input px-3.5 py-2.5 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Phone</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765..."
                  className="w-full glass-input px-3.5 py-2.5 text-white font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Password *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Choose a password"
                className="w-full glass-input px-3.5 py-2.5 text-white font-bold outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-discord-green py-3.5 rounded-2xl text-xs font-black uppercase tracking-wide cursor-pointer shadow-xl flex items-center justify-center gap-2 mt-2 button-cap-tracked"
            >
              Create Account <UserCheck className="w-4 h-4 text-black stroke-[3]" />
            </button>
          </form>
        )}

        {/* Guest Preview Alternative */}
        <div className="pt-2 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] text-gray-400">Just exploring?</p>
          <button
            type="button"
            onClick={() => {
              if (startGuestSession) startGuestSession();
              setAuthModalOpen(false);
              if (onEnterApp) onEnterApp();
            }}
            className="w-full py-2.5 rounded-xl border border-white/20 text-xs font-bold text-gray-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
          >
            Start as Guest (2 Min Preview)
          </button>
        </div>

      </div>
    </div>
  );
}
