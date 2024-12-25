import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import RateTable from './RateTable';
import { useShippingRates } from '../../../hooks/useShippingRates';
import type { ShippingRate } from '../../../types/shipping';

export default function ShippingCalculator() {
  const { rates, loading, error, addRate, updateRate, deleteRate } = useShippingRates();
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return <div className="p-4">Loading rates...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Shipping Rates</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rate
        </button>
      </div>

      <RateTable
        rates={rates}
        onUpdate={updateRate}
        onDelete={deleteRate}
      />
    </div>
  );
}