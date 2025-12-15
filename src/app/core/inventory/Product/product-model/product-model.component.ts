import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductModelService } from './service/product-model.service';
@Component({
  selector: 'app-product-model',
  templateUrl: './product-model.component.html'
})
export class ProductModelComponent implements AfterViewInit {

  showModelForm = true;

  toggleForm() {
    this.showModelForm = !this.showModelForm;
  }

brandDropdownList: any;

  productModelGridList: any;
  productModelGridDetails: any;
  productModel: any;
  deleteData: boolean = true
  productModelDataByID: any;


 

   globalVariablePML: any;
  baseUrlPML: any = '';
  userIdPML: any = ''
  branchIdPML: any = ''
  sessionIdPML: any = ''
  fiscalPML: any = ''
  otherInfoPML: any = ''
  userPML: any = '';
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

constructor(private el: ElementRef, public service: ProductModelService, private toastr: ToastrService) {

  }
  ngAfterViewInit(): void {
this.globalVariablePML = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPML = localStorage.getItem("baseUrl")
    this.userIdPML = localStorage.getItem("userId");

    this.branchIdPML = localStorage.getItem("branch");
    this.sessionIdPML = localStorage.getItem("sessionId");
    this.fiscalPML = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPML = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPML = JSON.parse(localStorage.getItem("userInfo") || '');


this.enterFun();
    $(this.el.nativeElement).find('select').select2();

    this.getProductModelDropdownList()
    this.getProductModelFilteredList()
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



  //Get product Model  dropdownlists
    getProductModelDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPML,
        "fiscalID": this.fiscalPML.financialYearId,
        "branchDepartmentId": 1001,
        "branchId": this.branchIdPML,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPML.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPML.fromDate,
        "fromDate": this.fiscalPML.fromDate,
        "endDate": this.fiscalPML.toDate,
        "toDate": this.fiscalPML.toDate,
        "decimalPlace": this.globalVariablePML[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPML,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "ProductModel",
    "listNameId": "[\"modelBrand\"]",
    "conditionalvalues": "",
    "isSingleList": "true",
    "singleListNameStr": ""
      



    };

    this.service.getProductModelDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product model dropdown data');
        if (result) {
           this.brandDropdownList=result[0]
         
          //  console.log(result,"product brand dropdown data");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }



  //Get product model list
    getProductModelFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductModel--ProductModel",
    "columnName": "",
    "strName": $('#modelSearchString').val(),
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": "[\"\"]",
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": ""
  },
  "mainInfoModel": {
     "userId": this.userIdPML,
    "fiscalID": this.fiscalPML.financialYearId,
    "branchDepartmentId":this.branchIdPML,
    "branchId": this.branchIdPML,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPML.isEngOrNepali,
    "isMenuVerified": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPML.fromDate,
    "fromDate": this.fiscalPML.fromDate,
    "endDate": this.fiscalPML.toDate,
    "toDate": this.fiscalPML.toDate,
    "decimalPlace": this.globalVariablePML[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPML,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": false
  
    };




    this.service.getProductModelFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product model data list');
        if (result) {
           this.productModelGridList=result[0]
           this.productModelGridDetails=result[1]
          
          //  console.log(this.productModelGridList,"model gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=this.productModelGridDetails?.totalRecords
          // this.pageSize=this.productModelGridDetails?.pageSize
          // this.pageIndex=this.productModelGridDetails?.currentPageNumber - 1
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }



     validation() {
  
  if (this.productModel.productmodelModel.model == null ||  this.productModel.productmodelModel.model == "") {
    $('#modelName').focus();
    this.toastr.error("Model Name is required");
    return false
  }

 else if ( $('#brand').val() == null ||  $('#brand').val() == "") {
    $('#brand').focus();
    this.toastr.error("Brand is required");
    return false
  }
  return true
}



// post data of product Brand form
    onSubmitProductModel() {

      this.productModel = {  

        "productmodelModel": {
     "modelID": this.service.productModel.modelID||0,
    "model": this.service.productModel.modelName?.replace(/\s+/g, ' ').trim(),
    "brandID":$("#brand").val(),
    "remarks": this.service.productModel.modelRemarks,
    "status": $("#modelStatus").val()=="1"? 1:0,
    "extra1": "",
    "extra2": "",
    "cid": ""
  },
  "maininfo": {
    "userId": this.userIdPML,
    "fiscalID": this.fiscalPML.financialYearId,
    "branchDepartmentId": this.branchIdPML,
    "branchId": this.branchIdPML,
    "dbName": "",
    "isEngOrNepaliDate":  this.otherInfoPML.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPML.fromDate,
    "fromDate": this.fiscalPML.fromDate,
    "endDate": this.fiscalPML.toDate,
    "toDate": this.fiscalPML.toDate,
    "decimalPlace": this.globalVariablePML[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPML,
    "id": 0,
    "searchtext": "",
    "cid": 0
  }
      }
    
      // console.log(this.productModel, "model model")
        this.InsertProductModel()
     
    }

        InsertProductModel() {
        
      if (this.validation() == true) {
        this.service.insertUpdateProductModel(this.productModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.errors);
            $('#modelName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductModel()
              // this.getProductModelDropdownList()
               this.getProductModelFilteredList()
            
            setTimeout(() => {
  
              $('#modelName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#modelName').focus();
          }
  
        )
  
      }
    }


    //Edit model
   getProductModelById(Id: any) {
     

 let Model = {
     "userId": this.userIdPML,
  "fiscalID": this.fiscalPML.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPML,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPML.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPML.fromDate,
  "fromDate": this.fiscalPML.fromDate,
  "endDate": this.fiscalPML.toDate,
  "toDate": this.fiscalPML.toDate,
  "decimalPlace": this.globalVariablePML[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPML,
  "id": Id,
  "searchtext": "",
  "cid": 0

    };

      this.service.getProductModelByID(Model).subscribe((d: any) => {
        
        // console.log("get product model by id ",d);

              if(d?.returnMsg.success==true){
 this.productModelDataByID = d?.details;
       
        //  console.log("get product model by id",this.productModelDataByID);
  
         this.EditProductBrand(this.productModelDataByID);
          
      }
      else if(d?.returnMsg.success==false){
this.toastr.info(d?.returnMsg.errors)
      }
      });
  
    }


     EditProductBrand(value: any) {
       this.deleteData = false 
this.submitButton='Update'
       this.service.productModel.modelID = value?.modelID
      this.service.productModel.modelName = value?.model
      this.service.productModel.modelRemarks = value?.remarks
     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
       
        if ($('#brand').length) {
          const dropdown = document.getElementById("brand") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.brandID; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

         if ($('#modelStatus').length) {
          const dropdown = document.getElementById("modelStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.mStatus=='True'?"1":"0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);
     
  
       $('#modelName').focus()
     
    }



//Reset
         resetProductModel() {
  this. pageIndex = 0;

    this.service.productModel.modelID = 0
      this.service.productModel.modelName = ""
      this.service.productModel.modelRemarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

        if ($('#brand').length) {
        const dropdown = document.getElementById("brand") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#modelStatus').length) {
        const dropdown = document.getElementById("modelStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

     
    }, 100);
    $('#modelName').focus()

this.deleteData=true
this.submitButton='Save'

  }



  ///Delete Conformation
      
       confirmBoxProductModelDelete(Id: any) {
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
              this.DeleteProductModel(Id);
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
      
      
      DeleteProductModel(Id: number) {
      
       let Model = {
           "userId": this.userIdPML,
        "fiscalID": this.fiscalPML.financialYearId,
        "branchDepartmentId": 0,
        "branchId": this.branchIdPML,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPML.isEngOrNepali,
        "isMenuVerified": true,
        "isPrintView": true,
        "filterId": 0,
        "refId": 0,
        "mainId": Id,
        "strId": "",
        "startDate": this.fiscalPML.fromDate,
        "fromDate": this.fiscalPML.fromDate,
        "endDate": this.fiscalPML.toDate,
        "toDate": this.fiscalPML.toDate,
        "decimalPlace": this.globalVariablePML[2].value,
        "bookClose": 0,
        "sessionId":this.sessionIdPML,
        "id": Id,
        "searchtext": "",
        "cid": 0
          };
      
        this.service.deleteProductModel(Model).subscribe((res: any) => {
          if (res?.success == true) {
            this.toastr.success(res?.msg)
            setTimeout(() => {
              //  this.getProductModelDropdownList()
                this.getProductModelFilteredList()
      
            }, 100)
            $('#modelName').focus()
          }
          else if (res.success == false) {
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
    this.getProductModelFilteredList()
  }
   onSearchProductModel(event:any){
     this.getProductModelFilteredList()
  }

}
