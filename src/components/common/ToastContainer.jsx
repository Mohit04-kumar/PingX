import React, { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, Info, X, Zap } from 'lucide-react';

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#35ed7e]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#fee75c]" />;
      case 'deal':
        return <Zap className="w-5 h-5 text-[#ec48bd]" />;
      default:
        return <Info className="w-5 h-5 text-[#5865f2]" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-[#35ed7e]/40';
      case 'warning': return 'border-[#fee75c]/40';
      case 'deal': return 'border-[#ec48bd]/40';
      default: return 'border-[#5865f2]/40';
    }
  };

  return (
    <div className={`relative bg-[#1e2353] text-white p-4 rounded-2xl border ${getBorderColor()} shadow-2xl overflow-hidden flex items-start gap-3 w-80 sm:w-96 animate-fadeIn transition-all`}>
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-black uppercase font-heading tracking-wide text-white">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-gray-300 font-medium leading-relaxed mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-[#35ed7e] animate-progress"
        style={{
          animationDuration: `${toast.duration || 4000}ms`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards'
        }}
      />
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}
