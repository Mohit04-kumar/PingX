import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Moon, Sun, Film, Move } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedToggle } from '../smoothui/animated-toggle/AnimatedToggle';

export function FloatingThemeSwitcher() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('pingx_theme_pos');
    return saved ? JSON.parse(saved) : { x: 24, y: window.innerHeight - 80 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 4) {
        dragRef.current.hasMoved = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 70, dragRef.current.initialX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, dragRef.current.initialY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('pingx_theme_pos', JSON.stringify(position));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  const handleClick = () => {
    if (!dragRef.current.hasMoved) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
        touchAction: 'none'
      }}
      className="select-none"
    >
      {/* Dropdown Menu (Opens Above Button) */}
      {isOpen && (
        <div
          className="absolute bottom-16 left-0 mb-2 w-52 rounded-2xl p-3 border shadow-2xl space-y-1 animate-fadeIn backdrop-blur-xl"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b mb-1.5" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>Dark Mode</span>
            <AnimatedToggle
              checked={theme === 'dark'}
              onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
              variant="icon"
              icons={{ on: <Moon className="w-3 h-3 text-slate-800" />, off: <Sun className="w-3 h-3 text-amber-500" /> }}
              size="sm"
              label="Toggle Dark Mode"
            />
          </div>

          {availableThemes.map((t) => {
            const isActive = theme === t.id;
            const Icon = t.id === 'dark' ? Moon : t.id === 'animation' ? Film : Sun;
            return (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setIsOpen(false); }}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{t.name}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Draggable Button */}
      <button
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`w-13 h-13 rounded-full shadow-2xl flex items-center justify-center border cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-150 ${
          isDragging ? 'scale-110 shadow-[0_0_25px_rgba(132,204,22,0.6)]' : 'opacity-85 hover:opacity-100'
        }`}
        style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)', color: '#fff' }}
        title="Click to Switch Theme / Drag to reposition"
      >
        <Palette className="w-5 h-5 pointer-events-none" />
      </button>
    </div>
  );
}
