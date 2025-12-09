import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productBrandUrl {
  
  getProductBrandDropdownList: string = 'inventory/FIllList/GetList'

  insertUpdateProductBrand: string =`inventory/ProductBrand/AddEditProductBrand`
  getProductBrandDataByID:string='inventory/ProductBrand/GetProductBrandByID'
  deleteProductBrand:string='inventory/ProductBrand/DeleteProductBrand'
  productBrandFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
