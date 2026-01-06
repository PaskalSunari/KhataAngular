import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class productManufacturerUrl {

  insertUpdateProductManufacturer: string =`inventory/Manufacturer/AddEditManufacturer`
  getProductManufacturerDataByID:string='inventory/Manufacturer/GetManufacturerById'
  deleteProductManufacturer:string='inventory/Manufacturer/DeleteManufacturer'
  productManufacturerFilteredData:string='inventory/CommonInventoryPagi/GetFilterAnyDataPaginationInventory'
}
