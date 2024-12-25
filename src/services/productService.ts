import { supabase } from '../lib/supabase';
import { validateProductData } from '../utils/validation';
import { formatDimensions } from '../utils/dimensions';
import type { ProductFormData } from '../types/product';

export async function addProduct(supplierId: string, productData: ProductFormData) {
  const validationError = validateProductData(productData);
  if (validationError) throw new Error(validationError);

  const { error } = await supabase
    .from('products')
    .insert([{
      supplier_id: supplierId,
      name: productData.name.trim(),
      description: productData.description.trim(),
      dimensions: formatDimensions(productData.dimensions),
      "hsCode": productData.hsCode,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      active: true
    }]);

  if (error) throw error;
}

export async function updateProduct(productId: string, productData: ProductFormData) {
  const validationError = validateProductData(productData);
  if (validationError) throw new Error(validationError);

  const { error } = await supabase
    .from('products')
    .update({
      name: productData.name.trim(),
      description: productData.description.trim(),
      dimensions: formatDimensions(productData.dimensions),
      "hsCode": productData.hsCode,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
    })
    .eq('id', productId);

  if (error) throw error;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .update({ active: false })
    .eq('id', productId);

  if (error) throw error;
}

export async function toggleProductStatus(productId: string, active: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ active })
    .eq('id', productId);

  if (error) throw error;
}