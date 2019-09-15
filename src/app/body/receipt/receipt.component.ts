import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { TimeDiff } from 'src/app/models/time-diff';
import { Room } from 'src/app/models/room';
import { RoomType, RoomStatus } from 'src/app/enums';
import { Location } from '@angular/common';
const RATES: Rate[] = [
  { single: 100_000, double: 150_000 },
  { single: 150_000, double: 170_000 },
  { single: 170_000, double: 190_000 },
  { single: 190_000, double: 210_000 },
  { single: 210_000, double: 230_000 }
];
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
  checkInTime: Date;
  timeDiff: TimeDiff;
  now: Date;
  rate: number;
  charge = 0;
  discount = 0;
  note = '';
  order: Order;
  constructor(
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.now = new Date();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.order$ = this.fs.getOrderById(this.id);
      this.orderLines$ = this.fs.getOrderLinesByOrderId(this.id);
      // this.orderLines$
      //   .pipe(map(ols => ols.reduce((sum, current) => sum + current.total, 0)))
      //   .subscribe(total => (this.total = total));
    }
    this.order$.subscribe(order => {
      this.checkInTime = new Date(order.checkInTime);
      this.timeDiff = this.getTimeDiff(order.checkInTime);
      this.fs.getRoomById(order.roomId).subscribe(room => {
        this.room = room;
        this.rate = this.getRate();
      });
      this.order = order;
    });
  }

  getTimeDiff(checkInTime: number): TimeDiff {
    const now = new Date().getTime();
    const timeDiff = now - checkInTime;
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
    if (this.timeDiff.hours <= 5) {
      return this.getHourlyRate(this.timeDiff);
    }
    return this.getDailyRate();
  }
  getHourlyRate(timeDiff: TimeDiff): number {
    let index = timeDiff.hours === 0 ? 0 : timeDiff.hours - 1;
    if (timeDiff.hours >= 5) {
      return this.room.rate;
    }
    if (timeDiff.minutes > 30 && timeDiff.hours > 0) {
      index++;
    }
    return this.room.type === RoomType.Single ? RATES[index].single : RATES[index].double;
  }
  getDailyRate(): number {
    const year = this.checkInTime.getFullYear();
    const month = this.checkInTime.getMonth();
    let date = this.checkInTime.getDate();
    const hour = this.checkInTime.getHours();
    if (hour >= 0 && hour <= 6) {
      date--;
    }
    const start = new Date(year, month, date, 12, 0, 0).getTime();
    const diff = this.getTimeDiff(start);
    const extra = this.getHourlyRate(diff);
    return diff.days * this.room.rate + extra;
  }
  getTotal(total: number) {
    this.total = total;
  }
  submit() {
    this.updateOrder();
    this.updateRoom();
    this.location.back();
  }
  cancel() {
    this.location.back();
  }
  updateOrder() {
    const total = this.total + this.rate + this.charge - this.discount;
    this.order.totalService = this.total;
    this.order.roomRate = this.rate;
    this.order.charges = this.charge;
    this.order.discount = this.discount;
    this.order.note = this.note;
    this.order.total = total;
    this.order.checkOutTime = new Date().getTime();
    this.fs.updateOrder(this.order, this.id);
  }
  updateRoom() {
    const room: Room = {
      occupied: false,
      status: RoomStatus.NeedCleaning,
      orderId: null,
      customerId: null
    };
    this.fs.updateRoom(this.order.roomId, room);
  }
}

interface Rate {
  single: number;
  double: number;
}
