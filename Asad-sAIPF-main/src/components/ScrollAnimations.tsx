/**
 * ScrollAnimations.tsx — Premium scroll animation system
 *
 * 5 distinct non-generic effects:
 *  1. Velocity-reactive luminous progress bar
 *  2. Scroll velocity dot trail
 *  3. Section teleprinter (types section name at right edge)
 *  4. Scroll depth arc indicator (bottom-left)
 *  5. Left-edge ribbon tracker with speed glow dot
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';

/* -------------------------------------------------------------
   1. LUMINOUS PROGRESS BAR — velocity-reactive glow width
   ------------------------------------------------------------- */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [velocity, setVelocity] = useState(0);
  const lastScroll = useRef(0);
  const lastTime   = useRef(Date.now());

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const dt  = Math.max(now - lastTime.current, 1);
      const dy  = Math.abs(window.scrollY - lastScroll.current);
      setVelocity(Math.min(dy / dt * 20, 1));
      lastScroll.current = window.scrollY;
      lastTime.current   = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const glowOpacity = 0.35 + velocity * 0.65;
  const glowSpread  = 4 + velocity * 14;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[99999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #f05a28, #ff8c5a, #f05a28)',
        boxShadow: `0 0 ${glowSpread}px ${glowOpacity * 10}px rgba(240,90,40,${glowOpacity})`,
        transition: 'box-shadow 0.15s ease',
      }}
    />
  );
}

/* -------------------------------------------------------------
   2. VELOCITY DOT TRAIL — dots spawn per scroll, drift and vanish
   ------------------------------------------------------------- */
type TrailDot = { id: number; x: number; y: number; size: number };

export function ScrollVelocityTrail() {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const idRef   = useRef(0);
  const lastY   = useRef(0);
  const rafRef  = useRef<number | null>(null);

  const spawn = useCallback(() => {
    const dy = Math.abs(window.scrollY - lastY.current);
    lastY.current = window.scrollY;
    if (dy < 3) return;
    const count = Math.min(Math.floor(dy / 8), 3);
    const newDots: TrailDot[] = Array.from({ length: count }, () => ({
      id:   idRef.current++,
      x:    6 + Math.random() * 6,
      y:    window.scrollY + window.innerHeight * (0.3 + Math.random() * 0.4),
      size: 3 + Math.random() * 5,
    }));
    setDots(prev => [...prev.slice(-18), ...newDots]);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(spawn);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spawn]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99990] overflow-hidden">
      <AnimatePresence>
        {dots.map(dot => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-[#f05a28]"
            style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
            initial={{ opacity: 0.85, scale: 1,  x: 0,  y: 0 }}
            animate={{ opacity: 0,   scale: 0.1, x: -6, y: -24 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.65 + Math.random() * 0.5, ease: 'easeOut' }}
            onAnimationComplete={() =>
              setDots(prev => prev.filter(d => d.id !== dot.id))
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------
   3. SECTION TELEPRINTER — types current section at right edge
   ------------------------------------------------------------- */
const SECTION_MAP: Record<string, string> = {
  home:     'HOME',
  about:    'ABOUT',
  skills:   'SKILLS',
  projects: 'PROJECTS',
  contact:  'CONTACT',
};

export function SectionTeleprinter() {
  const [current,   setCurrent]   = useState('HOME');
  const [displayed, setDisplayed] = useState('');
  const [visible,   setVisible]   = useState(true);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.keys(SECTION_MAP).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrent(SECTION_MAP[id]); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    if (typeRef.current) clearInterval(typeRef.current);
    if (fadeRef.current) clearTimeout(fadeRef.current);
    setDisplayed('');
    setVisible(true);
    let i = 0;
    typeRef.current = setInterval(() => {
      i++;
      setDisplayed(current.slice(0, i));
      if (i >= current.length) {
        clearInterval(typeRef.current!);
        fadeRef.current = setTimeout(() => setVisible(false), 2400);
      }
    }, 60);
    return () => {
      if (typeRef.current) clearInterval(typeRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [current]);

  return (
    <AnimatePresence>
      {visible && displayed.length > 0 && (
        <motion.div
          className="fixed right-5 top-1/2 -translate-y-1/2 z-[99980] pointer-events-none hidden md:block"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{    opacity: 0, x: 12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="flex flex-col items-center gap-3"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            <span className="text-[9px] font-mono font-black tracking-[0.35em] uppercase text-[#f05a28]">
              {displayed}
              <motion.span
                className="inline-block bg-[#f05a28] align-middle ml-[1px]"
                style={{ width: 1, height: 9 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.55, repeat: Infinity }}
              />
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-[#f05a28]/60 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------
   4. SCROLL DEPTH ARC INDICATOR — bottom-left radial arc
   ------------------------------------------------------------- */
export function ScrollDepthIndicator() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', v => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  const radius = 16;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  if (pct <= 1 || pct >= 99) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-6 z-[99980] pointer-events-none hidden md:block"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg width="40" height="40" className="absolute inset-0 -rotate-90">
          <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(240,90,40,0.12)" strokeWidth="1.5" />
          <circle
            cx="20" cy="20" r={radius}
            fill="none"
            stroke="#f05a28"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.2s ease' }}
          />
        </svg>
        <span className="text-[7px] font-mono font-black text-[#f05a28] leading-none tabular-nums select-none">
          {pct}
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
   5. LEFT-EDGE SCROLL RIBBON with velocity glow dot
   ------------------------------------------------------------- */
export function ScrollRibbon() {
  const { scrollYProgress } = useScroll();
  const height = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 120, damping: 25 }
  );

  const [velocity, setVelocity] = useState(0);
  const lastScroll = useRef(0);
  const lastTime   = useRef(Date.now());

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const dt  = Math.max(now - lastTime.current, 1);
      const dy  = Math.abs(window.scrollY - lastScroll.current);
      setVelocity(Math.min(dy / dt * 18, 1));
      lastScroll.current = window.scrollY;
      lastTime.current   = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[2px] z-[99970] pointer-events-none hidden md:block">
      <div className="absolute inset-0 bg-[#f05a28]/8" />
      <motion.div
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#f05a28] to-[#ff8c5a]"
        style={{ height }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#f05a28]"
        style={{ top: height, width: 8, height: 8, marginLeft: -3, marginTop: -4 }}
        animate={{
          boxShadow: `0 0 ${6 + velocity * 18}px ${2 + velocity * 10}px rgba(240,90,40,${0.4 + velocity * 0.55})`,
          scale: 1 + velocity * 0.5,
        }}
        transition={{ duration: 0.12 }}
      />
    </div>
  );
}
