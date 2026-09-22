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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e6e2f8] shadow-2xl flex flex-col justify-between text-slate-900 animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#e6e2f8] bg-[#f8f7ff] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#7256c3] uppercase font-mono tracking-wider block">DETAILS DRAWER</span>
              <h3 className="text-lg font-extrabold font-heading text-slate-900 tracking-tight">{title || 'Details & Overview'}</h3>
              {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-900 border border-[#e6e2f8] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {children}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#e6e2f8] bg-[#f8f7ff] flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> PingX Verified Specs
            </span>
            <button
              onClick={onClose}
              className="bg-[#7256c3] hover:bg-[#6245b5] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Close Panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
