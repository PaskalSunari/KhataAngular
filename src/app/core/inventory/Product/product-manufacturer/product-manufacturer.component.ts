import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductManufacturerService } from './service/product-manufacturer.service';
@Component({
  selector: 'app-product-manufacturer',
  templateUrl: './product-manufacturer.component.html'
})
export class ProductManufacturerComponent implements AfterViewInit {
 isSubmitManufacturer:boolean=true
 
 showManufacturerForm = true;

  toggleForm() {
    this.showManufacturerForm = !this.showManufacturerForm;
  }


  productManufacturerGridList: any;
  productManufacturerGridDetails: any;
  productManufacturerModel: any;
  deleteData: boolean = true
  productManufacturerDataByID: any;
  
 globalVariablePM: any;
  baseUrlPM: any = '';
  userIdPM: any = ''
  branchIdPM: any = ''
  sessionIdPM: any = ''
  fiscalPM: any = ''
  otherInfoPM: any = ''
  userPM: any = '';
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

constructor(private el: ElementRef, public service: ProductManufacturerService, private toastr: ToastrService) {

  }
  ngAfterViewInit(): void {
     $('#manufacturerName').focus();
 this.globalVariablePM = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPM = localStorage.getItem("baseUrl")
    this.userIdPM = localStorage.getItem("userId");

    this.branchIdPM = localStorage.getItem("branch");
    this.sessionIdPM = localStorage.getItem("sessionId");
    this.fiscalPM = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPM = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPM = JSON.parse(localStorage.getItem("userInfo") || '');

this.enterFun();
    $(this.el.nativeElement).find('select').select2();

    this.getProductManufacturerFilteredList()
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

//Get product Manufacturer list
    getProductManufacturerFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductManufacturer--ProductManufacturer",
    "columnName": "",
    "strName": $('#manufacturerSearchString').val(),
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": "[\"\"]",
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": ""
  },
  "mainInfoModel": {
     "userId": this.userIdPM,
    "fiscalID": this.fiscalPM.financialYearId,
    "branchDepartmentId":this.branchIdPM,
    "branchId": this.branchIdPM,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPM.isEngOrNepali,
    "isMenuVerified": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPM.fromDate,
    "fromDate": this.fiscalPM.fromDate,
    "endDate": this.fiscalPM.toDate,
    "toDate": this.fiscalPM.toDate,
    "decimalPlace": this.globalVariablePM[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPM,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": false
  
    };




    this.service.getProductManufacturerFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacturer data list');
        if (result) {
           this.productManufacturerGridList=result[0]
           this.productManufacturerGridDetails=result[1]
          
          //  console.log(this.productManufacturerGridList,"gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=this.productManufacturerGridDetails?.totalRecords
          // this.pageSize=this.productManufacturerGridDetails[1]?.pageSize
          // this.pageIndex=this.productManufacturerGridDetails[1]?.currentPageNumber - 1
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }
  
  //Validation
     validation() {
  
  if (this.productManufacturerModel.manufactureData.name == null ||  this.productManufacturerModel.manufactureData.name == "") {
    $('#manufacturerName').focus();
    this.toastr.error("Manufacturer Name is required");
    return false
  }

// else if (this.productManufacturerModel.manufactureData.address == null ||  this.productManufacturerModel.manufactureData.address == "") {
//     $('#manufacturerAddress').focus();
//     this.toastr.error("Address is required");
//     return false
//   }

//   else if (this.productManufacturerModel.manufactureData.contactNo == null ||  this.productManufacturerModel.manufactureData.contactNo == "") {
//     $('#manufacturerContact').focus();
//     this.toastr.error("Contact is required");
//     return false
//   }
//   else if (this.productManufacturerModel.manufactureData.email == null ||  this.productManufacturerModel.manufactureData.email == "") {
//     $('#manufacturerEmail').focus();
//     this.toastr.error("Email is required");
//     return false
//   }
  return true
}


 //post data of product Group form
    onSubmitProductManufacturer() {

      this.productManufacturerModel = {  

        "manufactureData": {

     "manufacturerID": this.service.productManufacturerModel.manufacturerID||0,
    "name": this.service.productManufacturerModel.manufacturerName?.replace(/\s+/g, ' ').trim(),
    "address": this.service.productManufacturerModel.manufacturerAddress?.replace(/\s+/g, ' ').trim(),
    "contactNo": this.service.productManufacturerModel.manufacturerContactNumber,
    "email": this.service.productManufacturerModel.manufacturerEmail?.replace(/\s+/g, ' ').trim(),
    "remarks": this.service.productManufacturerModel.manufacturerRemarks,
    "status": $("#manufacturerStatus").val()=="1"? 1:0,
    "extra1": "",
    "extra2": "",
    "cid": ""
  },
  "maininfo": {
    "userId": this.userIdPM,
    "fiscalID": this.fiscalPM.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPM,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPM.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPM.fromDate,
    "fromDate": this.fiscalPM.fromDate,
    "endDate": this.fiscalPM.toDate,
    "toDate": this.fiscalPM.toDate,
    "decimalPlace": this.globalVariablePM[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPM,
    "id": 0,
    "searchtext": "",
    "cid": 0
  }
      }
    
      // console.log(this.productManufacturerModel, "model")
        // this.InsertProductManufacturer()
      if(this.isSubmitManufacturer==true){
          this.InsertProductManufacturer()
this.isSubmitManufacturer=false
        }
        setTimeout(() => {
this.isSubmitManufacturer=true
        },1000)
    }



      InsertProductManufacturer() {
        // console.log(this.productManufacturerModel);
        
      if (this.validation() == true) {
        this.service.insertUpdateProductManufacturer( this.productManufacturerModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.errors);
            $('#manufacturerName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductManufacturer()
               this.getProductManufacturerFilteredList()
            
            setTimeout(() => {
  
              $('#manufacturerName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#manufacturerName').focus();
          }
  
        )
  
      }
    }


    //Edit
      getProductManufacturerById(Id: any) {
      

 let Model = {
     "userId": this.userIdPM,
  "fiscalID": this.fiscalPM.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPM,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPM.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPM.fromDate,
  "fromDate": this.fiscalPM.fromDate,
  "endDate": this.fiscalPM.toDate,
  "toDate": this.fiscalPM.toDate,
  "decimalPlace": this.globalVariablePM[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPM,
  "id": Id,
  "searchtext": "",
  "cid": 0

    };

      this.service.getProductManufacturerByID(Model).subscribe((d: any) => {
        //  console.log("get product manufacturer by id ",d);
            if(d?.returnMsg?.success==true){
  this.productManufacturerDataByID = d?.details;
        //  console.log("get product unit by id in array ",this.productManufacturerDataByID);
  
      this.EditProductManufacturer(this.productManufacturerDataByID);
      }
      else if(d?.returnMsg?.success==false){
this.toastr.info(d?.returnMsg?.errors)
      }
        // this.productManufacturerDataByID = d?.details;
        // console.log("get product manufacturer by id ",d);
  
        // this.EditProductManufacturer(this.productManufacturerDataByID);
      });
  
    }


     EditProductManufacturer(value: any) {
      this.deleteData = false  
this.submitButton='Update'
       this.service.productManufacturerModel.manufacturerID = value?.manufacturerID
      this.service.productManufacturerModel.manufacturerName = value?.name
      this.service.productManufacturerModel.manufacturerAddress = value?.address
      this.service.productManufacturerModel.manufacturerContactNumber = value?.contactNo
      this.service.productManufacturerModel.manufacturerEmail =value?.email
      this.service.productManufacturerModel.manufacturerRemarks = value?.remarks
     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
       
        if ($('#manufacturerStatus').length) {
          const dropdown = document.getElementById("manufacturerStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.status=='True'?"1":"0" // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

      }, 100);
     
  
       $('#manufacturerName').focus()
     
    } 


    ///Delete Conformation
        
         confirmBoxProductManufacturerDelete(Id: any) {
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
                this.DeleteProductManufacturer(Id);
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
        
        
        DeleteProductManufacturer(Id: number) {
        
         let Model = {
             "userId": this.userIdPM,
          "fiscalID": this.fiscalPM.financialYearId,
          "branchDepartmentId": 0,
          "branchId": this.branchIdPM,
          "dbName": "",
          "isEngOrNepaliDate": this.otherInfoPM.isEngOrNepali,
          "isMenuVerified": true,
          "isPrintView": true,
          "filterId": 0,
          "refId": 0,
          "mainId": 0,
          "strId": "",
          "startDate": this.fiscalPM.fromDate,
          "fromDate": this.fiscalPM.fromDate,
          "endDate": this.fiscalPM.toDate,
          "toDate": this.fiscalPM.toDate,
          "decimalPlace": this.globalVariablePM[2].value,
          "bookClose": 0,
          "sessionId":this.sessionIdPM,
          "id": Id,
          "searchtext": "",
          "cid": 0
            };
        
          this.service.deleteProductManufacturer(Model).subscribe((res: any) => {
            if (res?.success == true) {
              this.toastr.success(res?.msg)
              setTimeout(() => {
                 
                  this.getProductManufacturerFilteredList()
        
              }, 100)
              $('#manufacturerName').focus()
            }
            else if (res.success == false) {
              this.toastr.error(res?.errors)
            }
          }, (error:any) => {
            this.toastr.error(error?.error?.Message)
          })
        
        
        }

    //Reset
       resetProductManufacturer() {
  this. pageIndex = 0;

    this.service.productManufacturerModel.manufacturerID = 0
      this.service.productManufacturerModel.manufacturerName = ""
      this.service.productManufacturerModel.manufacturerAddress = ""
      this.service.productManufacturerModel.manufacturerContactNumber = ""
      this.service.productManufacturerModel.manufacturerEmail = ""
      this.service.productManufacturerModel.manufacturerRemarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event


      if ($('#manufacturerStatus').length) {
        const dropdown = document.getElementById("manufacturerStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


      
     
    }, 100);
    $('#manufacturerName').focus()

this.deleteData=true
this.submitButton='Save'

  }



  onSearchProductUnit(event:any){
     this.getProductManufacturerFilteredList()
  }
    handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductManufacturerFilteredList()
  }
}
