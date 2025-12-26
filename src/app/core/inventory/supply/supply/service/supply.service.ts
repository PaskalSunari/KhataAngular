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

  getGenericServices(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.genericApi}`, data);
  }

  getDropDownList(userId: number, branchId: number, fiscalId: number, masterId: number) {
    return this.http.get(`${this.baseUrl}${this.urls.getDropdownList}/${userId}/${branchId}/${fiscalId}/${masterId}`);
  }

}
