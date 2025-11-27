import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductGroupComponent } from './product-group/product-group.component';
import { SharedModule } from '../shared/shared.module';
import { ProductCategoryComponent } from './Product/product-category/product-category.component';
import { ProductUnitComponent } from './Product/product-unit/product-unit.component';
import { ProductManufacturerComponent } from './Product/product-manufacturer/product-manufacturer.component';
import { ProductBrandComponent } from './Product/product-brand/product-brand.component';
import { ProductModelComponent } from './Product/product-model/product-model.component';
import { ProductSizeComponent } from './Product/product-size/product-size.component';

@NgModule({
  declarations: [
    ProductGroupComponent,
    ProductCategoryComponent,
    ProductUnitComponent,
    ProductManufacturerComponent,
    ProductBrandComponent,
    ProductModelComponent,
    ProductSizeComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
