import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductBrand } from '../product-brand.model';
import { productBrandUrl } from '../product-brandEndpointURL';

@Injectable({
  providedIn: 'root'
})
export class ProductBrandService {

baseurl = environment.appURL;
  productBrandModel: ProductBrand = new ProductBrand();
  constructor(private http: HttpClient, private endPoint: productBrandUrl) {}


   getProductBrandDropdownList(model:any) {
    return this.http.post(`${this.baseurl}${this.endPoint.getProductBrandDropdownList}`,model);
  }
 

  insertUpdateProductBrand(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductBrand}`,data);
  }
  getProductBrandByID(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.getProductBrandDataByID}`,data);
  }

   deleteProductBrand(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.deleteProductBrand}`,data);
  }

    getProductBrandFilteredList(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.productBrandFilteredData}`,data);
  }
}
