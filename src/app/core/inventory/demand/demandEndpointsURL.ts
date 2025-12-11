import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DemandUrl {
  
  getRequestedByDropdownList: string = 'inventory/Demand/RequestedBy'
  getRequestedToDropdownList: string = 'inventory/Demand/RequestedTo?userId='
  getDepartmentDropdownList: string = 'inventory/Demand/DepartmentList'
  getProductDropdownList: string = 'inventory/Demand/ProductList'
  getUnitDropdownList: string = 'inventory/Demand/UnitList'
  postDemand: string = 'inventory/Demand/PostDemand'
  availableQuantity: string = 'inventory/Demand/AvailableQuantity?productId='
}
