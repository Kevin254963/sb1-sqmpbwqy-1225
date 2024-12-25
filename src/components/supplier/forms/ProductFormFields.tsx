import React from 'react';
import { formatHsCode } from '../../../utils/formatters';
import type { ProductFormData } from '../../../types/product';

interface ProductFormFieldProps {
  label: string;
  name: keyof ProductFormData;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  step?: string;
  placeholder?: string;
  rows?: number;
}

function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text',
  min,
  step,
  placeholder,
  rows
}: ProductFormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    if (name === 'hsCode') {
      newValue = formatHsCode(newValue);
    }
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={handleChange}
          rows={rows}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          min={min}
          step={step}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default FormField;