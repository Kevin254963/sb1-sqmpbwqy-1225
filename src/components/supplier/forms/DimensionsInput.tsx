import React from 'react';

interface DimensionsInputProps {
  length: string;
  width: string;
  height: string;
  onChange: (dimensions: { length: string; width: string; height: string }) => void;
}

export default function DimensionsInput({ length, width, height, onChange }: DimensionsInputProps) {
  const handleChange = (field: 'length' | 'width' | 'height', value: string) => {
    // Allow numbers and one decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    const formattedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : cleanValue;

    onChange({
      length: field === 'length' ? formattedValue : length,
      width: field === 'width' ? formattedValue : width,
      height: field === 'height' ? formattedValue : height
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
        <input
          type="text"
          value={length}
          onChange={(e) => handleChange('length', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="0.0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
        <input
          type="text"
          value={width}
          onChange={(e) => handleChange('width', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="0.0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
        <input
          type="text"
          value={height}
          onChange={(e) => handleChange('height', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="0.0"
        />
      </div>
    </div>
  );
}