import React, { useEffect } from 'react';
import { X, ExternalLink, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';

export function SlideOverDrawer({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1e2353] border-l border-[#5865f2]/30 shadow-2xl flex flex-col justify-between text-white animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#5865f2]/20 bg-[#0a0d3a]/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#5865f2] uppercase font-heading tracking-widest block">PAGE FLOWS DRAWER</span>
              <h3 className="text-lg font-black font-heading text-white tracking-tight uppercase">{title || 'Details & Overview'}</h3>
              {subtitle && <p className="text-xs text-gray-300 font-medium">{subtitle}</p>}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0a0d3a] text-gray-300 hover:text-white border border-[#5865f2]/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#5865f2]/20 bg-[#0a0d3a] flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-1.5 text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#35ed7e]" /> PingX Verified Specs
            </span>
            <button
              onClick={onClose}
              className="btn-discord-blurple px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
