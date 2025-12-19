import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeptLocationMappingUrl } from '../dept-stock-location-mappintURL';
import { environment } from 'src/environments/environment';
import { DeptStockLocationMapping } from '../dept-stock-location-mapping.model';


@Injectable({
  providedIn: 'root'
})
export class DeptStockLocationMappingService {
  baseUrl = environment.appURL;

  storeLocationModel: DeptStockLocationMapping = new DeptStockLocationMapping();

  constructor(private http: HttpClient, private endPoint: DeptLocationMappingUrl) { }

  getDropdownList(userId: number, branchId: number) {
    return this.http.get(`${this.baseUrl}${this.endPoint.getDropdownList}/${userId}/${branchId}`);
  }

  getGridDataList(model: any) {
    return this.http.post(`${this.baseUrl}${this.endPoint.getGridList}`, model);
  }

  insertUpdate(data: any) {
    return this.http.post(`${this.baseUrl}${this.endPoint.insertUpdate}`, data);
  }

  getById(id:any, branchId:any,userId:any){
    return this.http.get(`${this.baseUrl}${this.endPoint.getById}/${id}/${branchId}/${userId}`)
  }
}
