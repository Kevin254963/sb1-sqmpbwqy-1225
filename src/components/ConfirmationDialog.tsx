import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { CartItem } from '../types/product';
import OrderSummary from './OrderSummary';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerInfo: {
    name: string;
    email: string;
    zipCode: string;
    message?: string;
  };
  items: CartItem[];
  total: number;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  customerInfo,
  items,
  total
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Confirm Your Inquiry</h2>
          
          <div className="space-y-6 mb-6">
            <div>
              <h3 className="font-medium text-sm text-gray-700">Contact Information</h3>
              <p className="text-sm">Name: {customerInfo.name}</p>
              <p className="text-sm">Email: {customerInfo.email}</p>
              <p className="text-sm">ZIP Code: {customerInfo.zipCode}</p>
              {customerInfo.message && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Additional Notes:</p>
                  <p className="text-sm text-gray-600">{customerInfo.message}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Order Summary</h3>
              <OrderSummary 
                items={items}
                productTotal={total}
                zipCode={customerInfo.zipCode}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirm & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}