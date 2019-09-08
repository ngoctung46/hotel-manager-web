import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { ProductType } from 'src/app/enums';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  product: Product = {
    id: null,
    name: '',
    price: null,
    description: '',
    type: ProductType.Item,
    inStock: 0
  };
  items: Item[] = [
    { name: 'Dịch vụ', type: ProductType.Service },
    { name: 'Hàng hóa', type: ProductType.Item },
    { name: 'Thanh toán', type: ProductType.Payment },
    { name: 'Phụ thu', type: ProductType.ExtraCharge }
  ];
  products: Product[] = [];
  productId = null;
  constructor(private fb: FormBuilder, private fs: FirebaseService) {}

  ngOnInit() {
    this.setForm();
    this.resetForm();
    this.fs.getProducts().subscribe(products => (this.products = products));
  }
  onSubmit() {
    this.product = this.productForm.value as Product;
    if (this.product.type === ProductType.Payment) {
      this.product.price = -this.product.price;
    }
    if (this.product.type === ProductType.Item) {
      this.product.inStock = 0;
    }
    if (this.productId) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
    this.resetForm();
  }
  onSelect(event: TypeaheadMatch) {
    this.product = (event.item as unknown) as Product;
    this.productId = this.product.id;
    this.setForm();
  }

  setForm() {
    this.productForm = this.fb.group({
      name: [this.product.name, Validators.required],
      price: [this.product.price, Validators.required],
      type: [this.product.type, Validators.required],
      description: [this.product.description],
      inStock: [this.product.inStock]
    });
  }

  updateProduct() {
    this.fs.updateProduct(this.product, this.productId);
  }

  addProduct() {
    this.fs.addProduct(this.product);
  }

  deleteProduct() {
    if (this.productId) {
      this.fs.deleteProduct(this.productId);
      this.resetForm();
    }
  }

  resetForm() {
    this.productForm.reset();
    this.productForm.get('type').setValue(ProductType.Item);
    this.productId = null;
    this.product = null;
  }
}
interface Item {
  name: string;
  type: ProductType;
}
