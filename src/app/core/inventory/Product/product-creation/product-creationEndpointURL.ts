import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productCreateUrl {
  
  getProductCreateDropdownList: string = 'inventory/FIllList/GetList'

  insertUpdateProductCreate: string =`inventory/Product/AddEdit`
  getProductCreateDataByID:string='inventory/Product/GetByIdProduct'
  deleteProductCreate:string='inventory/Product/DeleteProduct'
  productCreateFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'

//Add Variable Api
  natureDropdownList:string='inventory/ProductInfoVariable/GetProductVariableNatureList'
  addVariableFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
insertUpdateAddVariable:string=`inventory/ProductInfoVariable/AddEditProductInfoVariable`
getAddVariableDataByID:string=`inventory/ProductInfoVariable/GetProductInfoVariableByID`
deleteAddVariable:string=`inventory/ProductInfoVariable/DeleteProductInfoVariable`

// variable option api
getVariableOptionList:string=`inventory/ProductInfoVariable/GetProductInfoVariableOptionList`
insertUpdateVariableOption:string=`inventory/ProductInfoVariable/AddUpdateProductInfoVariableOption`
deleteVariableOption:string=`inventory/ProductInfoVariable/DeleteProductInfoVariableOption`
}
