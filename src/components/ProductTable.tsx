import React, { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';
import { useCart } from '../hooks/useCart';
import InquiryForm from './InquiryForm';
import ProductTableHeader from './ProductTableHeader';
import ProductTableRow from './ProductTableRow';
import CartSummary from './CartSummary';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { cart, addToCart, cartTotal, clearCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = products.filter(product =>
    Object.values(product).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, Math.min(quantity, 
        products.find(p => p.id === productId)?.stock || 0))
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity === 0) return;

    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const handleInquirySent = () => {
    clearCart();
    setQuantities({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-gray-600" size={24} />
          <span className="font-semibold">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <ProductTableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                quantity={quantities[product.id] || 0}
                onQuantityChange={(value) => handleQuantityChange(product.id, value)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {cart.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <CartSummary cart={cart} total={cartTotal} />
          <InquiryForm 
            cart={cart}
            cartTotal={cartTotal}
            onInquirySent={handleInquirySent}
          />
        </div>
      )}
    </div>
  );
}