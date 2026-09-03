import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useDragon } from './DragonContext';

export function CustomCursor() {
  const [hoverType, setHoverType] = useState<'default' | 'grow' | 'drag' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // High performance coordinates tracking using Framer Motion values (bypasses React re-renders)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for fluid movement
  const springConfig = { stiffness: 450, damping: 35, mass: 0.25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  
  useEffect(() => {
    // Disable custom cursor on touch devices to avoid conflict
    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsMobile(touchQuery.matches);
    const touchHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    touchQuery.addEventListener('change', touchHandler);

    // Check reduced motion setting
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(prev => prev ? prev : true);
    };

    let lastTarget: HTMLElement | null = null;
    const handlePointerOver = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement;
      if (!targetEl || targetEl === lastTarget) return;
      lastTarget = targetEl;

      // Detect cursor targets using custom attributes or tags
      const dragTarget = targetEl.closest('[data-cursor="drag"]');
      const viewTarget = targetEl.closest('[data-cursor="view"]');
      const interactiveTarget = targetEl.closest('a, button, [role="button"], .cursor-pointer, [role="slider"]');

      if (dragTarget) {
        setHoverType('drag');
      } else if (viewTarget) {
        setHoverType('view');
      } else if (interactiveTarget) {
        setHoverType('grow');
      } else {
        setHoverType('default');
      }
    };

    const handleMouseLeaveDoc = () => setIsVisible(false);
    const handleMouseEnterDoc = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveDoc);
    document.addEventListener('mouseenter', handleMouseEnterDoc);

    return () => {
      touchQuery.removeEventListener('change', touchHandler);
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('mouseleave', handleMouseLeaveDoc);
      document.removeEventListener('mouseenter', handleMouseEnterDoc);
    };
  }, [mouseX, mouseY]);

  const { isDragonActive } = useDragon();

  // Do not render if on mobile, reduced motion is preferred, or dragon cursor is active
  if (isMobile || reducedMotion || isDragonActive) return null;

  // Render cursor configurations based on active state
  const cursorVariants = {
    default: {
      width: 10,
      height: 10,
      backgroundColor: '#ea580c',
      borderRadius: '9999px',
      border: '0px solid transparent',
      boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)'
    },
    grow: {
      width: 52,
      height: 52,
      backgroundColor: 'rgba(234, 88, 12, 0.04)',
      borderRadius: '9999px',
      border: '1.2px solid #ea580c',
      boxShadow: '0 0 16px rgba(234, 88, 12, 0.15)'
    },
    drag: {
      width: 80,
      height: 32,
      backgroundColor: 'rgba(9, 9, 11, 0.95)',
      borderRadius: '8px',
      border: '1px solid #ea580c',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    view: {
      width: 90,
      height: 90,
      backgroundColor: '#ffffff',
      borderRadius: '9999px',
      border: '0px solid transparent',
      boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
    }
  };

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:flex items-center justify-center transition-opacity duration-300 transform-gpu ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <motion.div
        animate={hoverType}
        variants={cursorVariants}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="flex items-center justify-center overflow-hidden"
      >
        {/* Render text or icons inside specific states */}
        {hoverType === 'drag' && (
          <span className="text-[8px] font-mono font-bold tracking-widest text-orange-500 uppercase select-none whitespace-nowrap">
            ← DRAG →
          </span>
        )}
        {hoverType === 'view' && (
          <span className="text-[9px] font-sans font-black tracking-widest text-black uppercase select-none text-center leading-none">
            VIEW<br/>CASE
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
