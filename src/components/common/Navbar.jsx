import React, { useState, useEffect } from 'react';
import { PingXLogo } from './PingXLogo';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ onEnterApp, onOpenAuth, isLoggedIn: propIsLoggedIn }) {
  const { user } = useAuth();
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
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <PingXLogo className="w-8 h-8 sm:w-9 sm:h-9" showText={true} textClassName="text-xl sm:text-2xl font-black text-slate-900" />
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
            {isLoggedIn ? (
              <button
                onClick={onEnterApp}
                className="navbar-btn-shrink font-extrabold cursor-pointer transition-all duration-300 bg-[#1e1b4b] hover:bg-[#2e2a72] text-white shadow-md px-5 py-2.5 text-xs sm:text-sm rounded-full flex items-center gap-1.5"
              >
                <span>Open Dashboard</span>
                <span className="text-[#a855f7]">↗</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('login') : onEnterApp()}
                  className="font-bold cursor-pointer transition-colors text-slate-700 hover:text-slate-900 px-3 py-1.5"
                >
                  Sign in
                </button>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('register') : onEnterApp()}
                  className={`navbar-btn-shrink font-bold cursor-pointer transition-all duration-300 bg-[#7256c3] hover:bg-[#6348b6] text-white shadow-md shadow-[#7256c3]/20 ${
                    isScrolled ? 'px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm' : 'px-5 py-2.5 text-sm'
                  }`}
                  style={{ borderRadius: '9999px' }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}


