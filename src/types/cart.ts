import type { Product, CartItem } from './product';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  cartTotal: number;
  checkout: () => Promise<boolean>;
}