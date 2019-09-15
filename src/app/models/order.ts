import { OrderLine } from './order-line';
import { Observable } from 'rxjs';

export interface Order {
  orderId?: string;
  roomId?: string;
  roomNumber?: number;
  checkInTime?: number;
  checkOutTime?: number;
  orderLineIds?: string[];
  orderLines?: Observable<OrderLine[]>;
  customerId?: string;
  total?: number;
  createdAt?: number;
  roomRate?: number;
  totalService?: number;
  charges?: number;
  discount?: number;
  note?: string;
}
