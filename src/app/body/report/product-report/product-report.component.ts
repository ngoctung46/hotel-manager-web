import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';
import { FirebaseService } from 'src/app/services/firebase.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {
  @Input() start: Date;
  @Input() end: Date;
  orderLines: OrderLine[];
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    if (this.start && this.end) {
      this.fs.getItemsSoldByDateRange(this.start, this.end).subscribe(ols => {
        this.orderLines = this.sumAndGroupOrderLines(ols);
        this.setProducts();
      });
    }
  }

  sumAndGroupOrderLines(data: OrderLine[]): OrderLine[] {
    return Object.values(
      data.reduce(
        (r, o) => (
          r[o.productId] ? (r[o.productId].quantity += o.quantity) : (r[o.productId] = { ...o }), r
        ),
        {}
      )
    );
  }

  setProducts() {
    this.orderLines.forEach(ol => {
      this.fs.getProductById(ol.productId).subscribe(product => (ol.product = product));
    });
  }
}
