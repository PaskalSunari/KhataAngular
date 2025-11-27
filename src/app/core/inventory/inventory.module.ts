import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductGroupComponent } from './product-group/product-group.component';
import { SharedModule } from '../shared/shared.module';
import { ProductCategoryComponent } from './Product/product-category/product-category.component';
import { ProductUnitComponent } from './Product/product-unit/product-unit.component';
import { ProductManufacturerComponent } from './Product/product-manufacturer/product-manufacturer.component';
import { ProductBrandComponent } from './Product/product-brand/product-brand.component';
import { DemandComponent } from './demand/demand.component';

@NgModule({
  declarations: [
    ProductGroupComponent,
    ProductCategoryComponent,
    ProductUnitComponent,
    ProductManufacturerComponent,
    ProductBrandComponent,
    DemandComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
