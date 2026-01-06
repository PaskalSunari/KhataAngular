import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductSize } from '../product-size.model';
import { productSizeUrl } from '../product-sizeEndpointURL';

@Injectable({
  providedIn: 'root'
})
export class ProductSizeService {

baseurl = environment.appURL;
  productSizeModel: ProductSize = new ProductSize();
  constructor(private http: HttpClient, private endPoint: productSizeUrl) {}


    insertUpdateProductSize(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductSize}`,data);
  }
  getProductSizeByID(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.getProductSizeDataByID}`,data);
  }

   deleteProductSize(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.deleteProductSize}`,data);
  }

    getProductSizeFilteredList(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.productSizeFilteredData}`,data);
  }
}
