import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Demand } from '../demand.model';
import { DemandUrl } from '../demandEndpointsURL';
@Injectable({
  providedIn: 'root'
})
export class DemandService {
baseurl = environment.appURL;
  Demandmodel: Demand = new Demand();
  constructor(private http: HttpClient, private endPoint: DemandUrl) {}

   getRequestedByDropdownList(departmentId?: Number) {
    const params: any = {};
    if (departmentId){
      params.departmentId = departmentId.toString();
    }
    return this.http.get(`${this.baseurl}${this.endPoint.getRequestedByDropdownList}`, {params});
  }
  getRequestedToDropdownList() {
    const userId = Number(localStorage.getItem('userId'));
    const stockLocation = localStorage.getItem('stockLocation');
    const departmentId = stockLocation ? Number(JSON.parse(stockLocation).locationId) : 0;
    return this.http.get(`${this.baseurl}${this.endPoint.getRequestedToDropdownList}`,{
      params: {
        userId: userId.toString(),
        departmentId: departmentId.toString()
      }
    });
  }
  getDepartmentDropdownList() {
    const userId = Number(localStorage.getItem('userId'));
    return this.http.get(`${this.baseurl}${this.endPoint.getDepartmentDropdownList}`,{
      params: {
        userId: userId.toString()
      }
    });
  }
  getProductList() {
    return this.http.get(`${this.baseurl}${this.endPoint.getProductDropdownList}`);
  }

  getUnitList(productId: number) {
    const params = { productId: productId.toString() };
    return this.http.get(`${this.baseurl}${this.endPoint.getUnitDropdownList}`, { params });
  }
  postDemand(payload:any){
    return this.http.post(`${this.baseurl}${this.endPoint.postDemand}`,payload);
  }
  AvailableQuantity(productId: number,unitId:any) {
    // const params = { productId: productId.toString(), unitId:unitId.toString() };
    return this.http.get(`${this.baseurl}${this.endPoint.availableQuantity}${productId}&unitId=${unitId}`);
  }
}
