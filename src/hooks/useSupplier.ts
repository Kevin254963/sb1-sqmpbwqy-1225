import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Supplier } from '../types/supplier';

export function useSupplier() {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupplier();
  }, []);

  const loadSupplier = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSupplier(null);
        return;
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSupplier(data);
    } catch (err) {
      console.error('Error loading supplier:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { supplier, loading, error };
}