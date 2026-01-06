import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productSizeUrl {
  insertUpdateProductSize: string =`inventory/ProductSize/AddEditProductSize`
  getProductSizeDataByID:string='inventory/ProductSize/GetProductSizeByID'
  deleteProductSize:string='inventory/ProductSize/DeleteProductSize'
  productSizeFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
