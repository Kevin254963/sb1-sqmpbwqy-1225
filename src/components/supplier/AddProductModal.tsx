import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSupplier } from '../../hooks/useSupplier';
import { addProduct, updateProduct } from '../../services/productService';
import { parseDimensions } from '../../utils/dimensions';
import ProductForm from './forms/ProductForm';
import type { Product, ProductFormData } from '../../types/product';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  editingProduct?: Product | null;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  dimensions: {
    length: '',
    width: '',
    height: ''
  },
  hsCode: '',
  price: '',
  stock: ''
};

export default function AddProductModal({ 
  isOpen, 
  onClose, 
  onProductAdded,
  editingProduct 
}: AddProductModalProps) {
  const { supplier } = useSupplier();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  useEffect(() => {
    if (editingProduct) {
      const dimensions = parseDimensions(editingProduct.dimensions);
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        dimensions,
        hsCode: editingProduct.hsCode,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString()
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else if (supplier) {
        await addProduct(supplier.id, formData);
      }

      onProductAdded();
      onClose();
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <ProductForm formData={formData} onChange={handleChange} />

          {error && (
            <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}