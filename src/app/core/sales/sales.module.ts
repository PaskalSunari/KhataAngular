import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales/sales.component';
import { PosComponent } from './pos/pos.component';



@NgModule({
  declarations: [
    SalesComponent,
    PosComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
