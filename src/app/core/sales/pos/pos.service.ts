import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { posUrl } from './pos-endpoint';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  baseurl = environment.appURL;

  //use in html
  // InquiryModel: InquiryModel = new InquiryModel();

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

  GetProductDetail(productCode: any) {
    const params = new HttpParams()
      .set('flag', 2)
      .set('productcode', productCode)
      .set('branch', 1001);

    return this.http.get(`${this.baseurl}${this.endPoint.GetProductByCode}`, {
      params,
    });
  }

  //================================================================================
  GetUnits(
    productId: number = 1,
    batch: string = 'n/a',
    branch: string = '1001'
  ) {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('batch', batch)
      .set('branch', branch);

    return this.http.get(`${this.baseurl}${this.endPoint.GetUnits}`, {
      params,
    });
  }
  //================================================================================

  // GetBatch(data: any) {
  //   return this.http.post(`${this.baseurl}${this.endPoint.batch}`, data);
  // }

  GetFilterAnyDataPagination(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.GetFilterAnyDataPagination}`,
      data
    );
  }
}
