import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Steel Pipe',
    description: 'High-quality steel pipe for industrial use',
    dimensions: '2" x 20ft',
    hsCode: '7304.31',
    price: 299.99,
    stock: 50
  },
  {
    id: '2',
    name: 'Copper Tubing',
    description: 'Professional grade copper tubing',
    dimensions: '1/2" x 10ft',
    hsCode: '7411.10',
    price: 89.99,
    stock: 150
  },
  {
    id: '3',
    name: 'Aluminum Sheet',
    description: 'Industrial aluminum sheet metal',
    dimensions: '4ft x 8ft x 1/8"',
    hsCode: '7606.11',
    price: 199.99,
    stock: 75
  },
  {
    id: '4',
    name: 'Stainless Steel Plate',
    description: 'Heavy-duty stainless steel plate',
    dimensions: '3ft x 6ft x 1/4"',
    hsCode: '7219.31',
    price: 449.99,
    stock: 30
  },
  {
    id: '5',
    name: 'Brass Rod',
    description: 'Solid brass rod for various applications',
    dimensions: '1" x 3ft',
    hsCode: '7407.21',
    price: 79.99,
    stock: 100
  }
];