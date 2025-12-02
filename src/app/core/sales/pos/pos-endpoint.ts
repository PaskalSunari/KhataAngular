import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class posUrl {
  SalesLedger: string = 'Inventory/Sales/SalesLedger';
  Customer: string = 'Inventory/Sales/Customer';
  GetProductByCode: string='Inventory/Sales/GetProductByCode';
  GetUnits: string='Inventory/Sales/GetUnits';
  batch: string='Inventory/Sales/GetUnitByBatch';
  GetFilterAnyDataPagination: string='Account/MyFunction/GetFilterAnyDataPagination';  
 
}
