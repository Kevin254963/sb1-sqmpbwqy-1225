import { useState, useEffect } from 'react';
import { supabase, supabaseQuery } from '../lib/supabase';
import type { Product } from '../types/product';

export function useProducts(supplierId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          dimensions,
          "hsCode",
          price,
          stock,
          active
        `);

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      } else {
        query = query.eq('active', true).gt('stock', 0);
      }

      const { data, error: queryError } = await supabaseQuery(() => 
        query.order('created_at', { ascending: false })
      );

      if (queryError) throw queryError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [supplierId]);

  return { products, loading, error, reloadProducts: loadProducts };
}