import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SupplyReportURL } from './supply-report-url';

@Injectable({
  providedIn: 'root'
})
export class SupplyReportService {
baserUrl:string = environment.appURL;

  constructor(private http:HttpClient, private urls:SupplyReportURL) { }

  getGenericServices(data:any){
    return this.http.post(`${this.baserUrl}${this.urls.genericApi}`, data);
  }

  getDropDownList(userId:number, branchId:number, fiscalId:number, masterId:number){
    return this.http.get(`${this.baserUrl}${this.urls.getDropdownList}/${userId}/${branchId}/${fiscalId}/${masterId}`);
  }
  getSupplyList(data:any){
    return this.http.post(`${this.baserUrl}${this.urls.getSupplyList}`, data);
  }
}
