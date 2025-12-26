import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class SupplyURL {
  getDropdownList: string = 'inventory/Supply/GetDropdownList';
  gemericApi: string = 'Account/GlobalUtility/GenericAPI';
}
