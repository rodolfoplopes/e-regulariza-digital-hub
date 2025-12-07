import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function createSafeClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
  
  const url = SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = SUPABASE_ANON_KEY || 'placeholder-anon-key';
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: isSupabaseConfigured,
      persistSession: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured
    }
  });
}

export const supabase = createSafeClient();
