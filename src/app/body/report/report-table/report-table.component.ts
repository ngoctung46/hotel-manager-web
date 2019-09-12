import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Room } from 'src/app/models/room';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {
  @Input() orders: Order[] = [];
  room: Room;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    for (const order of this.orders) {
      this.fs.getOrderLinesByOrderId(order.orderId).subscribe(ols => (order.orderLines = ols));
    }
  }
}
