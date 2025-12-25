import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productCategoryUrl {
  
  getProductCategoryDropdownList: string = 'inventory/FIllList/GetList'

  getProductCategoryList: string = `inventory/ProductCategory/GetAllProductCategory/`

  insertUpdateProductCategory: string =`inventory/ProductCategory/AddEditProductCategory`
  getProductCategoryDataByID:string='inventory/ProductCategory/GetProductCategoryByID'
  deleteProductCategory:string='inventory/ProductCategory/DeleteProductCategory'
  productCategoryFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
