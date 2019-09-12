import { RoomType, RoomStatus } from '../enums';

export interface Room {
  id?: string;
  number?: number;
  rate?: number;
  type?: RoomType;
  status?: RoomStatus;
  orderId?: string;
  customerId?: string;
  occupied: boolean;
}
