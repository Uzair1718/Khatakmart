import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: ImagePlaceholder;
  category: string;
  expiryDate?: string;
  stock: number;
  isFeatured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  image: ImagePlaceholder;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: ImagePlaceholder;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'COD' | 'Card';
  paymentStatus: 'Pending Payment - COD' | 'Paid' | 'Pending Verification';
  orderStatus: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  paymentProofUrl?: string;
};
