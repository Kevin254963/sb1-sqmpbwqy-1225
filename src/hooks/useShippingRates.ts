import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ShippingRate } from '../types/shipping';

export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_rates')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setRates(data || []);
    } catch (err) {
      console.error('Error loading shipping rates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shipping rates');
    } finally {
      setLoading(false);
    }
  };

  const addRate = async (rate: Omit<ShippingRate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error: insertError } = await supabase
        .from('shipping_rates')
        .insert([rate]);

      if (insertError) throw insertError;
      await loadRates();
    } catch (err) {
      console.error('Error adding shipping rate:', err);
      throw err;
    }
  };

  const updateRate = async (id: string, updates: Partial<ShippingRate>) => {
    try {
      const { error: updateError } = await supabase
        .from('shipping_rates')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await loadRates();
    } catch (err) {
      console.error('Error updating shipping rate:', err);
      throw err;
    }
  };

  const deleteRate = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('shipping_rates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await loadRates();
    } catch (err) {
      console.error('Error deleting shipping rate:', err);
      throw err;
    }
  };

  return {
    rates,
    loading,
    error,
    addRate,
    updateRate,
    deleteRate
  };
}