import { createBrowserClient } from '@supabase/ssr';

// Mock client for development without Supabase
const mockClient = {
  auth: {
    signInWithPassword: async () => ({ error: { message: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env' } }),
    signUp: async () => ({ error: { message: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env' } }),
    resetPasswordForEmail: async () => ({ error: { message: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env' } }),
    signOut: async () => ({ error: null }),
  },
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseKey) {
    return mockClient as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
