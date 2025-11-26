import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginserviceService } from '../Auth/login/loginservice.service';
import { DashboardUrl } from './dashboard-endpoint';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseurl = environment.appURL;

  constructor(
    private http: HttpClient,
    private endurl: DashboardUrl,
    public loginService: LoginserviceService
  ) {}

  getDashboardData(objData: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //    Authorization: `Bearer ${this.loginService.Gettoken()}`
    // });

    const url = `${this.baseurl}${this.endurl.GetDashboardData}`;
    return this.http.post(url, objData);
  }

  GetTransaction(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endurl.GetTransaction}`,
      data
    );
  }
}
