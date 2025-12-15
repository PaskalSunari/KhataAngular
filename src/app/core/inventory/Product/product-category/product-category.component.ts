import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductCategoryService } from './service/product-category.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html'
})
export class ProductCategoryComponent implements AfterViewInit {
  showCategoryForm = true;
  productCategoryUnderDropdownList: any;
  productCategorySearchDropdownList: any;
  productCategoryUnderSearchDropdownList: any;

  productCategoryGridList: any;
  productCategoryGridDetails: any;
  productCategoryModel: any;
  deleteData: boolean = true
  productCategoryDataByID: any;


  toggleForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  globalVariablePG: any;
  baseUrlPG: any = '';
  userIdPG: any = ''
  branchIdPG: any = ''
  sessionIdPG: any = ''
  fiscalPG: any = ''
  otherInfoPG: any = ''
  userPG: any = '';
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

  constructor(private el: ElementRef, public service: ProductCategoryService, private toastr: ToastrService) {

  }
  ngAfterViewInit(): void {

    this.globalVariablePG = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPG = localStorage.getItem("baseUrl")
    this.userIdPG = localStorage.getItem("userId");

    this.branchIdPG = localStorage.getItem("branch");
    this.sessionIdPG = localStorage.getItem("sessionId");
    this.fiscalPG = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPG = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPG = JSON.parse(localStorage.getItem("userInfo") || '');


    this.enterFun();
    $(this.el.nativeElement).find('select').select2();

     this.getProductCategoryDropdownList()
     this.getProductCategoryFilteredList()

let self=this
      $('#filterByCategory').on('change', function (event: any) {
    if(event.target.value){
 self.getProductCategoryFilteredList()
    }
     })

      $('#filterByUnderCategory').on('change', function (event: any) {
    if(event.target.value){
 self.getProductCategoryFilteredList()
    }
     })
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

//Get product category  dropdownlists
    getProductCategoryDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPG,
        "fiscalID": this.fiscalPG.financialYearId,
        "branchDepartmentId": 1001,
        "branchId": this.branchIdPG,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPG.fromDate,
        "fromDate": this.fiscalPG.fromDate,
        "endDate": this.fiscalPG.toDate,
        "toDate": this.fiscalPG.toDate,
        "decimalPlace": this.globalVariablePG[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPG,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "ProductCategory",
    "listNameId": "[\"underCategory\",\"productCategorySearch\",\"underCategorySearch\"]",
    "conditionalvalues": "",
    "isSingleList": "false",
    "singleListNameStr": ""
      



    };

    this.service.getProductCategoryDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product under data');
        if (result) {
           this.productCategoryUnderDropdownList=result[0]
           this.productCategorySearchDropdownList=result[1]
             this.productCategoryUnderSearchDropdownList=result[2]
          //  console.log(result,"product dropdown data");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


//Get product category list
    getProductCategoryFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductCategory--ProductCategory",
    "columnName": "",
    "strName": "",
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": `[\"category--${$('#filterByCategory').val()==0?'':$('#filterByCategory').val()}\",\"underCategory--${$('#filterByUnderCategory').val()==0?'':$('#filterByUnderCategory').val()}\"]`,
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": "string"
  },
  "mainInfoModel": {
     "userId": this.userIdPG,
    "fiscalID": this.fiscalPG.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPG,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPG.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPG.fromDate,
    "fromDate": this.fiscalPG.fromDate,
    "endDate": this.fiscalPG.toDate,
    "toDate": this.fiscalPG.toDate,
    "decimalPlace": this.globalVariablePG[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPG,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": true
    };




    this.service.getProductCategoryFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product category data list');
        if (result) {
           this.productCategoryGridList=result[0]
           this.productCategoryGridDetails=result[1]
          
          //  console.log(this.productCategoryGridList,"gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=result[1]?.totalRecords
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
  
  if (this.productCategoryModel.productcategory.categoryName == null ||  this.productCategoryModel.productcategory.categoryName == "") {
    $('#productCategoryName').focus();
    this.toastr.error("Product Category Name is required");
    return false
  }

 else if ( $('#productCategoryUnder').val() == null ||  $('#productCategoryUnder').val() == "") {
    $('#productCategoryUnder').focus();
    this.toastr.error("Product Category Under is required");
    return false
  }
  return true
}


 //post data of product Category form
    onSubmitProductCategory() {

      this.productCategoryModel = {  

        "productcategory": {
     "categoryID": this.service.productCategoryModel.productCategoryID,
    "categoryName": this.service.productCategoryModel.productCategoryName?.replace(/\s+/g, ' ').trim(),
    "parentID":$("#productCategoryUnder").val(),
    "remarks": this.service.productCategoryModel.productCategoryRemarks,
    "status": $("#productCategoryStatus").val()=="1"? 1:0,
    "extra1": "",
    "extra2": "",
    "cid": ""
  },
  "maininfo": {
    "userId": this.userIdPG,
    "fiscalID": this.fiscalPG.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPG,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPG.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPG.fromDate,
    "fromDate": this.fiscalPG.fromDate,
    "endDate": this.fiscalPG.toDate,
    "toDate": this.fiscalPG.toDate,
    "decimalPlace": this.globalVariablePG[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPG,
    "id": 0,
    "searchtext": "",
    "cid": 0
  }
      }
    
      // console.log(this.productCategoryModel, "model")
        this.InsertProductCategory()
     
    }



      InsertProductCategory() {
        // console.log(this.productCategoryModel);
        
      if (this.validation() == true) {
        this.service.insertUpdateProductCategory( this.productCategoryModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.errors);
            $('#productCategoryName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductCategory()
              this.getProductCategoryDropdownList()
               this.getProductCategoryFilteredList()
            
            setTimeout(() => {
  
              $('#productCategoryName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#productCategoryName').focus();
          }
  
        )
  
      }
    }

      getProductCategoryById(Id: any) {
      this.deleteData = false

 let Model = {
     "userId": this.userIdPG,
  "fiscalID": this.fiscalPG.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPG,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPG.fromDate,
  "fromDate": this.fiscalPG.fromDate,
  "endDate": this.fiscalPG.toDate,
  "toDate": this.fiscalPG.toDate,
  "decimalPlace": this.globalVariablePG[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPG,
  "id": Id,
  "searchtext": "",
  "cid": 0

    };

      this.service.getProductCategoryByID(Model).subscribe((d: any) => {
        this.productCategoryDataByID = d?.details;
        // console.log("get product category by id ",d);
  
        this.EditProductCategory(this.productCategoryDataByID);


              if(d?.returnMsg?.success==true){
 this.productCategoryDataByID = d?.details;
 this.EditProductCategory(this.productCategoryDataByID);
        // console.log("get product Category by id ",d);
        //  console.log("get product category by id in ",this.productCategoryDataByID);
  
      }
      else if(d?.returnMsg?.success==false){
this.toastr.info(d?.returnMsg?.errors)
      }
      });
  
    }


     EditProductCategory(value: any) {
        
this.submitButton='Update'
      this.service.productCategoryModel.productCategoryID = value?.categoryID
      this.service.productCategoryModel.productCategoryName = value?.categoryName
      this.service.productCategoryModel.productCategoryRemarks = value?.remarks
     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
       
        if ($('#productCategoryUnder').length) {
          const dropdown = document.getElementById("productCategoryUnder") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.parentID; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

         if ($('#productCategoryStatus').length) {
          const dropdown = document.getElementById("productCategoryStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.cStatus=='True'?"1":"0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);
     
  
       $('#productCategoryName').focus()
     
    }

       resetProductCategory() {
  this. pageIndex = 0;

    this.service.productCategoryModel.productCategoryID = 0
      this.service.productCategoryModel.productCategoryName = ""
      this.service.productCategoryModel.productCategoryRemarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

        if ($('#productCategoryUnder').length) {
        const dropdown = document.getElementById("productCategoryUnder") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#productCategoryStatus').length) {
        const dropdown = document.getElementById("productCategoryStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


       if ($('#filterByCategory').length) {
        const dropdown = document.getElementById("filterByCategory") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#filterByUnderCategory').length) {
        const dropdown = document.getElementById("filterByUnderCategory") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
     
    }, 100);
    $('#productCategoryName').focus()

this.deleteData=true
this.submitButton='Save'

  }


   ///Delete Conformation
  
   confirmBoxProductCategoryDelete(Id: any) {
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
          this.DeleteProductCategory(Id);
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
  
  
  DeleteProductCategory(Id: number) {
  
   let Model = {
       "userId": this.userIdPG,
    "fiscalID": this.fiscalPG.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPG,
    "dbName": "",
    "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPG.fromDate,
    "fromDate": this.fiscalPG.fromDate,
    "endDate": this.fiscalPG.toDate,
    "toDate": this.fiscalPG.toDate,
    "decimalPlace": this.globalVariablePG[2].value,
    "bookClose": 0,
    "sessionId":this.sessionIdPG,
    "id": Id,
    "searchtext": "",
    "cid": 0
      };
  
    this.service.deleteProductCategory(Model).subscribe((res: any) => {
      // console.log(res,"delete");
      
      if (res?.success == true) {
        this.toastr.success(res?.msg)
        setTimeout(() => {
           this.getProductCategoryDropdownList()
            this.getProductCategoryFilteredList()
  
        }, 100)
        $('#productCategoryName').focus()
      }
      else if (res?.success == false) {
        this.toastr.error(res?.msg)
      }
    }, (error:any) => {
      this.toastr.error(error?.error?.Message)
    })
  
  
  }

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductCategoryFilteredList()
  }
}
