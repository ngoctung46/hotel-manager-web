import { RoomType } from '../enums';

export interface Booking {
  bookingId?: string;
  name?: string;
  phone?: string;
  type?: RoomType;
  date?: any;
  time?: any;
  createdAt?: any;
  updatedAt?: any;
  done?: boolean;
}
