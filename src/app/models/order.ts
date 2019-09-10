import { OrderLine } from './order-line';

export interface Order {
  roomId?: string;
  checkInTime?: number;
  checkOutTime?: number;
  orderLineIds?: string[];
  customerId?: string;
  total?: number;
  createdAt?: number;
}
