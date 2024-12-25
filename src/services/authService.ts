import { supabase } from '../lib/supabase';
import type { AuthResponse } from '@supabase/supabase-js';

export async function checkExistingUser(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  
  return !!data;
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const exists = await checkExistingUser(email);
  if (exists) {
    throw { code: 'user_already_exists', message: 'An account with this email already exists' };
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'user' }
    }
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}