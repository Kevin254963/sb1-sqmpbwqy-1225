export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  dimensions: string;
  hsCode: string;
  price: number;
  stock: number;
  active?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  dimensions: Dimensions;
  hsCode: string;
  price: string;
  stock: string;
}