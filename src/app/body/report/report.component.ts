import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  bsRangeValue: Date[];
  orders: Order[] = [];
  constructor(private localeService: BsLocaleService, private fs: FirebaseService) {}

  ngOnInit() {
    this.localeService.use('vi');
  }

  onValueChange(dateRange: Date[]) {
    if (dateRange.length !== 2) {
      return;
    }
    this.fs.getOrdersByDateRange(dateRange[0], dateRange[1]).subscribe(orders => {
      this.orders = orders;
    });
  }
}
