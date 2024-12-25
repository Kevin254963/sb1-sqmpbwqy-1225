import React, { useEffect, useState } from 'react';
import { useShipping } from '../hooks/useShipping';
import type { Product } from '../types/product';

interface ShippingCalculatorProps {
  products: Product[];
  zipCode?: string;
}

export default function ShippingCalculator({ products, zipCode }: ShippingCalculatorProps) {
  const { fee, loading, error } = useShipping(zipCode || '', products);

  if (!zipCode) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Shipping to {zipCode}:
        </span>
        {loading ? (
          <span className="text-sm text-gray-500">Calculating...</span>
        ) : error ? (
          <span className="text-sm text-red-600">{error}</span>
        ) : fee !== null ? (
          <span className="font-medium">${fee.toFixed(2)}</span>
        ) : null}
      </div>
    </div>
  );
}