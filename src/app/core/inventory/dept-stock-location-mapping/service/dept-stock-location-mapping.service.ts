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

  constructor(private http: HttpClient, private urls: DeptLocationMappingUrl) { }

  getDropdownList(deptId: number, branchId: number) {
    return this.http.get(`${this.baseUrl}${this.urls.getDropdownList}/${deptId}/${branchId}`);
  }

  getGridDataList(model: any) {
    return this.http.post(`${this.baseUrl}${this.urls.getGridList}`, model);
  }

  insertUpdate(data: any) {
    return this.http.post(`${this.baseUrl}${this.urls.insertUpdate}`, data);
  }

  getById(id: any, branchId: any, userId: any) {
    return this.http.get(`${this.baseUrl}${this.urls.getById}/${id}/${branchId}/${userId}`)
  }
  deleteById(id: number, branchId: number, userId: any) {
    return this.http.get(`${this.baseUrl}${this.urls.deleteById}/${id}/${branchId}/${userId}`);
  }

   getDepartmentList(data:any){
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);   
  }

}
