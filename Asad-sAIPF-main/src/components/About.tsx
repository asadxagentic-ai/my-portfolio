import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { FlipText } from './FlipText';
import { useScrollSystem } from './ScrollSystem';
import { RubiksCube } from './RubiksCube';

const EXPLORE_DATA: Record<string, { icon: string; tagline: string; points: string[]; tools: string[] }> = {
  'THINK.': {
    icon: '🧠',
    tagline: 'Every great system starts with a question nobody else thought to ask.',
    points: [
      'Deep-dive research into your domain, competitors, and users before writing a single line',
      'Map out system architecture, data flows, and edge cases with visual diagrams',
      'Identify the 20% of work that delivers 80% of value — then start there',
      'Challenge assumptions with prototypes and proof-of-concepts before committing',
    ],
    tools: ['System Design', 'User Research', 'Architecture Mapping', 'Risk Analysis'],
  },
  'DESIGN.': {
    icon: '✦',
    tagline: 'Design is not decoration — it\'s how it works.',
    points: [
      'Every interface element has a purpose — zero ornamental clutter',
      'Typography, spacing, and color that create hierarchy without thinking',
      'Motion design that guides attention and confirms actions naturally',
      'Responsive systems that feel native on every device and viewport',
    ],
    tools: ['UI/UX Design', 'Design Systems', 'Motion Design', 'Prototyping'],
  },
  'AUTOMATE.': {
    icon: '⚡',
    tagline: 'If a human does it twice, a machine should do it forever.',
    points: [
      'Build AI agents that handle customer support, data entry, and scheduling 24/7',
      'Create intelligent workflows that connect your tools and eliminate manual steps',
      'Deploy monitoring systems that catch problems before your team even notices',
      'Reduce operational costs by automating the repetitive work your team hates',
    ],
    tools: ['AI Agents', 'Workflow Automation', 'API Integration', 'Monitoring'],
  },
  'SCALE.': {
    icon: '🚀',
    tagline: 'Build once, run forever — at any size.',
    points: [
      'Architecture that handles 10 users or 10 million without a rewrite',
      'Cloud-native systems that auto-scale based on real demand',
      'Modular codebases where new features slot in without breaking existing ones',
      'Performance optimization that turns seconds into milliseconds',
    ],
    tools: ['Cloud Infrastructure', 'Performance Tuning', 'Modular Architecture', 'Load Testing'],
  },
};

const STORY_MILESTONES = [
  { year: '2021', title: 'The Spark', desc: 'Wrote my first line of code and fell in love with making machines execute ideas. Built custom scripts that automated my own repetitive daily workflows.' },
  { year: '2022', title: 'Full-Stack Foundations', desc: 'Dove headfirst into modern full-stack architecture and cloud infrastructure. Built real products for real users, learning that true code elegance lies in zero-friction execution.' },
  { year: '2023', title: 'The AI Shift', desc: 'Discovered the power of Large Language Models and vector embeddings. Transitioned from static apps to building systems that don\'t just respond — they perceive, reason, and act.' },
  { year: '2024', title: 'Enterprise Automations & Clients', desc: 'Partnered with clients globally. Engineered multi-agent workflows, custom n8n pipelines, and RAG systems that slashed manual processing times from hours to seconds.' },
  { year: '2025', title: 'Agent Swarms & Neural Graphs', desc: 'Architected production-ready multi-agent swarms with LangGraph, vLLM, and real-time voice APIs. Deployed self-healing automation loops operating with 99.9% reliability.' },
  { year: '2026', title: 'The Frontier of Autonomous Systems', desc: 'Building sovereign AI experiences and self-operating business engines. Transforming complex operations into zero-touch intelligence so humans can focus entirely on creation.' },
];

export function About() {
  const { scrollTo } = useScrollSystem();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const [storyOpen, setStoryOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (storyOpen || exploreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [storyOpen, exploreOpen]);

  return (
    <section id="about" ref={containerRef} className="relative bg-[#fafafa] text-[#111] overflow-hidden pt-16 pb-32 z-20 font-sans selection:bg-[#f05a28] selection:text-white border-t border-[#e5e5e5]">
      
      {/* Background Grid Lines */}
      <div className="absolute top-0 bottom-0 left-[5%] right-[5%] pointer-events-none z-0 flex justify-between">
        <div className="w-px h-full bg-[#e5e5e5]"></div>
        <div className="w-px h-full bg-[#e5e5e5]"></div>
        <div className="w-px h-full bg-[#e5e5e5]"></div>
        <div className="w-px h-full bg-[#e5e5e5]"></div>
        <div className="w-px h-full bg-[#e5e5e5]"></div>
      </div>

      {/* Ghost Text 'ABOUT' */}
      <div className="absolute top-[30%] left-0 w-full pointer-events-none z-[1] select-none flex justify-center overflow-hidden mix-blend-multiply">
        <motion.h2 
          style={{ y: bgY }}
          className="text-[24vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap text-[#f2f2f2] ml-[-2%]"
        >
          ABOUT
        </motion.h2>
      </div>

      <div className="relative z-10 mx-auto w-full px-[5%] max-w-[2000px] flex flex-col">
        
        {/* Top Section */}
        <div className="flex flex-col mb-40 relative">
          <div className="text-[#f05a28] text-[10px] font-bold tracking-[0.25em] mb-12 uppercase flex items-center gap-3">
            <span>//</span> WHO I AM
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            <div className="lg:col-span-3 flex flex-col">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[9vw] lg:text-[4.5vw] xl:text-[72px] 2xl:text-[80px] font-black leading-[0.9] tracking-tighter uppercase text-[#111]"
              >
                <FlipText duration={0.8}>I DON'T BUILD</FlipText><br/>
                <FlipText duration={0.8} delay={0.2}>SYSTEMS.</FlipText>
              </motion.h2>
              <div className="h-12 lg:h-24"></div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[9vw] lg:text-[4.5vw] xl:text-[72px] 2xl:text-[80px] font-black leading-[0.9] tracking-tighter uppercase text-[#111]"
              >
                I BUILD<br/>
                <span className="text-[#f05a28]">AI EXPERIENCES.</span>
              </motion.h2>

              {/* View Projects CTA Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 md:mt-12 flex"
              >
                <a 
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('projects');
                  }}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#111] hover:bg-[#f05a28] text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-100 hover:shadow-[0_10px_25px_rgba(240,90,40,0.25)] transition-all duration-300 cursor-pointer"
                >
                  View Projects
                  <span className="text-base font-normal leading-none transform group-hover:translate-x-1.5 transition-transform duration-300">⟶</span>
                </a>
              </motion.div>
            </div>
            
            <div className="lg:col-span-1 mt-12 lg:mt-32 pt-2 lg:pl-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[16px] md:text-sm font-semibold leading-[1.8] text-[#333] mb-8 pr-4">
                <i>"I design intelligent systems that eliminate repetitive work, automate businesses, and create digital products that are both beautiful and incredibly efficient."</i> 
                </p>
                <button 
                  onClick={() => setStoryOpen(true)}
                  className="group/story relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[#f05a28]/30 hover:border-[#f05a28] px-6 py-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(240,90,40,0.2)] bg-transparent"
                >
                  <span className="relative flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#f05a28]" />
                    <span className="absolute w-2 h-2 rounded-full bg-[#f05a28]/40 animate-ping" />
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#f05a28] group-hover/story:text-[#111] transition-colors duration-300">
                    READ MY STORY
                  </span>
                  <span className="text-base font-normal leading-none text-[#f05a28] group-hover/story:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 4 Columns Section */}
        <div className="border-t border-[#e5e5e5] pt-16 pb-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <FeatureBox 
              num="01" 
              title="THINK." 
              desc="Deep research and strategic thinking behind every solution. I solve problems at the root, not just the surface." 
              delay={0.1}
              onExplore={() => setExploreOpen('THINK.')}
            />
            <FeatureBox 
              num="02" 
              title="DESIGN." 
              desc="Clean, minimal and purposeful designs that communicate clearly and create emotional impact." 
              delay={0.2}
              onExplore={() => setExploreOpen('DESIGN.')}
            />
            <FeatureBox 
              num="03" 
              title="AUTOMATE." 
              desc="I build AI automation systems that work 24/7 and remove manual tasks from your business." 
              delay={0.3}
              onExplore={() => setExploreOpen('AUTOMATE.')}
            />
            <FeatureBox 
              num="04" 
              title="SCALE." 
              desc="Every system I build is made to grow with your business and handle the future effortlessly." 
              delay={0.4}
              onExplore={() => setExploreOpen('SCALE.')}
            />
          </div>
        </div>

        {/* Quote Section */}
        <div className="border-t border-[#e5e5e5] pt-24 pb-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              {/* Quote Mark */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#f05a28] text-[80px] md:text-[120px] leading-[0.8] font-serif font-black"
              >
                “
              </motion.div>
              
              {/* Quote Text */}
              <div className="pt-2 md:pt-6 border-l-[3px] border-[#f05a28]/20 pl-6 md:pl-10">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[28px] md:text-5xl lg:text-[52px] font-medium leading-[1.2] tracking-tight"
                >
                  <span className="text-[#111] block mb-2"><FlipText duration={0.7}>I don't just write code.</FlipText></span>
                  <span className="text-[#f05a28] block"><FlipText duration={0.7} delay={0.2}>I build systems that think.</FlipText></span>
                </motion.h3>
              </div>
            </div>

            {/* 3D Rubik's Cube Component */}
            <div className="lg:col-span-1 flex justify-center items-start pt-0 -mt-6 lg:-mt-14">
              <RubiksCube />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-[#e5e5e5] pt-24 pb-32 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <StatBox num="50+" label="PROJECTS DELIVERED" delay={0.1} />
            <StatBox num="3+" label="YEARS OF EXPERIENCE" delay={0.2} />
            <StatBox num="15+" label="HAPPY CLIENTS" delay={0.3} />
            <StatBox num="24/7" label="AUTOMATION SYSTEMS BUILT" delay={0.4} />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-[#e5e5e5] pt-24 pb-12 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[10vw] md:text-6xl lg:text-[72px] font-black leading-[0.9] tracking-tighter uppercase text-[#111]">
              LET'S BUILD SOMETHING<br/>
              <span className="text-[#f05a28]">EXTRAORDINARY.</span>
            </h2>
          </motion.div>
          <motion.a 
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 cursor-pointer group no-underline"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#f05a28] flex items-center justify-center text-[#f05a28] text-xl md:text-3xl group-hover:bg-[#f05a28] group-hover:text-white group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(240,90,40,0.35)] transition-all duration-300 flex-shrink-0">
              <span className="transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300">↗</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#111] group-hover:text-[#f05a28] transition-colors duration-300">Let's connect</span>
          </motion.a>
        </div>

      </div>

      {/* Vertical Text (Visible on larger screens)
      <div className="hidden 2xl:flex absolute right-6 top-[65%] -translate-y-1/2 rotate-90 origin-center text-[10px] font-bold tracking-[0.25em] uppercase text-[#666] items-center gap-4 z-30 whitespace-nowrap">
        BASED IN PAKISTAN <span className="text-[#ccc] mx-2">•</span> WORKING WORLDWIDE
        <span className="text-[#f05a28] text-[8px] ml-4">●</span>
      </div> */}

      {/* Modals */}
      <AnimatePresence>
        {storyOpen && <StoryModal onClose={() => setStoryOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {exploreOpen && <ExploreModal title={exploreOpen} onClose={() => setExploreOpen(null)} />}
      </AnimatePresence>

    </section>
  );
}

/* ──────────────────────────────────────────────
   STORY MODAL — Full-screen cinematic timeline
   ────────────────────────────────────────────── */
function StoryModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto px-6 md:px-12 py-16 scrollbar-thin rounded-3xl bg-[#0d0d0d]/90 border border-white/10"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-[#f05a28] hover:bg-[#f05a28]/20 transition-all duration-300 text-base cursor-pointer z-50 shadow-xl"
          title="Close Story"
        >
          ✕
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[#f05a28] text-[10px] font-bold tracking-[0.25em] uppercase mb-4 block">// MY JOURNEY</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-[0.95]">
            THE STORY<br />
            <span className="text-[#f05a28]">SO FAR.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-[#f05a28] via-[#f05a28]/30 to-transparent" />

          {STORY_MILESTONES.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-14 pb-14 last:pb-0 group"
            >
              {/* Dot */}
              <div className="absolute left-[11px] top-1.5 w-[15px] h-[15px] rounded-full border-2 border-[#f05a28] bg-[#0a0a0a] group-hover:bg-[#f05a28] group-hover:shadow-[0_0_12px_rgba(240,90,40,0.5)] transition-all duration-300" />

              {/* Year badge */}
              <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#f05a28] mb-3 px-3 py-1 rounded-full border border-[#f05a28]/20 bg-[#f05a28]/5">
                {item.year}
              </span>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2 group-hover:text-[#f05a28] transition-colors duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-[1.8] text-white/50 group-hover:text-white/70 transition-colors duration-300 max-w-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 pt-10 border-t border-white/10 text-center"
        >
          <p className="text-white/40 text-sm font-semibold mb-6">The best chapters are still being written.</p>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#f05a28] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#d44d20] hover:shadow-[0_10px_30px_rgba(240,90,40,0.3)] transition-all duration-300 cursor-pointer"
          >
            Back to About
            <span className="text-base">←</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   EXPLORE MODAL — Capability deep-dive showcase
   ────────────────────────────────────────────── */
function ExploreModal({ title, onClose }: { title: string; onClose: () => void }) {
  const data = EXPLORE_DATA[title];
  if (!data) return null;

  const cleanTitle = title.replace('.', '');

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl mx-4 bg-[#111] border border-white/10 rounded-3xl overflow-y-auto max-h-[90vh] scrollbar-thin"
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#f05a28] via-[#ff7849] to-[#f05a28]/30" />

        <div className="p-5 sm:p-8 md:p-12">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-[#f05a28] hover:bg-[#f05a28]/10 transition-all duration-300 text-sm cursor-pointer"
          >
            ✕
          </button>

          {/* Icon + Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-5xl mb-4 block">{data.icon}</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-[0.95]">
              {cleanTitle}<span className="text-[#f05a28]">.</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/50 font-medium leading-relaxed italic">
              "{data.tagline}"
            </p>
          </motion.div>

          {/* Points */}
          <div className="space-y-4 mb-10">
            {data.points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 group/point"
              >
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#f05a28]/40 group-hover/point:bg-[#f05a28] group-hover/point:shadow-[0_0_8px_rgba(240,90,40,0.5)] transition-all duration-300 flex-shrink-0" />
                <p className="text-sm text-white/60 leading-[1.7] group-hover/point:text-white/80 transition-colors duration-300">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tools tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-6 border-t border-white/10"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4 block">KEY TOOLS & METHODS</span>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-1.5 rounded-full border border-[#f05a28]/20 text-[11px] font-bold tracking-wider uppercase text-[#f05a28]/70 hover:bg-[#f05a28]/10 hover:border-[#f05a28]/40 hover:text-[#f05a28] transition-all duration-300 cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bottom action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex justify-end"
          >
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-[#f05a28] transition-colors duration-300 cursor-pointer"
            >
              CLOSE <span className="text-sm">✕</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   FEATURE BOX — Individual capability card
   ────────────────────────────────────────────── */
function FeatureBox({ num, title, desc, delay, onExplore }: { num: string; title: string; desc: string; delay: number; onExplore: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-60, 60], [10, -10]);
  const rotateY = useTransform(x, [-120, 120], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col relative group cursor-pointer pr-4 p-5 sm:p-6 ml-0 sm:-ml-6 rounded-2xl hover:bg-white hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-transparent hover:border-zinc-100/60 transition-all duration-300 bg-transparent"
      onClick={onExplore}
      whileHover={{ scale: 1.02 }}
    >
      <div 
        style={{ transform: "translateZ(20px)" }} 
        className="flex items-center gap-3 mb-6 text-[#111] text-xs font-bold"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] group-hover:scale-150 transition-transform duration-300 group-hover:shadow-[0_0_8px_rgba(240,90,40,0.6)]"></span>
        {num}
      </div>
      <h3 
        style={{ transform: "translateZ(30px)" }} 
        className="text-3xl md:text-[34px] font-black tracking-tighter uppercase mb-6 text-[#111] group-hover:text-[#f05a28] transition-colors duration-300"
      >
        {title}<span className="text-[#f05a28] group-hover:text-[#111] transition-colors duration-300">.</span>
      </h3>
      <p 
        style={{ transform: "translateZ(15px)" }} 
        className="text-[13px] font-semibold leading-[1.8] text-[#555] mb-8 group-hover:text-[#333] transition-colors duration-300"
      >
        {desc}
      </p>
      <div 
        style={{ transform: "translateZ(25px)" }}
        className="mt-auto"
      >
        <button className="inline-flex items-center gap-2 text-[#f05a28] text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 w-max border-b border-transparent group-hover:border-[#f05a28] pb-0.5 group-hover:translate-x-1 bg-transparent cursor-pointer">
          EXPLORE <span className="text-sm font-normal leading-none transform translate-y-[-1px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
        </button>
      </div>
    </motion.div>
  );
}

function StatBox({ num, label, delay }: { num: string, label: string, delay: number }) {
  const labelParts = label.split(" ");
  const firstWord = labelParts[0];
  const restWords = labelParts.slice(1).join(" ");
  const hasPlus = num.includes('+');
  const hasSlashSeven = num.includes('/7');

  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          
          const targetNumber = parseInt(num) || 0;
          const duration = 1000;
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.floor(easeOut * targetNumber));
            
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setIsCompleted(true);
            }
          };
          
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [num]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center relative group cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
    >
      <div className="relative inline-flex mb-6">
        <h4 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tighter text-[#111] group-hover:text-[#f05a28] transition-colors duration-300">
          {count}{isCompleted && hasSlashSeven ? '/7' : ''}
        </h4>
        {hasPlus && (
          <span className="text-[#f05a28] text-xl md:text-2xl font-light leading-none absolute -right-6 md:-right-8 top-1 md:top-2 group-hover:scale-110 transition-transform duration-300">+</span>
        )}
      </div>
      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#111] leading-[1.6] group-hover:text-zinc-900 transition-colors duration-300">
        {firstWord}<br />
        <span className="text-[#666] group-hover:text-[#f05a28]/80 transition-colors duration-300">{restWords}</span>
      </p>
    </motion.div>
  );
}
