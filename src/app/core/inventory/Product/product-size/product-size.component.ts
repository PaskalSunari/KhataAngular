import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductSizeService } from './service/product-size.service';

@Component({
  selector: 'app-product-size',
  templateUrl: './product-size.component.html'
})
export class ProductSizeComponent implements AfterViewInit {

  isSubmitSize:boolean=true

 showSizeForm = true;

  toggleForm() {
    this.showSizeForm = !this.showSizeForm;
  }


 productSizeGridList: any;
  productSizeGridDetails: any;
  productSizeModel: any;
  deleteData: boolean = true
  productSizeDataByID: any;


 

   globalVariablePS: any;
  baseUrlPS: any = '';
  userIdPS: any = ''
  branchIdPS: any = ''
  sessionIdPS: any = ''
  fiscalPS: any = ''
  otherInfoPS: any = ''
  userPS: any = '';
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

constructor(private el: ElementRef, public service: ProductSizeService, private toastr: ToastrService) {

  }
  ngAfterViewInit(): void {
      $('#sizeName').focus();
 this.globalVariablePS = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPS = localStorage.getItem("baseUrl")
    this.userIdPS = localStorage.getItem("userId");

    this.branchIdPS = localStorage.getItem("branch");
    this.sessionIdPS = localStorage.getItem("sessionId");
    this.fiscalPS = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPS = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPS = JSON.parse(localStorage.getItem("userInfo") || '');

this.enterFun();
    $(this.el.nativeElement).find('select').select2();

this.getProductSizeFilteredList()

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

//Get product Brand list
    getProductSizeFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductSize--ProductSize",
    "columnName": "",
    "strName": $('#sizeSearchString').val(),
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": "[\"\"]",
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": ""
  },
  "mainInfoModel": {
     "userId": this.userIdPS,
    "fiscalID": this.fiscalPS.financialYearId,
    "branchDepartmentId":this.branchIdPS,
    "branchId": this.branchIdPS,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPS.isEngOrNepali,
    "isMenuVerified": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPS.fromDate,
    "fromDate": this.fiscalPS.fromDate,
    "endDate": this.fiscalPS.toDate,
    "toDate": this.fiscalPS.toDate,
    "decimalPlace": this.globalVariablePS[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPS,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": false
  
    };




    this.service.getProductSizeFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product Size data list');
        if (result) {
           this.productSizeGridList=result[0]
           this.productSizeGridDetails=result[1]
          
          //  console.log(this.productSizeGridList,"size gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=this.productSizeGridDetails?.totalRecords
          // this.pageSize=this.productSizeGridDetails[1]?.pageSize
          // this.pageIndex=this.productSizeGridDetails[1]?.currentPageNumber - 1
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

   validation() {
  
  if (this.productSizeModel.productsize.sizeName == null ||  this.productSizeModel.productsize.sizeName == "") {
    $('#sizeName').focus();
    this.toastr.error("Size Name is required");
    return false
  }

  return true
}

// post data of product Brand form
    onSubmitProductSize() {

      this.productSizeModel = {  
 
        "productsize": {
     "sizeID": this.service.productSizeModel.sizeID||0,
    "sizeName": this.service.productSizeModel.sizeName?.replace(/\s+/g, ' ').trim(),
    "remarks": this.service.productSizeModel.sizeRemarks,
    "status": $("#sizeStatus").val()=="1"? 1:0,
    "extra1": "",
    "extra2": "",
  },
  "maininfo": {
    "userId": this.userIdPS,
    "fiscalID": this.fiscalPS.financialYearId,
    "branchDepartmentId": this.branchIdPS,
    "branchId": this.branchIdPS,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPS.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPS.fromDate,
    "fromDate": this.fiscalPS.fromDate,
    "endDate": this.fiscalPS.toDate,
    "toDate": this.fiscalPS.toDate,
    "decimalPlace": this.globalVariablePS[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPS,
    "id": 0,
    "searchtext": "",
    "cid": 0
  }
      }
    
      // console.log(this.productSizeModel, "size model")
      
     

         if(this.isSubmitSize==true){
           this.InsertProductSize()
this.isSubmitSize=false
        }
        setTimeout(() => {
this.isSubmitSize=true
        },1000)
    }

        InsertProductSize() {
        
      if (this.validation() == true) {
        this.service.insertUpdateProductSize( this.productSizeModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.errors);
            $('#sizeName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductSize()
               this.getProductSizeFilteredList()
            
            setTimeout(() => {
  
              $('#sizeName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#sizeName').focus();
          }
  
        )
  
      }
    }


      getProductSizeById(Id: any) {
     

 let Model = {
     "userId": this.userIdPS,
  "fiscalID": this.fiscalPS.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPS,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPS.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPS.fromDate,
  "fromDate": this.fiscalPS.fromDate,
  "endDate": this.fiscalPS.toDate,
  "toDate": this.fiscalPS.toDate,
  "decimalPlace": this.globalVariablePS[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPS,
  "id": Id,
  "searchtext": "",
  "cid": 0

    };

      this.service.getProductSizeByID(Model).subscribe((d: any) => {
        
        // console.log("get product size by id ",d);

              if(d?.returnMsg?.success==true){
 this.productSizeDataByID = d?.productsize;
       
        //  console.log("get product Size by id in array ",this.productSizeDataByID);
  
         this.EditProductSize(this.productSizeDataByID);
          
      }
      else if(d?.returnMsg?.success==false){
this.toastr.info(d?.returnMsg?.errors)
      }
      });
  
    }


     EditProductSize(value: any) {
       this.deleteData = false 
this.submitButton='Update'
       this.service.productSizeModel.sizeID = value?.sizeID
      this.service.productSizeModel.sizeName = value?.sizeName
      this.service.productSizeModel.sizeRemarks = value?.remarks
     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
       
     

         if ($('#sizeStatus').length) {
          const dropdown = document.getElementById("sizeStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.status=='True'?"1":"0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);
     
  
       $('#sizeName').focus()
     
    }

    //Reset
         resetProductSize() {
  this. pageIndex = 0;

    this.service.productSizeModel.sizeID = 0
      this.service.productSizeModel.sizeName = ""
      this.service.productSizeModel.sizeRemarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

      if ($('#sizeStatus').length) {
        const dropdown = document.getElementById("sizeStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

     
    }, 100);
    $('#sizeName').focus()

this.deleteData=true
this.submitButton='Save'

  }


//Delete Conformation
    
     confirmBoxProductSizeDelete(Id: any) {
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
            this.DeleteProductSize(Id);
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
    
    
    DeleteProductSize(Id: number) {
    
     let Model = {
         "userId": this.userIdPS,
      "fiscalID": this.fiscalPS.financialYearId,
      "branchDepartmentId": 0,
      "branchId": this.branchIdPS,
      "dbName": "",
      "isEngOrNepaliDate": this.otherInfoPS.isEngOrNepali,
      "isMenuVerified": true,
      "isPrintView": true,
      "filterId": 0,
      "refId": 0,
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPS.fromDate,
      "fromDate": this.fiscalPS.fromDate,
      "endDate": this.fiscalPS.toDate,
      "toDate": this.fiscalPS.toDate,
      "decimalPlace": this.globalVariablePS[2].value,
      "bookClose": 0,
      "sessionId":this.sessionIdPS,
      "id": Id,
      "searchtext": "",
      "cid": 0
        };
    
      this.service.deleteProductSize(Model).subscribe((res: any) => {
        if (res?.success == true) {
          this.toastr.success(res?.msg)
          setTimeout(() => {
              this.getProductSizeFilteredList()
    
          }, 100)
          $('#sizeName').focus()
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
    this.getProductSizeFilteredList()
  }
   onSearchProductSize(event:any){
     this.getProductSizeFilteredList()
  }



}
