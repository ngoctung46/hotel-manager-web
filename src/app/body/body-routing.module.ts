import { HomeComponent } from './home/home.component';
import { BodyComponent } from './body.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  {
    path: '',
    component: BodyComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'report', component: ReportComponent },
      { path: 'product', component: ProductComponent },
      { path: 'stock', component: StockComponent },
      { path: 'order/:id', component: OrderComponent },
      { path: 'customer/:id', component: CustomerComponent },
      { path: 'customer/room/:roomId', component: CustomerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodyRoutingModule {}
