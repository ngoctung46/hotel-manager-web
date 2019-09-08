import { Product } from './product';

export interface OrderLine {
  id?: string;
  orderId: string;
  customerId?: string;
  productId?: string;
  product: Product;
  quantity: number;
  total: number;
  createdAt?: number;
}
