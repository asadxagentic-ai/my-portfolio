/**
 * ScrollSystem.tsx
 *
 * Core Scroll Animation & Smooth Scroll Orchestrator.
 * Powered by Lenis (smooth scroll) and motion/react (Framer Motion).
 *
 * Exposes:
 *  - ScrollSystemProvider: Initializes Lenis, handles prefers-reduced-motion,
 *    and provides a global toggle to disable scroll animations.
 *  - ScrollReveal: Component to stagger text, fade/scale images, and slide divs.
 *  - CountUp: Component to animate numbers when scrolled into view.
 */
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { motion, useInView } from "motion/react";

interface ScrollSystemContextProps {
  motionEnabled: boolean;
  setMotionEnabled: (val: boolean) => void;
  scrollTo: (target: string | HTMLElement, options?: any) => void;
}

const ScrollSystemContext = createContext<ScrollSystemContextProps>({
  motionEnabled: true,
  setMotionEnabled: () => {},
  scrollTo: (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
});

export const useScrollSystem = () => useContext(ScrollSystemContext);

// Global cubic-bezier curves for unified premium feel
export const PREMIUM_EASE = [0.16, 1, 0.3, 1] as any; // Ultra-smooth out
export const STAGGER_EASE = [0.215, 0.61, 0.355, 1] as any;

export function ScrollSystemProvider({ children }: { children: React.ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = (target: string | HTMLElement, options?: any) => {
    const selector = typeof target === 'string' && !target.startsWith('#') && !target.startsWith('.') ? `#${target}` : target;
    if (lenisRef.current && motionEnabled) {
      lenisRef.current.scrollTo(selector, options);
    } else {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Detect system reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mediaQuery.matches;

    // Set initial state based on reduced motion setting
    if (reducedMotion) {
      setMotionEnabled(false);
      return;
    }

    if (!motionEnabled) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Lazy load Lenis settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium exponential easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Hook Lenis into requestAnimationFrame
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motionEnabled]);

  // Monitor prefers-reduced-motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMotionEnabled(false);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <ScrollSystemContext.Provider value={{ motionEnabled, setMotionEnabled, scrollTo }}>
      {children}
    </ScrollSystemContext.Provider>
  );
}

/* --------------------------------------------------------------
   SCROLL REVEAL COMPONENT
   Supports: "fade-up", "stagger-text", "image-reveal"
   -------------------------------------------------------------- */
interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fade-up" | "stagger-text" | "image-reveal";
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
}: ScrollRevealProps) {
  const { motionEnabled } = useScrollSystem();

  // If motion is disabled globally, render static content directly
  if (!motionEnabled) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "stagger-text" && typeof children === "string") {
    const words = children.split(" ");
    return (
      <span className={`inline-block ${className}`}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-1">
            <motion.span
              className="inline-block origin-bottom"
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: duration,
                delay: delay + i * 0.04,
                ease: PREMIUM_EASE,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    );
  }

  if (variant === "image-reveal") {
    return (
      <div className={`relative overflow-hidden rounded-3xl ${className}`}>
        <motion.div
          className="absolute inset-0 bg-orange-500 z-10 origin-left"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: duration, delay: delay, ease: PREMIUM_EASE }}
        />
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: duration + 0.2, delay: delay + 0.1, ease: PREMIUM_EASE }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // Default "fade-up"
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: PREMIUM_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------
   COUNT UP STATS
   Animates numeric output when scrolling into view
   -------------------------------------------------------------- */
interface CountUpProps {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({ to, duration = 1.5, prefix = "", suffix = "", className = "" }: CountUpProps) {
  const { motionEnabled } = useScrollSystem();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView || !motionEnabled) {
      setValue(to);
      return;
    }

    let start = 0;
    const end = to;
    const totalTicks = 60 * duration;
    let tickCount = 0;

    const timer = setInterval(() => {
      tickCount++;
      const progress = tickCount / totalTicks;
      // Exponential out easing
      const easeProgress = 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(start + (end - start) * easeProgress);

      setValue(currentVal);

      if (tickCount >= totalTicks) {
        clearInterval(timer);
        setValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, to, duration, motionEnabled]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
