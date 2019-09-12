import { OrderLine } from './order-line';

export interface Order {
  orderId?: string;
  roomId?: string;
  roomNumber?: number;
  checkInTime?: number;
  checkOutTime?: number;
  orderLineIds?: string[];
  orderLines?: OrderLine[];
  customerId?: string;
  total?: number;
  createdAt?: number;
  roomRate?: number;
  totalService?: number;
  charges?: number;
  discount?: number;
  note?: string;
}
