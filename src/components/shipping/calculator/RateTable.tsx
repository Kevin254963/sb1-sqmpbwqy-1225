import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import EditableCell from './EditableCell';
import type { ShippingRate } from '../../../types/shipping';

interface RateTableProps {
  rates: ShippingRate[];
  onUpdate: (id: string, updates: Partial<ShippingRate>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RateTable({ rates, onUpdate, onDelete }: RateTableProps) {
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);

  const handleCellUpdate = async (id: string, field: string, value: string) => {
    await onUpdate(id, { [field]: value });
    setEditingCell(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ZIP Start</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ZIP End</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Rate ($)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per KG Rate ($)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimension Factor</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Charge ($)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rates.map((rate) => (
            <tr key={rate.id}>
              <EditableCell
                value={rate.zone_name}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'zone_name'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'zone_name' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'zone_name', value)}
              />
              <EditableCell
                value={rate.zip_start}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'zip_start'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'zip_start' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'zip_start', value)}
              />
              <EditableCell
                value={rate.zip_end}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'zip_end'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'zip_end' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'zip_end', value)}
              />
              <EditableCell
                value={rate.base_rate.toString()}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'base_rate'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'base_rate' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'base_rate', value)}
                type="number"
              />
              <EditableCell
                value={rate.per_kg_rate.toString()}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'per_kg_rate'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'per_kg_rate' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'per_kg_rate', value)}
                type="number"
              />
              <EditableCell
                value={rate.dimension_factor.toString()}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'dimension_factor'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'dimension_factor' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'dimension_factor', value)}
                type="number"
              />
              <EditableCell
                value={rate.min_charge.toString()}
                isEditing={editingCell?.id === rate.id && editingCell?.field === 'min_charge'}
                onEdit={() => setEditingCell({ id: rate.id, field: 'min_charge' })}
                onUpdate={(value) => handleCellUpdate(rate.id, 'min_charge', value)}
                type="number"
              />
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(rate.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}