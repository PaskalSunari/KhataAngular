import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupplyURL } from '../supply-url';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  baseUrl = environment.appURL;
  constructor(private http:HttpClient, private urls:SupplyURL) { }

  getDemandList(data:any){
    return this.http.post(`${this.baseUrl}${this.urls.gemericApi}`, data);   
  }

}
