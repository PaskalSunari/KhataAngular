import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DemandReportEndpointURL {
  public readonly locationList :string= `Inventory/users/{userId}/demand-reports/branches/{branchId}/locations`;
  public readonly demandList :string= `Inventory/users/{userId}/demand-reports`;
  public readonly demandDetails: string = `Inventory/users/{userId}/demand-reports/{demandMasterId}/details`;
}