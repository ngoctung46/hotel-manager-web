import { Pipe, PipeTransform } from '@angular/core';
import { RoomStatus } from '../enums';

@Pipe({
  name: 'roomStatus'
})
export class RoomStatusPipe implements PipeTransform {
  transform(status: RoomStatus, ...args: any[]): string {
    switch (status) {
      case RoomStatus.CustomerOut:
        return 'Ra Ngoài';
      case RoomStatus.NeedCleaning:
        return 'Cần dọn phòng';
      case RoomStatus.Clean:
        return 'Sạch';
      default:
        return '';
    }
  }
}
