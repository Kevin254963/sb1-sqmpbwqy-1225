import { useState, useEffect } from 'react';
import { supabase, supabaseQuery } from '../lib/supabase';
import type { ShippingSupplier } from '../types/shipping';

export function useShippingSupplier() {
  const [supplier, setSupplier] = useState<ShippingSupplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupplier = async () => {
    try {
      const { data: { user } } = await supabaseQuery(() => 
        supabase.auth.getUser()
      );

      if (!user) {
        setSupplier(null);
        return;
      }

      const { data, error: fetchError } = await supabaseQuery(() =>
        supabase
          .from('shipping_suppliers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      );

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // If no supplier found or profile is incomplete
      if (!data || 
          data.company_name === 'Pending Setup' || 
          data.contact_name === 'Pending Setup' || 
          data.phone === 'Pending' || 
          data.address === 'Pending') {
        setError('Shipping supplier profile not found. Please complete registration.');
        return;
      }

      setSupplier(data);
    } catch (err) {
      console.error('Error loading shipping supplier:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shipping supplier profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupplier();
  }, []);

  return { supplier, loading, error, reloadSupplier: loadSupplier };
}