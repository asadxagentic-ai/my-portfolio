import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Layers, 
  Sparkles, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Zap,
  Globe,
  Braces
} from 'lucide-react';
import { useDataContext, SkillItem } from '../context/DataContext';
import { SKILLS as STATIC_SKILLS } from './TechnicalExpertise';

interface AllSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_LOGOS: Record<string, string> = {
  'ai-agents': '/openai.png',
  'langchain': '/langchain.png',
  'langgraph': '/langgraph.png',
  'workflow-automation': '/n8n.png',
  'workflow-auto': '/n8n.png',
  'gen-ai': '/brain.png',
  'ai-chatbots': '/openai.png',
  'fastapi': '/FastAPI.png',
  'prompt-engg': '/Python.png',
  'python': '/Python.png',
  'llm': '/brain.png',
};

export const AllSkillsModal: React.FC<AllSkillsModalProps> = ({ isOpen, onClose }) => {
  const { skills: contextSkills } = useDataContext();

  const allSkills = useMemo(() => {
    return contextSkills && contextSkills.length > 0 ? contextSkills : STATIC_SKILLS;
  }, [contextSkills]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);

  // Extract unique categories for filter pills
  const categories = useMemo(() => {
    const set = new Set<string>();
    allSkills.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [allSkills]);

  // Filter skills by search query and category
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(skill.useCases) && skill.useCases.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (Array.isArray(skill.relatedTech) && skill.relatedTech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [allSkills, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-hidden selection:bg-[#f05a28] selection:text-white font-sans">
        
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[#0b0b0f] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#f05a28]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* ── HEADER BAR ── */}
          <div className="flex flex-col gap-4 mb-6 pb-5 border-b border-white/10 relative z-10 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f05a28]/15 border border-[#f05a28]/30 flex items-center justify-center text-[#f05a28]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] uppercase text-white tracking-tight flex items-center gap-2.5">
                    <span>TECHNICAL SKILLS DIRECTORY</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f05a28]/20 text-[#f05a28] border border-[#f05a28]/30 font-mono text-xs font-bold">
                      {allSkills.length} SKILLS
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium hidden sm:block">
                    Full catalog of neural frameworks, AI agents, automation engines, and high-performance backends.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SEARCH & CATEGORY FILTERS */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, tech stack, or use cases..."
                  className="w-full bg-[#141419] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f05a28] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#f05a28] text-white shadow-md shadow-orange-500/20'
                          : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── SKILLS GRID CATALOG ── */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar relative z-10">
            {filteredSkills.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 font-mono text-sm border border-dashed border-white/10 rounded-2xl">
                No technical skills match "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => {
                  const logoSrc = skill.iconSrc || FALLBACK_LOGOS[skill.id];
                  const isCodeExpanded = expandedCodeId === skill.id;

                  return (
                    <div
                      key={skill.id}
                      className="bg-[#121217] border border-white/10 hover:border-[#f05a28]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-xl hover:shadow-[#f05a28]/5"
                    >
                      <div>
                        {/* Header: Logo + Title + Category Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              {logoSrc ? (
                                <img
                                  src={logoSrc}
                                  alt={`${skill.name} logo`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Braces className="w-5 h-5 text-[#f05a28]" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-white group-hover:text-[#f05a28] transition-colors leading-snug">
                                {skill.name}
                              </h3>
                              {skill.subtitle && (
                                <p className="text-[11px] text-zinc-400 font-medium">
                                  {skill.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[9px] text-orange-400 font-bold uppercase tracking-wider shrink-0">
                            {skill.category}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
                          {skill.description}
                        </p>

                        {/* Use Cases List */}
                        {Array.isArray(skill.useCases) && skill.useCases.length > 0 && (
                          <div className="mb-4">
                            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block mb-1.5">
                              Core Capabilities:
                            </span>
                            <ul className="space-y-1">
                              {skill.useCases.slice(0, 3).map((useCase, idx) => (
                                <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-[#f05a28] shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{useCase}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Metrics Pills */}
                        {Array.isArray(skill.metrics) && skill.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {skill.metrics.map((m, idx) => (
                              <div key={idx} className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5 font-mono text-[10px]">
                                <span className="text-zinc-400">{m.label}:</span>
                                <span className="text-[#f05a28] font-bold">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Related Tech Tags */}
                        {Array.isArray(skill.relatedTech) && skill.relatedTech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {skill.relatedTech.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono font-bold text-zinc-400"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Code Snippet Expander */}
                      {skill.codeSnippet && (
                        <div className="pt-3 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => setExpandedCodeId(isCodeExpanded ? null : skill.id)}
                            className="w-full py-1.5 px-3 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3 h-3 text-[#f05a28]" />
                              <span>{isCodeExpanded ? 'Hide Code Snippet' : 'View Code Snippet'}</span>
                            </span>
                            {isCodeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isCodeExpanded && (
                            <motion.pre
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 bg-black/90 rounded-lg border border-white/10 font-mono text-[10px] text-orange-300 overflow-x-auto max-h-40"
                            >
                              {skill.codeSnippet}
                            </motion.pre>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono shrink-0">
            <span>SHOWING {filteredSkills.length} OF {allSkills.length} SKILLS</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
