import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '01',
    title: 'NEXUS AI',
    tags: ['AI Platform', 'SaaS'],
    desc: 'Intelligent automation platform revolutionizing enterprise workflows with predictive AI models.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '02',
    title: 'SYNTHESIS',
    tags: ['Machine Learning', 'API'],
    desc: 'Advanced neural network API providing real-time data analysis and pattern recognition for finance.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '03',
    title: 'AURA',
    tags: ['AI Agents', 'Automation'],
    desc: 'Autonomous AI agents capable of handling complex customer service interactions 24/7.',
    image: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '04',
    title: 'QUANTUM',
    tags: ['Data Analytics', 'Dashboard'],
    desc: 'High-performance analytics dashboard processing millions of data points with AI-driven insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '05',
    title: 'HORIZON',
    tags: ['Generative AI', 'Web App'],
    desc: 'Creative suite powered by generative AI models for instant architectural visualization and design.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop'
  }
];

export function Work() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(Math.floor(latest * projects.length), projects.length - 1);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    if (isHovering) {
      window.addEventListener('mousemove', updateMousePosition);
    }
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isHovering]);

  return (
    <section id="work" ref={containerRef} className="relative h-[500vh] bg-[#db4a18] text-white font-sans selection:bg-white selection:text-[#db4a18]">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 rounded-full bg-white text-[#db4a18] flex items-center justify-center text-xs font-black tracking-widest pointer-events-none z-[110] mix-blend-screen shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        animate={{
          x: mousePos.x - 48,
          y: mousePos.y - 48,
          scale: isHovering ? 1 : 0,
          opacity: isHovering ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
      >
        VIEW
      </motion.div>

      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Radial Gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          
          {/* Grid Lines */}
          <div className="absolute top-0 bottom-0 left-[5%] right-[5%] flex justify-between pointer-events-none">
            <div className="w-px h-full bg-white/10 relative">
              <div className="absolute top-20 -left-1 text-white/30 text-[10px] leading-none">+</div>
            </div>
            <div className="w-px h-full bg-white/10 hidden md:block" />
            <div className="w-px h-full bg-white/10 hidden lg:block" />
            <div className="w-px h-full bg-white/10 relative">
              <div className="absolute top-20 -right-1 text-white/30 text-[10px] leading-none">+</div>
            </div>
          </div>
        </div>

        {/* Huge Ghost Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[30vw] font-black tracking-tighter leading-none opacity-[0.04] select-none text-white whitespace-nowrap">
            WORK
          </span>
        </div>

        {/* Background Giant Number */}
        <div className="absolute left-[-2%] top-1/2 -translate-y-1/2 z-0 pointer-events-none overflow-hidden h-[60vh] flex items-center">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeIndex}
               initial={{ y: 150, opacity: 0 }}
               animate={{ y: 0, opacity: 0.05 }}
               exit={{ y: -150, opacity: 0 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="text-[40vw] font-black leading-none text-white tracking-tighter"
             >
               {projects[activeIndex].id}
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[5%] h-[75vh] flex flex-col lg:flex-row items-center mt-10">
          
          {/* Left / Center Image Area (70%) */}
          <div className="w-full lg:w-[65%] h-[40vh] lg:h-[70vh] relative flex items-center">
             <div 
               className="relative w-full h-full rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10 cursor-none"
               onMouseEnter={() => setIsHovering(true)}
               onMouseLeave={() => setIsHovering(false)}
             >
                <div className="absolute inset-0 bg-[#db4a18]/20 mix-blend-overlay z-10 pointer-events-none" />
                <AnimatePresence>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', x: 100 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', x: -100 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={projects[activeIndex].image} 
                      alt={projects[activeIndex].title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>

          {/* Right Text Area (35%) */}
          <div className="w-full lg:w-[35%] lg:pl-16 flex flex-col justify-center h-full mt-8 lg:mt-0 relative z-20">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeIndex}
                 initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                 className="flex flex-col items-start"
               >
                  <div className="flex flex-wrap gap-2 mb-6">
                     {projects[activeIndex].tags.map((tag, i) => (
                        <motion.span 
                          key={tag}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                          className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] uppercase tracking-widest font-bold backdrop-blur-md bg-white/5 text-white/90"
                        >
                           {tag}
                        </motion.span>
                     ))}
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9] text-white drop-shadow-md">
                     {projects[activeIndex].title}
                  </h3>
                  
                  <p className="text-base md:text-lg text-white/70 mb-10 leading-[1.6] max-w-md font-medium">
                     {projects[activeIndex].desc}
                  </p>
                  
                  <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#111] font-bold text-[11px] uppercase tracking-[0.2em] overflow-hidden hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-shadow duration-500">
                     <div className="absolute inset-0 bg-[#f05a28] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                     <span className="relative z-10 group-hover:text-white transition-colors duration-500">VIEW CASE STUDY</span>
                     <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  </button>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>

        {/* Bottom Progress Indicator */}
        <div className="absolute bottom-8 lg:bottom-12 left-[5%] right-[5%] flex items-center gap-6 z-20">
            <AnimatePresence mode="wait">
              <motion.span 
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-bold tracking-widest text-white min-w-[30px]"
              >
                {projects[activeIndex].id}
              </motion.span>
            </AnimatePresence>
            
            <div className="flex-1 h-px bg-white/20 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </div>
            
            <span className="text-sm font-bold tracking-widest text-white/50">
              0{projects.length}
            </span>
        </div>

      </div>
    </section>
  );
}
