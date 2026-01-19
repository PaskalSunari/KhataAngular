import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { salesOrderUrl } from './sales-order-endpoint';


@Injectable({
  providedIn: 'root',
})
export class salesOrderService {
  baseurl = environment.appURL;

  constructor(private http: HttpClient, private endpoint: salesOrderUrl) { }

  getSalesLedger(branchId: string){
     const base = this.baseurl.replace(/\/+$/, '');
    const params = new HttpParams()
    .set('flag', '1')
    .set('branchId', branchId);
    return this.http.get(`${base}${this.endpoint.salesLedgerDropdownList}`,{params})
  }

  getProductName(flag: any,code:any,branchId:any){
    const base = this.baseurl.replace(/\/+$/, '');
    return this.http.get(`${base}${this.endpoint.getProductByName}${flag}&code=${code}&branchId=${branchId}`);
  }
}
