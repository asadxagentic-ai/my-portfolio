import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface MaskRevealProps {
  originalSrc: string;
  revealedSrc: string;
  altText: string;
  isHovered: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
}

/**
 * MaskReveal Component
 * Renders the layered portrait images, applies the radial CSS mask,
 * and overlays premium lighting, bloom, grain, and floating dust particles.
 */
export function MaskReveal({
  originalSrc,
  revealedSrc,
  altText,
  isHovered,
  isMobile,
  reducedMotion
}: MaskRevealProps) {
  // Generate a set of random floating dust particles
  const particles = useMemo(() => {
    const arr: Particle[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        // Small premium dust mote sizing
        size: Math.random() * 3 + 1,
        // Spread starting positions across the face/spotlight area
        left: `${20 + Math.random() * 60}%`,
        top: `${15 + Math.random() * 65}%`,
        // Vary timing to create organic asynchronous motion
        duration: `${8 + Math.random() * 12}s`,
        delay: `${-Math.random() * 10}s`,
        // Subtle drift offsets
        driftX: `${(Math.random() - 0.5) * 50}px`,
        driftY: `${-60 - Math.random() * 60}px` // Always drift upwards slowly
      });
    }
    return arr;
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* ── IMAGE A: Original Portrait (Base layer, always visible) ── */}
      <img
        src={originalSrc}
        alt={altText}
        className="w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.02]"
        onError={(e) => {
          // Robust Unsplash fallback
          e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop";
        }}
        draggable="false"
      />

      {/* ── MASKED CONTAINER LAYER (Image B + effects inside spotlight) ── */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 ease-out will-change-transform hero-mask-container"
        style={{
          // Apply hardware-accelerated CSS masking
          WebkitMaskImage: 'radial-gradient(circle 240px at var(--mask-x, 50%) var(--mask-y, 50%), black 0%, black 25%, transparent 100%)',
          maskImage: 'radial-gradient(circle 240px at var(--mask-x, 50%) var(--mask-y, 50%), black 0%, black 25%, transparent 100%)',
          // Driven dynamically by the MouseTracker requestAnimationFrame loop
          opacity: 'var(--mask-opacity, 0)',
        }}
      >
        {/* ── IMAGE B: Sunglasses / AI Portrait (Revealed layer) ── */}
        <img
          src={revealedSrc}
          alt={`${altText} wearing sunglasses`}
          className="absolute inset-0 w-full h-full object-cover object-top scale-100 filter brightness-[1.05] contrast-[1.08] saturate-[1.05]"
          onError={(e) => {
            // Distinct premium fallback for sunglasses image
            e.currentTarget.src = "/maskimage.png";
          }}
          draggable="false"
        />

        {/* ── Subtle Grain/Noise Overlay inside Spotlight ── */}
        <div className="absolute inset-0 mix-blend-overlay opacity-[0.08] pointer-events-none hero-spotlight-grain" />

        {/* ── Tiny Floating Dust Particles (Clipped inside spotlight) ── */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-orange-200/40 blur-[0.5px] hero-dust-particle"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: p.left,
                  top: p.top,
                  animation: `dustFloat ${p.duration} ease-in-out ${p.delay} infinite`,
                  // Pass custom variables for keyframes drift
                  ['--drift-x' as any]: p.driftX,
                  ['--drift-y' as any]: p.driftY,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Orange Glow / Bloom Ring (Sits outside masked layer, layered on top) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-30 mix-blend-screen transition-opacity duration-500 ease-out will-change-transform"
        style={{
          // Follows the same coordinates and opacity
          background: 'radial-gradient(circle 250px at var(--mask-x, 50%) var(--mask-y, 50%), rgba(240, 90, 40, 0.14) 0%, rgba(240, 90, 40, 0.04) 55%, transparent 100%)',
          opacity: 'var(--mask-opacity, 0)',
        }}
      />
      
      {/* ── Ambient Soft Glow (Inner core highlight for the spotlight) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-30 mix-blend-plus-lighter transition-opacity duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle 100px at var(--mask-x, 50%) var(--mask-y, 50%), rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          opacity: 'var(--mask-opacity, 0)',
        }}
      />
    </div>
  );
}
