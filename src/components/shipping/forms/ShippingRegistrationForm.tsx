import React from 'react';
import { useShippingRegistration } from '../../../hooks/useShippingRegistration';
import RegistrationFields from './RegistrationFields';

interface ShippingRegistrationFormProps {
  onSuccess: () => void;
}

export default function ShippingRegistrationForm({ onSuccess }: ShippingRegistrationFormProps) {
  const {
    formData,
    loading,
    error,
    handleSubmit,
    handleChange
  } = useShippingRegistration(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RegistrationFields
        data={formData}
        onChange={handleChange}
      />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}