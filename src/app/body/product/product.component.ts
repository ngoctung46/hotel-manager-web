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
    type: ProductType.Service
  };
  products: Product[] = [];
  productId = null;
  constructor(private fb: FormBuilder, private fs: FirebaseService) {}

  ngOnInit() {
    this.setForm();
    this.fs.getProducts().subscribe(products => (this.products = products));
  }
  onSubmit() {
    this.product = this.productForm.value as Product;
    this.product.type = this.getProductType(this.product.type);
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
      description: [this.product.description]
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
    this.productId = null;
  }

  getProductType(type: string): ProductType {
    switch (type) {
      case '0':
        return ProductType.RoomRate;
      case '1':
        return ProductType.Service;
      case '2':
        return ProductType.Item;
      case '4':
        return ProductType.Payment;
      case '5':
        return ProductType.ExtraCharge;
      default:
        return ProductType.Item;
    }
  }
}
