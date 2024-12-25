import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupplier } from '../../hooks/useSupplier';
import LoadingSpinner from '../LoadingSpinner';
import SupplierNavigation from './SupplierNavigation';
import SupplierProducts from './SupplierProducts';

export default function SupplierDashboard() {
  const { supplier, loading, error } = useSupplier();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !supplier) {
    return <Navigate to="/supplier/login" replace />;
  }

  return (
    <div>
      <SupplierNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {supplier.company_name}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your products and view inquiries</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            supplier.verified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {supplier.verified ? 'Verified Supplier' : 'Verification Pending'}
          </div>
        </div>
        <SupplierProducts />
      </div>
    </div>
  );
}