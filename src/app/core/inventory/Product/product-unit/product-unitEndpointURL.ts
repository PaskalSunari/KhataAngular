import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productUnitUrl {
  
  getProductUnitDropdownList: string = 'inventory/FIllList/GetList'

  insertUpdateProductUnit: string =`inventory/Unit/AddEditUnit`
  //  updateProductUnit: string =`inventory/ProductUnit/UpdateProductUnit`
  getProductUnitDataByID:string='inventory/Unit/GetDataById'
  deleteProductUnit:string='inventory/Unit/DeleteUnit'
  productUnitFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
