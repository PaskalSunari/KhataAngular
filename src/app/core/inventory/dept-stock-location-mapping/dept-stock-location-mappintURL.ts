import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root',
})
export class DeptLocationMappingUrl{
    getDropdownList:string='inventory/DepartmentLocationMapping/GeDropdoantList';
    getGridList:string='inventory/DepartmentLocationMapping/GetJsonList';
    insertUpdate:string='inventory/DepartmentLocationMapping/AddUpdate';
    deleteById:string='inventory/DepartmentLocationMapping/Delete';
    getById:string='inventory/DepartmentLocationMapping/GetById';
    gemericApi: string = 'Account/GlobalUtility/GenericAPI';
}