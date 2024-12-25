import { useState, useEffect } from 'react';
import { supabase, supabaseQuery } from '../lib/supabase';
import type { Profile } from '../types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabaseQuery(() => 
        supabase.auth.getUser()
      );

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error: fetchError } = await supabaseQuery(() =>
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
      );

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create new profile if none exists
        const { data: newProfile, error: createError } = await supabaseQuery(() =>
          supabase
            .from('profiles')
            .insert([{ 
              id: user.id, 
              email: user.email,
              created_at: new Date().toISOString()
            }])
            .select()
            .single()
        );

        if (createError) throw createError;
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    reloadProfile: loadProfile
  };
}