import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Product } from 'src/app/models/product';
import { FirebaseService } from 'src/app/services/firebase.service';
import { OrderLine } from 'src/app/models/order-line';
import { Order } from 'src/app/models/order';
import { ProductType } from 'src/app/enums';

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
  isOpenPrice: boolean;
  alert = {
    type: 'danger',
    timeout: 3000,
    msg: 'Không đủ hàng trong kho'
  };
  found = false;
  constructor(private fb: FormBuilder, private fs: FirebaseService) {}

  ngOnInit() {
    this.setForm();
    this.fs.getProducts().subscribe(products => (this.products = products));
    this.fs.getOrderById(this.orderId).subscribe(order => (this.order = order));
    this.orderLineForm.get('quantity').valueChanges.subscribe(qty => {
      this.orderLineForm.get('total').setValue(qty * this.product.price);
      const num = (this.existedOrderLine && this.existedOrderLine.quantity) || 0;
      if (this.product.type === ProductType.Item) {
        this.orderLineForm.get('inStock').setValue(this.product.inStock + num - qty);
      }
    });
    this.orderLineForm.get('price').valueChanges.subscribe(price => {
      const qty = this.orderLineForm.get('quantity').value;
      this.orderLineForm.get('total').setValue(qty * -price);
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
    if (this.product.type === ProductType.Item) {
      const qty = this.product.inStock - this.orderLine.quantity;
      if (qty < 0) {
        this.errors = 'Không đủ số lượng trong kho';
        return;
      }
      this.fs.updateProductQty(this.product.id, qty);
    }
    const orderLineId = this.fs.addOrderLine(this.orderLine);
    this.order.orderLineIds.push(orderLineId);
    this.order.total = this.order.total + +this.orderLine.total;
    this.fs.updateOrder(this.order, this.orderId);
  }
  updateOrderLine() {
    let qty = 0;
    if (this.product.type === ProductType.Item) {
      qty = this.product.inStock + +this.existedOrderLine.quantity - this.orderLine.quantity;
      this.fs.updateProductQty(this.product.id, qty);
      if (qty < 0) {
        this.errors = 'Không đủ số lượng trong kho';
        return;
      }
    }
    this.fs.updateOrderLine(this.orderLine, this.existedOrderLine.id);
    this.order.total = this.order.total - this.existedOrderLine.total + this.orderLine.total;
    this.fs.updateOrder(this.order, this.orderId);
  }

  onSelect(event: TypeaheadMatch) {
    this.product = (event.item as unknown) as Product;
    if (
      this.product.type === ProductType.Payment ||
      this.product.type === ProductType.ExtraCharge
    ) {
      this.isOpenPrice = true;
    } else {
      this.isOpenPrice = false;
    }
    this.fs.getOrderLineByProductIdAndOrderId(this.product.id, this.orderId).subscribe(ol => {
      this.existedOrderLine = ol;
      this.updateForm();
    });
    this.found = true;
  }

  setForm() {
    this.orderLineForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, Validators.required],
      price: [0, Validators.required],
      total: [0, Validators.required],
      inStock: [0]
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
      this.orderLineForm.get('inStock').setValue(this.product.inStock);
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
    const price = this.product.type === ProductType.Payment ? -ol.price : ol.price;
    this.orderLine = {
      product: this.product,
      orderId: this.orderId,
      productId: this.product.id,
      quantity: ol.quantity,
      total: ol.total,
      price
    };
  }
  resetForm() {
    this.orderLineForm.reset();
    this.orderLine = null;
    this.product = null;
    this.existedOrderLine = null;
    this.isOpenPrice = false;
  }
}
