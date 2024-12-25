import React from 'react';
import type { Product } from '../types/product';

interface ProductTableRowProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: string) => void;
  onAddToCart: () => void;
}

export default function ProductTableRow({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart 
}: ProductTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.description}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{product.dimensions}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{product.hsCode}</td>
      <td className="px-6 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4">
        <input
          type="number"
          min="0"
          max={product.stock}
          value={quantity || ''}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </td>
      <td className="px-6 py-4">
        <button
          onClick={onAddToCart}
          disabled={!quantity}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </td>
    </tr>
  );
}