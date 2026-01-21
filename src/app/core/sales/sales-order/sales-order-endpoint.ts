import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class salesOrderUrl {
 
salesLedgerDropdownList: string = '/inventory/SalesOrder/SalesLedger';
getProductByName: string = '/inventory/SalesOrder/GetProductByCode';
getCustomerList: string =  '/inventory/SalesOrder/Customer';
}

