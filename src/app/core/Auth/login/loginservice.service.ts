import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InquiryModel } from './login.model';
import { Router } from '@angular/router';
import { EncryptionService } from '../../encryptionservice/encryption.service';
import { loginEndpointUrl } from './loginEndpointUrl';
@Injectable({
  providedIn: 'root',
})
export class LoginserviceService {
  baseurl = environment.appURL;

  //use in html
  InquiryModel: InquiryModel = new InquiryModel();

  constructor(
    private http: HttpClient,
    private endPoint: loginEndpointUrl,
    private router: Router,
    private encrypt: EncryptionService
  ) {}
  token = localStorage.getItem('token'); // or wherever your token is stored
  //Login
  Login(Model: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.Login}`, Model);
  }

  //checking for logined for authguard
  isLoggedIn(): boolean {
    return localStorage.getItem('ktoken') ? true : false;
  }
  // for logout
  removetoken() {
    // Remove only auth-related items (safer than clearing everything)
    localStorage.removeItem('ktoken');
    localStorage.removeItem('systemInfo');
    localStorage.removeItem('fiscalYear');
    localStorage.removeItem('globalVariable');
    localStorage.removeItem('otherInfo');
    localStorage.removeItem('companyInfo');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('allMenu');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionId');
    // localStorage.removeItem('companyLogoMain');
    localStorage.removeItem('branch');
    localStorage.removeItem('branchDepartment');

    // Clear session storage if used for login/session data
    sessionStorage.clear();

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // for token localstorage
  setToken(token: string) {
    localStorage.setItem('ktoken', token);
  }

  //used for returntoken
  Gettoken() {
    // a=1;
    return this.encrypt.decryptionAES(localStorage.getItem('ktoken') || ' ');
    //  return localStorage.getItem('ktoken')
  }

  Gtoken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6WyJLMTExMCIsIlNUS1MiLCJPdXIgQ29tcGFueTEiXSwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJjb21wYW55QGdtYWlsLmNvbSIsImFkZHJlc3MiOiJBbG9rbmFnYXIiLCJtb2JpbGUiOiIxMTExMTExMTEiLCJvdGhlckluZm8iOiJ7XCJpc0VuZ09yTmVwYWxpXCI6dHJ1ZSxcIkFEQlNcIjpudWxsLFwiaXNQcmlmaXhVc2VcIjp0cnVlLFwiaXNTdWZpeFVzZVwiOnRydWUsXCJpc0Zpc2NhbFVzZVwiOnRydWUsXCJkYk5hbWVcIjpudWxsLFwiYnJhbmNoSWRcIjowLFwiZGVjaW1hbFBsYWNlXCI6bnVsbH0iLCJHbG9iYWxWYXJpYWJsZXMiOiJbe1wiVmFyaWFibGVOYW1lXCI6XCJEZWZhdWx0IFByaW50IFBhZ2VzXCIsXCJWYWx1ZVwiOlwiMlwiLFwiTWF4VmFsdWVcIjpcIjEwXCJ9LHtcIlZhcmlhYmxlTmFtZVwiOlwiRGF0ZUZvcm1hdFwiLFwiVmFsdWVcIjpcIjBcIixcIk1heFZhbHVlXCI6XCIwXCJ9LHtcIlZhcmlhYmxlTmFtZVwiOlwiRGVjaW1hbCBQbGFjZVwiLFwiVmFsdWVcIjpcIjJcIixcIk1heFZhbHVlXCI6XCIxMFwifSx7XCJWYXJpYWJsZU5hbWVcIjpcIkRpcmVjdCBWb3VjaGVyIFBvc3RpbmdcIixcIlZhbHVlXCI6XCIxXCIsXCJNYXhWYWx1ZVwiOlwiMFwifSx7XCJWYXJpYWJsZU5hbWVcIjpcIlNob3cgRXhwaXJlZCBJdGVtIGluIFBPU1wiLFwiVmFsdWVcIjpcIjFcIixcIk1heFZhbHVlXCI6XCIwXCJ9LHtcIlZhcmlhYmxlTmFtZVwiOlwiRGlyZWN0IEJpbGwgUHJpbnRcIixcIlZhbHVlXCI6XCIwXCIsXCJNYXhWYWx1ZVwiOlwiMFwifSx7XCJWYXJpYWJsZU5hbWVcIjpcIkxvY2sgU2FsZXMgUmF0ZSBJbiBTYWxlcyBJbnZvaWNlXCIsXCJWYWx1ZVwiOlwiMFwiLFwiTWF4VmFsdWVcIjpcIjBcIn1dIiwiQnJhbmNoIjoie1wiQnJhbmNoRGVwYXJ0bWVudF9JZFwiOjAsXCJCcmFuY2hEZXBhcnRtZW50XCI6XCJDZW50cmFsIEJyYW5jaFwiLFwiQnJhbmNoX0lkXCI6MTAwMX0iLCJGaXNjYWx5ZWFyIjoie1wiZmluYW5jaWFsWWVhcklkXCI6MixcImZyb21EYXRlXCI6XCIyMDI1LTA3LTE3VDAwOjAwOjAwXCIsXCJ0b0RhdGVcIjpcIjIwMjYtMDctMTdUMDA6MDA6MDBcIixcImZpc2NhbFllYXJcIjpcIjIwODIvODNcIixcInNob3J0RGF0ZVwiOlwiMDgyLzgzXCIsXCJjcmVhdGVkRGF0ZVwiOlwiMjAyNS0wNy0xNlQyMzoyMzowNi43OFwiLFwidXNlcklkXCI6MSxcImlzRW5nT3JOZXBcIjpmYWxzZSxcIm5lcFN0YXJ0RGF0ZVwiOlwiXCIsXCJuZXBFbmREYXRlXCI6XCJcIixcIm5lcEZpc2NhbFllYXJcIjpcIlwiLFwibmVwU2hvcnREYXRlXCI6XCJcIixcImJvb2tDbG9zZVwiOjB9IiwiVXNlcklkIjoiMSIsIm5iZiI6MTc2Mzk3Mzg0NywiZXhwIjoxNzY0MDYwMjQ3LCJpYXQiOjE3NjM5NzM4NDd9.WCibLVxEhWtYWBmvTHRhnKNrVoia2c9rK2d1gnTVlww"

  headers = new HttpHeaders({
   Authorization: `Bearer ${this.Gtoken}`,
    'Content-Type': 'application/json',
  });

  // Inquiry
  Inquiry(Model: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.inquiry}`, Model, {
      headers: this.headers,
    });
  }
}
