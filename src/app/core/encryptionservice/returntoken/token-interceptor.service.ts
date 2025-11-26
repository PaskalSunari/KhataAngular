import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginserviceService } from '../../Auth/login/loginservice.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginserviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.Gettoken();

    if (token) {
      // make clones the request and adds the Authorization header
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);  // send request with token
    }

    return next.handle(req); // send request without token
  }
}

//Interceptor ले Angular बाट जाने सबै HTTP requests capture गर्छ र तिनीहरूलाई modify गर्न सक्छ।
//your http.post() --> creates HttpRequest --> passes through interceptors --> next.handle(req) forwards it