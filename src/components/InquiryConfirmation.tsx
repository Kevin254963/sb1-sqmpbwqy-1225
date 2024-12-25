import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Truck, Calendar, Globe } from 'lucide-react';
import type { CartItem } from '../types/product';
import OrderSummary from './OrderSummary';

interface LocationState {
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    zipCode: string;
    message?: string;
  };
}

export default function InquiryConfirmation() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state?.items) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Inquiry Received Successfully
          </h1>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <OrderSummary 
              items={state.items}
              productTotal={state.total}
              zipCode={state.customerInfo.zipCode}
            />
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Processing Time</h3>
                <p className="text-sm text-gray-600">
                  We'll review your inquiry within 24-48 business hours
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Shipping from Taiwan</h3>
                <p className="text-sm text-gray-600">
                  Estimated delivery: 14-21 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}