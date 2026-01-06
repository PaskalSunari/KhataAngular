import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseOrder } from '../purchase-order.model';
import { purchaseOrderUrl } from '../purchase-orderEndpointURL';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  baseurl = environment.appURL;
  purchaseOrderModel: PurchaseOrder = new PurchaseOrder();
 
     constructor(private http: HttpClient, private endPoint: purchaseOrderUrl) {}
    // getPurchaseOrderDropdownList() {
    //   return this.http.get(`${this.baseurl}${this.endPoint.getPurchaseOrderDropdownList}`);
    // }

     getSuffixPrefix(id:any,brancID:any,fiscalID:any) {
      return this.http.get(`${this.baseurl}${this.endPoint.getSuffixPrefix}${id}&branchId=${brancID}&fiscalId=${fiscalID}`);
    }

      getCurrencyAndRate() {
      return this.http.get(`${this.baseurl}${this.endPoint.getCurrencyAndRate}`);
    }

      getPurchaseDropdownList(branchID:any,fiscalID:any) {
      return this.http.get(`${this.baseurl}${this.endPoint.getPurchaseDropdownList}${branchID}&fiscalyear=${fiscalID}`);
    }

     getProductDropdownList() {
      return this.http.get(`${this.baseurl}${this.endPoint.getProdutDropdownList}`);
    }
     getProductDropdownList1(searchText:any,pageSize:any,branchID:any) {
      return this.http.get(`${this.baseurl}${this.endPoint.getProdutDropdownList1}${searchText}&pageSize=${pageSize}&branchID=${branchID}`);
    }

      getTaxChargesDropDownList(flag:any) {
      return this.http.get(`${this.baseurl}${this.endPoint.getTaxChargesDropDownList}${flag}`);
    }
   
    getLedgerDetailsByID(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.getLedgerDetails}`,data);
    }
  addPurchaseInfo(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.addPurchaseInfo}`,data);
  }


  getProductDataByID(id:any){
     return this.http.get(`${this.baseurl}${this.endPoint.getProductByID}${id}`);
  }

  getUnitByProductID(id:any){
     return this.http.get(`${this.baseurl}${this.endPoint.getUnitByProduct}${id}`);
  }

   getProductBatchAndExpiry(id:any){
     return this.http.get(`${this.baseurl}${this.endPoint.getProductBatchAndExpiry}${id}`);
  }
    // insertUpdatePurchaseOrder(data: any) {
    //   return this.http.post(`${this.baseurl}${this.endPoint.insertUpdatePurchaseOrder}`,data);
    // }


}
