import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SupplyReportURL {
  genericApi: string = 'Account/GlobalUtility/GenericAPI';
  getDropdownList: string = 'inventory/Supply/GetDropdownList';
  getSupplyList: string = 'inventory/Supply/GetSupplyReport';
}    