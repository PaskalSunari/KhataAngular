import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productModelUrl {
  
  getProductModelDropdownList: string = 'inventory/FIllList/GetList'

  insertUpdateProductModel: string =`inventory/handleDeleteUnit_Event/AddEditProductModel`
  getProductModelDataByID:string='inventory/handleDeleteUnit_Event/GetProductModelByID'
  deleteProductModel:string='inventory/handleDeleteUnit_Event/DeleteProductModel'
  productModelFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
