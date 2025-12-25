import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class SupplyURL {
    getDropdownList: string = 'inventory/DepartmentLocationMapping/GeDropdoantList';
    gemericApi: string = 'Account/GlobalUtility/GenericAPI';
}
