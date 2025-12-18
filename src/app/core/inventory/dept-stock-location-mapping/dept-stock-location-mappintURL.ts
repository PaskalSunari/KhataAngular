import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root',
})
export class DeptLocationMappingUrl{
    getDropdownList:string='inventory/DepartmentLocationMapping/GeDropdoantList';
    getGridList:string='inventory/DepartmentLocationMapping/GetJsonList';
}