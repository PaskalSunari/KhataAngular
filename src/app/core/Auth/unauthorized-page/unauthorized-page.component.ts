import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginserviceService } from '../login/loginservice.service';
@Component({
  selector: 'hms-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
})
export class UnauthorizedPageComponent {
  constructor(
    private router: Router,
    private loginservice: LoginserviceService
  ) {}

  changeRouting() {
    if (this.loginservice.isLoggedIn()) {
      if (localStorage.getItem('MLogin')) {
        this.router.navigate(['organization/mdashboard']);
      }
    } else {
      if (localStorage.getItem('PLogin')) {
        this.router.navigate(['/appointment/appointmentdashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      this.loginservice.removetoken();
    }
  }
}
