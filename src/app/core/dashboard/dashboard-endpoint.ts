import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardUrl {
  GetDashboardData: string = 'Account/MyFunction/GetDashboardData';
  GetTransaction: string = 'Account/GlobalUtility/GenericAPI';  

}
