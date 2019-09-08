export interface Order {
  checkInTime?: number;
  checkOutTime?: number;
  orderLineIds?: string[];
  customerId?: string;
  total?: number;
  createdAt?: number;
}
