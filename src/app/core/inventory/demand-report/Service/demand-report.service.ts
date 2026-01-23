import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DemandReportEndpointURL } from '../Demand-ReportEndpointURL';
import { environment } from 'src/environments/environment';
import { DemandReport } from '../demand-report.model';

@Injectable({
  providedIn: 'root'
})
export class DemandReportService {

  private readonly baseUrl = environment.appURL;

  demandReportModel: DemandReport = new DemandReport();
  constructor(private readonly http: HttpClient, private readonly endPoint: DemandReportEndpointURL) {}
  private getBranchId(): string{
    return localStorage.getItem('branch') || '1001';
  }
  private getuserId(): string{
    return localStorage.getItem('userId') || '1';
  }
  getLocationDropdownList() {
    const branchID = this.getBranchId();
    const url = `${this.baseUrl}${this.endPoint.locationList}${branchID}`;
    return this.http.get(url);
  }
  getDemandReportList() {
    const userId = this.getuserId();
    const endPoint = this.endPoint.demandList.replace('{userId}', userId);
    const url = `${this.baseUrl}${endPoint}`;
    return this.http.get(url);
  }
}
