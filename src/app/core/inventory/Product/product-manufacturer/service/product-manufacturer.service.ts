import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductManufacturer } from '../product-manufacturer.model';
import { productManufacturerUrl } from '../product-manufacturerEndPointURL';

@Injectable({
  providedIn: 'root'
})
export class ProductManufacturerService {
baseurl = environment.appURL;
   productManufacturerModel: ProductManufacturer = new ProductManufacturer();
   constructor(private http: HttpClient, private endPoint: productManufacturerUrl) {}

  insertUpdateProductManufacturer(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductManufacturer}`,data);
  }
  getProductManufacturerByID(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.getProductManufacturerDataByID}`,data);
  }

   deleteProductManufacturer(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.deleteProductManufacturer}`,data);
  }

    getProductManufacturerFilteredList(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.productManufacturerFilteredData}`,data);
  }

}
