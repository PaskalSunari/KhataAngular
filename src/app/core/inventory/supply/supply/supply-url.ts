import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class SupplyURL {
  genericApi: string = 'Account/GlobalUtility/GenericAPI';
  getDropdownList: string = 'inventory/Supply/GetDropdownList';  
  GetSupplyDraftList: string = 'inventory/Supply/GetSupplyDraftList';  
}
