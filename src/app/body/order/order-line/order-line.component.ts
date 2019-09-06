import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Product } from 'src/app/models/product';
import { FirebaseService } from 'src/app/services/firebase.service';
import { OrderLine } from 'src/app/models/order-line';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-order-line',
  templateUrl: './order-line.component.html',
  styleUrls: ['./order-line.component.css']
})
export class OrderLineComponent implements OnInit {
  @Input() orderId = '';
  orderLineForm: FormGroup;
  orderLine: OrderLine;
  order: Order;
  product: Product;
  products: Product[] = [];
  constructor(private fb: FormBuilder, private fs: FirebaseService) {}

  ngOnInit() {
    this.setForm();
    this.fs.getProducts().subscribe(products => (this.products = products));
    // this.fs.getOrderById(this.orderId).subscribe(order => (this.order = order));
    this.disableForm();
  }

  onSubmit() {
    this.initOrderLine();
    // const orderLineId = this.fs.addOrderLine(this.orderLine);
    // this.order.orderLineIds.push(orderLineId);
    // this.fs.updateOrder(this.order, this.orderId);
    console.log(`OrderLine: ${JSON.stringify(this.orderLine)}`);
    console.log(`Order: ${JSON.stringify(this.order)}`);
  }

  onSelect(event: TypeaheadMatch) {
    this.product = (event.item as unknown) as Product;
    this.fs.getOrderLineByProductId(this.product.id).subscribe(ol => {
      console.log(`ol: ${JSON.stringify(ol)}`);
    });
    this.enableForm();
  }

  setForm() {
    this.orderLineForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required]
    });
  }

  disableForm() {
    this.orderLineForm.get('quantity').disable();
    this.orderLineForm.get('price').disable();
    this.orderLineForm.get('total').disable();
  }

  enableForm() {
    if (this.product) {
      console.log(`Product: ${JSON.stringify(this.product)}`);
      this.orderLineForm.get('price').setValue(this.product.price);
      const qtyCtrl = this.orderLineForm.get('quantity');
      qtyCtrl.enable();
      qtyCtrl.valueChanges.subscribe(qty => {
        this.orderLineForm.get('total').setValue(qty * this.product.price);
      });
      qtyCtrl.setValue('1');
    }
  }
  initOrderLine() {
    const ol = this.orderLineForm.value as OrderLine;
    console.log(JSON.stringify(ol));
    this.orderLine = {
      product: this.product,
      orderId: this.product.id,
      quantity: ol.quantity,
      total: ol.total
    };
  }
}
