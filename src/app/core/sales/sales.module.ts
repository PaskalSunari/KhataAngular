import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales/sales.component';
import { PosComponent } from './pos/pos.component';
import { FormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";
import { SalesOrderComponent } from './sales-order/sales-order.component';



@NgModule({
  declarations: [
    SalesComponent,
    PosComponent,
    SalesOrderComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    FormsModule,
    A11yModule
]
})
export class SalesModule { }
