import { Pipe, PipeTransform } from '@angular/core';
import { RoomType, ProductType } from '../enums';

@Pipe({
  name: 'productType'
})
export class ProductTypePipe implements PipeTransform {
  transform(type: ProductType, ...args: any[]): string {
    switch (type) {
      case ProductType.ExtraCharge:
        return 'Phụ Thu';
      case ProductType.Item:
        return 'Hàng hóa';
      case ProductType.Payment:
        return 'Thanh toán';
      case ProductType.RoomRate:
        return 'Giá phòng';
      case ProductType.Service:
        return 'Dịch vụ';
    }
  }
}
