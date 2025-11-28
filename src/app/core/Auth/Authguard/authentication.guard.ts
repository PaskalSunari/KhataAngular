import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginserviceService } from '../../../core/Auth/login/loginservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private loginservice: LoginserviceService,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // ✅ Extract only the clean route path (remove query params and hash)
    const requestedRoute = state.url.split(/[?#]/)[0];

    // ✅ Define routes that are allowed only for logged-in users
    const allowedRoutes = ['/dashboard', '/sales/pos', 'organization','/inventory/productgroup','/inventory/productcategory','/inventory/productunit','/inventory/productmanufacturer','/inventory/productbrand','/inventory/productmodel','/inventory/productsize','/inventory/demand'];

    // 🚫 If not logged in → redirect to login
    if (!this.loginservice.isLoggedIn()) {
      this.toastr.info('Please login to access this page.');
      this.loginservice.removetoken();
      this.router.navigate(['/login']);
      return false;

    }

    // ✅ Allow route access if it’s in the allowed list
    if (allowedRoutes.includes(requestedRoute)) {
      return true;
    }

    // 🔁 Otherwise redirect to dashboard (default page)
    this.router.navigate(['/dashboard']);
    return false;
  }
}

//Note:
// allowedRoutes → Array of strings (['/dashboard', '/sales/pos', 'organization'])
// requestedRoute → String ('/dashboard')