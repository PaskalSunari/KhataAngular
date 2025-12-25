import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { posUrl } from './pos-endpoint';
import { UnitModel } from './pos.model';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  baseurl = environment.appURL;

  //use in html
  UnitModel: UnitModel = new UnitModel();

  constructor(private http: HttpClient, private endPoint: posUrl) {}
  //================================================================================
  // GET request
  salesLedger() {
    const params = new HttpParams().set('flag', 1).set('branchId', 1001);
    return this.http.get(`${this.baseurl}${this.endPoint.SalesLedger}`, {
      params,
    });
  }
  //================================================================================

  GetCustomersByMode(mode: string) {
    const params = new HttpParams()
      .set('flag', mode) // existing parameter
      .set('branchId', '1001'); // existing parameter

    return this.http.get(`${this.baseurl}${this.endPoint.Customer}`, {
      params,
    });
  }

  //================================================================================

  GetAllProducts() {
    const params = new HttpParams()
      .set('flag', 1)
      .set('productcode', '')
      .set('branch', 1001);

    return this.http.get(`${this.baseurl}${this.endPoint.GetProductByCode}`, {
      params,
    });
  }

  GetProductDetail(selectedValue: any) {
    const params = new HttpParams()
      .set('flag', 2)
      .set('productcode', selectedValue)
      .set('branch', 1001);

    return this.http.get(`${this.baseurl}${this.endPoint.GetProductByCode}`, {
      params,
    });
  }

  //================================================================================

  GetUnits(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.GetUnits}`, data);
  }

  //================================================================================
  GetRate(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.GetRate}`, data);
  }
    //================================================================================

  GetFilterAnyDataPagination(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.GetFilterAnyDataPagination}`,
      data
    );
  }
  //================================================================================
  GetMissingUnit(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.GetMissingUnit}`, data);
  }
}
