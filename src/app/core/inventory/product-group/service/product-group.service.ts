import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { productGroupUrl } from '../product-groupEndpointURL';
import { ProductGroup } from '../product-group.model';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

baseurl = environment.appURL;
  productGroupmodel: ProductGroup = new ProductGroup();
  constructor(private http: HttpClient, private endPoint: productGroupUrl) {}

   getGroupUnderDropdownList(model:any) {
    return this.http.post(`${this.baseurl}${this.endPoint.getGroupUnderDropdownList}`,model);
  }
   getProductGroupList() {
    return this.http.get(`${this.baseurl}${this.endPoint.getProductGroupList}`);
  }
 

  insertProductGroup(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertProductGroup}`,data);
  }
}
