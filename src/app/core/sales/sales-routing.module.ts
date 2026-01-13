import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { PosComponent } from './pos/pos.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';

const routes: Routes = [
  { path: 'sales', component: SalesComponent },
  { path: 'salesorder', component: SalesOrderComponent },
  { path: 'pos', component: PosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
