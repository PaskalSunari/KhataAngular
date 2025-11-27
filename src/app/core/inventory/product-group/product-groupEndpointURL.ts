import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productGroupUrl {
  
  getGroupUnderDropdownList: string = 'inventory/FIllList/GetList'

  getProductGroupList: string = `Ministry/Organization/GetList/`;

  insertProductGroup: string =`Ministry/GlobalDropdown/GenericAPI`
}
