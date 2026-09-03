import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Lock, Sparkles, Home, Layers } from 'lucide-react';
import { useScrollSystem } from './ScrollSystem';

export const NotFound: React.FC = () => {
  const { scrollTo } = useScrollSystem();

  const handleNavigateHome = () => {
    window.location.href = '/';
  };

  const handleNavigateSection = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-[#f05a28] text-white flex flex-col justify-between p-6 sm:p-10 selection:bg-white selection:text-[#f05a28] font-sans relative overflow-hidden select-none">
      
      {/* ──── Cyber Grid Overlay & Plus Crosshairs ──── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle grid lines */}
        <div className="absolute top-0 bottom-0 left-[6%] right-[6%] flex justify-between">
          <div className="w-px h-full bg-white/20" />
          <div className="w-px h-full bg-white/20" />
          <div className="w-px h-full bg-white/20" />
        </div>
        <div className="absolute left-0 right-0 top-[15%] bottom-[15%] flex flex-col justify-between">
          <div className="h-px w-full bg-white/20" />
          <div className="h-px w-full bg-white/20" />
        </div>

        {/* Plus Signs (+) at grid intersections */}
        <span className="absolute top-[15%] left-[6%] -translate-x-1/2 -translate-y-1/2 text-white/50 text-xs font-mono">+</span>
        <span className="absolute top-[15%] right-[6%] translate-x-1/2 -translate-y-1/2 text-white/50 text-xs font-mono">+</span>
        <span className="absolute bottom-[15%] left-[6%] -translate-x-1/2 translate-y-1/2 text-white/50 text-xs font-mono">+</span>
        <span className="absolute bottom-[15%] right-[6%] translate-x-1/2 translate-y-1/2 text-white/50 text-xs font-mono">+</span>
      </div>

      {/* ── TOP NAVIGATION HEADER (100% Mobile, Tablet & PC Responsive) ── */}
      <header className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Left Logo */}
        <div 
          onClick={handleNavigateHome}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img 
            src="/logo.webp" 
            alt="Asadullah Logo" 
            className="h-10 sm:h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform" 
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
          />
        </div>

        {/* Center Floating Glassmorphic Navbar Pill */}
        <nav className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white overflow-x-auto max-w-full">
          <button onClick={() => handleNavigateHome()} className="hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap">HOME</button>
          <button onClick={() => handleNavigateSection('about')} className="hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap">ABOUT</button>
          <button onClick={() => handleNavigateSection('skills')} className="hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap">SKILLS</button>
          <button onClick={() => handleNavigateSection('projects')} className="hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap">PROJECTS</button>
          <button onClick={() => handleNavigateSection('contact')} className="hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap">CONTACT</button>
        </nav>

        {/* Right Spacer to maintain center alignment on desktop */}
        <div className="hidden sm:block w-16" />
      </header>

      {/* ── MAIN PROMINENT 404 HERO CONTAINER ── */}
      <main className="relative z-20 my-auto max-w-5xl mx-auto w-full flex flex-col items-center text-center py-10 space-y-6">
        
        {/* Glassmorphic Speech Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-sans italic text-white/95 font-medium shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-orange-300 shrink-0 animate-pulse" />
          <span>Looks like you took a wrong turn...</span>
        </motion.div>

        {/* PROMINENT MAIN 404 DISPLAY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
        >
          <h1 className="text-8xl sm:text-[160px] md:text-[210px] font-black font-['Outfit'] uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-500 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            404
          </h1>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black font-['Outfit'] uppercase tracking-tight text-white drop-shadow-md"
        >
          PAGE NOT FOUND
        </motion.h2>

        {/* Description Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-white/85 max-w-lg mx-auto font-medium leading-relaxed"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* CTA Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={handleNavigateHome}
            className="px-8 py-4 rounded-full bg-white text-[#f05a28] hover:bg-zinc-100 font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>BACK HOME</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavigateSection('projects')}
            className="px-8 py-4 rounded-full bg-black/20 hover:bg-black/40 border border-white/40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg backdrop-blur-md"
          >
            <span>VIEW PROJECTS</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavigateSection('about')}
            className="group font-bold text-xs uppercase tracking-wider text-white hover:text-amber-200 flex items-center gap-1.5 underline underline-offset-4 transition-colors cursor-pointer"
          >
            <span>EXPLORE WORK</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>

      </main>

      {/* ── BOTTOM FOOTER BAR ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/80 border-t border-white/10">
        {/* Left Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] uppercase font-bold tracking-widest">
          <span>©2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span>AI ENGINEER</span>
        </div>

        {/* Right Contact Prompt */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-white/70">Lost? Let's fix that.</span>
          <button 
            onClick={() => handleNavigateSection('contact')}
            className="text-white font-bold underline underline-offset-4 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer uppercase"
          >
            <span>CONTACT ME</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
