import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { ProductType } from 'src/app/enums';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  products = [];
  quantity: number;
  stockForm: FormGroup;
  product: Product;
  constructor(private fs: FirebaseService, private fb: FormBuilder) {}

  ngOnInit() {
    this.fs
      .getStockableProducts()
      .pipe(tap(items => items.sort((x, y) => x.inStock - y.inStock)))
      .subscribe(items => (this.products = items));
    this.setForm();
  }

  onSelect(event: TypeaheadMatch) {
    this.product = (event.item as unknown) as Product;
  }

  onSubmit() {
    if (this.product == null) {
      return;
    }
    const qty = this.stockForm.get('quantity').value + +this.product.inStock;
    this.fs.updateProductQty(this.product.id, qty);
    this.stockForm.reset();
    this.product = null;
  }

  setForm() {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, Validators.required]
    });
  }
}
