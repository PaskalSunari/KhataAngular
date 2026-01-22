import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DemandReportEndpointURL } from '../Demand-ReportEndpointURL';
import { environment } from 'src/environments/environment';
import { DemandReport } from '../demand-report.model';

@Injectable({
  providedIn: 'root'
})
export class DemandReportService {

branchID=localStorage.getItem('branch') || '1001';
  baseurl = environment.appURL;
  demandReportModel: DemandReport = new DemandReport();
  constructor(private http: HttpClient, private endPoint: DemandReportEndpointURL) {}


  getLocationDropdownList() {
    return this.http.get(`${this.baseurl}${this.endPoint.locationList}${this.branchID}`);
  }
}
