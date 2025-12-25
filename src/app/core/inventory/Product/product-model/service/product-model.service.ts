import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../product-model.model';
import { productModelUrl } from '../product-modelEndpointURL';


@Injectable({
  providedIn: 'root'
})
export class ProductModelService {
baseurl = environment.appURL;
  productModel: ProductModel = new ProductModel();
  constructor(private http: HttpClient, private endPoint: productModelUrl) {}


   getProductModelDropdownList(model:any) {
    return this.http.post(`${this.baseurl}${this.endPoint.getProductModelDropdownList}`,model);
  }
 

  insertUpdateProductModel(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductModel}`,data);
  }
  getProductModelByID(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.getProductModelDataByID}`,data);
  }

   deleteProductModel(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.deleteProductModel}`,data);
  }

    getProductModelFilteredList(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.productModelFilteredData}`,data);
  }
}
