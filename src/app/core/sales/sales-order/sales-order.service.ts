import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { salesOrderUrl } from './sales-order-endpoint';


@Injectable({
  providedIn: 'root',
})
export class salesOrderService {
  baseurl = environment.appURL;

  constructor(private http: HttpClient) { }

  getSalesLedger(branchId: string){
     const base = this.baseurl.replace(/\/+$/, '');
    const params = new HttpParams()
    .set('flag', '1')
    .set('branchId', branchId);
    return this.http.get(`${base}/SalesOrder/SalesLedger`,{params})
  }
}
