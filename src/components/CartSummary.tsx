import React from 'react';
import type { CartItem } from '../types/product';

interface CartSummaryProps {
  cart: CartItem[];
  total: number;
}

export default function CartSummary({ cart, total }: CartSummaryProps) {
  return (
    <div className="space-y-4 mb-6">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
          </div>
          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Subtotal:</div>
          <div className="font-semibold">${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}