import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { TimeDiff } from 'src/app/models/time-diff';
import { Room } from 'src/app/models/room';
import { RoomType } from 'src/app/enums';
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  orderLines$: Observable<OrderLine[]>;
  order$: Observable<Order>;
  room: any = {};
  id: string;
  total: number;
  checkInTime: string;
  timeDiff: TimeDiff;
  now: string;
  constructor(private fs: FirebaseService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.now = new Date().toLocaleString('vi');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.order$ = this.fs.getOrderById(this.id);
      this.orderLines$ = this.fs.getOrderLinesByOrderId(this.id);
      this.orderLines$
        .pipe(map(ols => ols.reduce((sum, current) => sum + current.total, 0)))
        .subscribe(total => (this.total = total));
    }
    this.order$.subscribe(order => {
      this.checkInTime = new Date(order.checkInTime).toLocaleString('vi');
      this.timeDiff = this.getTimeDiff(order);
      this.fs.getRoomById(order.roomId).subscribe(room => {
        this.room = room;
      });
      this.getRate();
    });
  }

  getTimeDiff(order: Order): TimeDiff {
    const now = new Date().getTime();
    const timeDiff = now - order.checkInTime;
    const seconds = Math.trunc(timeDiff / 1000);
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);
    const days = Math.trunc(hours / 24);
    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      totalHours: hours
    };
  }

  getRate(): number {
    if (this.timeDiff.totalHours > 5) {
      const rate = this.getDailyRate();
    } else {
      this.getHourlyRate();
    }
    return 0;
  }
  getHourlyRate() {
    const singleRoom = this.room.type === RoomType.Single;
    const overTime = this.timeDiff.minutes > 30;
    switch (this.timeDiff.totalHours) {
      case 0:
        if (!overTime) {
          return singleRoom ? 100_000 : 150_000;
        }
      case 1:
        if (!overTime) {
          return singleRoom ? 150_000 : 190_000;
        }
      case 2:
        if (!overTime) {
          return singleRoom ? 170_000 : 210_000;
        }
      case 3:
        if (!overTime) {
          return singleRoom ? 190_000 : 230_000;
        }
      default:
        return singleRoom ? 210_000 : 250_000;
    }
  }
  getDailyRate() {}
}
