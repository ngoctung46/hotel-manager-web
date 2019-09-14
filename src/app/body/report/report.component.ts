import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Total } from 'src/app/models/total';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  bsRangeValue: Date[];
  orders: Order[] = [];
  total: Total = {};
  constructor(private localeService: BsLocaleService, private fs: FirebaseService) {}

  ngOnInit() {
    this.localeService.use('vi');
    this.bsRangeValue = [new Date(), new Date()];
  }

  onValueChange(dateRange: Date[]) {
    if (dateRange == null || dateRange.length !== 2) {
      return;
    }
    const start = dateRange[0];
    const end = dateRange[1];
    this.getOrders(start, end);
  }

  private getOrders(start: Date, end: Date) {
    this.fs.getOrdersByDateRange(start, end).subscribe(orders => {
      this.orders = orders;
      this.total.all = this.orders.reduce((sum, current) => sum + current.total, 0);
      this.total.services = this.orders.reduce((sum, current) => sum + current.totalService, 0);
      this.total.charges = this.orders.reduce((sum, current) => sum + current.charges, 0);
      this.total.discounts = this.orders.reduce((sum, current) => sum + current.discount, 0);
      this.total.rates = this.orders.reduce((sum, current) => sum + current.roomRate, 0);
    });
  }
}
