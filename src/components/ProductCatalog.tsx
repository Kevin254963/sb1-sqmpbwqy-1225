import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navigation from './Navigation';
import ProductTable from './ProductTable';
import LoadingSpinner from './LoadingSpinner';
import type { Product } from '../types/product';

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          dimensions,
          "hsCode",
          price,
          stock
        `)
        .eq('active', true)
        .gt('stock', 0);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-red-50 p-4 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <ProductTable products={products} />
    </div>
  );
}