import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  @Input() orderLines$: Observable<OrderLine[]>;
  total = 0;
  constructor() {}

  ngOnInit() {
    this.orderLines$
      .pipe(map(ols => ols.reduce((sum, current) => sum + current.total, 0)))
      .subscribe(total => (this.total = total));
  }
}
