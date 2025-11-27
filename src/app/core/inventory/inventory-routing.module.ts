import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductGroupComponent } from './product-group/product-group.component';
import { ProductCategoryComponent } from './Product/product-category/product-category.component';
import { ProductUnitComponent } from './Product/product-unit/product-unit.component';
import { ProductManufacturerComponent } from './Product/product-manufacturer/product-manufacturer.component';
import { ProductBrandComponent } from './Product/product-brand/product-brand.component';
import { DemandComponent } from './demand/demand.component';

const routes: Routes = [
 {
    path: 'productgroup',
    component: ProductGroupComponent,
  },
  {
    path: 'productcategory',
    component: ProductCategoryComponent,
  },
   {
    path: 'productunit',
    component: ProductUnitComponent,
  },
   {
    path: 'productmanufacturer',
    component: ProductManufacturerComponent,
  },
   {
    path: 'productbrand',
    component: ProductBrandComponent,
  },
   {
    path: 'productModel',
    component: ProductManufacturerComponent,
  },
   {
    path: 'productSize',
    component: ProductManufacturerComponent,
  },
   {
    path: 'demand',
    component: DemandComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {

 }
