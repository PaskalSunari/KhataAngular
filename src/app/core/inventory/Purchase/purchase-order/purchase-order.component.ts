import { AfterViewInit, Component, ElementRef,HostListener,ViewChild } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import { Router } from '@angular/router';
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService } from './service/purchase-order.service';

import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { data } from 'jquery';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements AfterViewInit {

   @ViewChild('productContainer') productContainer!: ElementRef;

  showPurchaseOrderForm = true;
  submitButton:string='Save'
  purchaseLedgerDropdownList:any;
purchaseAgainstDropdownList:any;
partyDropdownList:any;
unitDropdwonList:any;
productDropdownList:any;
prefixSuffixList:any;
currencyRateList:any
taxChargeList:any
stockLocationDropdownList:any;

modelAnimationPurchaseOrderDetails=''
purchaseOrderDetailsPopup:boolean=false


modelAnimationPurchaseOrderCalculationPopup=''
purchaseOrderCalculationPopup:boolean=false

insertPurchaseDetails:boolean=true
purchaseDetailsModel:any

selectedProductData:any

isOpenProductList:boolean=false
 toggleForm() {
    this.showPurchaseOrderForm = !this.showPurchaseOrderForm;
  }

 //variable having Local storage data 
  globalVariablePC: any;
  baseUrlPC: any = '';
  userIdPC: any = ''
  branchIdPC: any = ''
  sessionIdPC: any = ''
  fiscalPC: any = ''
  otherInfoPC: any = ''
  userPC: any = '';
  ledgerDetails:any;

   pageSize = 50;
  branchID = 1001;


  unitListByProductID:any;
  productBatchExpiryDetails:any
  expiryDateDisabled:boolean=false
  batchDisabled:boolean=false

 constructor(private el: ElementRef, private toastr: ToastrService, public service: PurchaseOrderService, private router: Router) { }

   PurchaseOrderDropdownList: any;
 ngAfterViewInit(): void {
  setTimeout(() => {

    $('#purchaseLedger').focus();
  },200)
   this.globalVariablePC = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPC = localStorage.getItem("baseUrl")
    this.userIdPC = localStorage.getItem("userId");
    this.branchIdPC = localStorage.getItem("branch");
    this.sessionIdPC = localStorage.getItem("sessionId");
    this.fiscalPC = JSON.parse(localStorage.getItem("fiscalYear") || '');
    this.otherInfoPC = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPC = JSON.parse(localStorage.getItem("userInfo") || '');

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

      setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);


    this.getPurchaseList()
    // this.getProductDropdownList()
    this.getProductDropdownList1('',10,this.branchIdPC)
    this.getPrefixSuffixList()
    this.getCurrencyRate()
    this.getTaxChargeDropdownList()

    let self=this
      $('#discountAmount').on('change', function (event: any) {
     
    if(event.target.value){
 
      if(event.target.value>0){
        self.service.purchaseOrderModel.discountPercent=self.discountAmountToPercent(1000,event.target.value)

      }
    }
     })


     //
           $('#discountPercent').on('change', function (event: any) {
       
    if(event.target.value){
 
      if(event.target.value>0){
        self.service.purchaseOrderModel.discountAmount=self.discountPercentToAmount(1000,event.target.value)

      }
    }
     })


     $('#party').on('select2:close', function (event:any) {
    if (event?.target?.value) {
      self.getLedgerDetails(event?.target?.value)
       
    }
});

//    $('#productName').on('change', function (event: any) {
//     if (event?.target?.value) {
//       self.getProductDataByID(event?.target?.value)
       
//     }
// });

this.service.purchaseOrderModel.dispatchedDate=new Date()?.toISOString()
  
//


 }


  //number type validation
  wholeNumberValidation(event: KeyboardEvent) {
    const invalidKeys = ['-', 'e', 'E', '.'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault(); 
    }
  }

   decimalNumberValidation(event:KeyboardEvent){
      const invalidKeys = ['-', 'e', 'E'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault(); 
    }
  }

  //Get purchase order  dropdownlists
    getPurchaseList() {
    this.service.getPurchaseDropdownList(this.branchIdPC,this.fiscalPC?.financialYearId).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'purchase list');
        if (result) { 
          //  console.log(result,"product dropdown data");
          this.purchaseLedgerDropdownList=result?.purchaseledger
          this.purchaseAgainstDropdownList=result?.purchaseledgeragainst
          this.partyDropdownList=result?.partyList
          this.unitDropdwonList=result?.unitList
          this.stockLocationDropdownList=result?.getStockLocation
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


   //Product Dropdown list
      getProductDropdownList() {
    this.service.getProductDropdownList().subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'get product  dropdown list');
        if (result) { 
          this.productDropdownList=result
          //  console.log(result,"product dropdown data");
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

    getProductDropdownList1(searchText:any,pageSize:any,branchID:any) {
    this.service.getProductDropdownList1(searchText,pageSize,branchID).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'get product  dropdown list');
        if (result) { 
          this.productDropdownList=result
          //  console.log(result,"product dropdown data");
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //get prefix suffix
      getPrefixSuffixList() {
    this.service.getSuffixPrefix(69,this.branchIdPC,this.fiscalPC?.financialYearId).subscribe(
      (res) => {
        let result: any = res;
         console.log(result, 'prefix list');
        if (result) {
          this.prefixSuffixList=result
          //  console.log(result,"product dropdown data");
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //Currency rate 
      getCurrencyRate() {
  this.service.getCurrencyAndRate().subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'currency and rate');
        if (result) {  
          //  console.log(result,"product dropdown data");
          this.currencyRateList=result
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //Tax charge list
      getTaxChargeDropdownList() {
    this.service.getTaxChargesDropDownList(9).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'get tax charge dropdown list');
        if (result) { 
          //  console.log(result,"product dropdown data");
          this.taxChargeList=result
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //Dicount amt to discount percent 
  discountAmountToPercent(originalPrice:any, discountAmount:any) {
  return (discountAmount / originalPrice) * 100;
}

//discount percent to discount amt
 discountPercentToAmount(originalPrice:any, discountPercent:any) {
  return (originalPrice * discountPercent) / 100;
}

//get ledger details
     getLedgerDetails(ID:any) {
let model={
   "userId": this.userIdPC,
      "fiscalID": this.fiscalPC.financialYearId,
      "branchDepartmentId": this.branchIdPC,
      "branchId": this.branchIdPC,
      "dbName": "",
      "isEngOrNepaliDate": this.otherInfoPC.isEngOrNepali,
      "isMenuVerified": true,
      "isPrintView": true,
      "filterId": 0,
      "refId": 0,
      "mainId": 0,
      "strId": "",
      "startDate": this.fiscalPC.fromDate,
      "fromDate": this.fiscalPC.fromDate,
      "endDate": this.fiscalPC.toDate,
      "toDate": this.fiscalPC.toDate,
      "decimalPlace": this.globalVariablePC[2].value,
      "bookClose": 1,
      "sessionId": this.sessionIdPC,
      "id": +ID,
      "searchtext": "",
      "cid": 0

}

    this.service.getLedgerDetailsByID(model).subscribe(
      (res) => {
        let result: any = res;
         console.log(result, 'ledger details');
        if (result) {
          this.ledgerDetails=result

           this.openPurchaseOrderDetailsPopup();
          //  console.log(result,"product dropdown data");
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }



resetPurchaseOrder(){
  this.service.purchaseOrderModel.productOrderID=0
  this.service.purchaseOrderModel.estimatedDeliveryDate=''
  this.service.purchaseOrderModel.refNumber=''
  this.service.purchaseOrderModel.productCode=''
  this.service.purchaseOrderModel.productName=''
  this.service.purchaseOrderModel.quantity=0
  this.service.purchaseOrderModel.rate=0
  this.service.purchaseOrderModel.actualRate=0
  this.service.purchaseOrderModel.discountPercent=0
  this.service.purchaseOrderModel.discountAmount=0


   if ($('#purchaseLedger').length) {
      const dropdown = document.getElementById("purchaseLedger") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }


    if ($('#purchaseAgainst').length) {
      const dropdown = document.getElementById("purchaseAgainst") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#party').length) {
      const dropdown = document.getElementById("party") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#unit').length) {
      const dropdown = document.getElementById("unit") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#vat').length) {
      const dropdown = document.getElementById("vat") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "Excluded"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#otherCharges').length) {
      const dropdown = document.getElementById("otherCharges") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "no"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }
}


resetAddProduct(){

  this.service.purchaseOrderModel.productCode=''
  this.service.purchaseOrderModel.productName=''
  this.service.purchaseOrderModel.quantity=0
  this.service.purchaseOrderModel.rate=0
  this.service.purchaseOrderModel.actualRate=0
  this.service.purchaseOrderModel.discountPercent=0
  this.service.purchaseOrderModel.discountAmount=0


     if ($('#unit').length) {
      const dropdown = document.getElementById("unit") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#vat').length) {
      const dropdown = document.getElementById("vat") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "Excluded"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

     if ($('#otherCharges').length) { 
      const dropdown = document.getElementById("otherCharges") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "no"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }
}

//open and close popup

  //open purchase order details  Popup
  openPurchaseOrderDetailsPopup() {
    this.modelAnimationPurchaseOrderDetails = 'modal-enter';
    this.purchaseOrderDetailsPopup = true;   

    setTimeout(() =>{
 this.service.purchaseOrderModel.supplierName=this.ledgerDetails?.viewDetail[0]?.ledgerName
    this.service.purchaseOrderModel.mailingName=this.ledgerDetails?.viewDetail[0]?.mailingName
     this.service.purchaseOrderModel.address=this.ledgerDetails?.viewDetail[0]?.address
      this.service.purchaseOrderModel.email=this.ledgerDetails?.viewDetail[0]?.email
       this.service.purchaseOrderModel.pan=this.ledgerDetails?.viewDetail[0]?.pan
        this.service.purchaseOrderModel.creditPeriod=this.ledgerDetails[0]?.viewDetail?.creditPeriod||0
        this.service.purchaseOrderModel.modeOfPayment='Cash'
        this.service.purchaseOrderModel.dispatchedDate=new Date().toISOString().split('T')[0]
    },1000)
   
  }

  //Close purchase order Details Popup
  closePurchaseOrderDetailsPopup() {
    this.modelAnimationPurchaseOrderDetails = 'modal-exit';
    this.purchaseOrderDetailsPopup = false;
  }


//open close quantity calculation popup

//open purchase order calculation  popup
 
   openPurchaseOrderCalculationPopup() {
    if(this.service.purchaseOrderModel.quantity>0){
 this.modelAnimationPurchaseOrderCalculationPopup = 'modal-enter';
    this.purchaseOrderCalculationPopup = true;   
    this.getProductBatchAndExpiry(this.service.purchaseOrderModel.productID)
    }
    else{
      this.toastr.error("Quantity is required")
    }
   
  }

  //Close purchase order calculation Popup
  closePurchaseOrderCalculationPopup() {
    this.modelAnimationPurchaseOrderCalculationPopup = 'modal-exit';
    this.purchaseOrderCalculationPopup = false;
     $('#rate').focus()
  }


 //validaion of add variable page
  validationPurchaseDetails() {

    // if (this.addVariableModel.productInfoVariable.variable == null || this.addVariableModel.productInfoVariable.variable == "") {
    //   $('#variableName').focus();
    //   this.toastr.error("Variable Name is required");
    //   return false
    // }

    // else if ($('#nature').val() == null || $('#nature').val() == "") {
    //   $('#nature').focus();
    //   this.toastr.error("Nature is required");
    //   return false
    // }
    return true
  }

  onSubmitPurchaseDetails() {
let ledgerInfo=this.ledgerDetails?.viewDetail[0]
    this.purchaseDetailsModel = {

      "purchaseInfoID": 0,
  "purchaseMasterID": 0,
  "supplierID": ledgerInfo?.ledgerId,
  "supplierName": this.service.purchaseOrderModel.supplierName,
  "supplierAddress": ledgerInfo?.address,
  "mailingName": this.service.purchaseOrderModel.mailingName,
  "pan": ledgerInfo?.pan,
  "email": ledgerInfo?.email,
  "creditPeriod": +this.service.purchaseOrderModel.creditPeriod,
  "ppaymentMode": this.service.purchaseOrderModel.modeOfPayment,
  "dispatchedDate": this.service.purchaseOrderModel.dispatchedDate,
  "dispatchedThrough": this.service.purchaseOrderModel.dispatchedThrough,
  "carrierAgent": this.service.purchaseOrderModel.carrierName,
  "receivedDate": "2025-12-31T06:09:41.624Z",
  "orginalInvoiceNo": "",
  "orginalInvoiceDate": "2025-12-31T06:09:41.624Z",
  "orderChallanNo": this.service.purchaseOrderModel.challanNumber,
  "lR_RRNO_BillOfLanding": this.service.purchaseOrderModel.billOfLanding,
  "remarks": this.service.purchaseOrderModel.remarks,
  "userID":+this.userIdPC,
  "entryDate": "2025-12-31T06:09:41.624Z",
  "updatedBy": this.userIdPC?.toString(),
  "updatedDate": "2025-12-31T06:09:41.624Z",
  "extra1": "",
  "extra2": "",
  "flag": 0,
  "vehicleNo": this.service.purchaseOrderModel.vehicleNumber
    }

    // console.log(this.addVariableModel, "add variable model")

    if (this.insertPurchaseDetails == true) {
      this.insertPurchaseDetails = false
      this.InsertPurchaseInfo()
    }

  }

  InsertPurchaseInfo() {

    if (this.validationPurchaseDetails() == true) {
      this.service.addPurchaseInfo(this.purchaseDetailsModel).subscribe((response: any) => {
        console.log(response,"purchase info");
        if (response?.success == false) {
          this.toastr.error(response?.errors);
          $('#productCode').focus()
        }
        else if (response?.success == true) {

          this.toastr.success(response?.msg);
          // this.addVariableReset()
          // this.getAddVariableFilteredList()


          setTimeout(() => {

            $('#productCode').focus()
            this.closePurchaseOrderDetailsPopup()
          }, 50)

        }

      },
        (error: any) => {
          this.toastr.error(error?.error?.Messages);
          $('#productCode').focus();
        }

      )



    }
    setTimeout(() => {

      this.insertPurchaseDetails = true
    }, 1000)
  }

  //get product data by id

    getProductDataByID(productID:any) {
  this.service.getProductDataByID(productID).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'product data by id');
        if (result) {  
          //  console.log(result,"product dropdown data");
          this.selectedProductData=result
          this.service.purchaseOrderModel.productCode=result[0]?.text
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

//

purchaseNameInputFieldClick(){
  this.isOpenProductList=!this.isOpenProductList
}



//go to product list using arrow key
activeIndex: number = -1;

onKeyDown(event: KeyboardEvent) {
  if (!this.isOpenProductList || !this.productDropdownList.length) {
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      this.activeIndex =
        this.activeIndex < this.productDropdownList.length - 1
          ? this.activeIndex + 1
          : 0;
      this.scrollToActive();
      break;

    case 'ArrowUp':
      event.preventDefault();
      this.activeIndex =
        this.activeIndex > 0
          ? this.activeIndex - 1
          : this.productDropdownList.length - 1;
      this.scrollToActive();
      break;

    case 'Enter':
      event.preventDefault();
      if (this.activeIndex >= 0) {
        this.selectItem(this.productDropdownList[this.activeIndex]);
      }
      break;

    case 'Escape':
      setTimeout(() =>{

        this.isOpenProductList = false;
      },100)
      this.activeIndex = -1;
      break;
  }
}


//item selected event
selectItem(item: any) {

  this.service.purchaseOrderModel.productName = item?.text;
  this.service.purchaseOrderModel.productID=item?.value;
  setTimeout(() =>{

    this.isOpenProductList = false;
  },100)
  this.activeIndex = -1;
  if(item){
      this.getProductDataByID(item?.value)
      this.getUnitByProductID(item?.value)
  }
}


scrollToActive() {
  setTimeout(() => {
    const activeElement = document.querySelector(
      '.suggestion-item.active'
    ) as HTMLElement;

    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  });
}


//search in product name field
onProductNameChange(value: string) {
  if (!value || value.length < 2) {
    this.productDropdownList = [];
    this.isOpenProductList = false;
    return;
  }

  // this.searchSubject.next(value);
  this.getProductDropdownList1(value,10,this.branchIdPC)
  this.isOpenProductList=true
}

//get unit list by product id
  getUnitByProductID(productID:any) {
  this.service.getUnitByProductID(productID).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'unit by product id');
        if (result) {  
          //  console.log(result,"product dropdown data");
          this.unitListByProductID=result
         
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //get product batch and expiry
   getProductBatchAndExpiry(productID:any) {
  this.service.getProductBatchAndExpiry(productID).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'product batch and expiry');
        if (result) {  
          //  console.log(result,"product dropdown data");
          this.productBatchExpiryDetails=result
      
          this.service.purchaseOrderModel.quantityPopup=this.service.purchaseOrderModel.quantity
          this.service.purchaseOrderModel.unitPopup= $('#unit option:selected').text();
        if(result?.expirable==0){
          this.expiryDateDisabled=true
    
        }
        else{
          this.expiryDateDisabled=false
        }

         if(result?.allowBatch==0){
          this.batchDisabled=true
    
        }
        else{
          this.batchDisabled=false
        }

        if(result?.allowBatch==1){
          setTimeout(() =>{

            $('#batch').focus();
          },200)
        }
        else if(result?.allowBatch==0 && result?.expirable==1){
          setTimeout(() =>{
        $('#expiryDate').focus();
        },200)
        }

          else{
          setTimeout(() =>{

            $('#locationPopup').focus();
          },200)
        }
          
        }
      
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {

    if (
      this.productContainer &&
      !this.productContainer.nativeElement.contains(event.target)
    ) {
      this.isOpenProductList = false;
    }
  }
}
