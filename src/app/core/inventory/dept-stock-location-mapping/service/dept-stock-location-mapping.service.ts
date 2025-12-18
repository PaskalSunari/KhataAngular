import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeptLocationMappingUrl } from '../dept-stock-location-mappintURL';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeptStockLocationMappingService {
baseUrl = environment.appURL;
  constructor(private http:HttpClient, private endPoint:DeptLocationMappingUrl) { }
  getDropdownList(userId:number, branchId:number){
    return this.http.get(`${this.baseUrl}${this.endPoint.getDropdownList}/${userId}/${branchId}`);
  }
}
