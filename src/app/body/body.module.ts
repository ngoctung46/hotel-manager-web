import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodyRoutingModule } from './body-routing.module';
import { BodyComponent } from './body.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { RoomComponent } from './home/room/room.component';
import { MaterialModule } from '../material.module';
import { RoomListComponent } from './home/room-list/room-list.component';
import { FirebaseService } from '../services/firebase.service';
import { CustomerComponent } from './customer/customer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule, TypeaheadModule } from 'ngx-bootstrap';
import { FormComponent } from './customer/form/form.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { OrderLineComponent } from './order/order-line/order-line.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductTypePipe } from './product-type.pipe';
import { AlertModule } from 'ngx-bootstrap/alert';
import { StockComponent } from './stock/stock.component';

defineLocale('vi', viLocale);
@NgModule({
  declarations: [
    BodyComponent,
    HomeComponent,
    ReportComponent,
    RoomComponent,
    RoomListComponent,
    CustomerComponent,
    FormComponent,
    CustomerDetailsComponent,
    ProductComponent,
    OrderComponent,
    OrderLineComponent,
    OrderDetailsComponent,
    ProductListComponent,
    ProductTypePipe,
    StockComponent
  ],
  providers: [FirebaseService],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BodyRoutingModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    AlertModule.forRoot()
  ]
})
export class BodyModule {}
