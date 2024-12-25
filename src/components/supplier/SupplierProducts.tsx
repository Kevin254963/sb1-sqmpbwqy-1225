import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSupplier } from '../../hooks/useSupplier';
import { useProducts } from '../../hooks/useProducts';
import { deleteProduct } from '../../services/productService';
import ProductsTable from './tables/ProductsTable';
import AddProductModal from './AddProductModal';
import LoadingSpinner from '../LoadingSpinner';
import type { Product } from '../../types/product';

export default function SupplierProducts() {
  const { supplier } = useSupplier();
  const { products, loading, error, reloadProducts } = useProducts(supplier?.id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!supplier?.verified) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800">Verification Required</h3>
        <p className="mt-2 text-sm text-yellow-700">
          Your account is pending verification. You'll be able to manage products once your account is verified.
          This usually takes 1-2 business days.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product.id);
        reloadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddProductModal 
        isOpen={showAddModal}
        onClose={handleModalClose}
        onProductAdded={reloadProducts}
        editingProduct={editingProduct}
      />
    </div>
  );
}