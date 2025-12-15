import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductCategory } from '../product-category.model';
import { productCategoryUrl } from '../product-categoryEndpointURL';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

 baseurl = environment.appURL;
  productCategoryModel: ProductCategory = new ProductCategory();
  constructor(private http: HttpClient, private endPoint: productCategoryUrl) {}

   getProductCategoryDropdownList(model:any) {
    return this.http.post(`${this.baseurl}${this.endPoint.getProductCategoryDropdownList}`,model);
  }
   getProductCategoryList(model:any) {
    return this.http.post(`${this.baseurl}${this.endPoint.getProductCategoryList}`,model);
  }
 

  insertUpdateProductCategory(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductCategory}`,data);
  }
  getProductCategoryByID(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.getProductCategoryDataByID}`,data);
  }

   deleteProductCategory(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.deleteProductCategory}`,data);
  }

    getProductCategoryFilteredList(data:any){
      return this.http.post(`${this.baseurl}${this.endPoint.productCategoryFilteredData}`,data);
  }
}
