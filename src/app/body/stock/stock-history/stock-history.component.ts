import { Location } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from 'src/app/models/history';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {
  productId: string;
  histories$: Observable<History[]>;
  constructor(
    private fs: FirebaseService,
    private route: ActivatedRoute,
    public location: Location
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.histories$ = this.fs.getHistoriesByProductId(this.productId);
    }
  }

  goBack() {
    this.location.back();
  }
}
