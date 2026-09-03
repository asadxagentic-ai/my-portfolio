import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

const NAVBAR_LOGO_ID = 'navbar-brand-logo-target';
const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface BrandLoaderProps {
  onComplete?: () => void;
}

export function BrandLoader({ onComplete }: BrandLoaderProps) {
  // Timeline Phases: 'hold' (0.0s-1.6s) -> 'travel' (1.6s-3.2s) -> 'complete' (3.2s+)
  const [phase, setPhase] = useState<'hold' | 'travel' | 'complete'>('hold');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introBounds, setIntroBounds] = useState<{ width: number; height: number } | null>(null);

  // Target displacement and scale
  const [targetTransform, setTargetTransform] = useState<{
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);

  const logoRef = useRef<HTMLImageElement>(null);

  // Synchronously measure unscaled logo bounds on mount before browser paint
  useLayoutEffect(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setIntroBounds({ width: rect.width, height: rect.height });
      }
    }
  }, []);

  // Measure navbar logo DOM bounds and calculate top-left aligned target displacement & exact scaleX/scaleY
  const calculateDelta = useCallback(() => {
    const navbarEl = document.getElementById(NAVBAR_LOGO_ID);
    if (!navbarEl || !logoRef.current) return null;

    const navRect = navbarEl.getBoundingClientRect();
    const introRect = logoRef.current.getBoundingClientRect();

    if (navRect.width === 0 || navRect.height === 0 || introRect.width === 0 || introRect.height === 0) return null;

    // Initial centered position relative to top-0 left-0
    const initialX = (window.innerWidth - introRect.width) / 2;
    const initialY = (window.innerHeight - introRect.height) / 2;

    // Target top-left coordinates relative to top-0 left-0
    const targetX = navRect.left;
    const targetY = navRect.top;

    // Exact scale factor matching target dimensions
    const scaleX = navRect.width / introRect.width;
    const scaleY = navRect.height / introRect.height;

    return { initialX, initialY, targetX, targetY, scaleX, scaleY };
  }, []);

  useEffect(() => {
    // Lock body scroll during intro
    document.body.style.overflow = 'hidden';

    // Reduced motion check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
      const timer = setTimeout(() => {
        setPhase('complete');
        document.body.style.overflow = '';
        const navEl = document.getElementById(NAVBAR_LOGO_ID);
        if (navEl) navEl.style.opacity = '1';
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Timeline Sequence:
    // 0.0s - 1.6s: Massive A. logo holds static in viewport center over bright orange background
    // 1.6s - 3.2s: Smooth, unhurried shrink & travel to navbar position
    // 3.2s: Land in navbar, reveal target logo, unmount loader overlay
    const tTravel = setTimeout(() => {
      const delta = calculateDelta();
      if (delta) {
        setTargetTransform(delta);
      }
      setPhase('travel');
    }, 1600);

    const tComplete = setTimeout(() => {
      // Reveal navbar logo FIRST before unmounting loader overlay
      const navEl = document.getElementById(NAVBAR_LOGO_ID);
      if (navEl) {
        navEl.style.opacity = '1';
      }

      document.body.style.overflow = '';
      setPhase('complete');

      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(tTravel);
      clearTimeout(tComplete);
      document.body.style.overflow = '';
    };
  }, [calculateDelta, onComplete]);

  // Recalculate position on window resize
  useEffect(() => {
    if (phase !== 'travel') return;
    const handleResize = () => {
      const delta = calculateDelta();
      if (delta) setTargetTransform(delta);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [phase, calculateDelta]);

  if (phase === 'complete') return null;

  /* Reduced Motion Fallback */
  if (reducedMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-[999999] bg-[#f05a28] flex items-center justify-center pointer-events-none select-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/logo.png" alt="Asadullah Logo" className="w-72 h-auto object-contain" />
      </motion.div>
    );
  }

  const initialX = targetTransform
    ? targetTransform.initialX
    : introBounds
    ? (window.innerWidth - introBounds.width) / 2
    : 0;

  const initialY = targetTransform
    ? targetTransform.initialY
    : introBounds
    ? (window.innerHeight - introBounds.height) / 2
    : 0;

  const currentX = phase === 'travel' && targetTransform ? targetTransform.targetX : initialX;
  const currentY = phase === 'travel' && targetTransform ? targetTransform.targetY : initialY;
  const currentScaleX = phase === 'travel' && targetTransform ? targetTransform.scaleX : 1;
  const currentScaleY = phase === 'travel' && targetTransform ? targetTransform.scaleY : 1;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none select-none overflow-hidden">
      {/* ── 1. Hero Orange Overlay Backdrop ──────────────────────────── */}
      {/* Visually matches the hero section background (#f05a28) */}
      <motion.div
        className="absolute inset-0 bg-[#f05a28]"
        initial={{ opacity: 1 }}
        animate={{
          opacity: phase === 'travel' ? 0 : 1,
        }}
        transition={{ duration: 1.2, delay: phase === 'travel' ? 0.4 : 0, ease: EASE_PREMIUM }}
      />

      {/* ── 2. Ambient Warm Radial Glow behind Center Logo ──────────── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-3xl"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 45%, transparent 70%)',
        }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: phase === 'travel' ? 0 : 1,
          scale: phase === 'travel' ? 0.2 : 1,
        }}
        transition={{ duration: 1.2, ease: EASE_PREMIUM }}
      />

      {/* ── 3. DEDICATED INTRO LOGO (MASSIVE VIEWPORT CENTER) ─────────── */}
      {/* FIRST FRAME GUARANTEE: Rendered massive at fixed top: 0, left: 0, transformOrigin: '0 0' */}
      <motion.img
        ref={logoRef}
        src="/logo.png"
        alt="Asadullah Logo"
        onLoad={() => {
          if (logoRef.current) {
            const rect = logoRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              setIntroBounds({ width: rect.width, height: rect.height });
            }
          }
        }}
        className="fixed top-0 left-0 w-[320px] sm:w-[480px] md:w-[640px] lg:w-[760px] xl:w-[840px] h-auto object-contain pointer-events-none filter drop-shadow-[0_16px_50px_rgba(0,0,0,0.35)]"
        style={{
          transformOrigin: '0 0',
        }}
        initial={{
          x: initialX,
          y: initialY,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        }}
        animate={{
          x: currentX,
          y: currentY,
          scaleX: currentScaleX,
          scaleY: currentScaleY,
          opacity: 1,
        }}
        transition={{
          duration: 1.6,
          ease: EASE_PREMIUM,
        }}
      />
    </div>
  );
}
