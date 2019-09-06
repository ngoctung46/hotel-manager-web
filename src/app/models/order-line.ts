import { Product } from './product';

export interface OrderLine {
  orderId: string;
  customerId?: string;
  productId?: string;
  product: Product;
  quantity: number;
  total: number;
}
