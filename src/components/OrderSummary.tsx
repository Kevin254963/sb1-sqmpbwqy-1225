import React from 'react';
import type { CartItem } from '../types/product';
import { useShipping } from '../hooks/useShipping';
import ShippingCalculator from './ShippingCalculator';
import FAQ from './FAQ';

interface OrderSummaryProps {
  items: CartItem[];
  productTotal: number;
  zipCode?: string;
}

export default function OrderSummary({ items, productTotal, zipCode }: OrderSummaryProps) {
  const { fee } = useShipping(zipCode || '', items);
  const total = productTotal + (fee || 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Product Total:</span>
          <span className="font-medium">${productTotal.toFixed(2)}</span>
        </div>
        
        {zipCode && (
          <ShippingCalculator products={items} zipCode={zipCode} />
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-semibold">Total (incl. shipping & customs):</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>

      {zipCode && fee !== null && <FAQ />}
    </div>
  );
}