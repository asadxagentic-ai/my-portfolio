import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useScrollSystem } from './ScrollSystem';

const FOOTER_LINKS = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Projects', id: 'projects' },
  { name: 'Contact', id: 'contact' }
];

export function Footer() {
  const { scrollTo } = useScrollSystem();

  return (
    <footer className="relative bg-[#09090b] text-zinc-500 py-16 md:py-24 px-[5%] border-t border-zinc-900 overflow-hidden font-sans select-none">
      
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-0 bottom-0 left-[5%] right-[5%] flex justify-between">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-px h-full bg-zinc-900/30" />
          ))}
        </div>
      </div>

      {/* Ambient floating orbs */}
      <div className="absolute top-[20%] right-[15%] w-24 h-24 bg-orange-500/[0.02] rounded-full blur-2xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[30%] left-[10%] w-32 h-32 bg-orange-500/[0.015] rounded-full blur-3xl animate-float pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-zinc-900 pb-16">
          
          {/* Column 1: Identity & Copyright */}
          <motion.div 
            className="max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className="text-white font-bold font-['Outfit'] tracking-tight text-xl mb-4 uppercase group">
              <span className="hover-underline-draw cursor-pointer" onClick={() => scrollTo('home')}>ASADULLAH</span>
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-6">
              Designing and building intelligent automation systems, full-stack products, and seamless AI agent integrations.
            </p>
            <span className="text-[12px] font-mono tracking-wider block text-zinc-500">
              © 2026 ASADULLAH. ALL RIGHTS RESERVED.
            </span>
          </motion.div>

          {/* Column 2: Sitemap Directory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] font-mono text-zinc-400 block mb-4 uppercase tracking-widest font-bold">
              // Sitemap
            </span>
            <ul className="space-y-3 font-mono text-sm">
              {FOOTER_LINKS.map((link, i) => (
                <li key={link.id}>
                  <motion.button 
                    onClick={() => scrollTo(link.id)}
                    className="group relative hover:text-orange-500 transition-all duration-300 uppercase tracking-wider text-left font-bold cursor-pointer flex items-center gap-2"
                    whileHover={{ x: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="w-0 group-hover:w-3.5 h-px bg-orange-500 transition-all duration-300" />
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Colophon specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] font-mono text-zinc-400 block mb-4 uppercase tracking-widest font-bold">
              // Colophon
            </span>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-500">
              {[
                { label: 'ENGINE:', value: 'VITE + REACT' },
                { label: 'STYLES:', value: 'TAILWIND CSS v4' },
                { label: 'MOTION:', value: 'FRAMER MOTION v12' },
                { label: 'SERVER STATUS:', value: 'ONLINE // OK' },
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  className="group hover:text-zinc-300 transition-colors duration-300 cursor-default"
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="text-zinc-400 font-bold group-hover:text-orange-500 transition-colors duration-300">{item.label}</span> {item.value}
                  {item.label === 'SERVER STATUS:' && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 ml-2 animate-pulse-glow" />
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Back to Top Scroller */}
          <motion.div 
            className="flex justify-end self-stretch md:self-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button 
              onClick={() => scrollTo('home')}
              className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-orange-500/40 flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] group"
              whileHover={{ y: -4, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              aria-label="Scroll Back to Top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.button>
          </motion.div>

        </div>

        {/* Faded Branding watermark */}
        <motion.div 
          className="mt-16 md:mt-24 text-center group cursor-default"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            className="text-[12vw] font-black uppercase tracking-tighter leading-none pointer-events-none select-none block font-['Outfit'] transition-all duration-1000 group-hover:tracking-[-0.02em]"
            style={{
              letterSpacing: '-0.05em',
              color: '#2d2d38',
              transition: 'color 1s ease, text-shadow 1s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = '#3f3f4d';
              (e.target as HTMLElement).style.textShadow = '0 0 80px rgba(240, 90, 40, 0.08)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = '#2d2d38';
              (e.target as HTMLElement).style.textShadow = 'none';
            }}
          >
            ASADULLAH
          </span>
        </motion.div>

      </div>
    </footer>
  );
}
