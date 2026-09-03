import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { Bot, Workflow, LayoutTemplate, Unplug, Database, Lightbulb, ArrowUpRight, ArrowRight } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'AI AGENTS',
    desc: 'Intelligent AI agents that handle tasks, engage users, and work 24/7 to grow your business autonomously.',
    icon: Bot,
    highlight: 'AUTONOMOUS',
    stat: '24/7',
    statLabel: 'Uptime',
  },
  {
    id: '02',
    title: 'BUSINESS AUTOMATION',
    desc: 'Automate repetitive workflows and operational tasks to save time, reduce costs, and boost productivity at scale.',
    icon: Workflow,
    highlight: 'EFFICIENCY',
    stat: '10×',
    statLabel: 'Faster',
  },
  {
    id: '03',
    title: 'CUSTOM SAAS',
    desc: 'End-to-end SaaS solutions tailored to your business model with modern tech and scalable architecture.',
    icon: LayoutTemplate,
    highlight: 'SCALABLE',
    stat: '∞',
    statLabel: 'Scale',
  },
  {
    id: '04',
    title: 'API INTEGRATIONS',
    desc: 'Seamless API integrations that connect your tools, platforms, and services effortlessly into one ecosystem.',
    icon: Unplug,
    highlight: 'CONNECTED',
    stat: '100+',
    statLabel: 'APIs',
  },
  {
    id: '05',
    title: 'DATA & AI WORKFLOWS',
    desc: 'Build powerful data pipelines and AI workflows that transform raw data into actionable business insights.',
    icon: Database,
    highlight: 'INTELLIGENT',
    stat: 'ML',
    statLabel: 'Powered',
  },
  {
    id: '06',
    title: 'AI CONSULTING',
    desc: 'Strategic guidance to help you identify AI opportunities, choose the right tools, and implement effectively.',
    icon: Lightbulb,
    highlight: 'STRATEGIC',
    stat: '360°',
    statLabel: 'Vision',
  }
];

const marqueeText = 'AI AGENTS • AUTOMATION • SAAS • INTEGRATIONS • DATA PIPELINES • CONSULTING • ';

/* ─── Magnetic Button Component ─── */
function MagneticWrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Accordion Service Row ─── */
function ServiceRow({ service, index, isActive, onToggle }: {
  service: typeof services[0];
  index: number;
  isActive: boolean;
  onToggle: () => void;
  key?: React.Key;
}) {
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.9, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div
        onClick={onToggle}
        className={`group relative cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'py-0' : 'py-0'
        }`}
      >
        {/* Top Divider Line */}
        <div className="relative">
          <div className={`h-px w-full transition-all duration-700 ${isActive ? 'bg-white/40' : 'bg-white/10 group-hover:bg-white/25'}`} />
          {/* Animated line fill on hover */}
          <motion.div
            className="absolute top-0 left-0 h-px bg-white origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Main Row Content */}
        <div className="relative flex items-center gap-4 md:gap-8 py-7 md:py-10 px-2 md:px-0">
          
          {/* Number */}
          <div className={`text-[11px] font-bold tracking-[0.2em] transition-colors duration-500 flex-shrink-0 w-8 ${
            isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'
          }`}>
            {service.id}
          </div>

          {/* Icon Container */}
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-700 relative overflow-hidden ${
            isActive 
              ? 'bg-white/15 border border-white/30 scale-110 rotate-[-3deg]' 
              : 'bg-white/[0.04] border border-white/10 group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:scale-105'
          }`}>
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            <Icon className={`w-7 h-7 md:w-8 md:h-8 relative z-10 transition-all duration-500 ${
              isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-white/60 group-hover:text-white/90'
            }`} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h4 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase transition-all duration-500 flex-1 leading-none ${
            isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
          }`}>
            {service.title}
          </h4>

          {/* Stat Badge - Desktop */}
          <div className={`hidden md:flex flex-col items-end gap-1 flex-shrink-0 mr-4 transition-all duration-500 ${
            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-60 group-hover:translate-x-0'
          }`}>
            <span className="text-2xl font-black text-white leading-none">{service.stat}</span>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/50">{service.statLabel}</span>
          </div>

          {/* Toggle Arrow */}
          <MagneticWrap className="flex-shrink-0">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all duration-700 ${
              isActive 
                ? 'bg-white border-white text-[#db4a18] rotate-90 scale-110' 
                : 'bg-transparent border-white/20 text-white/50 group-hover:border-white/40 group-hover:text-white group-hover:bg-white/5'
            }`}>
              <ArrowRight className={`w-5 h-5 transition-transform duration-700 ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
            </div>
          </MagneticWrap>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-10 md:pb-14 pl-[calc(2rem+14px+1rem)] md:pl-[calc(2rem+64px+2rem+32px)] pr-4 md:pr-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  
                  {/* Description */}
                  <div className="md:col-span-5">
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-sm md:text-base leading-[1.8] text-white/70 font-medium"
                    >
                      {service.desc}
                    </motion.p>
                  </div>

                  {/* Highlight Keyword */}
                  <div className="md:col-span-4 flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="relative"
                    >
                      <span className="text-5xl md:text-7xl font-black tracking-tighter text-transparent uppercase leading-none" 
                        style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>
                        {service.highlight}
                      </span>
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        style={{ maskImage: 'linear-gradient(to right, transparent, black, transparent)' }}
                      />
                    </motion.div>
                  </div>

                  {/* CTA */}
                  <div className="md:col-span-3 flex items-center md:justify-end">
                    <motion.a
                      href="#contact"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                      className="group/cta inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-[#db4a18] hover:border-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">LEARN MORE</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-300" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Infinite Marquee ─── */
function InfiniteMarquee() {
  return (
    <div className="relative overflow-hidden py-6 md:py-8">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#db4a18] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#db4a18] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[10vw] md:text-[8vw] font-black tracking-tighter uppercase text-transparent leading-none mx-4 select-none"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}>
            {marqueeText}
          </span>
        ))}
      </motion.div>
    </div>
  );
}


/* ─── Main Services Section ─── */
export function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState<string | null>('01');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const headerScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative min-h-screen bg-[#db4a18] text-white overflow-hidden z-20 font-sans selection:bg-white selection:text-[#db4a18]"
    >
      {/* ═══ Background Layers ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Radial gradient bloom */}
        <div className="absolute top-[20%] left-[60%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(255,130,70,0.25)_0%,transparent_60%)] blur-[40px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(180,30,0,0.3)_0%,transparent_60%)] blur-[40px]" />
        
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px'
          }} 
        />

        {/* Subtle vertical grid lines */}
        <div className="absolute top-0 bottom-0 left-[5%] right-[5%] flex justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-px h-full bg-white/[0.06]" />
          ))}
        </div>

        {/* Floating orbs */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-[15%] right-[15%] w-3 h-3 rounded-full bg-white/20 blur-[1px]"
        />
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-[45%] left-[8%] w-2 h-2 rounded-full bg-white/15 blur-[1px]"
        />
        <motion.div
          style={{ y: parallaxY }}
          className="absolute bottom-[25%] right-[25%] w-4 h-4 rounded-full bg-white/10 blur-[2px]"
        />
      </div>

      {/* ═══ Content ═══ */}
      <div className="relative z-10">

        {/* ─── Top Marquee Strip ─── */}
        <div className="pt-24 md:pt-32">
          <InfiniteMarquee />
        </div>

        {/* ─── Header ─── */}
        <motion.div 
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="max-w-[1400px] mx-auto px-[5%] pt-12 md:pt-20 pb-16 md:pb-24"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
            
            {/* Left: Title */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 mb-8 md:mb-10"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">
                  WHAT I DO
                </span>
                <div className="w-12 h-px bg-white/30" />
              </motion.div>

              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] xl:text-[110px] font-black tracking-tighter uppercase leading-[0.85]">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: '120%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    SERVICES
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: '120%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[#1a1a1a]/80"
                    style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}
                  >
                    & SOLUTIONS
                  </motion.span>
                </span>
              </h3>
            </div>

            {/* Right: Description + Stats */}
            <div className="md:max-w-sm flex flex-col gap-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm md:text-base leading-[1.8] text-white/70 font-medium"
              >
                I design and build intelligent systems that help businesses 
                save time, scale faster, and grow smarter — from AI agents to 
                full-stack SaaS platforms.
              </motion.p>

              {/* Mini Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="flex gap-8"
              >
                {[
                  { value: '06', label: 'Core Services' },
                  { value: '50+', label: 'Projects' },
                  { value: '100%', label: 'Satisfaction' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-2xl md:text-3xl font-black text-white leading-none">{stat.value}</span>
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/40">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ─── Services Accordion ─── */}
        <div className="max-w-[1400px] mx-auto px-[5%]">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              isActive={activeService === service.id}
              onToggle={() => setActiveService(activeService === service.id ? null : service.id)}
            />
          ))}
          {/* Bottom line */}
          <div className="h-px w-full bg-white/10" />
        </div>

        {/* ─── Bottom CTA Section ─── */}
        <div className="max-w-[1400px] mx-auto px-[5%] py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center md:text-left"
            >
              <p className="text-lg md:text-xl font-medium text-white/60 leading-relaxed">
                Have a project in mind?{' '}
                <span className="text-white font-bold">Let's bring it to life.</span>
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <MagneticWrap>
                <a
                  href="#contact"
                  className="group/btn relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-[#db4a18] font-bold text-sm tracking-[0.1em] uppercase overflow-hidden hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-shadow duration-700"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#db4a18]/10 to-transparent translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000" />
                  
                  <span className="relative z-10">START A PROJECT</span>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#db4a18] flex items-center justify-center group-hover/btn:rotate-45 transition-transform duration-500">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </a>
              </MagneticWrap>
            </motion.div>
          </div>
        </div>

        {/* ─── Bottom Marquee Strip ─── */}
        <div className="pb-8 md:pb-12">
          <div className="relative overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#db4a18] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#db4a18] to-transparent z-10 pointer-events-none" />
            <motion.div
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-white/20 mx-8 select-none">
                  {marqueeText}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Footer Meta ─── */}
        <div className="max-w-[1400px] mx-auto px-[5%] pb-10 flex justify-between items-end">
          <div className="text-white/20">
            <ArrowUpRight className="w-5 h-5" strokeWidth={1} />
          </div>
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 flex items-center gap-2">
            BASED IN PAKISTAN <span className="w-1.5 h-1.5 rounded-full bg-white/40 block" />
          </div>
        </div>

      </div>
    </section>
  );
}
