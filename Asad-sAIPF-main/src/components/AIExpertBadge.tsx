/**
 * AIExpertBadge.tsx
 *
 * A 3D holographic orbital element that visually signals "AI Expert".
 * Features:
 *  - Mouse-tracked 3D perspective tilt
 *  - Three CSS 3D orbital rings rotating at different speeds/angles
 *  - Glowing orbital dots (like electrons orbiting)
 *  - Central SVG neural network / brain pulse icon
 *  - Floating AI keyword chips (LLMs, Agents, AutoML, NLP)
 *  - Holographic shimmer gradient on hover
 */
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";

const AI_KEYWORDS = ["LLMs", "AI Agents", "AutoML", "NLP", "RAG", "AutoGen"];

export function AIExpertBadge() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const [hovered, setHovered] = useState(false);
  const [activeKw, setActiveKw] = useState(0);

  // Smooth spring physics for tilt
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [14, -14]), { stiffness: 180, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), { stiffness: 180, damping: 28 });
  const glareX  = useTransform(mouseX, [-1, 1], ["0%", "100%"]);
  const glareY  = useTransform(mouseY, [-1, 1], ["0%", "100%"]);

  // Cycle active keyword
  useEffect(() => {
    const t = setInterval(() => setActiveKw(k => (k + 1) % AI_KEYWORDS.length), 1800);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    mouseX.set((e.clientX - cx) / (rect.width  / 2));
    mouseY.set((e.clientY - cy) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative select-none cursor-default"
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[200px] h-[220px] md:w-[220px] md:h-[240px]"
      >
        {/* -- Glass Card Body -- */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/20 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Holographic shimmer on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              background: hovered
                ? `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 70%)`
                : undefined,
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Subtle grid lines inside card */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* -- Orbital Rings (CSS 3D) -- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Ring 1 — horizontal equator */}
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ width: 130, height: 130, transformStyle: "preserve-3d", transform: "rotateX(70deg)" }}
          >
            <svg viewBox="0 0 130 130" className="w-full h-full overflow-visible">
              <ellipse cx="65" cy="65" rx="63" ry="63" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              {/* Glowing dot */}
              <circle cx="128" cy="65" r="4" fill="white" filter="url(#glow)" />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
            </svg>
          </motion.div>

          {/* Ring 2 — tilted at 45deg */}
          <motion.div
            className="absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            style={{ width: 140, height: 140, transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(45deg)" }}
          >
            <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
              <ellipse cx="70" cy="70" rx="68" ry="68" fill="none" stroke="rgba(240,90,40,0.35)" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="138" cy="70" r="3.5" fill="#f05a28" opacity="0.9" />
            </svg>
          </motion.div>

          {/* Ring 3 — perpendicular */}
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            style={{ width: 120, height: 120, transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(-60deg)" }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
              <ellipse cx="60" cy="60" rx="58" ry="58" fill="none" stroke="rgba(255,140,90,0.25)" strokeWidth="1" />
              <circle cx="118" cy="60" r="3" fill="#ff8c5a" opacity="0.8" />
            </svg>
          </motion.div>
        </div>

        {/* -- Central Neural Icon -- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none" style={{ transform: "translateZ(20px)" }}>
          {/* Brain / neural svg */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[#f05a28]/20"
              animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ margin: -10 }}
            />
            {/* Icon container */}
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm"
              style={{ boxShadow: "0 0 20px rgba(240,90,40,0.3), 0 0 40px rgba(240,90,40,0.1)" }}
            >
              {/* Neural network SVG icon */}
              <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
                {/* Nodes */}
                <circle cx="4"  cy="8"  r="2.5" fill="white" opacity="0.9"/>
                <circle cx="4"  cy="16" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="4"  cy="24" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="16" cy="6"  r="2.5" fill="#ff8c5a" opacity="0.95"/>
                <circle cx="16" cy="14" r="2.5" fill="#f05a28" opacity="0.95"/>
                <circle cx="16" cy="22" r="2.5" fill="#ff8c5a" opacity="0.95"/>
                <circle cx="28" cy="10" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="28" cy="22" r="2.5" fill="white" opacity="0.9"/>
                {/* Connections — input?hidden */}
                <line x1="6.5"  y1="8"  x2="13.5" y2="6.2" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                <line x1="6.5"  y1="8"  x2="13.5" y2="14"  stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
                <line x1="6.5"  y1="16" x2="13.5" y2="6.2" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8"/>
                <line x1="6.5"  y1="16" x2="13.5" y2="14"  stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                <line x1="6.5"  y1="16" x2="13.5" y2="22"  stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
                <line x1="6.5"  y1="24" x2="13.5" y2="14"  stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8"/>
                <line x1="6.5"  y1="24" x2="13.5" y2="22"  stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                {/* Connections — hidden?output */}
                <line x1="18.5" y1="6.2" x2="25.5" y2="10" stroke="rgba(255,140,90,0.45)" strokeWidth="0.8"/>
                <line x1="18.5" y1="14" x2="25.5" y2="10" stroke="rgba(240,90,40,0.5)"  strokeWidth="0.8"/>
                <line x1="18.5" y1="14" x2="25.5" y2="22" stroke="rgba(240,90,40,0.5)"  strokeWidth="0.8"/>
                <line x1="18.5" y1="22" x2="25.5" y2="22" stroke="rgba(255,140,90,0.45)" strokeWidth="0.8"/>
                <line x1="18.5" y1="6.2" x2="25.5" y2="22" stroke="rgba(255,140,90,0.25)" strokeWidth="0.8"/>
              </svg>
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center mt-1">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-white/90 leading-tight">
              AI Expert
            </div>
            {/* Cycling keyword */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKw}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
                className="text-[9px] font-bold tracking-widest text-[#f05a28] mt-0.5"
              >
                {AI_KEYWORDS[activeKw]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-1.5 mt-1">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-white/50">
              Available
            </span>
          </div>
        </div>

        {/* -- Bottom colophon strip -- */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-white/10 flex items-center justify-between"
          style={{ transform: "translateZ(10px)" }}
        >
          <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-white/30">
            v3.0 — 2026
          </span>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-[#f05a28]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
