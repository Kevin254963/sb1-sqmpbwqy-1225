import { ProductFormData } from '../types/product';

export function validateHsCode(code: string): boolean {
  return /^[0-9]{4}\.[0-9]{2}$/.test(code);
}

export function validateProductData(data: ProductFormData): string | null {
  if (!data.name.trim()) return 'Product name is required';
  if (!data.description.trim()) return 'Description is required';
  if (!data.dimensions.trim()) return 'Dimensions are required';
  if (!validateHsCode(data.hsCode)) return 'Invalid HS code format (must be XXXX.XX)';
  if (parseFloat(data.price) <= 0) return 'Price must be greater than 0';
  if (parseInt(data.stock) < 0) return 'Stock cannot be negative';
  return null;
}