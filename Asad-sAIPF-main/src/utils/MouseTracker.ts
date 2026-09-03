import { useEffect, useRef, useState, RefObject } from 'react';

export interface MouseTrackerOptions {
  lerpFactor?: number;
  mobileFloatSpeed?: number;
}

export interface MousePosition {
  x: number;
  y: number;
  lerpedX: number;
  lerpedY: number;
  opacity: number;
  isHovered: boolean;
}

/**
 * MouseTracker Hook
 * Tracks mouse position relative to a container element with custom lerping
 * and handles automatic floating animations on mobile/touch devices.
 * Uses requestAnimationFrame for buttery-smooth 60fps updates.
 */
export function useMouseTracker(
  containerRef: RefObject<HTMLElement | null>,
  options: MouseTrackerOptions = {}
) {
  const { lerpFactor = 0.08, mobileFloatSpeed = 0.002 } = options;

  // Track positions in refs to avoid React re-render overhead at 60fps
  const targetX = useRef<number>(0);
  const targetY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const targetOpacity = useRef<number>(0);
  const currentOpacity = useRef<number>(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rafId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    // Detect mobile/touch devices
    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsMobile(touchQuery.matches);
    const handleTouchChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    touchQuery.addEventListener('change', handleTouchChange);

    // Detect reduced motion settings
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset initial positions to center of container
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    currentX.current = centerX;
    currentY.current = centerY;
    targetX.current = centerX;
    targetY.current = centerY;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const currentRect = container.getBoundingClientRect();
      targetX.current = e.clientX - currentRect.left;
      targetY.current = e.clientY - currentRect.top;
    };

    const handleMouseEnter = () => {
      if (isMobile) return;
      setIsHovered(true);
      targetOpacity.current = 1;
    };

    const handleMouseLeave = () => {
      if (isMobile) return;
      setIsHovered(false);
      targetOpacity.current = 0;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Main 60fps animation loop
    const tick = () => {
      const el = containerRef.current;
      if (!el) return;

      const rectVal = el.getBoundingClientRect();
      const w = rectVal.width || 500;
      const h = rectVal.height || 600;

      if (isMobile) {
        // Automatic float animation for mobile
        timeRef.current += mobileFloatSpeed;
        
        // Generate a smooth infinity loop or Lissajous curve
        const floatX = w / 2 + Math.sin(timeRef.current * 1.5) * (w * 0.25);
        const floatY = h / 2 + Math.cos(timeRef.current * 2.3) * (h * 0.2);
        
        targetX.current = floatX;
        targetY.current = floatY;
        targetOpacity.current = 0.85; // Keep always slightly visible on mobile
      }

      // Apply interpolation (lerp)
      const t = reducedMotion ? 1 : lerpFactor;
      currentX.current += (targetX.current - currentX.current) * t;
      currentY.current += (targetY.current - currentY.current) * t;
      
      // Interpolate opacity for smooth fade in/out
      const opacitySpeed = reducedMotion ? 1 : 0.06;
      currentOpacity.current += (targetOpacity.current - currentOpacity.current) * opacitySpeed;

      // Update CSS variables for hardware acceleration
      el.style.setProperty('--mask-x', `${currentX.current}px`);
      el.style.setProperty('--mask-y', `${currentY.current}px`);
      el.style.setProperty('--mask-opacity', `${currentOpacity.current}`);

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, isMobile, reducedMotion, lerpFactor, mobileFloatSpeed]);

  return {
    isHovered,
    isMobile,
    reducedMotion
  };
}
