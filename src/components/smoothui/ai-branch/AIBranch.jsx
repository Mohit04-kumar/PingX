import React, { createContext, useContext, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, GitBranch } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/utils';

const SPRING_DEFAULT = { bounce: 0.1, duration: 0.25, type: 'spring' };
const SPRING_SNAPPY = { bounce: 0, duration: 0.2, type: 'spring' };

const AIBranchContext = createContext(null);

export const useAIBranch = () => {
  const context = useContext(AIBranchContext);
  if (!context) {
    throw new Error('AIBranch components must be used within AIBranch');
  }
  return context;
};

/**
 * AIBranch Component (SmoothUI)
 * Interactive AI branch component for switching between alternative prompt/response conversation flows.
 */
export function AIBranch({
  branches = [],
  currentBranchIndex = 0,
  onBranchChange,
  className = '',
}) {
  const [activeIdx, setActiveIdx] = useState(currentBranchIndex);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const totalBranches = branches.length;
  const currentBranch = branches[activeIdx] || branches[0];

  const handleIndexChange = (newIdx) => {
    setActiveIdx(newIdx);
    if (onBranchChange) {
      onBranchChange(newIdx, branches[newIdx]);
    }
  };

  const goToPrevious = () => {
    const nextIdx = activeIdx > 0 ? activeIdx - 1 : totalBranches - 1;
    handleIndexChange(nextIdx);
  };

  const goToNext = () => {
    const nextIdx = activeIdx < totalBranches - 1 ? activeIdx + 1 : 0;
    handleIndexChange(nextIdx);
  };

  const handleCopy = () => {
    if (!currentBranch) return;
    navigator.clipboard?.writeText(currentBranch.aiResponse || currentBranch.text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!branches || branches.length === 0) return null;

  return (
    <div className={cn('w-full max-w-3xl space-y-3', className)}>
      {/* Branch Navigation Bar */}
      {totalBranches > 1 && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-border/80 bg-muted/40 text-xs text-muted-foreground backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-orange-500">
              <GitBranch size={13} />
              Branch Version
            </span>
            <span className="tabular-nums font-semibold px-2 py-0.5 rounded-md bg-background border border-border text-foreground">
              {activeIdx + 1} of {totalBranches}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              aria-label="Previous branch"
              className="size-7 flex items-center justify-center rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted cursor-pointer transition-colors"
              onClick={goToPrevious}
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <ChevronLeft size={13} />
            </motion.button>

            <motion.button
              aria-label="Next branch"
              className="size-7 flex items-center justify-center rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted cursor-pointer transition-colors"
              onClick={goToNext}
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <ChevronRight size={13} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Active Branch Content */}
      <motion.div
        key={`branch-${activeIdx}`}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
        initial={{ opacity: 0, y: 6 }}
        transition={SPRING_DEFAULT}
      >
        {/* User Prompt */}
        {currentBranch.userMessage && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-orange-600 px-4 py-2.5 text-white shadow-sm text-sm">
              <p className="leading-relaxed">{currentBranch.userMessage}</p>
            </div>
          </div>
        )}

        {/* AI Response */}
        <div className="flex justify-start">
          <div className="relative max-w-[90%] rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm text-slate-800 dark:text-slate-100 text-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7256c3]">
                <GitBranch size={13} />
                <span>{currentBranch.title || `PingX AI • Alternative ${activeIdx + 1}`}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                type="button"
                title="Copy response"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">
              {currentBranch.aiResponse}
            </div>

            {currentBranch.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border/40">
                {currentBranch.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AIBranch;
