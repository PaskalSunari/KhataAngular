import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales/sales.component';
import { PosComponent } from './pos/pos.component';
import { FormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";



@NgModule({
  declarations: [
    SalesComponent,
    PosComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    FormsModule,
    A11yModule
]
})
export class SalesModule { }
