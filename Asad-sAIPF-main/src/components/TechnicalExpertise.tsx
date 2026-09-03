import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { FlipText } from './FlipText';
import { getTechLogo } from '../lib/techLogos';

export interface SkillItem {
  id: string;
  name: string;
  subtitle: string;
  expertise: string;
  category: 'ai-core' | 'frameworks' | 'engineering';
  description: string;
  useCases: string[];
  projectsCount: string;
  projectCategory: string;
  orbitAngle: number;
  brandBg: string;
  brandText: string;
  brandBorder: string;
  brandShadow: string;
  codeSnippet: string;
  metrics: { label: string; value: string }[];
  relatedTech: string[];
  iconSrc?: string;
}

export const SKILLS: SkillItem[] = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    subtitle: 'Autonomous Intelligence',
    expertise: 'Expertise: 3+ Years',
    category: 'ai-core',
    description: 'Designing autonomous AI agents capable of reasoning, tool use, independent decision-making, and multi-step problem solving.',
    useCases: [
      'Autonomous task execution & plan decomposition',
      'Reasoning & multi-step problem solving',
      'Dynamic tool use & API execution',
      'Autonomous decision-making loops'
    ],
    projectsCount: '20+ Projects',
    projectCategory: 'Autonomous Agent Networks',
    orbitAngle: -90,
    brandBg: 'bg-[#10a37f]',
    brandText: 'text-white',
    brandBorder: 'border-[#10a37f]',
    brandShadow: 'shadow-[#10a37f]/30',
    metrics: [
      { label: 'Autonomous Rate', value: '98.4%' },
      { label: 'Task Success', value: '96.2%' }
    ],
    relatedTech: ['OpenAI', 'LangChain', 'Python','Pinecone'],
    codeSnippet: `const agent = new AutonomousAgent({
  role: "Lead Strategist",
  tools: [WebBrowser, CodeInterpreter, SQLQuery],
  memory: new VectorMemoryStore(),
  maxIterations: 15
});

await agent.execute("Analyze competitor pricing and generate strategy report");`
  },
  {
    id: 'langchain',
    name: 'LangChain',
    subtitle: 'LLM Application Development',
    expertise: 'Expertise: 2+ Years',
    category: 'frameworks',
    description: 'Building composable LLM applications with prompt engineering, function calling, RAG pipelines, and agent development.',
    useCases: [
      'LLM integration & framework chains',
      'Advanced prompt engineering & template design',
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
    relatedTech: ['Python', 'Function calling',' MCPs', 'OpenAI','Supabase'],
    codeSnippet: `const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(systemPrompt),
  new ChatOpenAI({ model: "gpt-4o", temperature: 0.2 }),
  new StructuredOutputParser(zodSchema)
]);

const response = await chain.invoke({ query: input });`
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    subtitle: 'Multi-Agent Orchestration',
    expertise: 'Expertise: 2+ Years',
    category: 'frameworks',
    description: 'Orchestrating stateful, multi-agent graph workflows with conditional branching, execution loops, and human-in-the-loop systems.',
    useCases: [
      'Stateful workflow checkpointing & memory',
      'Multi-agent graph orchestration',
      'Conditional branching & cyclic loops',
      'Human-in-the-loop validation systems'
    ],
    projectsCount: '12+ Projects',
    projectCategory: 'Multi-Agent State Graphs',
    orbitAngle: -45,
    brandBg: 'bg-[#2563eb]',
    brandText: 'text-white',
    brandBorder: 'border-[#2563eb]',
    brandShadow: 'shadow-[#2563eb]/30',
    metrics: [
      { label: 'Graph Reliability', value: '99.9%' },
      { label: 'Checkpoint Speed', value: '<5ms' }
    ],
    relatedTech: ['Python', 'LangChain', 'PostgreSQL', 'Redis', 'FastAPI'],
    codeSnippet: `const workflow = new StateGraph(StateAnnotation)
  .addNode("planner", planStep)
  .addNode("executor", executeStep)
  .addConditionalEdges("planner", shouldContinue)
  .addEdge("executor", "planner");

const app = workflow.compile({ checkpointer: memoryStore });`
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    subtitle: 'Process Intelligence',
    expertise: 'Expertise: 3+ Years',
    category: 'engineering',
    description: 'Automating enterprise processes with event-driven webhooks, API integrations, task orchestration, and intelligent workflows.',
    useCases: [
      'Custom API & CRM integrations',
      'Event-driven webhook pipelines',
      'Task orchestration & scheduling',
      'End-to-end enterprise process automation'
    ],
    projectsCount: '25+ Projects',
    projectCategory: 'Enterprise Automation',
    orbitAngle: -10,
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
    name: 'Gen AI',
    subtitle: 'Generative Intelligence',
    expertise: 'Expertise: 3+ Years',
    category: 'ai-core',
    description: 'Developing multimodal generative AI applications for text generation, embeddings, content creation, and vision/voice AI.',
    useCases: [
      'Text generation & intelligent content creation',
      'Vector embeddings & semantic retrieval',
      'Multimodal vision & audio AI models',
      'Production AI application development'
    ],
    projectsCount: '30+ Projects',
    projectCategory: 'Multimodal AI Apps',
    orbitAngle: 20,
    brandBg: 'bg-[#6366f1]',
    brandText: 'text-white',
    brandBorder: 'border-[#6366f1]',
    brandShadow: 'shadow-[#6366f1]/30',
    metrics: [
      { label: 'Multimodal Accuracy', value: '97.5%' },
      { label: 'Tokens Processed', value: '100M+' }
    ],
    relatedTech: ['OpenAI', 'Anthropic', 'Gemini', 'Whisper', 'DALL·E'],
    codeSnippet: `const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: [{ type: "image", source: imageBuffer }] }]
});`
  },
  {
    id: 'ai-chatbots',
    name: 'AI Chatbots',
    subtitle: 'Conversational Experiences',
    expertise: 'Expertise: 3+ Years',
    category: 'ai-core',
    description: 'Creating conversational AI interfaces featuring long-term memory, RAG-based responses, tool integration, and support automation.',
    useCases: [
      'Conversational AI & persona interfaces',
      'Long-term stateful memory management',
      'RAG-based knowledge retrieval & answers',
      'Tool integration & customer-support automation'
    ],
    projectsCount: '20+ Projects',
    projectCategory: 'Conversational Assistants',
    orbitAngle: 52,
    brandBg: 'bg-[#0284c7]',
    brandText: 'text-white',
    brandBorder: 'border-[#0284c7]',
    brandShadow: 'shadow-[#0284c7]/30',
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
    temperature: 0.3
  });
  return new Response(stream);
}`
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    subtitle: 'High-Performance APIs',
    expertise: 'Expertise: 3+ Years',
    category: 'engineering',
    description: 'Developing high-performance REST APIs and async backend services with authentication and schema validation for AI endpoints.',
    useCases: [
      'High-performance REST API development',
      'Asynchronous backend services & integration',
      'Secure authentication & Pydantic validation',
      'High-concurrency AI model inference endpoints'
    ],
    projectsCount: '22+ Projects',
    projectCategory: 'High-Scale AI Backends',
    orbitAngle: 128,
    brandBg: 'bg-[#009688]',
    brandText: 'text-white',
    brandBorder: 'border-[#009688]',
    brandShadow: 'shadow-[#009688]/30',
    metrics: [
      { label: 'Avg Latency', value: '18ms' },
      { label: 'RPS Throughput', value: '5,000+' }
    ],
    relatedTech: ['Python', 'Pydantic', 'Docker'],
    codeSnippet: `@app.get("/api/v1/inference", response_model=ModelResult)
async def predict(payload: InferenceRequest):
    async with asyncio.TaskGroup() as tg:
        res1 = tg.create_task(model_a.query(payload))
        res2 = tg.create_task(model_b.query(payload))
    return aggregate(res1.result(), res2.result())`
  },
  {
    id: 'python',
    name: 'Python',
    subtitle: 'Core Language & AI Stack',
    expertise: 'Expertise: 3+ Years',
    category: 'engineering',
    description: 'Building core AI/ML pipelines, backend architectures, automation scripts, API integrations, and high-throughput data processing.',
    useCases: [
      'AI & Machine Learning development',
      'Automation scripting & task execution',
      'Backend development & API integration',
      'Data processing with AsyncIO concurrency'
    ],
    projectsCount: '35+ Projects',
    projectCategory: 'Python Architecture',
    orbitAngle: 160,
    brandBg: 'bg-[#3776ab]',
    brandText: 'text-white',
    brandBorder: 'border-[#3776ab]',
    brandShadow: 'shadow-[#3776ab]/30',
    metrics: [
      { label: 'Code Coverage', value: '98.5%' },
      { label: 'Execution Speed', value: 'Optimized' }
    ],
    relatedTech: ['FastAPI', 'PyTorch', 'LangChain', 'Pandas'],
    codeSnippet: `import asyncio
from typing import List, Dict

async def process_batch(items: List[Dict]) -> List[Dict]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(transform(item)) for item in items]
    return [task.result() for task in tasks]`
  },
  {
    id: 'llm',
    name: 'LLM',
    subtitle: 'Large Language Models',
    expertise: 'Expertise: 3+ Years',
    category: 'ai-core',
    description: 'Integrating and optimizing Large Language Models with context management, prompt design, structured outputs, and fast inference.',
    useCases: [
      'Prompt design & system instruction tuning',
      'Context management & token optimization',
      'Model integration & structured JSON outputs',
      'Inference optimization & benchmark evaluation'
    ],
    projectsCount: '28+ Projects',
    projectCategory: 'LLM Architectures',
    orbitAngle: -170,
    brandBg: 'bg-[#8b5cf6]',
    brandText: 'text-white',
    brandBorder: 'border-[#8b5cf6]',
    brandShadow: 'shadow-[#8b5cf6]/30',
    metrics: [
      { label: 'Cost Savings', value: '-65%' },
      { label: 'Context Limit', value: '128k+' }
    ],
    relatedTech: ['Ollama','API','OpenAI','Anthropic','Qwen','Gemini','DeepSeek'],
    codeSnippet: `from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-3.1-70B-Instruct", tensor_parallel_size=2)
params = SamplingParams(temperature=0.1, max_tokens=512)
outputs = llm.generate(prompts, params)`
  },
];

const SKILL_LOGOS: Record<string, string> = {
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

export { getTechLogo } from '../lib/techLogos';

function SkillIcon({ skillId, active = false, customIconSrc }: { skillId: string; active?: boolean; customIconSrc?: string }) {
  const logoSrc = customIconSrc || SKILL_LOGOS[skillId];

  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={`${skillId} logo`}
        className="w-full h-full object-contain"
      />
    );
  }

  const color = active ? '#ffffff' : '#475569';

  switch (skillId) {
    /* ── OpenAI logo (AI Agents) ── */
    case 'ai-agents':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
        </svg>
      );
    /* ── LangChain logo ── */
    case 'langchain':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    /* ── LangGraph logo ── */
    case 'langgraph':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.5" fill={color} />
          <circle cx="18" cy="6" r="2.5" fill={color} />
          <circle cx="12" cy="18" r="2.5" fill={color} />
          <line x1="8" y1="7.5" x2="10.5" y2="16" stroke={color} />
          <line x1="16" y1="7.5" x2="13.5" y2="16" stroke={color} />
          <line x1="8.5" y1="6" x2="15.5" y2="6" stroke={color} />
        </svg>
      );
    /* ── Workflow Automation (n8n logo) ── */
    case 'workflow-automation':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="5" height="5" rx="1.5" fill={color} />
          <rect x="16" y="3" width="5" height="5" rx="1.5" fill={color} />
          <rect x="9.5" y="16" width="5" height="5" rx="1.5" fill={color} />
          <path d="M5.5 8v3.5a2.5 2.5 0 0 0 2.5 2.5h4" />
          <path d="M18.5 8v3.5a2.5 2.5 0 0 1-2.5 2.5h-4" />
        </svg>
      );
    /* ── Google Gemini logo (Gen AI) ── */
    case 'gen-ai':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
          <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
        </svg>
      );
    /* ── ChatBot official logo (AI Chatbots) ── */
    case 'ai-chatbots':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
          <path d="M11.999 0c-2.25 0-4.5.06-6.6.21a5.57 5.57 0 00-5.19 5.1c-.24 3.21-.27 6.39-.06 9.6a5.644 5.644 0 005.7 5.19h3.15v-3.9h-3.15c-.93.03-1.74-.63-1.83-1.56-.18-3-.15-6 .06-9 .06-.84.72-1.47 1.56-1.53 2.04-.15 4.2-.21 6.36-.21s4.32.09 6.36.18c.81.06 1.5.69 1.56 1.53.24 3 .24 6 .06 9-.12.93-.9 1.62-1.83 1.59h-3.15l-6 3.9V24l6-3.9h3.15c2.97.03 5.46-2.25 5.7-5.19.21-3.18.18-6.39-.03-9.57a5.57 5.57 0 00-5.19-5.1c-2.13-.18-4.38-.24-6.63-.24zm-5.04 8.76c-.36 0-.66.3-.66.66v2.34c0 .33.18.63.48.78 1.62.78 3.42 1.2 5.22 1.26 1.8-.06 3.6-.48 5.22-1.26.3-.15.48-.45.48-.78V9.42c0-.09-.03-.15-.09-.21a.648.648 0 00-.87-.36c-1.5.66-3.12 1.02-4.77 1.05-1.65-.03-3.27-.42-4.77-1.08a.566.566 0 00-.24-.06z" />
        </svg>
      );
    /* ── FastAPI logo ── */
    case 'fastapi':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 17.5l-2.25-4.5H14.5L10.5 6.5l2.25 4.5H9.5l4 6.5z" />
        </svg>
      );
    /* ── Terminal prompt (Prompt Engineering) ── */
    case 'prompt-engg':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="2.5" stroke={color} strokeWidth="1.5" />
          <path d="M6 15l3.5-3L6 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="15" x2="18" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    /* ── Brain logo (LLM) ── */
    case 'llm':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.5" />
        </svg>
      );
  }
}

// Helper: Web Audio API synth sound feedback
function playUiChime(freq = 520) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Suppress audio context restrictions
  }
}




/* ═══════════════════════════════════════════════════════════════════════════════
   CONTINUOUS SCROLLING SKILL TICKER STRIP
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useDataContext, DEFAULT_SKILLS } from '../context/DataContext';

function ContinuousSkillStrip({
  activeId,
  onSelect,
  soundEnabled
}: {
  activeId: string;
  onSelect: (id: string) => void;
  soundEnabled: boolean;
}) {
  const { skills: SKILLS } = useDataContext();
  const doubledSkills = [...SKILLS, ...SKILLS, ...SKILLS];

  return (
    <motion.div 
      className="relative z-10 w-screen left-1/2 -translate-x-1/2 mt-6 sm:mt-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        className="bg-white/80 border-y border-slate-200/60 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden relative w-full"
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F8F8F8] via-[#F8F8F8]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F8F8F8] via-[#F8F8F8]/90 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-6 w-max transform-gpu"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear'
            }
          }}
        >
          {doubledSkills.map((skill, index) => {
            const isActive = skill.id === activeId;
            return (
              <React.Fragment key={`strip-${skill.id}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playUiChime(640);
                    onSelect(skill.id);
                  }}
                  className="relative flex items-center gap-3 group outline-none cursor-pointer border-none bg-transparent py-1 px-2 select-none"
                >
                  <span 
                    className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'text-slate-900 drop-shadow-sm scale-105'
                        : 'text-transparent group-hover:text-slate-900'
                    }`}
                    style={{
                      WebkitTextStroke: isActive ? 'none' : '1.5px #94a3b8'
                    }}
                  >
                    {skill.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      className="absolute -bottom-1 left-2 right-2 h-[3px] rounded-full bg-[#f05a28]"
                      layoutId="stripIndicator"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>

                {/* Glowing Bullet Dot Separator */}
                <span 
                  className={`w-2 h-2 rounded-full flex-shrink-0 mx-3 transition-all duration-300 ${
                    isActive ? 'bg-[#f05a28] shadow-[0_0_10px_#f05a28]' : 'bg-slate-300/60'
                  }`} 
                />
              </React.Fragment>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function TechnicalExpertise() {
  const { skills: SKILLS } = useDataContext();
  const [activeSkillId, setActiveSkillId] = useState<string>(SKILLS[0]?.id || 'ai-agents');
  const [cardTab, setCardTab] = useState<'overview' | 'code'>('overview');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);



  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Reset tab when switching skills
  useEffect(() => {
    setCardTab('overview');
  }, [activeSkillId]);

  // Compute dynamic Orbit Radii based on screen breakpoint
  const { RX, RY } = React.useMemo(() => {
    if (windowWidth < 380) {
      return { RX: 110, RY: 85 };
    } else if (windowWidth < 640) {
      return { RX: 125, RY: 95 };
    } else if (windowWidth < 1024) {
      return { RX: 220, RY: 150 };
    } else if (windowWidth < 1280) {
      return { RX: 240, RY: 170 };
    } else if (windowWidth < 1536) {
      return { RX: 250, RY: 180 };
    }
    return { RX: 290, RY: 210 };
  }, [windowWidth]);

  // Helper to guarantee clean, non-overlapping orbit angles for all skill nodes
  const getSkillAngle = (skill: { id: string; orbitAngle: number }) => {
    switch (skill.id) {
      case 'ai-agents':
        return -90;
      case 'langchain':
        return -135;
      case 'langgraph':
        return -45;
      case 'workflow-automation':
      case 'workflow-auto':
        return -10;
      case 'gen-ai':
        return 20;
      case 'ai-chatbots':
        return 65;
      case 'fastapi':
        return 125;
      case 'python':
        return 160;
      case 'llm':
      case 'llms':
        return -170;
      default:
        return skill.orbitAngle || 0;
    }
  };

  // Calculate coordinates for all 9 core skill nodes
  const displaySkills = SKILLS && SKILLS.length > 0 ? SKILLS : DEFAULT_SKILLS;
  const activeSkill = displaySkills.find((s) => s.id === activeSkillId) || displaySkills[0];

  const skillCoords = displaySkills.map((skill) => {
    const angle = getSkillAngle(skill);
    const rad = (angle * Math.PI) / 180;
    return {
      id: skill.id,
      x: Math.cos(rad) * RX,
      y: Math.sin(rad) * RY,
    };
  });

  const activeCoord = skillCoords.find((c) => c.id === activeSkillId) || skillCoords[0];

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="relative min-h-screen py-14 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8] flex flex-col items-center justify-between overflow-hidden selection:bg-[#f05a28] selection:text-white"
    >
      {/* ──── Background Grid Lines (matching About section) ──── */}
      <div className="absolute top-0 bottom-0 left-[5%] right-[5%] pointer-events-none z-0 flex justify-between">
        <div className="w-px h-full bg-[#e8e8e8]" />
        <div className="w-px h-full bg-[#e8e8e8]" />
        <div className="w-px h-full bg-[#e8e8e8]" />
        <div className="w-px h-full bg-[#e8e8e8]" />
        <div className="w-px h-full bg-[#e8e8e8]" />
      </div>

      {/* ──── Parallax Ghost Watermark Text ──── */}
      <div className="absolute top-[38%] left-0 w-full pointer-events-none z-[1] select-none flex justify-center overflow-hidden">
        <motion.h2 
          style={{ y: ghostY }}
          className="text-[22vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap text-slate-200/50"
        >
          SKILLS
        </motion.h2>
      </div>

      {/* Left Vertical Indicator Sidebar */}
      <div className="hidden lg:flex flex-col items-center gap-4 absolute left-4 xl:left-5 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-slate-300" />
          <span className="w-[5px] h-[5px] rounded-full bg-slate-300" />
          <span className="w-[7px] h-[7px] rounded-full bg-[#f05a28] ring-[3px] ring-[#f05a28]/20" />
          <span className="w-[5px] h-[5px] rounded-full bg-slate-300" />
        </div>

        <div className="w-px h-8 bg-slate-200" />

        <div
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          SKILLS
        </div>

        <div className="w-px h-8 bg-slate-200" />

        <div className="flex flex-col items-center gap-3 pt-1">
          <motion.a
            href="https://github.com/asadxagentic-ai"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 bg-slate-100/80 border border-slate-200/80 hover:bg-[#24292e] hover:text-white hover:border-[#24292e] hover:shadow-lg hover:shadow-[#24292e]/20 transition-all duration-300"
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/asadxagentic-ai/"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 bg-slate-100/80 border border-slate-200/80 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-lg hover:shadow-[#0A66C2]/30 transition-all duration-300"
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </motion.a>

          <motion.a
            href="mailto:m.asadullah95e@gmail.com"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 bg-slate-100/80 border border-slate-200/80 hover:bg-[#f05a28] hover:text-white hover:border-[#f05a28] hover:shadow-lg hover:shadow-[#f05a28]/30 transition-all duration-300"
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </motion.a>
        </div>
      </div>

      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(240,90,40,0.08),transparent_70%)] rounded-full pointer-events-none" />

      {/* ──── Top Section Header (Scroll-triggered) ──── */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto mb-3 text-left pt-2 select-none"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[#f05a28] text-[10px] font-bold tracking-[0.25em] mb-3 uppercase flex items-center justify-start gap-3">
          <span>//</span> THE INTELLIGENCE SYSTEM BEHIND MY WORK
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black leading-[0.9] tracking-tighter uppercase text-[#111] mb-3 font-sans">
          <FlipText duration={0.8}>TECHNICAL</FlipText><br />
          <span className="text-[#f05a28]">
            <FlipText duration={0.8} delay={0.2}>ECOSYSTEM.</FlipText>
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed mb-5 font-medium">
          Connected technologies, neural frameworks, and automation engines working together to build intelligent digital systems.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-start gap-3 max-w-full">
          <motion.div 
            className="inline-flex flex-wrap justify-start items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm max-w-full ml-3 sm:ml-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'ai-core', label: 'AI Core' },
              { id: 'frameworks', label: 'Frameworks' },
              { id: 'engineering', label: 'APIs & Backend' }
            ].map((cat) => {
              const isCatActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isCatActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ──── Main Container: Orbit Stage + Floating Detail Card ──── */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col xl:flex-row items-center justify-between gap-8 lg:gap-16 my-auto">
        
        {/* Orbit & Central Robot Intelligence Stage */}
        <motion.div 
          className="relative w-full max-w-[760px] min-h-[380px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center mx-auto xl:translate-x-4"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* SVG Laser Rays & Orbit Track */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            viewBox={`-${RX + 100} -${RY + 80} ${(RX + 100) * 2} ${(RY + 80) * 2}`}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Elliptical Orbit Track */}
            <ellipse
              cx="0"
              cy="0"
              rx={RX}
              ry={RY}
              stroke="url(#orbitMainGrad)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              className="opacity-60"
            />

            {/* Inner Core Pulse Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx={RX * 0.52}
              ry={RY * 0.52}
              stroke="#f05a28"
              strokeWidth="1"
              strokeOpacity="0.2"
            />

            {/* Spoke Rays connecting Center Robot Core to each technology node */}
            {skillCoords.map((coord) => {
              const isActive = coord.id === activeSkillId;
              return (
                <g key={`ray-${coord.id}`}>
                  <line
                    x1="0"
                    y1="0"
                    x2={coord.x}
                    y2={coord.y}
                    stroke={isActive ? '#f05a28' : '#cbd5e1'}
                    strokeWidth={isActive ? 3 : 1}
                    strokeOpacity={isActive ? 0.95 : 0.25}
                    strokeDasharray={isActive ? 'none' : '4 4'}
                  />
                  {isActive && (
                    <circle
                      cx={coord.x * 0.5}
                      cy={coord.y * 0.5}
                      r="4"
                      fill="#f05a28"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isActive ? 6 : 3.5}
                    fill={isActive ? '#f05a28' : '#94a3b8'}
                  />
                </g>
              );
            })}

            <defs>
              <linearGradient id="orbitMainGrad" x1="-460" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#f05a28" stopOpacity="0.9" />
                <stop offset="0.5" stopColor="#ff804d" stopOpacity="0.5" />
                <stop offset="1" stopColor="#cbd5e1" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Robot Focal Point */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto">
            {/* Holographic Glowing Platform Ring */}
            <div className="absolute bottom-1 w-[90px] sm:w-[120px] md:w-[150px] h-[22px] sm:h-[32px] rounded-[100%] border border-[#f05a28]/40 bg-gradient-radial from-[#f05a28]/25 via-orange-400/10 to-transparent blur-xs animate-pulse pointer-events-none" />

            {/* Central Robot Intelligence Mascot */}
            <motion.div
              className="relative z-10 flex justify-center items-center transform-gpu will-change-transform"
              animate={{ 
                y: [-6, 6, -6],
                rotate: activeCoord ? activeCoord.x * 0.015 : 0
              }}
              transition={{ 
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <picture>
                <source srcSet="/robot.webp" type="image/webp" />
                <img 
                  src="/robot.png" 
                  alt="AI Intelligence Robot Mascot Core" 
                  decoding="async"
                  loading="eager"
                  className="w-[100px] sm:w-[135px] md:w-[165px] lg:w-[190px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(240,90,40,0.2)] relative z-10 transform-gpu"
                />
              </picture>
            </motion.div>
          </div>

          {/* Orbiting Technology Nodes */}
          {displaySkills.map((skill) => {
            const isActive = skill.id === activeSkillId;
            const isDimmed = categoryFilter !== 'all' && skill.category !== categoryFilter;
            const angle = getSkillAngle(skill);
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * RX;
            const y = Math.sin(rad) * RY;

            return (
              <div
                key={skill.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-300 ${
                  isActive ? 'z-30' : 'z-20'
                } ${
                  isDimmed ? 'opacity-30 scale-85 grayscale' : 'opacity-100'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playUiChime(640);
                    setActiveSkillId(skill.id);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl cursor-pointer select-none transition-all duration-300 border outline-none focus:outline-none ${
                    isActive
                      ? `bg-white border-[#f05a28] border-2 shadow-xl shadow-orange-500/20 scale-[1.04] sm:scale-105 ring-2 sm:ring-4 ring-[#f05a28]/15`
                      : 'bg-white/95 backdrop-blur-sm border-slate-200/80 shadow-md hover:bg-white hover:border-slate-300 hover:scale-102'
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="w-6.5 h-6.5 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center flex-shrink-0 p-1 sm:p-1.5 transition-all duration-300">
                    <SkillIcon skillId={skill.id} active={isActive} customIconSrc={skill.iconSrc} />
                  </div>

                  <div className="hidden sm:flex flex-col text-left pr-0.5 min-w-0">
                    <span className={`text-[10px] sm:text-[11px] font-bold leading-tight whitespace-nowrap transition-colors duration-200 ${isActive ? 'text-slate-900 font-black' : 'text-slate-800'}`}>
                      {skill.name}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5 whitespace-nowrap max-w-[105px] truncate">
                      {skill.subtitle || skill.category}
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </motion.div>

        {/* ──── Right Live AI System Diagnostic Panel ──── */}
        <motion.div 
          className="w-full xl:w-[400px] flex justify-center xl:justify-end flex-shrink-0 xl:ml-auto"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkill.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/98 border border-slate-200/90 rounded-3xl p-5 shadow-xl relative overflow-hidden w-full max-w-[400px]"
            >
              {/* Subtle Ambient Radial Corner Accent */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-radial from-[#f05a28]/12 via-orange-400/5 to-transparent rounded-full blur-xl pointer-events-none" />
              
              {/* Refined Top Border Accent */}
              <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#f05a28]/50 to-transparent" />

              {/* Header Row: Category Badge + Tab Switcher */}
              <div className="flex items-center justify-between mb-4 pt-0.5 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-pulse" />
                    <span>NODE // {activeSkill.category === 'ai-core' ? 'AI CORE' : activeSkill.category === 'frameworks' ? 'FRAMEWORKS' : 'ENGINEERING'}</span>
                  </span>
                </div>

                {/* Tactile Switcher: Overview / Code */}
                <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-100/90 border border-slate-200/70">
                  <button
                    onClick={() => setCardTab('overview')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      cardTab === 'overview'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setCardTab('code')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      cardTab === 'code'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {'</>'} Code
                  </button>
                </div>
              </div>

              {/* Skill Hero Section */}
              <div className="flex items-center gap-3.5 mb-4 relative z-10 p-2.5 rounded-2xl bg-gradient-to-r from-slate-50/90 to-transparent border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center flex-shrink-0 p-2.5 transition-all duration-300 relative group">
                  <SkillIcon skillId={activeSkill.id} active customIconSrc={activeSkill.iconSrc} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight uppercase font-['Outfit'] truncate">
                      {activeSkill.name}
                    </h3>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-500 uppercase whitespace-nowrap">
                      {activeSkill.expertise ? activeSkill.expertise.replace('Expertise: ', '') : 'PRO ENGINE'}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold text-[#f05a28] truncate mt-0.5">
                    {activeSkill.subtitle || activeSkill.category}
                  </p>
                </div>
              </div>

              {/* Main Card Body (Overview vs Code) */}
              <AnimatePresence mode="wait">
                {cardTab === 'overview' ? (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5 relative z-10"
                  >
                    {/* Concise Description */}
                    <p className="text-[11.5px] text-slate-600 leading-relaxed font-medium">
                      {activeSkill.description}
                    </p>



                    {/* Core Capabilities Checklist */}
                    <div className="pt-1">
                      <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                        <span>CAPABILITY MATRIX</span>
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/70 text-[#f05a28] font-bold text-[9px] font-mono">
                          {activeSkill.projectsCount}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {activeSkill.useCases.slice(0, 3).map((useCase, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-[11px] text-slate-700 p-1.5 rounded-xl hover:bg-slate-50/80 transition-colors">
                            <span className="w-4 h-4 rounded-full bg-[#f05a28]/10 text-[#f05a28] flex items-center justify-center text-[10px] font-black flex-shrink-0">◈</span>
                            <span className="font-semibold text-slate-800 truncate">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Connected Tech Stack Tags */}
                    <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {activeSkill.relatedTech.map((tag) => {
                        const logo = getTechLogo(tag);
                        return (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/70 text-[9.5px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5 hover:bg-[#f05a28]/10 hover:text-[#f05a28] hover:border-[#f05a28]/30 transition-all duration-200 cursor-default"
                          >
                            {logo && <img src={logo} alt={tag} className="w-3.5 h-3.5 object-contain" />}
                            <span>{tag}</span>
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 relative z-10"
                  >
                    <div className="relative rounded-2xl bg-[#090D16] border border-slate-800 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-[#0B0F19]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          <span className="ml-1 text-[9.5px] font-mono text-slate-400">{activeSkill.id}.ts</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(activeSkill.codeSnippet)}
                          className="text-[9.5px] font-mono font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-150 cursor-pointer"
                        >
                          {copiedCode ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-3.5 max-h-[180px] overflow-y-auto overflow-x-auto text-[10.5px] leading-[1.65] font-mono text-emerald-300/90 scrollbar-thin">
                        <code>{activeSkill.codeSnippet}</code>
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeSkill.relatedTech.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/70 text-[9.5px] font-mono font-bold text-slate-700 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Action Bar */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate">{activeSkill.projectCategory}</span>
                </div>

                <button
                  onClick={handleScrollToProjects}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-[#f05a28] text-white text-[11px] font-bold shadow-md shadow-slate-900/10 hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View Projects</span>
                  <span className="text-[11px]">→</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>



      {/* CONTINUOUS SCROLLING SKILL TICKER STRIP (Click-only card selection) */}
      <ContinuousSkillStrip 
        activeId={activeSkillId} 
        onSelect={setActiveSkillId} 
        soundEnabled={soundEnabled}
      />

    </section>
  );
}
