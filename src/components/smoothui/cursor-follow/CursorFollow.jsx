import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '../../../lib/utils';

const CIRCLE_SIZE = 14;
const MIN_BUBBLE_WIDTH = 42;
const BUBBLE_HEIGHT = 36;
const TEXT_PADDING = 28;

/**
 * CursorFollow (SmoothUI)
 * Interactive cursor tracker that smoothly expands into text bubbles on elements with data-cursor-text.
 */
export function CursorFollow({
  children,
  className = '',
  hideNativeCursor = false,
}) {
  const [cursorText, setCursorText] = useState(null);
  const [pendingText, setPendingText] = useState(null);
  const [textWidth, setTextWidth] = useState(0);
  const [isInside, setIsInside] = useState(false);
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive spring follow configuration (ultra-snappy, silky smooth tracking)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 26, stiffness: 850, mass: 0.12 });
  const springY = useSpring(y, { damping: 26, stiffness: 850, mass: 0.12 });

  const bubbleWidth = cursorText
    ? Math.max(textWidth + TEXT_PADDING, MIN_BUBBLE_WIDTH)
    : CIRCLE_SIZE;
  const bubbleHeight = cursorText ? BUBBLE_HEIGHT : CIRCLE_SIZE;

  const bubbleSizeRef = useRef({ width: CIRCLE_SIZE, height: CIRCLE_SIZE });
  bubbleSizeRef.current = { width: bubbleWidth, height: bubbleHeight };
  const mousePosRef = useRef({ x: -100, y: -100 });

  // Direct mouse tracking without React state re-render lag
  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
      x.set(event.clientX - bubbleSizeRef.current.width / 2);
      y.set(event.clientY - bubbleSizeRef.current.height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  // Recenter when expanding/contracting bubble for text
  useEffect(() => {
    if (mousePosRef.current.x !== -100) {
      x.set(mousePosRef.current.x - bubbleWidth / 2);
      y.set(mousePosRef.current.y - bubbleHeight / 2);
    }
  }, [bubbleWidth, bubbleHeight, x, y]);

  useEffect(() => {
    if (pendingText && measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setTextWidth(width);
      setCursorText(pendingText);
      setPendingText(null);
    }
    if (!(pendingText || cursorText)) {
      setTextWidth(0);
    }
  }, [pendingText, cursorText]);

  const handleMouseOver = (e) => {
    setIsInside(true);
    let target = e.target;
    let foundText = null;
    while (target && target !== containerRef.current) {
      if (target.getAttribute && target.getAttribute('data-cursor-text')) {
        foundText = target.getAttribute('data-cursor-text');
        break;
      }
      target = target.parentElement;
    }
    if (foundText) {
      setPendingText(foundText);
    } else {
      setCursorText(null);
      setPendingText(null);
    }
  };

  const handleMouseLeave = () => {
    setIsInside(false);
    setCursorText(null);
    setPendingText(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
      style={{ cursor: hideNativeCursor && isInside ? 'none' : 'auto' }}
    >
      {children}

      {/* Floating Follower */}
      {isInside && (
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          className="pointer-events-none fixed z-50 transition-opacity duration-200"
          initial={{ opacity: 0, scale: 0.8 }}
          style={{ left: 0, top: 0, x: springX, y: springY }}
        >
          <motion.div
            animate={
              cursorText
                ? {
                    background: 'linear-gradient(135deg, #7256c3 0%, #6366f1 100%)',
                    borderRadius: 20,
                    boxShadow: '0 8px 24px -4px rgba(114, 86, 195, 0.4)',
                    color: '#ffffff',
                    height: BUBBLE_HEIGHT,
                    paddingLeft: 14,
                    paddingRight: 14,
                    scale: 1.05,
                    width: bubbleWidth,
                  }
                : {
                    background: 'rgba(114, 86, 195, 0.22)',
                    border: '1.5px solid rgba(114, 86, 195, 0.65)',
                    borderRadius: 999,
                    color: '#ffffff',
                    height: CIRCLE_SIZE,
                    paddingLeft: 0,
                    paddingRight: 0,
                    scale: 1,
                    width: CIRCLE_SIZE,
                  }
            }
            className="flex items-center justify-center font-bold text-xs"
            layout
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: [0.645, 0.045, 0.355, 1] }
            }
          >
            {cursorText && (
              <motion.span
                animate={{ filter: 'blur(0px)', opacity: 1 }}
                exit={{ filter: 'blur(4px)', opacity: 0 }}
                initial={{ filter: 'blur(4px)', opacity: 0 }}
                className="whitespace-nowrap tracking-wide text-white drop-shadow-xs"
                transition={{ duration: 0.15 }}
              >
                {cursorText}
              </motion.span>
            )}
          </motion.div>

          {/* Hidden measurement node */}
          {pendingText && (
            <span
              ref={measureRef}
              className="absolute pointer-events-none text-xs font-bold"
              style={{ paddingLeft: 14, paddingRight: 14, visibility: 'hidden', whiteSpace: 'nowrap' }}
            >
              {pendingText}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default CursorFollow;
