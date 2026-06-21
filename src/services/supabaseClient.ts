import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Returns true if both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * When false, the app falls back to localStorage mode.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') return false;
  
  const lowerUrl = supabaseUrl.toLowerCase();
  const placeholders = ['tu-url', 'your-url', 'your-project', 'your-anon-key', 'tu-anon-key', '[your-', 'placeholder'];
  
  for (const placeholder of placeholders) {
    if (lowerUrl.includes(placeholder) || supabaseAnonKey.toLowerCase().includes(placeholder)) {
      return false;
    }
  }

  try {
    new URL(supabaseUrl);
  } catch {
    return false;
  }

  return true;
};

/**
 * The Supabase client instance.
 * Only created if env vars are present; otherwise null.
 * Components should check isSupabaseConfigured() before using this.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Returns the configured admin email from env, or null.
 */
export const getAdminEmail = (): string | null => {
  const email = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
  return email && email.length > 0 ? email : null;
};
