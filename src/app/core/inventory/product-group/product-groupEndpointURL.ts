import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productGroupUrl {
  
  getGroupUnderDropdownList: string = 'inventory/FIllList/GetList'

  getProductGroupList: string = `inventory/ProductGroup/GetAllProductGroup/`

  insertUpdateProductGroup: string =`inventory/ProductGroup/AddEditProductGroup`
  getProductGroupDataByID:string='inventory/ProductGroup/GetProductGroupByID'
  deleteProductGroup:string='inventory/ProductGroup/DeleteProductGroup'
  productGroupFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
