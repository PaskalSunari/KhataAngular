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
import { ProductModelComponent } from './Product/product-model/product-model.component';
import { ProductSizeComponent } from './Product/product-size/product-size.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductCreationComponent } from './Product/product-creation/product-creation.component';
import { SupplyComponent } from './supply/supply/supply.component';
import { DeptStockLocationMappingComponent } from './dept-stock-location-mapping/dept-stock-location-mapping.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PurchaseOrderComponent } from './Purchase/purchase-order/purchase-order.component';
import { SupplyReportComponent } from './supply/supply-report/supply-report.component';

@NgModule({
  declarations: [
    ProductGroupComponent,
    ProductCategoryComponent,
    ProductUnitComponent,
    ProductManufacturerComponent,
    ProductBrandComponent,
    DemandComponent,
    ProductModelComponent,
    ProductSizeComponent,
    ProductCreationComponent,
    SupplyComponent,
    DeptStockLocationMappingComponent,
    PurchaseOrderComponent,
    SupplyReportComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    FormsModule,
    MatPaginatorModule,
      NgMultiSelectDropDownModule,
  
]
})
export class InventoryModule { }
