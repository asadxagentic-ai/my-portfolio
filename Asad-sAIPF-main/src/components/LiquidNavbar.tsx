import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollSystem } from './ScrollSystem';
import { DragonToggle } from './DragonToggle';

const navItems = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'Projects', id: 'projects' },
  { name: 'Contact', id: 'contact' },
];

export function LiquidNavbar() {
  const { scrollTo: globalScrollTo } = useScrollSystem();
  const [active, setActive] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // High-performance active section tracking using IntersectionObserver
    // Completely avoids scroll event listener layout reflows (offsetTop/offsetHeight thrashing)
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observerOptions = {
      root: null, // viewport
      rootMargin: '-45% 0px -45% 0px', // center region acts as the active region trigger
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollTo = (id: string) => {
    globalScrollTo(id);
    setActive(id);
    setIsMobileMenuOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const isLight = active === 'about' || active === 'skills' || active === 'contact';

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none px-[5%] h-[10vh] min-h-[80px] flex items-center justify-between text-xs uppercase tracking-widest font-medium">
        <div className="flex-shrink-0 pointer-events-auto cursor-pointer flex items-center transition-transform duration-300 hover:scale-105" onClick={() => scrollTo('home')}>
          <img 
            id="navbar-brand-logo-target"
            src="/logo.png" 
            alt="Asadullah Logo" 
            className="h-20 sm:h-22 md:h-24 lg:h-28 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]" 
            style={{ opacity: 0 }}
            decoding="async"
          />
        </div>

        <motion.nav
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            x: mousePos.x * 0.05,
            y: mousePos.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden lg:flex items-center px-2.5 py-1.5 rounded-full border shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(255,255,255,0.05)] backdrop-blur-[30px] backdrop-saturate-150 overflow-hidden transition-colors duration-500 ${isLight ? 'bg-[#f05a28]/15 border-[#f05a28]/20 shadow-[0_8px_32px_rgba(240,90,40,0.15)]' : 'bg-[rgba(255,255,255,0.08)] border-white/[0.12]'}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
          
          <motion.div 
            className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"
            animate={{
              x: mousePos.x,
              y: mousePos.y,
              opacity: mousePos.x || mousePos.y ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <div className="relative flex items-center gap-1 ">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="relative px-[18px] py-1.5 rounded-full text-[11px] uppercase tracking-widest font-medium transition-all duration-300 group cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute inset-0 rounded-full border overflow-hidden ${isLight ? 'bg-white/40 border-[#f05a28]/30 shadow-[0_0_15px_rgba(240,90,40,0.2)]' : 'bg-white/[0.08] border-white/20 shadow-[0_0_15px_rgba(240,90,40,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)] backdrop-blur-md'}`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-b opacity-50 ${isLight ? 'from-white/60 to-transparent' : 'from-[#f05a28]/20 to-transparent'}`} />
                      <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 blur-[6px] rounded-full ${isLight ? 'bg-[#f05a28]/40' : 'bg-[#f05a28]/60'}`} />
                    </motion.div>
                  )}
                  
                  <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 border ${isLight ? 'bg-white/30 border-[#f05a28]/20 shadow-[0_0_15px_rgba(240,90,40,0.1)]' : 'bg-white/5 border-white/10 group-hover:shadow-[0_0_15px_rgba(240,90,40,0.2),inset_0_1px_2px_rgba(255,255,255,0.1)] group-hover:bg-white/10'}`} />

                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? (isLight ? 'text-[#f05a28] font-bold' : 'text-white drop-shadow-md') : (isLight ? 'text-[#111]/70 group-hover:text-[#f05a28]' : 'text-white/60 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(240,90,40,0.5)]')}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* Right Controls Area (Dragon Toggle + Mobile Menu Button) */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <DragonToggle />

          <div className="lg:hidden">
            <input
              type="checkbox"
              id="hamburger-checkbox"
              className="uiverse-hamburger-checkbox"
              checked={isMobileMenuOpen}
              onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <label htmlFor="hamburger-checkbox" className="hamburger-toggle" aria-label="Toggle Navigation Menu">
              <div className={`hamburger-bar hamburger-bar--1 ${isLight && !isMobileMenuOpen ? '!bg-[#111]' : '!bg-white'}`}></div>
              <div className={`hamburger-bar hamburger-bar--2 ${isLight && !isMobileMenuOpen ? '!bg-[#111]' : '!bg-white'}`}></div>
              <div className={`hamburger-bar hamburger-bar--3 ${isLight && !isMobileMenuOpen ? '!bg-[#111]' : '!bg-white'}`}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Overlay Menu matching Reference Image Exactly */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-8%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-8%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] bg-[#0c0c0c] text-white flex flex-col overflow-y-auto pointer-events-auto lg:hidden"
          >
            {/* Top Header Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 h-16 sm:h-20 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#f05a28] block" />
                <span className="text-zinc-400 font-sans text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
                  MENU
                </span>
              </div>
              <div className="pointer-events-auto">
                <input
                  type="checkbox"
                  id="checkbox-overlay"
                  className="uiverse-checkbox"
                  checked={isMobileMenuOpen}
                  onChange={() => setIsMobileMenuOpen(false)}
                />
                <label htmlFor="checkbox-overlay" className="toggle">
                  <div className="bars !bg-white" id="bar1"></div>
                  <div className="bars !bg-white" id="bar2"></div>
                  <div className="bars !bg-white" id="bar3"></div>
                </label>
              </div>
            </div>

            {/* Navigation Links Stack */}
            <div className="flex flex-col flex-1 justify-center">
              {navItems.map((item, index) => {
                const isActive = active === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.06 + 0.08,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    onClick={() => scrollTo(item.id)}
                    className="w-full text-left px-6 sm:px-10 py-5 sm:py-7 border-b border-zinc-800/80 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span
                        className={`font-['Anton',sans-serif] text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-normal transition-colors duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-zinc-300 group-hover:text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      {isActive ? (
                        <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#f05a28] ml-3 sm:ml-4" />
                      ) : (
                        <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#f05a28] ml-3 sm:ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

