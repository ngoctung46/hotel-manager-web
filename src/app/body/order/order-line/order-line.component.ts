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
  existedOrderLine: OrderLine = null;
  order: Order;
  product: Product;
  products: Product[] = [];
  errors: string;
  alert = {
    type: 'danger',
    timeout: 3000,
    msg: 'Không đủ hàng trong kho'
  };
  constructor(private fb: FormBuilder, private fs: FirebaseService) {}

  ngOnInit() {
    this.setForm();
    this.fs.getProducts().subscribe(products => (this.products = products));
    this.fs.getOrderById(this.orderId).subscribe(order => (this.order = order));
    this.orderLineForm.get('quantity').valueChanges.subscribe(qty => {
      this.orderLineForm.get('total').setValue(qty * this.product.price);
    });
  }

  onSubmit() {
    this.setOrderLine();
    if (this.existedOrderLine) {
      this.updateOrderLine();
    } else {
      this.addOrderLine();
    }
    this.resetForm();
  }

  addOrderLine() {
    const qty = this.product.inStock - this.orderLine.quantity;
    if (qty < 0) {
      this.errors = 'Không đủ số lượng trong kho';
      return;
    }
    const orderLineId = this.fs.addOrderLine(this.orderLine);
    this.order.orderLineIds.push(orderLineId);
    this.fs.updateOrder(this.order, this.orderId);
    this.fs.updateProductQty(this.product.id, qty);
  }
  updateOrderLine() {
    const qty = this.product.inStock + +this.existedOrderLine.quantity - this.orderLine.quantity;
    if (qty < 0) {
      this.errors = 'Không đủ số lượng trong kho';
      return;
    }
    this.fs.updateOrderLine(this.orderLine, this.existedOrderLine.id);
    this.fs.updateProductQty(this.product.id, qty);
  }

  onSelect(event: TypeaheadMatch) {
    this.product = (event.item as unknown) as Product;
    this.fs.getOrderLineByProductIdAndOrderId(this.product.id, this.orderId).subscribe(ol => {
      this.existedOrderLine = ol;
      this.updateForm();
    });
  }

  setForm() {
    this.orderLineForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required]
    });
  }
  delete() {
    if (this.existedOrderLine) {
      this.fs.deleteOrderLine(this.existedOrderLine.id);
      const qty = this.product.inStock + +this.existedOrderLine.quantity;
      this.fs.updateProductQty(this.product.id, qty);
      this.resetForm();
    }
  }

  updateForm() {
    if (this.product) {
      this.orderLineForm.get('price').setValue(this.product.price);
      const qtyCtrl = this.orderLineForm.get('quantity');
      if (this.existedOrderLine) {
        qtyCtrl.setValue(this.existedOrderLine.quantity);
      } else {
        qtyCtrl.setValue(1);
      }
    }
  }

  setOrderLine() {
    const ol = this.orderLineForm.value;
    this.orderLine = {
      product: this.product,
      orderId: this.orderId,
      productId: this.product.id,
      quantity: ol.quantity,
      total: ol.total
    };
  }
  resetForm() {
    this.orderLineForm.reset();
    this.orderLine = null;
    this.product = null;
    this.existedOrderLine = null;
  }
}
