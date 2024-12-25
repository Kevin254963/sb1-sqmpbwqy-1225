import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('authorizations')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.role === 'admin');
    } catch (err) {
      console.error('Admin auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading, error };
}