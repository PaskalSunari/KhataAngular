import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class purchaseOrderUrl {
 getSuffixPrefix= `inventory/PurchaseOrder/GetSuffixPrefix?id=`
 getCurrencyAndRate= `inventory/Purchase/GetCurrencyAndRate`
getPurchaseDropdownList=`inventory/PurchaseOrder/GetPurchaseList?branchIds=`
getTaxChargesDropDownList=`inventory/Purchase/GetTaxChargesDropDown?flag=`
getProdutDropdownList=`inventory/PurchaseOrder/GetProductList?search=&pageSize=50&branchID=1001`
getProdutDropdownList1=`inventory/PurchaseOrder/GetProductList?search=`
//Purchase Details popup api
getLedgerDetails=`Account/AccountLedger/GetLedgerDetailById`
addPurchaseInfo=`inventory/PurchaseOrder/AddPurchaseInfo`


getProductByID=`inventory/PurchaseOrder/GetProductById?id=`

//quantity popup
getProductBatchAndExpiry= `inventory/PurchaseOrder/GetProductBatchAndExpiry?productId=`
getUnitByProduct=`inventory/PurchaseOrder/GetUnitwiseSalesByProductId?id=`


//
  getPurchaseOrderDropdownList: string = 'inventory/FIllList/GetList'

  insertUpdatePurchaseOrder: string =`inventory/Product/AddEdit`
//   getPurchaseOrderDataByID:string='inventory/Product/GetByIdProduct'
//   deletePurchaseOrder:string='inventory/Product/DeleteProduct'
//   productCreateFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'



}
