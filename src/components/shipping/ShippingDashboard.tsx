import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useShippingSupplier } from '../../hooks/useShippingSupplier';
import ShippingNavigation from './ShippingNavigation';
import LoadingSpinner from '../LoadingSpinner';
import ShippingCalculator from './calculator/ShippingCalculator';

export default function ShippingDashboard() {
  const { supplier, loading, error } = useShippingSupplier();
  const location = useLocation();
  const message = location.state?.message;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to profile completion if profile is incomplete
  if (error?.includes('profile not found')) {
    return <Navigate to="/shipping/complete-profile" replace />;
  }

  // Handle other errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            {error}
            {error.includes('profile not found') && (
              <div className="mt-4">
                <Link 
                  to="/shipping/complete-profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Complete Registration
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!supplier?.verified) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          {message && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg text-blue-700">
              {message}
            </div>
          )}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800">Verification Required</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Your account is pending verification. You'll be able to manage shipping rates once your account is verified.
              This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ShippingNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {supplier.company_name}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your shipping rates and zones</p>
        </div>
        <ShippingCalculator />
      </div>
    </div>
  );
}