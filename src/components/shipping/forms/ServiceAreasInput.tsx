import React from 'react';

interface ServiceAreasInputProps {
  areas: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function ServiceAreasInput({ 
  areas, 
  onChange, 
  onAdd, 
  onRemove 
}: ServiceAreasInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Service Areas
      </label>
      {areas.map((area, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={area}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder="Enter ZIP code range (e.g., 90001-90999)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {areas.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-2 text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
      >
        + Add Service Area
      </button>
    </div>
  );
}