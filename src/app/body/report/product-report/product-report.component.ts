import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {
  @Input() start: Date;
  @Input() end: Date;
  orderLines$: Observable<OrderLine[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    if (this.start && this.end) {
      this.orderLines$ = this.fs.getItemsSoldByDateRange(this.start, this.end);
    }
  }
}
