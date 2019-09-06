import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { OrderLine } from 'src/app/models/order-line';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  id: string;
  orderLines$: Observable<OrderLine[]>;
  constructor(private route: ActivatedRoute, private fs: FirebaseService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.orderLines$ = this.fs.getOrderLinesByOrderId(this.id);
  }
}
