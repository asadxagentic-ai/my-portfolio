import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/* -----------------------------------------------------------------------------
   TYPES & DEFAULT DATA SETUP
   ----------------------------------------------------------------------------- */

export interface ProjectItem {
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

export interface SkillMetric {
  label: string;
  value: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  subtitle?: string;
  expertise?: string;
  description: string;
  useCases: string[];
  projectsCount: string;
  projectCategory: string;
  orbitAngle: number;
  brandBg: string;
  brandText: string;
  brandBorder: string;
  brandShadow: string;
  metrics: SkillMetric[];
  relatedTech: string[];
  codeSnippet: string;
  iconSrc?: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: '01',
    title: 'Linkedin Autoconnect Automation',
    outcome: 'Scaled network outreach to 500+ monthly connections with 45% acceptance rate.',
    description: 'This n8n workflow automates LinkedIn lead generation and network growth using PhantomBuster agents.',
    tech: ['n8n', 'PhantomBuster', 'Docker'],
    image: '/proj1.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/linkedin-auto-connect-automation',
    repoUrl: 'https://github.com/asadxagentic-ai/linkedin-auto-connect-automation',
    altText: 'Linkedin Autoconnect Automation'
  },
  {
    id: '02',
    title: 'Agent Swarm',
    outcome: 'Consolidated 5+ team communication flows into a single Telegram command center.',
    description: 'Agent Swarm is a production-ready, modular n8n workflow that transforms Telegram into a unified interface for intelligent personal assistance.',
    tech: ['n8n', 'Docker'],
    image: '/proj3.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/a-fully-agentic-assistant',
    repoUrl: 'https://github.com/asadxagentic-ai/a-fully-agentic-assistant',
    altText: 'Agent Swarm'
  },
  {
    id: '03',
    title: 'AI CRM Sales Analysis',
    outcome: 'Extracted and synchronized actionable CRM insights from 100+ sales transcripts daily.',
    description: 'This n8n workflow automates the process of analyzing sales call transcripts from PDF files stored in Google Drive.',
    tech: ['n8n', 'Docker'],
    image: '/proj2.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/ai-crm-sales-analysis',
    repoUrl: 'https://github.com/asadxagentic-ai/ai-crm-sales-analysis',
    altText: 'AI CRM Sales Analysis'
  },
  {
    id: '04',
    title: 'Vapi AI Recipionist',
    outcome: 'Handled 80% of incoming real estate calls and scheduled viewings automatically.',
    description: 'This n8n workflow automates the process of a AI Recipionist for a Real Estate Agent using Vapi API. The AI Recipionist is able to answer phone calls from potential buyers and schedule viewings.',
    tech: ['n8n', 'Vapi', 'Docker'],
    image: '/proj5.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/vapi-ai-receptionist',
    repoUrl: 'https://github.com/asadxagentic-ai/vapi-ai-receptionist',
    altText: 'Vapi AI Recipionist'
  },
  {
    id: '05',
    title: 'AI Recruiter',
    outcome: 'Screened and evaluated 500+ candidates with automated voice interview reports.',
    description: 'An automated recruitment and screening pipeline that extracts resume details, runs ATS evaluation, conducts interactive interviews via Vapi, and generates final HR reports.',
    tech: ['n8n', 'Vapi', 'Mistral', 'Docker'],
    image: '/proj4.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/ai-weather-intelligence-report-generator',
    repoUrl: 'https://github.com/asadxagentic-ai/ai-weather-intelligence-report-generator',
    altText: 'AI Recruiter'
  },
  {
    id: '06',
    title: 'Outbound Sales Outreach',
    outcome: 'Enriched 1,000+ monthly leads and automated personalized outreach campaigns.',
    description: 'An automated outbound sales system integrating Apollo leads extraction, LeadIQ contact enrichment, AI-driven personalized drafting, and automated Gmail outreach with reply classification.',
    tech: ['n8n', 'Apollo', 'HubSpot', 'Docker'],
    image: '/proj6.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/ai-social-media-post-generator',
    repoUrl: 'https://github.com/asadxagentic-ai/ai-social-media-post-generator',
    altText: 'Outbound Sales Outreach'
  },
  {
    id: '07',
    title: 'AI Whatsapp Rag Business Assistant',
    outcome: 'Handled 95% of incoming client inquiries with automated RAG-based classifications.',
    description: 'An intelligent WhatsApp business assistant built with n8n that automatically handles incoming messages, classifies them as client inquiries or personal messages.',
    tech: ['n8n', 'Docker'],
    image: '/proj7.jpeg',
    liveUrl: 'https://github.com/asadxagentic-ai/ai-whatsapp-rag-business-assistant',
    repoUrl: 'https://github.com/asadxagentic-ai/ai-whatsapp-rag-business-assistant',
    altText: 'AI Whatsapp Rag Business Assistant'
  }
];

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    category: 'Core Agentic Architecture',
    description: 'autonomous task execution, reasoning, tool use, decision-making, and multi-step problem solving.',
    useCases: [
      'Multi-step autonomous workflow execution',
      'Reasoning & decision-making engines',
      'Tool use & dynamic function binding',
      'Complex multi-agent orchestration'
    ],
    projectsCount: '24+ Deployed',
    projectCategory: 'Autonomous Systems',
    orbitAngle: -90,
    brandBg: 'bg-[#f05a28]',
    brandText: 'text-white',
    brandBorder: 'border-[#f05a28]',
    brandShadow: 'shadow-[#f05a28]/30',
    metrics: [
      { label: 'Autonomous Accuracy', value: '99.4%' },
      { label: 'Task Execution Rate', value: '45/min' }
    ],
    relatedTech: ['LangGraph', 'LangChain', 'OpenAI', 'Python', 'MCPs'],
    codeSnippet: `class AgentEngine:
    def __init__(self, tools, llm):
        self.agent = create_react_agent(llm, tools)
        
    async def run(self, goal: str):
        return await self.agent.ainvoke({"input": goal})`
  },
  {
    id: 'langchain',
    name: 'LangChain',
    category: 'LLM Orchestration',
    description: 'LLM integration, prompt engineering, tool/function calling, RAG, and agent development.',
    useCases: [
      'LLM integration & model abstraction',
      'Prompt engineering & template management',
      'Tool & function calling bindings',
      'RAG pipelines & agent development'
    ],
    projectsCount: '15+ Projects',
    projectCategory: 'LangChain Ecosystems',
    orbitAngle: -135,
    brandBg: 'bg-[#10B981]',
    brandText: 'text-white',
    brandBorder: 'border-[#10B981]',
    brandShadow: 'shadow-[#10B981]/30',
    metrics: [
      { label: 'Latency Optimization', value: '-42%' },
      { label: 'Retrieval Precision', value: '94.8%' }
    ],
    relatedTech: ['Python', 'Function calling', 'MCPs', 'OpenAI', 'Supabase'],
    codeSnippet: `const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(systemPrompt),
  new ChatOpenAI({ model: "gpt-4o", temperature: 0.2 }),
  new StructuredOutputParser(zodSchema)
]);`
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    category: 'Stateful Agent Workflows',
    description: 'stateful workflows, multi-agent orchestration, conditional branching, loops, and human-in-the-loop systems.',
    useCases: [
      'Stateful graph-based agent workflows',
      'Multi-agent team orchestration',
      'Conditional branching & cyclic loops',
      'Human-in-the-loop approval systems'
    ],
    projectsCount: '12+ Systems',
    projectCategory: 'Graph Architectures',
    orbitAngle: -45,
    brandBg: 'bg-[#8B5CF6]',
    brandText: 'text-white',
    brandBorder: 'border-[#8B5CF6]',
    brandShadow: 'shadow-[#8B5CF6]/30',
    metrics: [
      { label: 'State Consistency', value: '100%' },
      { label: 'Branching Throughput', value: '2.4k/s' }
    ],
    relatedTech: ['Python', 'LangChain', 'FastAPI', 'Redis', 'PostgreSQL'],
    codeSnippet: `workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("action", take_action)
workflow.add_conditional_edges("agent", should_continue)
app = workflow.compile(checkpointer=MemorySaver())`
  },
  {
    id: 'workflow-auto',
    name: 'Workflow Automation',
    category: 'Enterprise Integration',
    description: 'API integrations, webhooks, event-driven workflows, task orchestration, and process automation.',
    useCases: [
      'API integrations & custom endpoints',
      'Webhooks & real-time listeners',
      'Event-driven asynchronous workflows',
      'Task orchestration & process automation'
    ],
    projectsCount: '35+ Workflows',
    projectCategory: 'n8n & Enterprise Pipelines',
    orbitAngle: -10,
    iconSrc: '/n8n.png',
    brandBg: 'bg-[#f05a28]',
    brandText: 'text-white',
    brandBorder: 'border-[#f05a28]',
    brandShadow: 'shadow-[#f05a28]/30',
    metrics: [
      { label: 'Time Saved / Month', value: '450+ hrs' },
      { label: 'Uptime SLA', value: '99.95%' }
    ],
    relatedTech: ['n8n', 'Make', 'Zapier'],
    codeSnippet: `@app.post("/webhook/trigger")
async function process_payload(payload: EventPayload):
    parsed = await pdf_extractor.extract(payload.doc_url)
    decision = await ai_engine.evaluate(parsed)
    await crm_client.sync_account(decision)
    return {"status": "success"}`
  },
  {
    id: 'gen-ai',
    name: 'Generative AI',
    category: 'Multimodal AI Development',
    description: 'text generation, content creation, embeddings, multimodal AI, and AI application development.',
    useCases: [
      'Text generation & intelligent content creation',
      'Vector embeddings & semantic search',
      'Multimodal AI (Vision, Audio, Code)',
      'AI application development & deployment'
    ],
    projectsCount: '28+ Applications',
    projectCategory: 'GenAI Apps',
    orbitAngle: 20,
    brandBg: 'bg-[#EC4899]',
    brandText: 'text-white',
    brandBorder: 'border-[#EC4899]',
    brandShadow: 'shadow-[#EC4899]/30',
    metrics: [
      { label: 'Generation Speed', value: '85 tok/s' },
      { label: 'Multimodal Accuracy', value: '98.2%' }
    ],
    relatedTech: ['OpenAI', 'Anthropic', 'Gemini', 'Whisper', 'Pinecone'],
    codeSnippet: `const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" }
});`
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'High-Performance Backends',
    description: 'REST API development, async services, backend integration, authentication, and high-performance AI endpoints.',
    useCases: [
      'REST API development & OpenAPI docs',
      'Asynchronous microservices & WebSockets',
      'Backend integration & database ORM',
      'High-performance AI inference endpoints'
    ],
    projectsCount: '18+ Services',
    projectCategory: 'Async Python Backends',
    orbitAngle: 128,
    brandBg: 'bg-[#009688]',
    brandText: 'text-white',
    brandBorder: 'border-[#009688]',
    brandShadow: 'shadow-[#009688]/30',
    metrics: [
      { label: 'Req Latency (p99)', value: '18ms' },
      { label: 'Async Throughput', value: '12k/s' }
    ],
    relatedTech: ['Python', 'Pydantic', 'SQLAlchemy', 'Uvicorn', 'Docker'],
    codeSnippet: `@app.get("/api/v1/inference", response_model=InferenceResponse)
async def predict(data: Payload = Depends()):
    result = await model_pool.infer(data)
    return {"prediction": result.output, "confidence": result.score}`
  },
  {
    id: 'ai-chatbots',
    name: 'AI Chatbots',
    category: 'Conversational Intelligence',
    description: 'conversational AI, memory, RAG-based responses, tool integration, and customer-support automation.',
    useCases: [
      'Conversational AI & custom personas',
      'Short & long-term memory systems',
      'RAG-based enterprise knowledge responses',
      'Tool integration & support automation'
    ],
    projectsCount: '20+ Chatbots',
    projectCategory: 'Support & Sales Bots',
    orbitAngle: 52,
    brandBg: 'bg-[#3B82F6]',
    brandText: 'text-white',
    brandBorder: 'border-[#3B82F6]',
    brandShadow: 'shadow-[#3B82F6]/30',
    metrics: [
      { label: 'CSAT Rating', value: '4.9 / 5' },
      { label: 'Deflection Rate', value: '82%' }
    ],
    relatedTech: ['Python', 'Supabase', 'OpenAI', 'Gen AI'],
    codeSnippet: `export async function POST(req: Request) {
  const { messages } = await req.json();
  const stream = await OpenAIStream({
    model: 'gpt-4o',
    messages,
    functions: toolDefinitions,
  });
  return new StreamingTextResponse(stream);
}`
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Core AI Scripting',
    description: 'AI/ML development, automation scripting, backend development, API integration, and data processing.',
    useCases: [
      'AI/ML framework development & fine-tuning',
      'Automation scripting & Web scraping',
      'Backend service development',
      'Data processing & ETL pipelines'
    ],
    projectsCount: '50+ Scripts & Services',
    projectCategory: 'Python Ecosystem',
    orbitAngle: 160,
    brandBg: 'bg-[#3776AB]',
    brandText: 'text-white',
    brandBorder: 'border-[#3776AB]',
    brandShadow: 'shadow-[#3776AB]/30',
    metrics: [
      { label: 'Test Coverage', value: '96%' },
      { label: 'Pipelines Built', value: '120+' }
    ],
    relatedTech: ['PyTorch', 'Pandas', 'NumPy', 'Asyncio', 'Poetry'],
    codeSnippet: `async def batch_process(items: list[WorkItem]):
    tasks = [process_single(item) for item in items]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if not isinstance(r, Exception)]`
  },
  {
    id: 'llm',
    name: 'LLMs',
    category: 'Language Model Engineering',
    description: 'prompt design, context management, model integration, structured outputs, and inference optimization.',
    useCases: [
      'Prompt design & meta-prompting',
      'Context window management & compression',
      'Multi-provider model integration',
      'Structured outputs & inference optimization'
    ],
    projectsCount: '30+ Models Deployed',
    projectCategory: 'Model Infrastructure',
    orbitAngle: -170,
    brandBg: 'bg-[#F59E0B]',
    brandText: 'text-white',
    brandBorder: 'border-[#F59E0B]',
    brandShadow: 'shadow-[#F59E0B]/30',
    metrics: [
      { label: 'Cost Savings', value: '-65%' },
      { label: 'Context Limit', value: '128k+' }
    ],
    relatedTech: ['Ollama', 'API', 'OpenAI', 'Anthropic', 'Qwen', 'Gemini', 'DeepSeek'],
    codeSnippet: `from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-3.1-70B-Instruct", tensor_parallel_size=2)
outputs = llm.generate(prompts, SamplingParams(temperature=0.1, max_tokens=512))`
  }
];

/* -----------------------------------------------------------------------------
   CONTEXT INTERFACE
   ----------------------------------------------------------------------------- */

interface DataContextType {
  projects: ProjectItem[];
  skills: SkillItem[];
  isLoading: boolean;
  addProject: (project: Omit<ProjectItem, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: Omit<SkillItem, 'id'> & { id?: string }) => Promise<void>;
  updateSkill: (id: string, skill: Partial<SkillItem>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

/* -----------------------------------------------------------------------------
   PROVIDER IMPLEMENTATION
   ----------------------------------------------------------------------------- */

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('asad_portfolio_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem('asad_portfolio_skills');
      return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('asad_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('asad_portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  // Fetch initial data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      setIsLoading(true);
      try {
        const { data: dbProjects, error: projErr } = await supabase.from('projects').select('*');
        if (!projErr && dbProjects && dbProjects.length > 0) {
          setProjects(dbProjects.map(p => ({
            id: p.id,
            title: p.title,
            outcome: p.outcome,
            description: p.description,
            tech: typeof p.tech === 'string' ? JSON.parse(p.tech) : p.tech,
            image: p.image,
            liveUrl: p.live_url || undefined,
            repoUrl: p.repo_url || undefined,
            altText: p.alt_text || p.title,
          })));
        }

        const { data: dbSkills, error: skillErr } = await supabase.from('skills').select('*');
        if (!skillErr && dbSkills && dbSkills.length > 0) {
          setSkills(dbSkills.map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            useCases: typeof s.use_cases === 'string' ? JSON.parse(s.use_cases) : s.use_cases,
            projectsCount: s.projects_count,
            projectCategory: s.project_category,
            orbitAngle: Number(s.orbit_angle),
            brandBg: s.brand_bg,
            brandText: s.brand_text,
            brandBorder: s.brand_border,
            brandShadow: s.brand_shadow,
            metrics: typeof s.metrics === 'string' ? JSON.parse(s.metrics) : s.metrics,
            relatedTech: typeof s.related_tech === 'string' ? JSON.parse(s.related_tech) : s.related_tech,
            codeSnippet: s.code_snippet,
            iconSrc: s.icon_src || undefined,
          })));
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  /* --- PROJECTS CRUD --- */
  const addProject = useCallback(async (newProjData: Omit<ProjectItem, 'id'>) => {
    const id = String(Date.now()).slice(-4);
    const newProject: ProjectItem = { id, ...newProjData };

    setProjects(prev => [newProject, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('projects').insert([{
        id: newProject.id,
        title: newProject.title,
        outcome: newProject.outcome,
        description: newProject.description,
        tech: newProject.tech,
        image: newProject.image,
        live_url: newProject.liveUrl,
        repo_url: newProject.repoUrl,
        alt_text: newProject.altText,
      }]);
    }
  }, []);

  const updateProject = useCallback(async (id: string, updatedFields: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));

    if (isSupabaseConfigured && supabase) {
      const payload: any = {};
      if (updatedFields.title) payload.title = updatedFields.title;
      if (updatedFields.outcome) payload.outcome = updatedFields.outcome;
      if (updatedFields.description) payload.description = updatedFields.description;
      if (updatedFields.tech) payload.tech = updatedFields.tech;
      if (updatedFields.image) payload.image = updatedFields.image;
      if (updatedFields.liveUrl !== undefined) payload.live_url = updatedFields.liveUrl;
      if (updatedFields.repoUrl !== undefined) payload.repo_url = updatedFields.repoUrl;
      if (updatedFields.altText) payload.alt_text = updatedFields.altText;

      await supabase.from('projects').update(payload).eq('id', id);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
  }, []);

  /* --- SKILLS CRUD --- */
  const addSkill = useCallback(async (newSkillData: Omit<SkillItem, 'id'> & { id?: string }) => {
    const id = newSkillData.id || newSkillData.name.toLowerCase().replace(/\s+/g, '-');
    const newSkill: SkillItem = { id, ...newSkillData };

    setSkills(prev => [...prev, newSkill]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('skills').insert([{
        id: newSkill.id,
        name: newSkill.name,
        category: newSkill.category,
        description: newSkill.description,
        use_cases: newSkill.useCases,
        projects_count: newSkill.projectsCount,
        project_category: newSkill.projectCategory,
        orbit_angle: newSkill.orbitAngle,
        brand_bg: newSkill.brandBg,
        brand_text: newSkill.brandText,
        brand_border: newSkill.brandBorder,
        brand_shadow: newSkill.brandShadow,
        metrics: newSkill.metrics,
        related_tech: newSkill.relatedTech,
        code_snippet: newSkill.codeSnippet,
        icon_src: newSkill.iconSrc,
      }]);
    }
  }, []);

  const updateSkill = useCallback(async (id: string, updatedFields: Partial<SkillItem>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));

    if (isSupabaseConfigured && supabase) {
      const payload: any = {};
      if (updatedFields.name) payload.name = updatedFields.name;
      if (updatedFields.category) payload.category = updatedFields.category;
      if (updatedFields.description) payload.description = updatedFields.description;
      if (updatedFields.useCases) payload.use_cases = updatedFields.useCases;
      if (updatedFields.projectsCount) payload.projects_count = updatedFields.projectsCount;
      if (updatedFields.projectCategory) payload.project_category = updatedFields.projectCategory;
      if (updatedFields.orbitAngle !== undefined) payload.orbit_angle = updatedFields.orbitAngle;
      if (updatedFields.brandBg) payload.brand_bg = updatedFields.brandBg;
      if (updatedFields.brandText) payload.brand_text = updatedFields.brandText;
      if (updatedFields.brandBorder) payload.brand_border = updatedFields.brandBorder;
      if (updatedFields.brandShadow) payload.brand_shadow = updatedFields.brandShadow;
      if (updatedFields.metrics) payload.metrics = updatedFields.metrics;
      if (updatedFields.relatedTech) payload.related_tech = updatedFields.relatedTech;
      if (updatedFields.codeSnippet) payload.code_snippet = updatedFields.codeSnippet;
      if (updatedFields.iconSrc !== undefined) payload.icon_src = updatedFields.iconSrc;

      await supabase.from('skills').update(payload).eq('id', id);
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('skills').delete().eq('id', id);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setProjects(DEFAULT_PROJECTS);
    setSkills(DEFAULT_SKILLS);
    localStorage.removeItem('asad_portfolio_projects');
    localStorage.removeItem('asad_portfolio_skills');
  }, []);

  return (
    <DataContext.Provider
      value={{
        projects,
        skills,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        updateSkill,
        deleteSkill,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
