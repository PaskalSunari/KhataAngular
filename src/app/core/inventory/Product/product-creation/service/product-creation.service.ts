import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { productCreateUrl } from '../product-creationEndpointURL';
import { ProductCreation } from '../product-creation.model';
import { AddVariable } from '../product-creation.model';

@Injectable({
  providedIn: 'root'
})
export class ProductCreationService {

  baseurl = environment.appURL;
    productCreationModel: ProductCreation = new ProductCreation();

    addVariableModel:AddVariable=new AddVariable
    constructor(private http: HttpClient, private endPoint: productCreateUrl) {}
  
  
     getProductCreateDropdownList(model:any) {
      return this.http.post(`${this.baseurl}${this.endPoint.getProductCreateDropdownList}`,model);
    }
   
  
    insertUpdateProductCreate(data: any) {
      return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateProductCreate}`,data);
    }
    getProductCreateByID(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.getProductCreateDataByID}`,data);
    }
  
     deleteProductCreate(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.deleteProductCreate}`,data);
    }
  
      getProductCreateFilteredList(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.productCreateFilteredData}`,data);
    }


    //Add Variable api
     getNatureDropdownList(model:any) {
      return this.http.post(`${this.baseurl}${this.endPoint.natureDropdownList}`,model);
    }
 getAddVariableFilteredList(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.addVariableFilteredData}`,data);
    }
 insertUpdateAddVariable(data: any) {
      return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateAddVariable}`,data);
    }
     getAddVariableByID(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.getAddVariableDataByID}`,data);
    }
  
     deleteAddVariable(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.deleteAddVariable}`,data);
    }

    //Variable Option api

     getVariableOptionList(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.getVariableOptionList}`,data);
    }
     insertUpdateVariableOption(data: any) {
      return this.http.post(`${this.baseurl}${this.endPoint.insertUpdateVariableOption}`,data);
    }

     deleteVariableOption(data:any){
        return this.http.post(`${this.baseurl}${this.endPoint.deleteVariableOption}`,data);
    }


}
