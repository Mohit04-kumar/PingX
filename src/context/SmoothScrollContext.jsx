/**
 * PingX Smooth Scroll Architecture (Lenis + Motion)
 * 
 * Performance Principles:
 * - Uses modern Lenis (v1.3) with requestAnimationFrame ticker.
 * - Exponential deceleration easing for tactile, organic momentum.
 * - Hardware accelerated (GPU composited transforms, zero continuous top/left repaints).
 * - Automatic delegation for anchor links (e.g. <a href="#smart-shop">).
 * - Respects prefers-reduced-motion for accessibility compliance.
 * - Resets scroll immediately on view/route transitions without momentum carry-over.
 */

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => {}
});

export function SmoothScrollProvider({ children, currentView }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect OS-level reduced motion accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with tuned momentum physics
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Connect to browser render cycle via requestAnimationFrame
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global anchor link handler for smooth jump to target sections
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top cleanly upon view change (Landing -> Login -> Dashboard)
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -80, ...options });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export const useSmoothScroll = () => useContext(SmoothScrollContext);
