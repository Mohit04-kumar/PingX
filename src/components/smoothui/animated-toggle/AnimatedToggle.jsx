import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/utils';

const SPRING = {
  bounce: 0.1,
  duration: 0.25,
  type: 'spring',
};

const SIZES = {
  lg: {
    icon: 'size-3.5',
    thumb: 'size-6',
    thumbTranslate: 24,
    track: 'w-[52px] h-7',
  },
  md: {
    icon: 'size-3',
    thumb: 'size-5',
    thumbTranslate: 20,
    track: 'w-11 h-6',
  },
  sm: {
    icon: 'size-2.5',
    thumb: 'size-4',
    thumbTranslate: 16,
    track: 'w-9 h-5',
  },
};

/**
 * AnimatedToggle (SmoothUI)
 * Animated toggle switch with morph and icon variants
 */
export function AnimatedToggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = 'default',
  icons,
  size = 'md',
  disabled = false,
  label,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newValue = !checked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [checked, disabled, isControlled, onChange]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  const sizeConfig = SIZES[size] || SIZES.md;

  const getThumbBorderRadius = () => {
    if (variant !== 'morph' || shouldReduceMotion) {
      return 9999;
    }
    return checked ? 9999 : 6;
  };

  const getThumbTransform = () => {
    return checked ? sizeConfig.thumbTranslate : 0;
  };

  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        checked ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700',
        disabled && 'cursor-not-allowed opacity-50',
        sizeConfig.track,
        className
      )}
      disabled={disabled}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="switch"
      type="button"
    >
      <motion.span
        animate={
          shouldReduceMotion
            ? { x: getThumbTransform() }
            : {
                borderRadius: getThumbBorderRadius(),
                x: getThumbTransform(),
              }
        }
        className={cn(
          'pointer-events-none flex items-center justify-center rounded-full border border-border/80 bg-white shadow-sm text-slate-800',
          sizeConfig.thumb
        )}
        initial={false}
        style={{ borderRadius: getThumbBorderRadius() }}
        transition={shouldReduceMotion ? { duration: 0 } : SPRING}
      >
        {variant === 'icon' && icons && (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={checked ? 'on' : 'off'}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, rotate: 0, scale: 1 }
              }
              className={cn(
                'flex items-center justify-center text-slate-700',
                sizeConfig.icon
              )}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, rotate: -90, scale: 0.5 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 90, scale: 0.5 }
              }
              transition={shouldReduceMotion ? { duration: 0 } : SPRING}
            >
              {checked ? icons.on : icons.off}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.span>
    </button>
  );
}

export default AnimatedToggle;
