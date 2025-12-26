import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupplyURL } from '../supply-url';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  baseUrl = environment.appURL;
  constructor(private http: HttpClient, private urls: SupplyURL) { }

    getPrefixSuffix(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);
  }

  getDemandList(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);
  }

  getStockLocationList(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);
  }

  getDemand(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);
  }

  getDropDownList(userId: number, branchId: number, fiscalId: number, masterId: number) {
    return this.http.get(`${this.baseUrl}${this.urls.getDropdownList}/${userId}/${branchId}/${fiscalId}/${masterId}`);
  }

}
