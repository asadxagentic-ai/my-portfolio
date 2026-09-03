import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderPlus, Plus, Trash2, Edit3, LogOut, Database, CheckCircle2, 
  ExternalLink, Layers, Upload, Image as ImageIcon, Sparkles, X, ArrowLeft
} from 'lucide-react';
import { useDataContext, ProjectItem, SkillItem } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

const DEFAULT_SKILL_LOGOS: Record<string, string> = {
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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { projects, skills, addProject, updateProject, deleteProject, addSkill, updateSkill, deleteSkill, resetToDefaults } = useDataContext();

  const [activeTab, setActiveTab] = useState<'projects' | 'skills'>('projects');

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projOutcome, setProjOutcome] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projLiveUrl, setProjLiveUrl] = useState('');
  const [projRepoUrl, setProjRepoUrl] = useState('');

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillId, setSkillId] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('ai-core');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillUseCases, setSkillUseCases] = useState('');
  const [skillProjectsCount, setSkillProjectsCount] = useState('10+ Systems');
  const [skillProjectCat, setSkillProjectCat] = useState('AI Engineering');
  const [skillRelatedTech, setSkillRelatedTech] = useState('');
  const [skillCodeSnippet, setSkillCodeSnippet] = useState('');
  const [skillIconSrc, setSkillIconSrc] = useState('');

  // Extract unique custom categories added previously
  const existingCustomCategories = React.useMemo(() => {
    const standard = new Set(['ai-core', 'frameworks', 'engineering']);
    const customSet = new Set<string>();
    skills.forEach(s => {
      if (s.category && !standard.has(s.category)) {
        customSet.add(s.category);
      }
    });
    return Array.from(customSet);
  }, [skills]);

  /* --- PROJECT HANDLERS --- */
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjTitle('');
    setProjOutcome('');
    setProjDesc('');
    setProjTech('n8n, Docker');
    setProjImage('/proj1.jpeg');
    setProjLiveUrl('');
    setProjRepoUrl('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: ProjectItem) => {
    setEditingProject(project);
    setProjTitle(project.title);
    setProjOutcome(project.outcome);
    setProjDesc(project.description);
    setProjTech(project.tech.join(', '));
    setProjImage(project.image);
    setProjLiveUrl(project.liveUrl || '');
    setProjRepoUrl(project.repoUrl || '');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = projTech.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProject) {
      await updateProject(editingProject.id, {
        title: projTitle,
        outcome: projOutcome,
        description: projDesc,
        tech: techArray,
        image: projImage,
        liveUrl: projLiveUrl || undefined,
        repoUrl: projRepoUrl || undefined,
        altText: projTitle,
      });
    } else {
      await addProject({
        title: projTitle,
        outcome: projOutcome,
        description: projDesc,
        tech: techArray,
        image: projImage,
        liveUrl: projLiveUrl || undefined,
        repoUrl: projRepoUrl || undefined,
        altText: projTitle,
      });
    }

    setIsProjectModalOpen(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setImageFn: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageFn(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /* --- SKILL HANDLERS --- */
  const openNewSkillModal = () => {
    setEditingSkill(null);
    setSkillId('');
    setSkillName('');
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setSkillCategory('ai-core');
    setSkillDesc('');
    setSkillUseCases('');
    setSkillProjectsCount('10+ Systems');
    setSkillProjectCat('AI Engineering');
    setSkillRelatedTech('Python, OpenAI');
    setSkillCodeSnippet('');
    setSkillIconSrc('');
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setSkillId(skill.id);
    setSkillName(skill.name);
    
    const standard = ['ai-core', 'frameworks', 'engineering'];
    if (!standard.includes(skill.category) && !existingCustomCategories.includes(skill.category)) {
      setIsCustomCategory(true);
      setCustomCategoryInput(skill.category);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }

    setSkillCategory(skill.category);
    setSkillDesc(skill.description);
    setSkillUseCases(skill.useCases.join('\n'));
    setSkillProjectsCount(skill.projectsCount);
    setSkillProjectCat(skill.projectCategory);
    setSkillRelatedTech(skill.relatedTech.join(', '));
    setSkillCodeSnippet(skill.codeSnippet);
    setSkillIconSrc(skill.iconSrc || '');
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const useCasesArray = skillUseCases.split('\n').map(u => u.trim()).filter(Boolean);
    const relatedTechArray = skillRelatedTech.split(',').map(t => t.trim()).filter(Boolean);

    if (editingSkill) {
      await updateSkill(editingSkill.id, {
        name: skillName,
        category: skillCategory,
        description: skillDesc,
        useCases: useCasesArray,
        projectsCount: skillProjectsCount,
        projectCategory: skillProjectCat,
        orbitAngle: editingSkill.orbitAngle || 0,
        relatedTech: relatedTechArray,
        codeSnippet: skillCodeSnippet,
        iconSrc: skillIconSrc || undefined,
      });
    } else {
      await addSkill({
        id: skillId || undefined,
        name: skillName,
        category: skillCategory,
        description: skillDesc,
        useCases: useCasesArray,
        projectsCount: skillProjectsCount,
        projectCategory: skillProjectCat,
        orbitAngle: 0,
        brandBg: 'bg-[#f05a28]',
        brandText: 'text-white',
        brandBorder: 'border-[#f05a28]',
        brandShadow: 'shadow-[#f05a28]/30',
        metrics: [
          { label: 'System SLA', value: '99.9%' },
          { label: 'Efficiency', value: '+45%' }
        ],
        relatedTech: relatedTechArray,
        codeSnippet: skillCodeSnippet,
        iconSrc: skillIconSrc || undefined,
      });
    }

    setIsSkillModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-orange-500 selection:text-white font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Live Site</span>
          </a>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-base sm:text-lg font-black font-['Outfit'] uppercase tracking-tight text-white flex items-center gap-2">
            <span>ADMIN CONSOLE</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-mono text-[9px] border border-orange-500/30 font-bold">
              PROD
            </span>
          </h1>
        </div>

        {/* Database Status Pill */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-white/10 text-[11px] sm:text-xs font-mono">
            <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-green-400' : 'text-amber-400'}`} />
            <span className="text-zinc-300 font-bold">
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local State Mode'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#f05a28] text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-[#f05a28] text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Skills ({skills.length})</span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={openNewProjectModal}
              className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-green-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>

        {/* TAB 1: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#111115] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-orange-500/40 transition-all"
              >
                <div>
                  <div className="h-44 bg-zinc-950 relative overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-orange-400 font-bold">
                      #{proj.id}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-white mb-2 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-orange-400 font-bold mb-3 line-clamp-2">{proj.outcome}</p>
                    <p className="text-xs text-zinc-400 line-clamp-3 mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-mono text-zinc-300 font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/60 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditProjectModal(proj)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#111115] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {skill.iconSrc || DEFAULT_SKILL_LOGOS[skill.id] ? (
                      <img src={skill.iconSrc || DEFAULT_SKILL_LOGOS[skill.id]} alt={skill.name} className="w-6 h-6 object-contain shrink-0" />
                    ) : (
                      <Layers className="w-5 h-5 text-orange-400 shrink-0" />
                    )}
                    <h3 className="font-bold text-lg text-white line-clamp-1">{skill.name}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-3">{skill.description}</p>

                  <div className="mb-4">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Use Cases ({skill.useCases.length}):</span>
                    <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                      {skill.useCases.slice(0, 2).map((uc, i) => (
                        <li key={i} className="line-clamp-1">{uc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skill.relatedTech.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-mono text-zinc-300 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditSkillModal(skill)}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete skill "${skill.name}"?`)) {
                        deleteSkill(skill.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PROJECT */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsProjectModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-[#111115] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold font-['Outfit'] uppercase text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button onClick={() => setIsProjectModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">PROJECT TITLE</label>
                  <input type="text" value={projTitle} onChange={e => setProjTitle(e.target.value)} required placeholder="e.g. Linkedin Autoconnect Automation" className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">KEY OUTCOME / IMPACT</label>
                  <input type="text" value={projOutcome} onChange={e => setProjOutcome(e.target.value)} required placeholder="e.g. Scaled network outreach to 500+ monthly connections." className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">DESCRIPTION</label>
                  <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} required rows={3} placeholder="Full diagnostic description of the workflow..." className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">TECH STACK (comma separated)</label>
                  <input type="text" value={projTech} onChange={e => setProjTech(e.target.value)} required placeholder="n8n, PhantomBuster, Docker" className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">IMAGE URL OR FILE UPLOAD</label>
                  <div className="flex gap-2">
                    <input type="text" value={projImage} onChange={e => setProjImage(e.target.value)} required placeholder="/proj1.jpeg or https://..." className="flex-1 bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                    <label className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-mono text-xs font-bold cursor-pointer flex items-center gap-2 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileUpload(e, setProjImage)} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">LIVE URL (OPTIONAL)</label>
                    <input type="url" value={projLiveUrl} onChange={e => setProjLiveUrl(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">GITHUB REPO URL (OPTIONAL)</label>
                    <input type="url" value={projRepoUrl} onChange={e => setProjRepoUrl(e.target.value)} placeholder="https://github.com/..." className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono font-bold uppercase">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#f05a28] hover:bg-[#ff6d39] text-white font-mono text-xs font-bold uppercase shadow-lg shadow-orange-500/20">Save Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
