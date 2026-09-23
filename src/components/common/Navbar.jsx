import React, { useState, useEffect } from 'react';
import { PingXLogo } from './PingXLogo';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ onEnterApp, onOpenAuth, isLoggedIn: propIsLoggedIn }) {
  const { user, logout } = useAuth();
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : !!user;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle shrinking state when scrolled down past 30px
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (label) => {
    const sectionMap = {
      'Features': 'messaging',
      'Chat': 'messaging',
      'Assistant': 'ai-assistant',
      'AI Assistant': 'ai-assistant',
      'Smart Shop': 'smart-shop',
    };

    const targetId = sectionMap[label];
    if (targetId) {
      if (window.lenis) {
        window.lenis.scrollTo(`#${targetId}`, { offset: -80, duration: 1.2 });
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-350">
      <header
        className={`pointer-events-auto navbar-header-shrink transition-all duration-350 ease-in-out ${
          isScrolled
            ? 'mt-3 sm:mt-4 w-[92%] sm:w-[90%] max-w-6xl rounded-2xl sm:rounded-full py-2.5 px-6 sm:px-8 border shadow-2xl shadow-black/10'
            : 'mt-0 w-full max-w-full rounded-none py-4 sm:py-5 px-6 border-b shadow-none'
        }`}
        style={{
          backgroundColor: isScrolled
            ? 'color-mix(in srgb, var(--bg-card) 62%, transparent)'
            : 'var(--bg-card)',
          borderColor: isScrolled ? 'var(--border)' : 'var(--border)',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(10px)',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(10px)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between transition-all duration-300">
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`navbar-brand-shrink cursor-pointer transition-all duration-300 origin-left flex items-center ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}
          >
            <PingXLogo className="h-8 sm:h-9 flex items-center" showText={true} textClassName="text-xl sm:text-2xl font-black text-slate-900" />
          </button>

          {/* Nav links */}
          <nav
            className={`hidden md:flex items-center text-sm font-semibold transition-all duration-300 ${
              isScrolled ? 'gap-6' : 'gap-8'
            }`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {['Features', 'Chat', 'Assistant', 'Smart Shop'].map((label) => (
              <button
                key={label}
                onClick={() => handleNavClick(label === 'Assistant' ? 'AI Assistant' : label)}
                className="hover:text-slate-900 transition-colors cursor-pointer text-slate-600 font-medium"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 text-sm">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onEnterApp}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-slate-800 text-xs font-bold"
                  title="View your dashboard"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'}
                    alt={user.name || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-slate-300"
                  />
                  <span className="max-w-[100px] truncate">{user.name?.split(' ')[0] || user.username || 'Account'}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
                  title="Sign out of account"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('login') : null}
                  className="font-bold cursor-pointer transition-colors text-slate-700 hover:text-slate-900 px-3 py-1.5"
                >
                  Sign in
                </button>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                  className={`navbar-btn-shrink font-bold cursor-pointer transition-all duration-300 bg-[#7256c3] hover:bg-[#6348b6] text-white shadow-md shadow-[#7256c3]/20 ${
                    isScrolled ? 'px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm' : 'px-5 py-2.5 text-sm'
                  }`}
                  style={{ borderRadius: '9999px' }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}


