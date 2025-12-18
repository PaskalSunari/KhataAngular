import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductBrandService } from './service/product-brand.service';

@Component({
  selector: 'app-product-brand',
  templateUrl: './product-brand.component.html'
})
export class ProductBrandComponent implements AfterViewInit {
  showBrandForm = true;
  toggleForm() {
    this.showBrandForm = !this.showBrandForm;
  }
  ManufacturerDropdownList: any;

  productBrandGridList: any;
  productBrandGridDetails: any;
  productBrandModel: any;
  deleteData: boolean = true
  productBrandDataByID: any;




  globalVariablePB: any;
  baseUrlPB: any = '';
  userIdPB: any = ''
  branchIdPB: any = ''
  sessionIdPB: any = ''
  fiscalPB: any = ''
  otherInfoPB: any = ''
  userPB: any = '';
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


  constructor(private el: ElementRef, public service: ProductBrandService, private toastr: ToastrService) {

  }
  ngAfterViewInit(): void {
    this.globalVariablePB = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPB = localStorage.getItem("baseUrl")
    this.userIdPB = localStorage.getItem("userId");

    this.branchIdPB = localStorage.getItem("branch");
    this.sessionIdPB = localStorage.getItem("sessionId");
    this.fiscalPB = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPB = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPB = JSON.parse(localStorage.getItem("userInfo") || '');

    this.enterFun();
    $(this.el.nativeElement).find('select').select2();

    this.getProductBrandFilteredList()
    this.getProductBrandDropdownList()
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


  //Get product brand   dropdownlists
  getProductBrandDropdownList() {
    let Model = {
      "mainInfoModel": {
        "userId": this.userIdPB,
        "fiscalID": this.fiscalPB.financialYearId,
        "branchDepartmentId": 1001,
        "branchId": this.branchIdPB,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPB.fromDate,
        "fromDate": this.fiscalPB.fromDate,
        "endDate": this.fiscalPB.toDate,
        "toDate": this.fiscalPB.toDate,
        "decimalPlace": this.globalVariablePB[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPB,
        "id": 0,
        "searchtext": "",
        "cid": 0
      },
      "refName": "ProductBrand",
      "listNameId": "[\"brandManufacturer\"]",
      "conditionalvalues": "",
      "isSingleList": "true",
      "singleListNameStr": ""




    };

    this.service.getProductBrandDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
          this.ManufacturerDropdownList = result[0]

          //  console.log(result,"product brand dropdown data");

        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //Get product Brand list
  getProductBrandFilteredList() {
    let Model = {
      "dataFilterModel": {
        "tblName": "ProductBrand--ProductBrand",
        "columnName": "",
        "strName": $('#brandSearchString').val(),
        "underColumnName": "",
        "underIntID": 0,
        "filterColumnsString": "[\"\"]",
        "currentPageNumber": this.pageIndex + 1,
        "pageRowCount": this.pageSize,
        "strlistNames": ""
      },
      "mainInfoModel": {
        "userId": this.userIdPB,
        "fiscalID": this.fiscalPB.financialYearId,
        "branchDepartmentId": this.branchIdPB,
        "branchId": this.branchIdPB,
        "dbName": "string",
        "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPB.fromDate,
        "fromDate": this.fiscalPB.fromDate,
        "endDate": this.fiscalPB.toDate,
        "toDate": this.fiscalPB.toDate,
        "decimalPlace": this.globalVariablePB[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPB,
        "id": 0,
        "searchtext": "",
        "cid": 0
      },
      "print": false

    };




    this.service.getProductBrandFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product brand data list');
        if (result) {
          this.productBrandGridList = result[0]
          this.productBrandGridDetails = result[1]

          //  console.log(this.productBrandGridList,"brand gridddd");
          // console.log(result[1].totalRecords,"total");

          this.length = this.productBrandGridDetails?.totalRecords
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


  validation() {

    if (this.productBrandModel.productbrand.brandName == null || this.productBrandModel.productbrand.brandName == "") {
      $('#brandName').focus();
      this.toastr.error("Brand Name is required");
      return false
    }

    else if ($('#manufacture').val() == null || $('#manufacture').val() == "") {
      $('#manufacture').focus();
      this.toastr.error("Manufacturer is required");
      return false
    }
    return true
  }


  // post data of product Brand form
  onSubmitProductBrand() {

    this.productBrandModel = {

      "productbrand": {
        "brandID": this.service.productBrandModel.brandID || 0,
        "brandName": this.service.productBrandModel.brandName?.replace(/\s+/g, ' ').trim(),
        "manufacturerID": $("#manufacture").val(),
        "remarks": this.service.productBrandModel.brandRemarks,
        "status": $("#brandStatus").val() == "1" ? 1 : 0,
        "extra1": "",
        "extra2": "",
        "cid": ""
      },
      "maininfo": {
        "userId": this.userIdPB,
        "fiscalID": this.fiscalPB.financialYearId,
        "branchDepartmentId": 0,
        "branchId": this.branchIdPB,
        "dbName": "string",
        "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
        "isMenuVerified": true,
        "isPrintView": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPB.fromDate,
        "fromDate": this.fiscalPB.fromDate,
        "endDate": this.fiscalPB.toDate,
        "toDate": this.fiscalPB.toDate,
        "decimalPlace": this.globalVariablePB[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPB,
        "id": 0,
        "searchtext": "",
        "cid": 0
      }
    }

    // console.log(this.productBrandModel, "brand model")
    this.InsertProductBrand()

  }

  InsertProductBrand() {

    if (this.validation() == true) {
      this.service.insertUpdateProductBrand(this.productBrandModel).subscribe((response: any) => {
        // console.log(response);

        if (response.success == false) {
          this.toastr.error(response?.errors);
          $('#brandName').focus()
        }
        else if (response.success == true) {
          this.toastr.success(response?.msg);
          this.resetProductBrand()
          // this.getProductBrandDropdownList()
          this.getProductBrandFilteredList()

          setTimeout(() => {

            $('#brandName').focus()
          }, 50)

        }

      },
        (error: any) => {
          this.toastr.error(error?.error?.Messages);
          $('#brandName').focus();
        }

      )

    }
  }


  getProductBrandById(Id: any) {


    let Model = {
      "userId": this.userIdPB,
      "fiscalID": this.fiscalPB.financialYearId,
      "branchDepartmentId": 0,
      "branchId": this.branchIdPB,
      "dbName": "",
      "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
      "isMenuVerified": true,
      "isPrintView": true,
      "filterId": 0,
      "refId": 0,
      "mainId": 0,
      "strId": "",
      "startDate": this.fiscalPB.fromDate,
      "fromDate": this.fiscalPB.fromDate,
      "endDate": this.fiscalPB.toDate,
      "toDate": this.fiscalPB.toDate,
      "decimalPlace": this.globalVariablePB[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPB,
      "id": Id,
      "searchtext": "",
      "cid": 0

    };

    this.service.getProductBrandByID(Model).subscribe((d: any) => {

      // console.log("get product brand by id ",d);

      if (d?.returnMsg?.success == true) {
        this.productBrandDataByID = d?.details;

        //  console.log("get product brand by id in array ",this.productBrandDataByID);

        this.EditProductBrand(this.productBrandDataByID);

      }
      else if (d?.returnMsg?.success == false) {
        this.toastr.info(d?.returnMsg?.errors)
      }
    });

  }


  EditProductBrand(value: any) {
    this.deleteData = false
    this.submitButton = 'Update'
    this.service.productBrandModel.brandID = value?.brandID
    this.service.productBrandModel.brandName = value?.brandName
    this.service.productBrandModel.brandRemarks = value?.remarks


    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

      if ($('#manufacture').length) {
        const dropdown = document.getElementById("manufacture") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.manufacturerID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#brandStatus').length) {
        const dropdown = document.getElementById("brandStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.bStatus == 'True' ? "1" : "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
    }, 100);


    $('#brandName').focus()

  }

  //Reset
  resetProductBrand() {
    this.pageIndex = 0;

    this.service.productBrandModel.brandID = 0
    this.service.productBrandModel.brandName = ""
    this.service.productBrandModel.brandRemarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

      if ($('#manufacture').length) {
        const dropdown = document.getElementById("manufacture") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#brandStatus').length) {
        const dropdown = document.getElementById("brandStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


    }, 100);
    $('#brandName').focus()

    this.deleteData = true
    this.submitButton = 'Save'

  }

  //Delete Conformation

  confirmBoxProductBrandDelete(Id: any) {
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
    if (this.deleteData == true) {


      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.DeleteProductBrand(Id);
          // this.toastr.error("No Permission to delete")

        }
      });
    }
    else {
      this.toastr.error("Complete pending task!")
    }
    setTimeout(() => {

      $('.ed-btn-danger').focus()

      $('.ed-btn-danger').on('keydown', (e: any) => {
        if (e.key === 'ArrowRight') {
          $('.ed-btn-secondary').focus()
        }
      })

      $('.ed-btn-secondary').on('keydown', (e: any) => {
        if (e.key === 'ArrowLeft') {
          $('.ed-btn-danger').focus()
        }
      })


    }, 0)

  }


  DeleteProductBrand(Id: number) {

    let Model = {
      "userId": this.userIdPB,
      "fiscalID": this.fiscalPB.financialYearId,
      "branchDepartmentId": 0,
      "branchId": this.branchIdPB,
      "dbName": "",
      "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
      "isMenuVerified": true,
      "isPrintView": true,
      "filterId": 0,
      "refId": 0,
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPB.fromDate,
      "fromDate": this.fiscalPB.fromDate,
      "endDate": this.fiscalPB.toDate,
      "toDate": this.fiscalPB.toDate,
      "decimalPlace": this.globalVariablePB[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPB,
      "id": Id,
      "searchtext": "",
      "cid": 0
    };

    this.service.deleteProductBrand(Model).subscribe((res: any) => {
      if (res?.success == true) {
        this.toastr.success(res?.msg)
        setTimeout(() => {
          //  this.getProductBrandDropdownList()
          this.getProductBrandFilteredList()

        }, 100)
        $('#brandName').focus()
      }
      else if (res?.success == false) {
        this.toastr.error(res?.errors)
      }
    }, (error: any) => {
      this.toastr.error(error?.error?.Message)
    })


  }

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductBrandFilteredList()
  }
  onSearchProductBrand(event: any) {
    this.getProductBrandFilteredList()
  }

}
