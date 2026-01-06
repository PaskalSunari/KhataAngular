import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductUnit } from '../product-unit.model';
import { productUnitUrl } from '../product-unitEndpointURL';

@Injectable({
  providedIn: 'root'
})
export class ProductUnitService {

  baseurl = environment.appURL;
    productUnitModel: ProductUnit = new ProductUnit();
    constructor(private http: HttpClient, private endPoint: productUnitUrl) {}
  
     getProductUnitDropdownList(model:any) {
      return this.http.post(`${this.baseurl}${this.endPoint.getProductUnitDropdownList}`,model);
    }
   
   
  
    insertUpdateProductUnit(data: any) {
      return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductUnit}`,data);
    }
    //  updateProductUnit(data: any) {
    //   return this.http.post(`${this.baseurl}${this.endPoint.updateProductUnit}`,data);
    // }
    getProductUnitByID(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.getProductUnitDataByID}`,data);
    }
  
     deleteProductUnit(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.deleteProductUnit}`,data);
    }
  
      getProductUnitFilteredList(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.productUnitFilteredData}`,data);
    }
}
