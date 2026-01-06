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


    const requestedRoute = state.url.split(/[?#]/)[0];

    // ✅ Define routes that are allowed only for logged-in users    

    const allowedRoutes = ['/dashboard', '/sales/pos', 'organization','/inventory/productgroup','/inventory/productcategory','/inventory/productunit','/inventory/productmanufacturer','/inventory/productbrand','/inventory/productmodel','/inventory/productsize','/inventory/productcreate','/inventory/supply','/inventory/deptstocklocationmapping','/inventory/purchaseorder'];

    if (!this.loginservice.isLoggedIn()) {
      this.toastr.info('Please login to access this page.');
      this.loginservice.removetoken();
      this.router.navigate(['/login']);
      return false;

    }

    
    if (allowedRoutes.includes(requestedRoute) || requestedRoute.startsWith('/inventory')) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}

