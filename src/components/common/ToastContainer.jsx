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
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'deal':
        return <Zap className="w-5 h-5 text-[#7256c3]" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-emerald-300 bg-white';
      case 'warning': return 'border-amber-300 bg-white';
      case 'deal': return 'border-violet-300 bg-white';
      default: return 'border-indigo-300 bg-white';
    }
  };

  const getBarColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'deal': return 'bg-[#7256c3]';
      default: return 'bg-indigo-500';
    }
  };

  return (
    <div className={`relative ${getBorderColor()} text-slate-900 p-4 rounded-2xl border shadow-xl overflow-hidden flex items-start gap-3 w-80 sm:w-96 animate-fadeIn transition-all`}>
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-extrabold uppercase font-heading tracking-wide text-slate-900">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${getBarColor()} animate-progress`}
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
