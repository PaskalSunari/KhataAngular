import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/Auth/login/login.component';
import { LayoutComponent } from './core/shared/components/layouts/layout/layout.component';
import { AuthGuardService } from './core/Auth/Authguard/authentication.guard';
import { UnauthorizedPageComponent } from './core/Auth/unauthorized-page/unauthorized-page.component';
import { PageNotFoundComponent } from './core/404/page-not-found/page-not-found.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { PolicyComponent } from './core/Auth/policy-page/policy/policy.component';
import { TermsAndconditionComponent } from './core/Auth/terms-condition-page/terms-andcondition/terms-andcondition.component';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', component: LoginComponent },
      {
        path: 'unauthorization',
        component: UnauthorizedPageComponent,
      },
      {
        path: 'policy/index',
        component: PolicyComponent,
      },
      {
        path: 'TermsConditions/Index',
        component: TermsAndconditionComponent,
      },
      {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          {
            path: 'sales',
            loadChildren: () =>
              import('./core/sales/sales.module').then((m) => m.SalesModule),
          },

           {
            path: 'inventory',
            loadChildren: () =>
              import('./core/inventory/inventory.module').then((m) => m.InventoryModule),
          },
        ],
      },

      //    {
      // path: '',
      // component: LayoutComponent,
      // canActivate: [AuthGuardService],
      // children: [
      // { path: '', component: DashboardComponent },
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'changepassword', component: ChangePasswordComponent },
      // { path: 'profile', component: ChangeProfileComponent },

      // {
      //   path: 'organization',
      //   loadChildren: () =>
      //     import('./core/Organization/organization.module').then(
      //       (m) => m.OrganizationModule
      //     ),
      // },

      // ],
      //  },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
