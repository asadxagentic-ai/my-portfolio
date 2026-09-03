/**
 * MaskedPortrait.tsx
 *
 * Hover-reveal mask effect: human photo on top, robot/AI image underneath.
 * Wherever the cursor is, the human layer becomes transparent, revealing
 * the robot layer through a soft radial-gradient mask.
 *
 * HOW TO SWAP YOUR IMAGES:
 *   HUMAN_SRC  — path to your real portrait (default /portrait.png)
 *   ROBOT_SRC  — path to your robot/AI version (e.g. /portrait-robot.png)
 *   If you don''t have a robot image yet, a styled fallback is shown.
 *
 * TECH:
 *   - React + useRef-based rAF lerp loop (no direct style writes on mousemove)
 *   - CSS custom properties --mx / --my drive the mask-image radial-gradient
 *   - Soft reveal: transparent core ? opaque edge over ~100px feather
 *   - Reveal radius: 120px (adjust REVEAL_RADIUS below)
 *   - Robot layer: cool-blue tint + SVG scanline/grid texture overlay
 *   - On leave: smooth CSS transition restores mask to center (hidden state)
 *   - Touch fallback: mask disabled on (hover: none) devices
 *   - prefers-reduced-motion: skips lerp, instant state change
 */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

/* --------------------------------------------------------------
   CONFIGURATION — edit these three constants to customise
   -------------------------------------------------------------- */
// ??  SWAP: path to your real photo
const HUMAN_SRC  = "/portrait.png";

// ??  SWAP: path to your robot / AI-generated version
//     Needs to be the same pose/crop as the human photo.
//     If the file doesn''t exist, the robot layer shows a styled gradient.
const ROBOT_SRC  = "/portrait-robot.png";

// Reveal circle radius in px (try 100–160)
const REVEAL_RADIUS = 130;

// Lerp factor: 0 = frozen, 1 = instant snap.  0.08–0.12 feels silky.
const LERP = 0.10;

/* --------------------------------------------------------------
   COMPONENT
   -------------------------------------------------------------- */
export function MaskedPortrait() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const humanLayerRef  = useRef<HTMLDivElement>(null);
  const rafRef         = useRef<number | null>(null);

  // Target (raw mouse position) and current (lerped) positions, relative to container
  const target  = useRef({ x: -9999, y: -9999 });
  const current = useRef({ x: -9999, y: -9999 });

  const [isHovered, setIsHovered] = useState(false);

  // Read once on mount — don't re-read on every mousemove
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // -- rAF lerp loop -------------------------------------------
  const tick = useCallback(() => {
    const cur  = current.current;
    const tgt  = target.current;
    const lerp = reducedMotion.current ? 1 : LERP;

    cur.x += (tgt.x - cur.x) * lerp;
    cur.y += (tgt.y - cur.y) * lerp;

    // Write position as CSS custom properties on the human overlay div
    const el = humanLayerRef.current;
    if (el) {
      el.style.setProperty("--mx", `${cur.x}px`);
      el.style.setProperty("--my", `${cur.y}px`);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Start / stop the rAF loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  // -- Mouse handlers ------------------------------------------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Move target off-screen so the lerp smoothly chases it away
    // The CSS transition on the human layer handles the final fade-close
    target.current = { x: -9999, y: -9999 };
    current.current = { x: -9999, y: -9999 };
  };

  /* -- Mask values ---------------------------------------------
     When not hovered: mask covers everything (human photo fully visible)
     When hovered: mask cuts a soft hole around the cursor
  -------------------------------------------------------------- */
  const r = REVEAL_RADIUS;

  // Hovered: the human layer gets a hole punched around the cursor.
  // transparent at cursor ? feathered edge ? opaque outside.
  const hoverMask = `radial-gradient(circle at var(--mx) var(--my), transparent 0%, transparent ${r * 0.45}px, rgba(0,0,0,0.4) ${r * 0.7}px, black ${r * 1.1}px)`;

  // Not hovered: a radial gradient centred far off-screen covers everything.
  const restingMask = `radial-gradient(circle at -9999px -9999px, transparent 0%, black 1px)`;

  const verticalFade = "linear-gradient(to bottom, black 70%, transparent 100%)";

  // Combine: hole-punch AND bottom fade, layered
  const humanMaskImage = isHovered
    ? `${hoverMask}, ${verticalFade}`
    : `${restingMask}, ${verticalFade}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Disable on touch devices via CSS (pointer-events kept for desktop)
      style={{ touchAction: "none" }}
    >

      {/* -- ROBOT / AI LAYER (bottom, always visible underneath) -- */}
      <div
        className="absolute inset-0 flex justify-center items-end"
        aria-hidden="true"
      >
        <img
          src={ROBOT_SRC}
          alt="" /* decorative — screen readers see the human layer */
          className="h-full w-auto object-cover object-top select-none"
          style={{
            // Cool blue/cyan tint for the "machine" reading
            filter: "contrast(1.1) saturate(0.3) brightness(0.9) sepia(0.2) hue-rotate(180deg)",
            imageRendering: "-webkit-optimize-contrast",
            maskImage: verticalFade,
            WebkitMaskImage: verticalFade,
          }}
          draggable={false}
          // Preload: the browser will fetch this alongside the human photo
          fetchPriority="high"
          onError={(e) => {
            // Fallback: hide broken image and let the CSS bg show through
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Scanline / grid texture overlay on the robot layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: verticalFade,
            WebkitMaskImage: verticalFade,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(0, 200, 255, 0.04) 0px,
                rgba(0, 200, 255, 0.04) 1px,
                transparent 1px,
                transparent 4px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(0, 200, 255, 0.03) 0px,
                rgba(0, 200, 255, 0.03) 1px,
                transparent 1px,
                transparent 40px
              )
            `,
            mixBlendMode: "screen",
          }}
        />

        {/* Subtle cyan ambient glow behind the robot layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(0, 180, 255, 0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* -- HUMAN LAYER (top, masked by cursor hole) -- */}
      <div
        ref={humanLayerRef}
        className="absolute inset-0 flex justify-center items-end"
        style={{
          // CSS custom properties updated each rAF tick
          "--mx": "-9999px",
          "--my": "-9999px",
          maskImage: humanMaskImage,
          WebkitMaskImage: humanMaskImage,
          // Smooth restoration when the cursor leaves
          transition: isHovered
            ? "none" /* no transition during active hover — rAF handles it */
            : "mask-image 0.6s ease-out, -webkit-mask-image 0.6s ease-out",
        } as React.CSSProperties}
      >
        <img
          src={HUMAN_SRC}
          alt="Asadullah — AI Expert"
          className="h-full w-auto object-cover object-top drop-shadow-2xl select-none"
          style={{
            imageRendering: "-webkit-optimize-contrast",
            filter: "contrast(1.06) saturate(1.05) brightness(1.02)",
          }}
          draggable={false}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop";
          }}
          referrerPolicy="no-referrer"
          // High priority — this is above-the-fold hero content
          fetchPriority="high"
        />
      </div>

      {/* -- Cursor hint tooltip (desktop only, fades on hover) -- */}
      <div
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 pointer-events-none select-none hidden md:flex flex-col items-center gap-1.5 transition-opacity duration-700"
        style={{ opacity: isHovered ? 0 : 0.6 }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6" />
        </svg>
        <span className="text-[7px] font-mono tracking-widest uppercase text-white/50">
          Scan me
        </span>
      </div>
    </div>
  );
}
