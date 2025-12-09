import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductGroupComponent } from './product-group/product-group.component';
import { ProductCategoryComponent } from './Product/product-category/product-category.component';
import { ProductUnitComponent } from './Product/product-unit/product-unit.component';
import { ProductManufacturerComponent } from './Product/product-manufacturer/product-manufacturer.component';
import { ProductBrandComponent } from './Product/product-brand/product-brand.component';
import { ProductModelComponent } from './Product/product-model/product-model.component';
import { ProductSizeComponent } from './Product/product-size/product-size.component';
import { ProductCreationComponent } from './Product/product-creation/product-creation.component';

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
    path: 'productmodel',
    component: ProductModelComponent,
  },
   {
    path: 'productsize',
    component: ProductSizeComponent,
  },
    {
    path: 'productcreate',
    component: ProductCreationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {

 }
