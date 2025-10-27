import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  founded_year: number | null;
  headquarters: string | null;
  employees: string | null;
  revenue: string | null;
  website: string | null;
  description: string | null;
  ceo: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}
