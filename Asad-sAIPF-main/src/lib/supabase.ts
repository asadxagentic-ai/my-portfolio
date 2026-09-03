import { createClient } from '@supabase/supabase-js';

/* -----------------------------------------------------------------------------
   SUPABASE CLIENT INITIALIZATION
   ----------------------------------------------------------------------------- */

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/* -----------------------------------------------------------------------------
   SQL TABLE CREATION SCHEMAS (FOR USER'S SUPABASE DASHBOARD SETUP)
   ----------------------------------------------------------------------------- */

export const SUPABASE_SQL_SETUP = `-- Copy and run this SQL in your Supabase SQL Editor:

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  outcome TEXT NOT NULL,
  description TEXT NOT NULL,
  tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  live_url TEXT,
  repo_url TEXT,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects_count TEXT NOT NULL,
  project_category TEXT NOT NULL,
  orbit_angle NUMERIC NOT NULL,
  brand_bg TEXT NOT NULL,
  brand_text TEXT NOT NULL,
  brand_border TEXT NOT NULL,
  brand_shadow TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  code_snippet TEXT NOT NULL,
  icon_src TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow authenticated all skills" ON public.skills FOR ALL USING (true);
`;
