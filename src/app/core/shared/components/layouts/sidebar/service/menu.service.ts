// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { EncryptionService } from 'src/app/core/encryptionservice/encryption.service';
// @Injectable({
//   providedIn: 'root'
// })
// export class MenuService {

//   constructor(private http:HttpClient ,private encrypt: EncryptionService,) { }
//   baseserverUrl= environment.appURL;

//   //AssignedMenuList
//   AssignedMenuList() {
//     return this.http.get(this.baseserverUrl + 'Authorization/Auth/AssignedMenuList');
//   }


//     getDropdown = 'MasterSetup/Utility/getDropDownList?DropDownType='
//     getDropDown(params: string) {
//     return this.http.get(`${this.baseserverUrl}${this.getDropdown}${params}`);
//   }



//   getmenulist(){

//     const Headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.encrypt.decryptionAES(localStorage.getItem("jwt_Token"))}`
//   });

//   return this.http.get(`${this.baseserverUrl}${"ministry/Menu/GetMenuList/"}${localStorage.getItem("Code")}`, {
//     headers: Headers
//   });
//   }





// }
