export function getTechLogo(name: string): string | null {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  if (normalized.includes('openai')) return '/openai.png';
  if (normalized.includes('langchain')) return '/langchain.png';
  if (normalized.includes('langgraph')) return '/langgraph.png';
  if (normalized.includes('n8n')) return '/n8n.png';
  if (normalized.includes('fastapi')) return '/FastAPI.png';
  if (normalized.includes('python')) return '/Python.png';
  if (normalized.includes('brain') || normalized.includes('genai') || normalized.includes('gemini')) return '/brain.png';
  if (normalized.includes('workflow')) return '/workflow.png';
  return null;
}
