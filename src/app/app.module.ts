import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {
  ConfirmBoxConfigModule,
  DialogConfigModule,
  NgxAwesomePopupModule,
  ToastNotificationConfigModule,
} from '@costlydeveloper/ngx-awesome-popup';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './core/Auth/login/login.component';
import { SharedModule } from './core/shared/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { TokenInterceptorService } from './core/encryptionservice/returntoken/token-interceptor.service';
import { PolicyComponent } from './core/Auth/policy-page/policy/policy.component';
import { TermsAndconditionComponent } from './core/Auth/terms-condition-page/terms-andcondition/terms-andcondition.component';
@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent,PolicyComponent,TermsAndconditionComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule, 
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'decreasing',
      timeOut: 2000,
      preventDuplicates: true,
    }),
    NgxAwesomePopupModule.forRoot({
      colorList: {
        success: '#146A42',
        info: '#2f8ee5',
        warning: '#ffc107',
        danger: '#CC2333',
        customOne: '#3ebb1a',
        customTwo: '#bd47fa',
      },
    }),
    ConfirmBoxConfigModule.forRoot(),
    DialogConfigModule.forRoot(),
    ToastNotificationConfigModule.forRoot(),
  ],
  providers: [CookieService,   {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
