import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { formatZipCode } from '../utils/formatters';
import type { CartItem } from '../types/product';
import ConfirmationDialog from './ConfirmationDialog';
import OrderSummary from './OrderSummary';

interface InquiryFormProps {
  cart: CartItem[];
  cartTotal: number;
  onInquirySent: () => void;
}

export default function InquiryForm({ cart, cartTotal, onInquirySent }: InquiryFormProps) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zipCode: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || '',
        email: profile.email || '',
        zipCode: profile.zip_code || ''
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSend = async () => {
    setSending(true);

    try {
      const { error } = await supabase.from('inquiries').insert([{
        user_id: profile?.id,
        items: cart,
        total: cartTotal,
        customer_name: formData.name,
        customer_email: formData.email,
        message: formData.message,
        status: 'pending'
      }]);

      if (error) throw error;
      
      onInquirySent();
      
      navigate('/inquiry-confirmation', {
        state: {
          items: cart,
          total: cartTotal,
          customerInfo: formData
        }
      });
    } catch (error) {
      console.error('Error sending inquiry:', error);
    } finally {
      setSending(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            required
            maxLength={5}
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              zipCode: formatZipCode(e.target.value)
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter ZIP code"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Any specific requirements or questions?"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <OrderSummary 
            items={cart}
            productTotal={cartTotal}
            zipCode={formData.zipCode.length === 5 ? formData.zipCode : undefined}
          />
        </div>

        <button
          type="submit"
          disabled={sending || cart.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {sending ? 'Sending...' : 'Review Inquiry'}
        </button>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSend}
        customerInfo={formData}
        items={cart}
        total={cartTotal}
      />
    </>
  );
}