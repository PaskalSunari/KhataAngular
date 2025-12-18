import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DeptStockLocationMappingModule { }

export interface Department {
  departmentID: number;
  departmentName: string;
}

export interface User {
  userId: number;
  userName: string;
}

export interface Location {
  locationId: number;
  locationName: string;
}

export interface DrodownListResponse {
  department: Department[];
  user: User[];
  location: Location[];
}
