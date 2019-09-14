import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Room } from 'src/app/models/room';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Total } from 'src/app/models/total';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Input() total: Total = {};
  room: Room;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    for (const order of this.orders) {
      this.fs.getOrderLinesByOrderId(order.orderId).subscribe(ols => (order.orderLines = ols));
    }
  }
}
