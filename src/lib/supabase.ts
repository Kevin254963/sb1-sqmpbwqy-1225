import { createClient } from '@supabase/supabase-js';
import { retryWithBackoff } from '../utils/retry';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Wrap Supabase queries with retry logic
export async function supabaseQuery<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  return retryWithBackoff(queryFn, maxRetries);
}