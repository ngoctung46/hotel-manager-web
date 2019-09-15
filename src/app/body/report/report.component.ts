import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { Observable, pipe } from 'rxjs';
import { Order } from 'src/app/models/order';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Total } from 'src/app/models/total';
import { Expense } from 'src/app/models/expense';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  bsRangeValue: Date[];
  orders: Order[] = [];
  total: Total = {};
  totalExpense = 0;
  start: Date;
  end: Date;
  constructor(private localeService: BsLocaleService, private fs: FirebaseService) {}

  ngOnInit() {
    this.localeService.use('vi');
    this.bsRangeValue = [new Date(), new Date()];
  }

  onValueChange(dateRange: Date[]) {
    if (dateRange == null || dateRange.length !== 2) {
      return;
    }
    this.start = dateRange[0];
    this.end = dateRange[1];
    this.getOrders(this.start, this.end);
    this.getTotalExpense(this.start, this.end);
  }

  private getOrders(start: Date, end: Date) {
    this.fs.getOrdersByDateRange(start, end).subscribe(orders => {
      this.orders = orders.sort((x, y) => x.roomNumber - y.roomNumber);
      this.total.all = this.orders.reduce((sum, current) => sum + current.total, 0);
      this.total.services = this.orders.reduce((sum, current) => sum + current.totalService, 0);
      this.total.charges = this.orders.reduce((sum, current) => sum + current.charges, 0);
      this.total.discounts = this.orders.reduce((sum, current) => sum + current.discount, 0);
      this.total.rates = this.orders.reduce((sum, current) => sum + current.roomRate, 0);
    });
  }

  private getTotalExpense(start: Date, end: Date) {
    this.fs.getExpensesByDateRange(start, end).subscribe(expenses => {
      this.totalExpense = expenses.reduce((sum, curr) => sum + curr.amount, 0);
    });
  }
}
