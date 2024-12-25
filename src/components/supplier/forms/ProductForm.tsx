import React from 'react';
import FormField from './ProductFormFields';
import DimensionsInput from './DimensionsInput';
import type { ProductFormData, Dimensions } from '../../../types/product';

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: any) => void;
}

export default function ProductForm({ formData, onChange }: ProductFormProps) {
  const handleDimensionsChange = (dimensions: Dimensions) => {
    onChange('dimensions', dimensions);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={(value) => onChange('name', value)}
      />

      <FormField
        label="Description"
        name="description"
        value={formData.description}
        onChange={(value) => onChange('description', value)}
        rows={3}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
        <DimensionsInput
          length={formData.dimensions.length}
          width={formData.dimensions.width}
          height={formData.dimensions.height}
          onChange={handleDimensionsChange}
        />
      </div>

      <FormField
        label="HS Code"
        name="hsCode"
        value={formData.hsCode}
        onChange={(value) => onChange('hsCode', value)}
        placeholder="e.g., 7304.31"
      />

      <FormField
        label="Price (USD)"
        name="price"
        value={formData.price}
        onChange={(value) => onChange('price', value)}
        type="number"
        min="0"
        step="0.01"
      />

      <FormField
        label="Stock"
        name="stock"
        value={formData.stock}
        onChange={(value) => onChange('stock', value)}
        type="number"
        min="0"
      />
    </div>
  );
}