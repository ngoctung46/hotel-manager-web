import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.products$ = this.fs
      .getProducts()
      .pipe(tap(products => products.sort((x, y) => x.type - y.type)));
  }
}
