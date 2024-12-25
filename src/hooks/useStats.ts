import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AdminStats } from '../types/admin';

export function useStats() {
  const [stats, setStats] = useState<AdminStats>({
    pendingVerifications: 0,
    activeUsers: 0,
    verifiedSuppliers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        { count: pendingVerifications },
        { count: activeUsers },
        { count: verifiedSuppliers }
      ] = await Promise.all([
        supabase
          .from('verification_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('suppliers')
          .select('id', { count: 'exact', head: true })
          .eq('verified', true)
      ]);

      setStats({
        pendingVerifications: pendingVerifications || 0,
        activeUsers: activeUsers || 0,
        verifiedSuppliers: verifiedSuppliers || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error };
}