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

   getRequestedByDropdownList() {
   
    return this.http.get(`${this.baseurl}${this.endPoint.getRequestedByDropdownList}`);
  }
  getRequestedToDropdownList() {
   
    return this.http.get(`${this.baseurl}${this.endPoint.getRequestedToDropdownList}`);
  }
  getDepartmentDropdownList() {
    return this.http.get(`${this.baseurl}${this.endPoint.getDepartmentDropdownList}`);
  }
  getProductList(){
    return this.http.get(`${this.baseurl}${this.endPoint.getProductDropdownList}`);
  }
  getUnitLIst(){
    return this.http.get(`${this.baseurl}${this.endPoint.getUnitDropdownList}`);
  }
}
