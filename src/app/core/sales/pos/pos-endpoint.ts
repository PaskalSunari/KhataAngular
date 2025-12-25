import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class posUrl {
  SalesLedger: string = 'Inventory/Sales/SalesLedger';
  Customer: string = 'Inventory/Sales/Customer';
  GetProductByCode: string='Inventory/Sales/GetProductByCode';
  GetUnits: string='Inventory/Sales/GetUnitByBatch';
  GetRate: string='Inventory/Sales/GetRateByUnitbatch';
  GetMissingUnit: string='Inventory/Sales/GetMissingUnitConversionFact';

  GetFilterAnyDataPagination: string='Account/MyFunction/GetFilterAnyDataPagination';  
 
}
