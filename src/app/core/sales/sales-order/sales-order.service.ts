import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { salesOrderUrl } from './sales-order-endpoint';


@Injectable({
  providedIn: 'root',
})
export class salesOrderService {
  baseurl = environment.appURL;



}
