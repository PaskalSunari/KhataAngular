import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;

import 'select2';
import { ToastrService } from 'ngx-toastr';

import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { ProductCreationService } from './service/product-creation.service';
@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
})
export class ProductCreationComponent implements AfterViewInit {

showProductCreationForm = true;
 toggleForm() {
    this.showProductCreationForm = !this.showProductCreationForm;
  }
      
   ProductCreationDropdownList: any;

  productCreationGridList: any;
  productCreationGridDetails: any;
  productCreationModel: any;
  deleteData: boolean = true
  productCreationDataByID: any;

categoryDropdownList:any;
groupDropdownList:any;
skuDropdownList:any;
manufacturerDropdownList:any;
productBrandDropdownList:any;
sizeProductDropdownList:any;
variableTypeDropdownList:any;
groupSearchDropdownList:any;
catagoryProductSearchDropdownList:any;
 
alternativeUnitDropdownList:any;
disableAlternativeUnit:boolean=true

   globalVariablePC: any;
  baseUrlPC: any = '';
  userIdPC: any = ''
  branchIdPC: any = ''
  sessionIdPC: any = ''
  fiscalPC: any = ''
  otherInfoPC: any = ''
  userPC: any = '';
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


  disableBrand:boolean=true;
  brandDropdownList:any;

  modelDropdownList:any;
  disableModel:boolean=true



  tab = 'General';

  hiddeValueOption:boolean=true
  hiddenValueText:boolean=false
variableOptionDropdownList:any;

tempVariableFormList:any[]=[]

selectedSKUUnit=''
selectedAlternativeUnit=''

popupSKUValue:any=0
popupALTValue:any=0
SKUALTValue:any=''


//Add Variable declaration
addVariablePopup:boolean=false

//Add variable Pagination
  //pagination variable of add pagination
  lengthAV = 0;
  pageSizeAV = 10;
  pageIndexAV = 0;
  pageSizeOptionsAV = [10, 25, 50, 100];

  hidePageSizeAV = false;
  showPageSizeOptionsAV = true;
  showFirstLastButtonsAV = true;
  disabledAV = false;

  constructor(private el: ElementRef, private toastr: ToastrService , public service: ProductCreationService) {}

  ngAfterViewInit(): void {
     $('#productName').focus();
    this.globalVariablePC = JSON.parse(localStorage.getItem("globalVariable") || '');
     this.baseUrlPC = localStorage.getItem("baseUrl")
    this.userIdPC = localStorage.getItem("userId");

    this.branchIdPC = localStorage.getItem("branch");
    this.sessionIdPC = localStorage.getItem("sessionId");
    this.fiscalPC = JSON.parse(localStorage.getItem("fiscalYear") || '');

    this.otherInfoPC = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPC= JSON.parse(localStorage.getItem("userInfo") || '');
    this.enterFun();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);

this.getProductCreationDropdownList()

let self=this
      $('#sku').on('change', function (event: any) {
    if(event.target.value){
         self.selectedSKUUnit=$('#sku option:selected').text(),
 self.getAlternativeUnitDropdownList()
    }
     })

      $('#manufacturer').on('change', function (event: any) {
    if(event.target.value){
 self.getBrandDropdownList()
    }
     })


        $('#brand').on('change', function (event: any) {
    if(event.target.value){
 self.getModelDropdownList()
    }
     })

     
        $('#productStatus').on('change', function (event: any) {
    if(event.target.value){
 self.tab = 'Details'
    }
     })

     this.getProductCreationFilteredList()


        $('#groupSearch').on('change', function (event: any) {
    if(event.target.value){
 self.getProductCreationFilteredList()
    }
     })

      $('#categorySearch').on('change', function (event: any) {
    if(event.target.value){
 self.getProductCreationFilteredList()
    }
     })


       $('#variableType').on('change', function (event: any) {
    if(event.target.value){
      if(event.target.value=='textField'){
self.hiddenValueText=false
self.hiddeValueOption=true
self.variableOptionDropdownList=[]
self.service.productCreationModel.value=''
   if ($('#variableOption').length) {
        const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      }
else if(event.target.value=='dropdownField'){
self.hiddenValueText=true
self.hiddeValueOption=false

self.service.productCreationModel.value=''
   if ($('#variableOption').length) {
        const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
}

    }
     })


     
      $('#alternativeUnit').on('change', function (event: any) {
    if(event.target.value){
      if(event.target.value!=1){
        self.selectedAlternativeUnit=$('#alternativeUnit option:selected').text()
self.openAlternativePopup()
      }
 
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




    //Get product create  dropdownlists
    getProductCreationDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPC.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPC.fromDate,
        "fromDate": this.fiscalPC.fromDate,
        "endDate": this.fiscalPC.toDate,
        "toDate": this.fiscalPC.toDate,
        "decimalPlace": this.globalVariablePC[2]?.value,
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "CreateProduct",
    "listNameId": "[\"underGroup\",\"category\",\"sku\",\"manufacturer\",\"productBrand\",\"sizeProduct\",\"variableType\",\"groupSearch\",\"catagoryProductSearch\"]",
    "conditionalvalues": "",
    "isSingleList": "false",
    "singleListNameStr": ""
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
           this.ProductCreationDropdownList=result
           
           this.groupDropdownList=this.ProductCreationDropdownList[0]
           this.categoryDropdownList=this.ProductCreationDropdownList[1]
           this.skuDropdownList=this.ProductCreationDropdownList[2]
           this.manufacturerDropdownList=this.ProductCreationDropdownList[3]
           this.productBrandDropdownList=this.ProductCreationDropdownList[4]
           this.sizeProductDropdownList=this.ProductCreationDropdownList[5]
           this.variableTypeDropdownList=this.ProductCreationDropdownList[6]
           this.groupSearchDropdownList=this.ProductCreationDropdownList[7]
           this.catagoryProductSearchDropdownList=this.ProductCreationDropdownList[8]





            console.log(result,"product creation dropdown data");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


   //Get product brand   dropdownlists
    getAlternativeUnitDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPC.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPC.fromDate,
        "fromDate": this.fiscalPC.fromDate,
        "endDate": this.fiscalPC.toDate,
        "toDate": this.fiscalPC.toDate,
        "decimalPlace": this.globalVariablePC[2]?.value,
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "CreateProduct",
    "listNameId": `[\"altUnit--${ $('#sku').val()}\"]`,
    "conditionalvalues": "",
    "isSingleList": "true",
    "singleListNameStr": "altUnit"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
           this.alternativeUnitDropdownList=result[0]
            console.log(result,"product creation alternative unit dropdown data");
           this.disableAlternativeUnit=false
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //Get product brand   dropdownlists
    getBrandDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPC.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPC.fromDate,
        "fromDate": this.fiscalPC.fromDate,
        "endDate": this.fiscalPC.toDate,
        "toDate": this.fiscalPC.toDate,
        "decimalPlace": this.globalVariablePC[2]?.value,
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "CreateProduct",
    "listNameId": `[\"productBrand--${ $('#manufacturer').val()}\"]`,
    "conditionalvalues": "",
    "isSingleList": "true",
    "singleListNameStr": "productBrand"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
           this.brandDropdownList=result[0]
            console.log(result,"product creation brand based on manufacturer dropdown data");
           this.disableBrand=false
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

   //Get product model   dropdownlists
    getModelDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPC.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPC.fromDate,
        "fromDate": this.fiscalPC.fromDate,
        "endDate": this.fiscalPC.toDate,
        "toDate": this.fiscalPC.toDate,
        "decimalPlace": this.globalVariablePC[2]?.value,
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "CreateProduct",
    "listNameId": `[\"model--${ $('#brand').val()}\"]`,
    "conditionalvalues": "",
    "isSingleList": "true",
    "singleListNameStr": "model"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
           this.modelDropdownList=result[0]
            console.log(result,"product creation model based on brand dropdown data");
           this.disableModel=false
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


//popup
    modalAnimationClass = '';

  productGroupPopup: boolean = false;
  productCategoryPopup: boolean = false;
  productUnitPopup: boolean = false;
  productManufacturerPopup:boolean=false
  productBrandPopup:boolean=false
  productModelPopup:boolean=false
  productSizePopup:boolean=false
  alternativeUnitPopup:boolean=false

  //Group
  openGroupPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productGroupPopup = true;
    
  }

  closeGroupPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productGroupPopup = false;
  }


  //Category
   openCategoryPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productCategoryPopup = true;
  }

  closeCategoryPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productCategoryPopup = false;
  }


  //Unit
   openUnitPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productUnitPopup = true;
  }

  closeUnitPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productUnitPopup = false;
  }

   //Manufacturer
   openManufacturerPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productManufacturerPopup = true;
  }

  closeManufacturerPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productManufacturerPopup = false;
  }

   //Brand
   openBrandPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productBrandPopup = true;
  }

  closeBrandPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productBrandPopup = false;
  }


   //Model
   openModelPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productModelPopup = true;
  }

  closeModelPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productModelPopup = false;
  }

   //size
   openSizePopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productSizePopup = true;
  }

  closeSizePopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productSizePopup = false;
  }

  //Alternative Popup
   openAlternativePopup() {
    this.modalAnimationClass = 'modal-enter';
    this.alternativeUnitPopup = true;
  }

  closeAlternativePopup() {
    this.modalAnimationClass = 'modal-exit';
    this.alternativeUnitPopup = false;
    this.tempProductUnitRelationReset()

  }

  //Get product category list
    getProductCreationFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductCreate--ProductCreate",
    "columnName": "",
    "strName": $('#productSearch').val(),
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": `[\"group--${$('#groupSearch').val()==0||$('#groupSearch').val()==null?'':$('#groupSearch').val()}\",\"category--${$('#categorySearch').val()==0 ||$('#categorySearch').val()==null?'':$('#categorySearch').val()}\"]`,
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": "string"
  },
  "mainInfoModel": {
     "userId": this.userIdPC,
    "fiscalID": this.fiscalPC.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPC,
    "dbName": "",
    "isEngOrNepaliDate":  this.otherInfoPC.isEngOrNepali,
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
    "bookClose": 0,
    "sessionId": this.sessionIdPC,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": true
    };




    this.service.getProductCreateFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product category data list');
        if (result) {
           this.productCreationGridList=result[0]
           this.productCreationGridDetails=result[1]
          
          //  console.log(this.productCreationGridList,"gridddd");
            // console.log(result[1].totalRecords,"total");
           
          this.length=result[1]?.totalRecords
          // this.pageSize=this.productCreationGridDetails?.pageSize
          // this.pageIndex=this.productCreationGridDetails?.currentPageNumber - 1
          //  console.log(result,"productGroupgridlist");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

   onSearchProductCreation(event:any){
     this.getProductCreationFilteredList()
  }

 validation() {
  
  // if (this.productCreationModel.viewData.productCode == null ||  this.productCreationModel.viewData.productCode == "") {
  //   $('#productCode').focus();
  //   this.toastr.error("Product Code is required");
  //   return false
  // }

  if (this.productCreationModel.viewData.productName == null ||  this.productCreationModel.viewData.productName == "") {
    $('#productName').focus();
    this.toastr.error("Product Name is required");
    return false
  }

 else if ( $('#group').val() == null ||  $('#group').val() == "") {
    $('#group').focus();
    this.toastr.error("Group is required");
    return false
  }

   else if ( $('#productCategory').val() == null ||  $('#productCategory').val() == "") {
    $('#productCategory').focus();
    this.toastr.error("Category is required");
    return false
  }

   else if ( $('#sku').val() == null ||  $('#sku').val() == "") {
    $('#sku').focus();
    this.toastr.error("SKU is required");
    return false
  }

  // else if (this.service.productCreationModel.UUID == null ||  this.service.productCreationModel.UUID == 0) {
  //   $('#UUID').focus();
  //   this.toastr.error("UUID is required");
  //   return false
  // }

   else if ( $('#manufacturer').val() == null ||  $('#manufacturer').val() == "") {
    $('#manufacturer').focus();
    this.toastr.error("Manufacturer is required");
    return false
  }

   else if ( $('#brand').val() == null ||  $('#brand').val() == "") {
    $('#brand').focus();
    this.toastr.error("Brand is required");
    return false
  }

   else if ( $('#model').val() == null ||  $('#model').val() == "") {
    $('#model').focus();
    this.toastr.error("Model is required");
    return false
  }

  
   else if ( $('#size').val() == null ||  $('#size').val() == "") {
    $('#size').focus();
    this.toastr.error("Size is required");
    return false
  }

  
   else if ( $('#model').val() == null ||  $('#model').val() == "") {
    $('#model').focus();
    this.toastr.error("Model is required");
    return false
  }
  return true
}

  // post data of product Brand form
    onSubmitProductCreation() {

      this.productCreationModel = {  

   "viewData": {
    "productID": this.service.productCreationModel.productID||0,
    "productCode": this.service.productCreationModel.productCode?.replace(/\s+/g, ' ').trim(),
    "productName": this.service.productCreationModel.productName?.replace(/\s+/g, ' ').trim(),
    "groupID": +$("#group").val(),
    "categoryID": +$("#productCategory").val(),
    "skuId":  +$("#sku").val(),
    "alternateUnitID": +$("#alternativeUnit").val(),
    "allowBatch":  +$("#allowBatch").val(),
    "isVatable":  +$("#vatable").val(),
    "assetsTypeID":  +$("#assetsType").val(),
    "isConsumable":  +$("#consumable").val(),
    "bom":  +$("#BOM").val(),
    "expirable":  +$("#IsExpirable").val(),
    "branchID": this.branchIdPC,
    "isPublic":  +$("#public").val(),
    "status": $("#productStatus").val()=="1"? 1:0,
    "createdDate": "2025-12-12T05:11:55.986Z",
    "createdBy": this.userIdPC,
    "updatedBy":this.userIdPC,
    "updatedDate": "2025-12-12T05:11:55.986Z",
    "extra1": "",
    "extra2": "",
    "flag": 0
  },
  "mainInfoModel": {
     "userId": this.userIdPC,
    "fiscalID": this.fiscalPC.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPC,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPC.isEngOrNepali,
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
    "bookClose": 0,
    "sessionId": this.sessionIdPC,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "viewProductDetail": {
    "productDetailsID": 0,
    "productID": this.service.productCreationModel.productID||0,
    "uuid": this.service.productCreationModel.UUID,
    "brandID": +$("#brand").val(),
    "sizeID": +$("#size").val(),
    "modelNO":+$("#model").val(),
    "manufacturerID": +$("#manufacturer").val(),
    "minimumStock": this.service.productCreationModel.minStock||0,
    "maximumStock": this.service.productCreationModel.maxStock||0,
    "reorderLevel": this.service.productCreationModel.reorderLevel||0,
    "productDescription":this.service.productCreationModel.productDescription,
    "createdBy": this.userIdPC,
    "createdDate": "2025-12-12T05:11:55.986Z",
    "updatedBy": this.userIdPC,
    "updatedDate": "2025-12-12T05:11:55.986Z",
    "extra1": this.service.productCreationModel.HSCode,
    "extra2": "",
    "flag": 0
  },
  "returnMsg": {
    "success": true,
    "errors": "string",
    "msg": "string",
    "mainId": 0,
    "strId": "string",
    "statusCode": "string",
    "isEditable": true,
    "msgEditable": "string",
    "mWarning": "string"
  },
  "variableList": [
    {
      "productInfoId": 0,
      "variableId": 0,
      "variableText": "string",
      "variableValue": "string"
    }
  ],
  "variableJson": "string",
  "allowBatch":  $("#allowBatch").val(),
  "buttonName": "",
  "skuAltFactor": this.SKUALTValue||'',
      }
    
      // console.log(this.productBrandModel, "brand model")
        this.InsertProductCreation()
     
    }

        InsertProductCreation() {
        
      if (this.validation() == true) {
        this.service.insertUpdateProductCreate( this.productCreationModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.msg);
            $('#productName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductCreation()
              // this.getProductBrandDropdownList()
               this.getProductCreationFilteredList()
            
            setTimeout(() => {
  
              $('#productName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#productName').focus();
          }
  
        )
  
      }
    }



    //Reset
         resetProductCreation() {
  this. pageIndex = 0;

    this.service.productCreationModel.productID = 0
      this.service.productCreationModel.productCode = ""
      this.service.productCreationModel.productName = ""
      this.service.productCreationModel.UUID=0
      this.service.productCreationModel.minStock=0
      this.service.productCreationModel.maxStock=0
      this.service.productCreationModel.reorderLevel=0
      this.service.productCreationModel.HSCode=""
      this.service.productCreationModel.productDescription=''
      this.service.productCreationModel.value=""
$('#productSearch').val('')

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

        if ($('#group').length) {
        const dropdown = document.getElementById("group") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#productCategory').length) {
        const dropdown = document.getElementById("productCategory") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      
      if ($('#sku').length) {
        const dropdown = document.getElementById("sku") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      
      if ($('#alternativeUnit').length) {
        const dropdown = document.getElementById("alternativeUnit") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#vatable').length) {
        const dropdown = document.getElementById("vatable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#assetsType').length) {
        const dropdown = document.getElementById("assetsType") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#consumable').length) {
        const dropdown = document.getElementById("consumable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#allowBatch').length) {
        const dropdown = document.getElementById("allowBatch") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#IsExpirable').length) {
        const dropdown = document.getElementById("IsExpirable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#public').length) {
        const dropdown = document.getElementById("public") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#BOM').length) {
        const dropdown = document.getElementById("BOM") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#productStatus').length) {
        const dropdown = document.getElementById("productStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#manufacturer').length) {
        const dropdown = document.getElementById("manufacturer") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#brand').length) {
        const dropdown = document.getElementById("brand") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#model').length) {
        const dropdown = document.getElementById("model") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#size').length) {
        const dropdown = document.getElementById("size") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
        if ($('#variableType').length) {
        const dropdown = document.getElementById("variableType") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


       if ($('#groupSearch').length) {
        const dropdown = document.getElementById("groupSearch") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#categorySearch').length) {
        const dropdown = document.getElementById("categorySearch") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

 

     
    }, 100);
    $('#productName').focus()

this.deleteData=true
this.submitButton='Save'

setTimeout(() => {
  
  this.tab = 'General'
},200);

this.hiddeValueOption=true
  this.hiddenValueText=false
this.variableOptionDropdownList=[]
this.tempVariableFormList=[]

  }



  variableFormValidation() {
     if ( $('#variableType').val() == null ||  $('#variableType').val() == "") {
    $('#variableType').focus();
    this.toastr.error("Variable Type is required");
    return false
  }

  else if ( $('#variableType').val()=='textField' && this.service.productCreationModel.value== null ||  this.service.productCreationModel.value == "") {
    $('#value').focus();
    this.toastr.error("Value is required");
    return false
  }

   else if ( $('#variableType').val()=='dropdownField' && $('#variableOption').val() == null ||  $('#variableOption').val() == "") {
    $('#variableOption').focus();
    this.toastr.error("Value is required");
    return false
  }
     return true
}
submitVariableForm(){
  if (this.variableFormValidation() == true) {
this.tempVariableFormList.push(
  {
      variableTypeID:$('#variableType').val(),
      variableTypeName:$('#variableType option:selected').text(),
      value: $('#variableType').val()=='textField' ?this.service.productCreationModel.value:$('#variableOption').val()
    }
  );
  this.tempVariableFormReset()
}
}

DeleteVariableFormData(index:number){
   
    this.tempVariableFormList.splice(index, 1);
  
}

tempVariableFormReset(){
this.service.productCreationModel.value=''


  if ($('#variableType').length) {
        const dropdown = document.getElementById("variableType") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#variableOption').length) {
        const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
}

//ProductUnit Relation Form

tempProductUnitRelationReset(){
this.popupALTValue=0
this.popupSKUValue=0
}


productRelationFormValidation() {
     if ( this.popupSKUValue == null ||  this.popupSKUValue  == 0) {
    $('#popupSKUUnit').focus();
    this.toastr.error("SKU Value is required");
    return false
  }

  else if (  this.popupALTValue== null ||  this.popupALTValue == "") {
    $('#popupALTUnit').focus();
    this.toastr.error("Alternative Value is required");
    return false
  }

     return true
}
onSubmitProductionUnitRelation(){
  if (this.productRelationFormValidation() == true) {
    this.SKUALTValue=`${this.popupSKUValue}--${this.popupALTValue}`
    this.closeAlternativePopup()
    this.tempProductUnitRelationReset()
  }

}
//Pagination
handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductCreationFilteredList()
  }


  //ADD Variable  form
 //Alternative Popup
   openAddVariablePopup() {
    this.modalAnimationClass = 'modal-enter';
    this.addVariablePopup = true;
  }

  closeAddVariablePopup() {
    this.modalAnimationClass = 'modal-exit';
    this.addVariablePopup = false;
    // this.tempProductUnitRelationReset()

  }

    onSearchAddVariable(event:any){
    //  this.getProductBrandFilteredList()
  }


  handlePageEventOfAddVariable(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    // this.getProductCreationFilteredList()
  }

   //Get product brand   dropdownlists
  //   getNatureDropdownList() {
  //   let Model = {
  //   "mainInfoModel": {
  //       "userId": this.userIdPB,
  //       "fiscalID": this.fiscalPB.financialYearId,
  //       "branchDepartmentId": 1001,
  //       "branchId": this.branchIdPB,
  //       "dbName": "",
  //       "isEngOrNepaliDate": this.otherInfoPB.isEngOrNepali,
  //       "isMenuVerified": true,
  //       "filterId": 0,
  //       "refId": 0,
  //       "mainId": 0,
  //       "strId": "",
  //       "startDate": this.fiscalPB.fromDate,
  //       "fromDate": this.fiscalPB.fromDate,
  //       "endDate": this.fiscalPB.toDate,
  //       "toDate": this.fiscalPB.toDate,
  //       "decimalPlace": this.globalVariablePB[2].value,
  //       "bookClose": 0,
  //       "sessionId": this.sessionIdPB,
  //       "id": 0,
  //       "searchtext": "",
  //       "cid": 0
  //   },
  //   "refName": "ProductBrand",
  //   "listNameId": "[\"brandManufacturer\"]",
  //   "conditionalvalues": "",
  //   "isSingleList": "true",
  //   "singleListNameStr": ""
      



  //   };

  //   this.service.getProductBrandDropdownList(Model).subscribe(
  //     (res) => {
  //       let result: any = res;
  //       // console.log(result, 'product manufacture dropdown data');
  //       if (result) {
  //          this.ManufacturerDropdownList=result[0]
         
  //         //  console.log(result,"product brand dropdown data");
           
  //       }
  //     },
  //     (error) => {
  //       // console.error('Error:', error); // Inspect full error message
  //       this.toastr.error(error?.error?.Messages);
  //     }
  //   );
  // }


  //ADD variable Option in ADD Variable page


}
