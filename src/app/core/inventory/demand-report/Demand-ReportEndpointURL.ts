import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DemandReportEndpointURL {
  public readonly locationList :string= `Inventory/DemandReport/LocationList?branchId=`;
  public readonly demandList :string= `Inventory/users/{userId}/demand-reports`;
 
}