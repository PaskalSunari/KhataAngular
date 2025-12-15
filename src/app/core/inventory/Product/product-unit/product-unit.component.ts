import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
import { Validators } from '@angular/forms';
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductUnitService } from './service/product-unit.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-unit',
  templateUrl: './product-unit.component.html',
   providers: [DatePipe] 
})
export class ProductUnitComponent implements AfterViewInit {
 showUnitForm = true;
 unitTypeStatus:boolean=true
unitTypeDropdownList:any;
  firstUnitDropdownList: any;
  secondUnitDropdownList: any;

  productUnitGridList: any;
  productUnitGridDetails: any;
  productUnitModel: any;
  deleteData: boolean = true
  productUnitDataByID: any;

  toggleForm() {
    this.showUnitForm = !this.showUnitForm;
  }

   globalVariablePU: any;
  baseUrlPU: any = '';
  userIdPU: any = ''
  branchIdPU: any = ''
  sessionIdPU: any = ''
  fiscalPU: any = ''
  otherInfoPU: any = ''
  userPU: any = '';
  submitButton: any = 'Save'

   //pagination variable
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

constructor(private el: ElementRef, public service: ProductUnitService, private toastr: ToastrService,public datePipe:DatePipe) {}
  ngAfterViewInit(): void {

     this.globalVariablePU = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPU = localStorage.getItem("baseUrl")
    this.userIdPU= localStorage.getItem("userId");

    this.branchIdPU = localStorage.getItem("branch");
    this.sessionIdPU = localStorage.getItem("sessionId");
    this.fiscalPU = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPU = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPU = JSON.parse(localStorage.getItem("userInfo") || '');

this.enterFun();
    $(this.el.nativeElement).find('select').select2();


     if ($('#unitType').length) {
          const dropdown = document.getElementById("unitType") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

this.getProductUnitDropdownList()
 this.getProductUnitFilteredList()

     let self = this;

       $('#unitType').on('change', function (event: any) {
      if (event.target.value == "1"||event.target.value == "3") {
       self.unitTypeStatus=true

          if ($('#firstUnit').length) {
        const dropdown = document.getElementById("firstUnit") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

         if ($('#secondUnit').length) {
        const dropdown = document.getElementById("secondUnit") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
      self.service.productUnitModel.conversionFactor=0

      }
      else if (event.target.value == "2") {
       self.unitTypeStatus=false

       self.service.productUnitModel.formalName=''
        self.service.productUnitModel.symbol=''
        self.service.productUnitModel.numberOfDecimalPlace=0

      }
    })


//        $('#filterByCategory').on('change', function (event: any) {
//     if(event.target.value){
// //  self.getProductCategoryFilteredList()
//     }
//      })

//       $('#filterByUnderCategory').on('change', function (event: any) {
//     if(event.target.value){
// //  self.getProductCategoryFilteredList()
//     }
//      })
  }
    // Enter functon
  enterFun() {
    $(document).ready(function () {
      // Keydown event handler for inputs and selects
      $('input, select, .focussable, textarea ,button').on(
        'keydown blur',
       function (this: HTMLElement, event: any) {
          if (event.keyCode === 13) {
            event.preventDefault();
            const current = $(event.target);
            if (!current.hasClass('select2-hidden-accessible')) {
              setFocusOnNextElement.call(current);
            }
          }
        }
      );

      $('select').on('select2:close', function (this: HTMLElement, event: any) {
        const $this = $(this);
        // Wait for Select2 dropdown to close completely
        setTimeout(() => {
          setFocusOnNextElement.call($this);
        }, 0);
      });
    });
  }

  // currentDate(){
  //   //  return this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //   return  new Date().toISOString(); 
  // }

  getCurrentDateTime(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


  //Get product category  dropdownlists
    getProductUnitDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPU,
        "fiscalID": this.fiscalPU.financialYearId,
        "branchDepartmentId": 1001,
        "branchId": this.branchIdPU,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPU.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPU.fromDate,
        "fromDate": this.fiscalPU.fromDate,
        "endDate": this.fiscalPU.toDate,
        "toDate": this.fiscalPU.toDate,
        "decimalPlace": this.globalVariablePU[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPU,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "ProductUnit",
    "listNameId":"[\"firstUnit\",\"secondUnit\"]",
    "conditionalvalues": "",
    "isSingleList": "false",
    "singleListNameStr": ""

    };

    this.service.getProductUnitDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product unit dropdown  data');
        if (result) {
          //  this.unitTypeDropdownList=result[0]
           this.firstUnitDropdownList=result[0]
             this.secondUnitDropdownList=result[1]
          //  console.log(result,"product unit dropdown data");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }



  //Get product category list
    getProductUnitFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "UnitCreate--UnitCreate",
    "columnName": "",
    "strName": $('#productUnitSearchString').val(),
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": `[\"group--\"]`,
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": ""
  },
  "mainInfoModel": {
     "userId": this.userIdPU,
    "fiscalID": this.fiscalPU.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPU,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPU.isEngOrNepali,
    "isMenuVerified": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPU.fromDate,
    "fromDate": this.fiscalPU.fromDate,
    "endDate": this.fiscalPU.toDate,
    "toDate": this.fiscalPU.toDate,
    "decimalPlace": this.globalVariablePU[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPU,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": false
  
    };




    this.service.getProductUnitFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product unit data list');
        if (result) {
           this.productUnitGridList=result[0]
           this.productUnitGridDetails=result[1]
          
          //  console.log(this.productCategoryGridList,"gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=this.productUnitGridDetails?.totalRecords
          // this.pageSize=this.productGroupGridList[1]?.pageSize
          // this.pageIndex=this.productGroupGridList[1]?.currentPageNumber - 1
          //  console.log(result,"productGroupgridlist");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


   validation() {
  if($("#unitType").val()==1||$("#unitType").val()==3){

 
  if (this.productUnitModel.unitData.formalName == null ||  this.productUnitModel.unitData.formalName == "") {
    $('#formalName').focus();
    this.toastr.error("Formal Name is required");
    return false
  }
 else if (this.productUnitModel.unitData.symbol == null ||  this.productUnitModel.unitData.symbol == "") {
    $('#symbol').focus();
    this.toastr.error("Symbol is required");
    return false
  }

   else if (this.service.productUnitModel.numberOfDecimalPlace == null ||  this.service.productUnitModel.numberOfDecimalPlace < 1) {
    $('#decimalPlace').focus();
    this.toastr.error("Number of Decimal place is required");
    return false
  }

  //   else if (Validators.pattern(/^[0-9]+$/)) {
  //   $('#decimalPlace').focus();
  //   this.toastr.error("Number of Decimal place is required");
  //   return false
  // }

   }
  else{
  if ( $('#firstUnit').val() == null ||  $('#firstUnit').val() == "") {
    $('#firstUnit').focus();
    this.toastr.error("First Unit is required");
    return false
  }
   else if (this.service.productUnitModel.conversionFactor == null ||  this.service.productUnitModel.conversionFactor<1) {
    $('#conversionFactor').focus();
    this.toastr.error("Conversion Factor is required");
    return false
  }
  else if ( $('#secondUnit').val() == null ||  $('#secondUnit').val() == "") {
    $('#secondUnit').focus();
    this.toastr.error("Second Unit is required");
    return false
  }
  
  }
  return true
}


 //post data of product Group form
    onSubmitProductUnit() {
      this.productUnitModel = {  


 "unitData": {
      "unitID": this.service.productUnitModel.productUnitID||0,
    "formalName": this.service.productUnitModel.formalName?.replace(/\s+/g, ' ').trim(),
    "symbol": this.service.productUnitModel.symbol?.replace(/\s+/g, ' ').trim(),
    "digitAfterDecimal": this.service.productUnitModel.numberOfDecimalPlace,
    "unitType": $("#unitType").val(),
    "baseUnitID": 0,
    "description": this.service.productUnitModel.productUnitRemarks,
    "status": $("#unitStatus").val()=="1"? 1:0,
    "createdBy":  this.userIdPU,
    "createdDate":  this.getCurrentDateTime(),
    "updatedBy":  this.userIdPU,
    "updatedDate":  this.getCurrentDateTime(),
    "extra1":  this.userIdPU,
    "extra2":  this.branchIdPU,
    "factrolValue": this.service.productUnitModel.conversionFactor||0,
    "unitTypeName": "",
    "firstUnit": $("#firstUnit").val()||0,
    "secondUnit": $("#secondUnit").val()||0,
    "isEditable": true
  },

  "mainInfoModel": {
    "userId": this.userIdPU,
    "fiscalID": this.fiscalPU.financialYearId,
    "branchDepartmentId": this.branchIdPU,
    "branchId": this.branchIdPU,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPU.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPU.fromDate,
    "fromDate": this.fiscalPU.fromDate,
    "endDate": this.fiscalPU.toDate,
    "toDate": this.fiscalPU.toDate,
    "decimalPlace": this.globalVariablePU[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPU,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
      }
    
      // console.log(this.productUnitModel, "model")
        this.InsertProductUnit()
     
    }



      InsertProductUnit() {
        // console.log(this.productUnitModel);
        
      if (this.validation() == true) {
        this.service.insertUpdateProductUnit( this.productUnitModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.errors);
            $('#unitType').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductUnit()
              this.getProductUnitDropdownList()
               this.getProductUnitFilteredList()
            
            setTimeout(() => {
  
             $('#unitType').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
             $('#unitType').focus()
          }
  
        )
  
      }
    }


        getProductUnitById(Id: any) {
      

 let Model = {
     "userId": this.userIdPU,
  "fiscalID": this.fiscalPU.financialYearId,
  "branchDepartmentId":this.branchIdPU,
  "branchId": this.branchIdPU,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPU.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": Id,
  "strId": "",
  "startDate": this.fiscalPU.fromDate,
  "fromDate": this.fiscalPU.fromDate,
  "endDate": this.fiscalPU.toDate,
  "toDate": this.fiscalPU.toDate,
  "decimalPlace": this.globalVariablePU[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPU,
  "id": Id,
  "searchtext": "",
  "cid": 0

    };

      this.service.getProductUnitByID(Model).subscribe((d: any) => {
      if(d?.returnMsg?.success==true){
 this.productUnitDataByID = d?.viewData;
        // console.log("get product unit by id ",d);
        //  console.log("get product unit by id in array ",this.productUnitDataByID);
  
        this.EditProductUnit(this.productUnitDataByID);
      }
      else if(d?.returnMsg?.success==false){
this.toastr.info(d?.returnMsg?.errors)
      }
       
      });
  
    }


        EditProductUnit(value: any) {
            this.deleteData = false
this.submitButton='Update'
      this.service.productUnitModel.productUnitID = value?.unitID
      this.service.productUnitModel.formalName = value?.formalName
      this.service.productUnitModel.symbol = value?.symbol
      this.service.productUnitModel.numberOfDecimalPlace=value?.digitAfterDecimal
      this.service.productUnitModel.conversionFactor=value?.factrolValue
       this.service.productUnitModel.productUnitRemarks = value?.description



     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
        if ($('#unitType').length) {
          const dropdown = document.getElementById("unitType") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.unitType; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      
         if ($('#firstUnit').length) {
          const dropdown = document.getElementById("firstUnit") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.firstUnit; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

         if ($('#secondUnit').length) {
          const dropdown = document.getElementById("secondUnit") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.secondUnit; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

          if ($('#unitStatus').length) {
          const dropdown = document.getElementById("unitStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.status==1?"1":"0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }




      }, 100);
     
  
       $('#unitType').focus()
     
    }

//Reset 
         resetProductUnit() {
  this. pageIndex = 0;

 this.service.productUnitModel.productUnitID = 0
      this.service.productUnitModel.formalName = ''
      this.service.productUnitModel.symbol = ''
      this.service.productUnitModel.numberOfDecimalPlace=0
      this.service.productUnitModel.conversionFactor=0
       this.service.productUnitModel.productUnitRemarks =''
    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

     
        if ($('#unitType').length) {
          const dropdown = document.getElementById("unitType") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      
         if ($('#firstUnit').length) {
          const dropdown = document.getElementById("firstUnit") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value ="0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

         if ($('#secondUnit').length) {
          const dropdown = document.getElementById("secondUnit") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

          if ($('#unitStatus').length) {
          const dropdown = document.getElementById("unitStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

     
    }, 100);
    $('#unitType').focus()

this.deleteData=true
this.submitButton='Save'

  }



   ///Delete Conformation
    
     confirmBoxProductUnitDelete(Id: any) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('Are you sure?');
      confirmBox.setMessage('Confirm to Delete !');
      confirmBox.setButtonLabels('YES', 'NO');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER,
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT,
      });
      // Simply open the popup and listen which button is clicked
      if (this.deleteData== true) {
    
    
        confirmBox.openConfirmBox$().subscribe(resp => {
          // do some action after user click on a button
          if (resp.success === true && resp.clickedButtonID === 'yes') {
            this.DeleteProductUnit(Id);
            // this.toastr.error("No Permission to delete")
    
          }
        });
      }
      else {
        this.toastr.error("Complete pending task!")
      }
      setTimeout(() => {
    
        $('.ed-btn-danger').focus()
    
        $('.ed-btn-danger').on('keydown', (e:any) => {
          if (e.key === 'ArrowRight') {
            $('.ed-btn-secondary').focus()
          }
        })
    
        $('.ed-btn-secondary').on('keydown', (e:any) => {
          if (e.key === 'ArrowLeft') {
            $('.ed-btn-danger').focus()
          }
        })
    
    
      }, 0)
    
    }
    
    
    DeleteProductUnit(Id: number) {
    
     let Model = {
         "userId": this.userIdPU,
      "fiscalID": this.fiscalPU.financialYearId,
      "branchDepartmentId": 0,
      "branchId": this.branchIdPU,
      "dbName": "",
      "isEngOrNepaliDate": this.otherInfoPU.isEngOrNepali,
      "isMenuVerified": true,
      "isPrintView": true,
      "filterId": 0,
      "refId": 0,
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPU.fromDate,
      "fromDate": this.fiscalPU.fromDate,
      "endDate": this.fiscalPU.toDate,
      "toDate": this.fiscalPU.toDate,
      "decimalPlace": this.globalVariablePU[2].value,
      "bookClose": 0,
      "sessionId":this.sessionIdPU,
      "id": Id,
      "searchtext": "",
      "cid": 0
        };
    
      this.service.deleteProductUnit(Model).subscribe((res: any) => {
        if (res?.success == true) {
          this.toastr.success(res?.msg)
          setTimeout(() => {
             this.getProductUnitDropdownList()
              this.getProductUnitFilteredList()
    
          }, 100)
          $('#unitType').focus()
        }
        else if (res?.success == false) {
          this.toastr.error(res?.errors)
        }
      }, (error:any) => {
        this.toastr.error(error?.error?.Message)
      })
    
    
    }

    handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductUnitFilteredList()
  }

  onSearchProductUnit(event:any){
     this.getProductUnitFilteredList()
  }

}
