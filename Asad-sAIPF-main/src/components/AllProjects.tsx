import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Search, 
  Sparkles, 
  Layers, 
  X, 
  CheckCircle2, 
  Filter,
  ArrowUpRight,
  FolderGit2
} from 'lucide-react';
import { useDataContext, DEFAULT_PROJECTS } from '../context/DataContext';
import { getTechLogo } from '../lib/techLogos';

interface ProjectItem {
  id: string;
  title: string;
  outcome: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  altText: string;
}

export const AllProjects: React.FC = () => {
  const { projects: contextProjects } = useDataContext();
  const allProjectsList = useMemo(() => {
    return contextProjects && contextProjects.length > 0 ? contextProjects : DEFAULT_PROJECTS;
  }, [contextProjects]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Extract all unique tech tags for filter pills
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allProjectsList.forEach((p) => {
      if (Array.isArray(p.tech)) {
        p.tech.forEach((t) => tagsSet.add(t));
      }
    });
    return ['All', ...Array.from(tagsSet)];
  }, [allProjectsList]);

  // Filter projects by search query and active tag
  const filteredProjects = useMemo(() => {
    return allProjectsList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.outcome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(item.tech) && item.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTag = selectedTag === 'All' || (Array.isArray(item.tech) && item.tech.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [allProjectsList, searchQuery, selectedTag]);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-[#f05a28] selection:text-white font-sans relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#f05a28]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
        <div className="absolute top-0 bottom-0 left-[5%] right-[5%] flex justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-px h-full bg-[#2d2d38]" />
          ))}
        </div>
      </div>

      {/* ── TOP HEADER / NAV BAR ── */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#141419] hover:bg-zinc-800 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer group shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-[#f05a28] group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141419] border border-white/10 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5 text-[#f05a28]" />
              <span>TOTAL PROJECTS: {allProjectsList.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-12 flex-1">
        
        {/* Title Header */}
        <div className="mb-12 text-center sm:text-left border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f05a28]/10 border border-[#f05a28]/30 text-[#f05a28] font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>FULL CASE STUDIES SHOWCASE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-['Outfit'] tracking-tight uppercase text-white mb-4 leading-none">
            ALL CREATIVE <span className="text-[#f05a28]">&</span> AI PROJECTS.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-medium leading-relaxed">
            Explore the complete repository of autonomous AI agents, LinkedIn lead automation, WhatsApp assistants, and full-stack AI workflows.
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#141419]/80 border border-white/10 rounded-3xl p-12 text-center my-12">
            <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white uppercase font-['Outfit'] mb-1">
              No Projects Match Your Search
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Try adjusting your search terms or selecting a different technology tag filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
              className="px-4 py-2 rounded-xl bg-[#f05a28] text-white text-xs font-mono font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {filteredProjects.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedProject(item)}
                className="group bg-[#141419]/90 border border-white/10 hover:border-[#f05a28]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-[#f05a28]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Thumbnail Header */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.image || '/logo.png'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/30" />
                  
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                    ID #{item.id || String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black font-['Outfit'] uppercase tracking-tight text-white group-hover:text-[#f05a28] transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-medium leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Outcome Highlight Box */}
                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/5 text-[11px] text-zinc-300 leading-relaxed font-medium">
                      <span className="text-[#f05a28] font-bold block text-[9px] font-mono uppercase mb-0.5">
                        // IMPACT & OUTCOME
                      </span>
                      {item.outcome}
                    </div>
                  </div>

                  {/* Tech Badges with Logos */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {Array.isArray(item.tech) && item.tech.map((t, i) => {
                        const logoSrc = getTechLogo(t);
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[9.5px] font-mono font-bold text-zinc-300 uppercase"
                          >
                            {logoSrc && (
                              <img src={logoSrc} alt={t} className="w-3 h-3 object-contain shrink-0" />
                            )}
                            <span>{t}</span>
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.repoUrl && (
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-[#f05a28]/15 hover:bg-[#f05a28] border border-[#f05a28]/30 text-[#f05a28] hover:text-white transition-colors"
                          title="Live Demo"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>

      {/* ── PROJECT DETAIL MODAL LIGHTBOX ── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 select-text">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-3xl mx-4 bg-[#141419] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Image Header */}
              <div className="relative h-64 sm:h-80 w-full bg-zinc-950 shrink-0">
                <img
                  src={selectedProject.image || '/logo.png'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/40" />

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
                <div>
                  <span className="text-[10px] font-mono text-[#f05a28] font-bold uppercase tracking-widest block mb-1">
                    PROJECT // ID #{selectedProject.id}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] uppercase text-white">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-sm text-zinc-300 font-medium leading-relaxed">
                  <span className="text-[#f05a28] font-bold block text-xs font-mono uppercase mb-1">
                    // KEY OUTCOME & METRICS
                  </span>
                  {selectedProject.outcome}
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    // OVERVIEW & ARCHITECTURE
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    // TECH STACK USED
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedProject.tech) && selectedProject.tech.map((t, i) => {
                      const logoSrc = getTechLogo(t);
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono font-bold text-zinc-200"
                        >
                          {logoSrc && (
                            <img src={logoSrc} alt={t} className="w-3.5 h-3.5 object-contain" />
                          )}
                          <span>{t}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* External Action Links */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all"
                    >
                      <Github className="w-4 h-4" />
                      <span>View GitHub Code</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl bg-[#f05a28] hover:bg-[#ff6d39] text-white font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-lg shadow-[#f05a28]/20 transition-all"
                    >
                      <span>Open Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER BAR ── */}
      <footer className="relative z-10 border-t border-zinc-900 py-6 px-6 sm:px-10 text-[10px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>TOTAL SHOWCASE PROJECTS: {allProjectsList.length}</span>
        <span>© 2026 ASADULLAH. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
};
