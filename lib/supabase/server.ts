import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock client for development without Supabase
const mockClient = {
  auth: {
    getUser: async () => ({ 
      data: { 
        user: { 
          id: 'dev-user-id',
          email: 'dev@example.com',
          user_metadata: { name: 'Developer' }
        } 
      }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
    exchangeCodeForSession: async () => ({ error: null }),
  },
};

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseKey) {
    return mockClient as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
