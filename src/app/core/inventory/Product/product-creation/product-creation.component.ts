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


  //Toggle product creation form 
  showProductCreationForm = true;
  toggleForm() {
    this.showProductCreationForm = !this.showProductCreationForm;
  }


  //product Creation page variable
  tab = 'General';
  submitButton: any = 'Save'
productCodeDisable:boolean=false
  ProductCreationDropdownList: any;

  productCreationGridList: any;
  productCreationGridDetails: any;
  productCreationModel: any;
  productCreationDeleteData: boolean = true
  productCreationDataByID: any;

  categoryDropdownList: any;
  groupDropdownList: any;
  skuDropdownList: any;
  manufacturerDropdownList: any;
  productBrandDropdownList: any;
  sizeProductDropdownList: any;
  variableTypeDropdownList: any;
  groupSearchDropdownList: any;
  catagoryProductSearchDropdownList: any;



  alternativeUnitDropdownList: any;
  disableAlternativeUnit: boolean = true


  disableBrand: boolean = true;
  brandDropdownList: any;

  modelDropdownList: any;
  disableModel: boolean = true

  //variable having Local storage data 
  globalVariablePC: any;
  baseUrlPC: any = '';
  userIdPC: any = ''
  branchIdPC: any = ''
  sessionIdPC: any = ''
  fiscalPC: any = ''
  otherInfoPC: any = ''
  userPC: any = '';




  //pagination variable of Product Creation
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;



  //Additionanl details variables

  selectedNatureID: any = 1

  variableOptionDropdownList: any;

  tempVariableFormList: any;


  //Product unit Relatio popup Variable

  selectedSKUUnit = ''
  selectedAlternativeUnit = ''

  popupSKUValue: any = 0
  popupALTValue: any = 0
  SKUALTValue: any = ''


  //Add Variable declaration
  addVariablePopup: boolean = false
  natureDropdownList: any;
  addVariableFilteredList: any;
  submitButtonAV: string = 'Save'

  addVariableGridList: any;
  addVariableGridDetails: any;
  addVariableModel: any;
  addVariableDeleteData: boolean = true
  addVariableDataByID: any;

  insertedAddVariable: boolean = true

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

  //Variable option variable
  variableOptionPopup: boolean = false
  optionName: any = ''
  variableOptionGridList: any[] = [];
  selectedAddVariableID: any = 0
  variableOptionModel: any
  insertedVariableOption: boolean = true


  //Multidropdown setting in additional info form
  multidropdownSettings: any = {
    singleSelection: false,
    idField: 'optionID',
    textField: 'optionName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    enableCheckAll: true,
    maxHeight: 120,
  };



  //popup Variable to show and hide popup 

  modalAnimationClass = '';

  productGroupPopup: boolean = false;
  productCategoryPopup: boolean = false;
  productUnitPopup: boolean = false;
  productManufacturerPopup: boolean = false
  productBrandPopup: boolean = false
  productModelPopup: boolean = false
  productSizePopup: boolean = false
  alternativeUnitPopup: boolean = false


  constructor(private el: ElementRef, private toastr: ToastrService, public service: ProductCreationService) { }

  ngAfterViewInit(): void {
    $('#productName').focus();

    //Local storage data assign to Variable
    this.globalVariablePC = JSON.parse(localStorage.getItem("globalVariable") || '');
    this.baseUrlPC = localStorage.getItem("baseUrl")
    this.userIdPC = localStorage.getItem("userId");
    this.branchIdPC = localStorage.getItem("branch");
    this.sessionIdPC = localStorage.getItem("sessionId");
    this.fiscalPC = JSON.parse(localStorage.getItem("fiscalYear") || '');
    this.otherInfoPC = JSON.parse(localStorage.getItem("otherInfo") || '');
    this.userPC = JSON.parse(localStorage.getItem("userInfo") || '');

    //Enter Button event
    this.enterFun();

    //Select dropdown
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);

    //Dropdown  data of Product Creation

    this.getProductCreationDropdownList()

//Product Creation filtered list 
this.getProductCreationFilteredList()

    //On Change Function
    let self = this
    $('#sku').on('change', function (event: any) {
      if (event.target.value) {
        self.selectedSKUUnit = $('#sku option:selected').text(),
          self.getAlternativeUnitDropdownList()
      }
    })

    $('#manufacturer').on('change', function (event: any) {
      if (event.target.value) {
        self.getBrandDropdownList()
      }
    })


    $('#branded').on('change', function (event: any) {
      if (event.target.value) {
        self.getModelDropdownList()
      }
    })


    $('#productStatus').on('change', function (event: any) {
      if (event.target.value) {
        self.tab = 'Details'
      }
    })

    

//Filter input box change
    $('#groupSearch').on('change', function (event: any) {
      if (event.target.value) {
        self.getProductCreationFilteredList()
      }
    })

    $('#categorySearch').on('change', function (event: any) {
      if (event.target.value) {
        self.getProductCreationFilteredList()
      }
    })


    //Addtional Details  Variable Change

    $('#variableType').on('change', function (event: any) {
      setTimeout(() => {
        $(self.el.nativeElement).find('select').select2();
      }, 10);
      if (event.target.value) {
        let variableID = +event?.target?.value?.split('-')[0]
        let variableNatureID = +event?.target?.value?.split('-')[1]
        // console.log(variableID,"variable id");
        // console.log(variableNatureID,"variable class idd");

        self.selectedNatureID = variableNatureID

        if (variableNatureID == 4 || variableNatureID == 5) {
          self.getVariableOptionDropdownList(variableID)
        }


        if (variableNatureID == 1) {
          self.variableOptionDropdownList = []
          self.service.productCreationModel.value = ''
          self.service.productCreationModel.multiSelectValue = ''
          self.service.productCreationModel.decimalNumber = 0
          self.service.productCreationModel.wholeNumber = 0
          if ($('#variableOption').length) {
            const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }

        }
        else if (variableNatureID == 2) {
          self.variableOptionDropdownList = []
          self.service.productCreationModel.value = ''
          self.service.productCreationModel.multiSelectValue = ''
          self.service.productCreationModel.decimalNumber = 0
          self.service.productCreationModel.wholeNumber = 0
          if ($('#variableOption').length) {
            const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }
        }

        else if (variableNatureID == 3) {

          self.variableOptionDropdownList = []
          self.service.productCreationModel.value = ''
          self.service.productCreationModel.multiSelectValue = ''
          self.service.productCreationModel.decimalNumber = 0
          self.service.productCreationModel.wholeNumber = 0
          if ($('#variableOption').length) {
            const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }

        }

        else if (variableNatureID == 4) {

          self.service.productCreationModel.value = ''
          self.service.productCreationModel.multiSelectValue = ''
          self.service.productCreationModel.decimalNumber = 0
          self.service.productCreationModel.wholeNumber = 0
          if ($('#variableOption').length) {
            const dropdown = document.getElementById("variableOption") as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }
        }
        else if (variableNatureID == 5) {
          self.service.productCreationModel.value = ''
          self.service.productCreationModel.multiSelectValue = ''
          self.service.productCreationModel.decimalNumber = 0
          self.service.productCreationModel.wholeNumber = 0
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


//Alternative unit dropdown data change
    $('#alternativeUnit').on('change', function (event: any) {
      if (event.target.value) {
        if (event.target.value != 1) {
          self.selectedAlternativeUnit = $('#alternativeUnit option:selected').text()
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
        console.log(result, 'product creation dropdown data');
        if (result) {
          this.ProductCreationDropdownList = result

          this.groupDropdownList = this.ProductCreationDropdownList[0]
          this.categoryDropdownList = this.ProductCreationDropdownList[1]
          this.skuDropdownList = this.ProductCreationDropdownList[2]
          this.manufacturerDropdownList = this.ProductCreationDropdownList[3]
          this.productBrandDropdownList = this.ProductCreationDropdownList[4]
          this.sizeProductDropdownList = this.ProductCreationDropdownList[5]
          this.variableTypeDropdownList = this.ProductCreationDropdownList[6]
          this.groupSearchDropdownList = this.ProductCreationDropdownList[7]
          this.catagoryProductSearchDropdownList = this.ProductCreationDropdownList[8]





          console.log(result, "product creation dropdown data");

        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //Get alternative unit  dropdownlists
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
      "listNameId": `[\"altUnit--${$('#sku').val()}\"]`,
      "conditionalvalues": "",
      "isSingleList": "true",
      "singleListNameStr": "altUnit"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
          this.alternativeUnitDropdownList = result[0]
          console.log(result, "product creation alternative unit dropdown data");
          this.disableAlternativeUnit = false
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
      "listNameId": `[\"productBrand--${$('#manufacturer').val()}\"]`,
      "conditionalvalues": "",
      "isSingleList": "true",
      "singleListNameStr": "productBrand"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
          this.brandDropdownList = result[0]
          console.log(result, "product creation brand based on manufacturer dropdown data");
          this.disableBrand = false
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
      "listNameId": `[\"model--${$('#branded').val()}\"]`,
      "conditionalvalues": "",
      "isSingleList": "true",
      "singleListNameStr": "model"
    };

    this.service.getProductCreateDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'product manufacture dropdown data');
        if (result) {
          this.modelDropdownList = result[0]
          console.log(result, "product creation model based on brand dropdown data");
          this.disableModel = false
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //variable option dropdown list

  getVariableOptionDropdownList(ID: any) {
    let Model = {
      "userId": this.userIdPC,
      "fiscalID": this.fiscalPC.financialYearId,
      "branchDepartmentId": 0,
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
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": +ID,
      "searchtext": "",
      "cid": 0
    };




    this.service.getVariableOptionList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'Variable  option dropdown list');
        if (result) {
          this.variableOptionDropdownList = result
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }




  //Group Popup
  openGroupPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productGroupPopup = true;

  }

  closeGroupPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productGroupPopup = false;
  }


  //Category Popup
  openCategoryPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productCategoryPopup = true;
  }

  closeCategoryPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productCategoryPopup = false;
  }


  //Unit Popup
  openUnitPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productUnitPopup = true;
  }

  closeUnitPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productUnitPopup = false;
  }

  //Manufacturer Popup
  openManufacturerPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productManufacturerPopup = true;
  }

  closeManufacturerPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productManufacturerPopup = false;
  }

  //Brand Popup
  openBrandPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productBrandPopup = true;
  }

  closeBrandPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productBrandPopup = false;
  }


  //Model Popup
  openModelPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.productModelPopup = true;
  }

  closeModelPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.productModelPopup = false;
  }

  //size Popup
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
    setTimeout(() =>{

      $('#popupSKUUnit').focus()
    },500)
  }

  closeAlternativePopup() {
    this.modalAnimationClass = 'modal-exit';
    this.alternativeUnitPopup = false;
    this.tempProductUnitRelationReset()
      setTimeout(() =>{

        $('#vatable').focus()
  },100) 
  }

  //Get product Creation table data

  getProductCreationFilteredList() {
    let Model = {
      "dataFilterModel": {
        "tblName": "ProductCreate--ProductCreate",
        "columnName": "",
        "strName": $('#productSearch').val(),
        "underColumnName": "",
        "underIntID": 0,
        "filterColumnsString": `[\"group--${$('#groupSearch').val() == 0 || $('#groupSearch').val() == null ? '' : $('#groupSearch').val()}\",\"category--${$('#categorySearch').val() == 0 || $('#categorySearch').val() == null ? '' : $('#categorySearch').val()}\"]`,
        "currentPageNumber": this.pageIndex + 1,
        "pageRowCount": this.pageSize,
        "strlistNames": "string"
      },
      "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": 0,
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
        console.log(result, 'product creation data list');
        if (result) {
          this.productCreationGridList = result[0]
          this.productCreationGridDetails = result[1]

          this.length = this.productCreationGridDetails?.totalRecords


          // this.pageSize=this.productCreationGridDetails?.pageSize
          // this.pageIndex=this.productCreationGridDetails?.currentPageNumber - 1 
        }
      },
      (error) => {
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //Search Box in product Creation

  onSearchProductCreation(event: any) {
    this.getProductCreationFilteredList()
  }


  //........validation of product creation

  validation() {

    // if (this.productCreationModel.viewData.productCode == null ||  this.productCreationModel.viewData.productCode == "") {
    //   $('#productCode').focus();
    //   this.toastr.error("Product Code is required");
    //   return false
    // }

    if (this.productCreationModel.viewData.productName == null || this.productCreationModel.viewData.productName == "") {
      $('#productName').focus();
      this.toastr.error("Product Name is required");
      return false
    }

    else if ($('#group').val() == null || $('#group').val() == "") {
      $('#group').focus();
      this.toastr.error("Group is required");
      return false
    }

    else if ($('#productCategory').val() == null || $('#productCategory').val() == "") {
      $('#productCategory').focus();
      this.toastr.error("Category is required");
      return false
    }

    else if ($('#sku').val() == null || $('#sku').val() == "") {
      $('#sku').focus();
      this.toastr.error("SKU is required");
      return false
    }

    // else if (this.service.productCreationModel.UUID == null ||  this.service.productCreationModel.UUID == 0) {
    //   $('#UUID').focus();
    //   this.toastr.error("UUID is required");
    //   return false
    // }

    else if ($('#manufacturer').val() == null || $('#manufacturer').val() == "") {
      $('#manufacturer').focus();
      this.toastr.error("Manufacturer is required");
      return false
    }

    // else if ($('#branded').val() == null || $('#branded').val() == "") {
    //   $('#branded').focus();
    //   this.toastr.error("Brand is required");
    //   return false
    // }

    // else if ($('#model').val() == null || $('#model').val() == "") {
    //   $('#model').focus();
    //   this.toastr.error("Model is required");
    //   return false
    // }

    else if ($('#size').val() == null || $('#size').val() == "") {
      $('#size').focus();
      this.toastr.error("Size is required");
      return false
    }

    return true
  }


  //.....................post product Creation Form

  onSubmitProductCreation() {

    this.productCreationModel = {
      "viewData": {
        "productID": this.service.productCreationModel.productID?.toString() || '0',
        "productCode": this.service.productCreationModel.productCode?.replace(/\s+/g, ' ').trim(),
        "productName": this.service.productCreationModel.productName?.replace(/\s+/g, ' ').trim(),
        "groupID": $("#group").val()?.toString(),
        "categoryID": $("#productCategory").val()?.toString(),
        "skuId": $("#sku").val()?.toString(),
        "alternateUnitID": +$("#alternativeUnit").val(),
        "allowBatch": $("#allowBatch").val()?.toString(),
        "isVatable": $("#vatable").val()?.toString(),
        "assetsTypeID": $("#assetsType").val()?.toString(),
        "isConsumable": $("#consumable").val()?.toString(),
        "bom": $("#BOM").val()?.toString(),
        "expirable": $("#IsExpirable").val()?.toString(),
        "branchID": this.branchIdPC?.toString(),
        "isPublic": $("#public").val()?.toString(),
        "status": $("#productStatus").val(),
        "createdDate": new Date().toISOString(),
        "createdBy": this.userIdPC?.toString(),
        "updatedBy": this.userIdPC?.toString(),
        "updatedDate": new Date().toISOString(),
        "extra1": this.fiscalPC.financialYearId?.toString(),
        "extra2": "",
        "flag": 0
      },
      "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "string",
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
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
      },
      "viewProductDetail": {
        "productDetailsID": this.service.productCreationModel.productDetailsID?.toString()||"0",
        "productID": this.service.productCreationModel.productID?.toString() || "0",
        "uuid": this.service.productCreationModel.UUID?.toString()||"0",
        "brandID": $("#branded").val()?.toString()||"0",
        "sizeID": $("#size").val()?.toString()||"0",
        "modelNO": +$("#model").val()||"0",
        "manufacturerID": $("#manufacturer").val()?.toString()||"0",
        "minimumStock": this.service.productCreationModel.minStock?.toString() || "0",
        "maximumStock": this.service.productCreationModel.maxStock?.toString() || "0",
        "reorderLevel": this.service.productCreationModel.reorderLevel?.toString() || "0",
        "productDescription": this.service.productCreationModel.productDescription?.toString()||'',
        "createdBy": this.userIdPC,
        "createdDate": new Date().toISOString(),
        "updatedBy": this.userIdPC,
        "updatedDate": new Date().toISOString(),
        "extra1": this.service.productCreationModel.HSCode||'',
        "extra2": "",
        "flag": 0
      },
      "returnMsg": null,
      "variableList": null,
      "variableJson": this.tempVariableFormList?JSON.stringify(this.tempVariableFormList) : '[]',
      "allowBatch": $("#allowBatch").val(),
      "buttonName": "",
      "skuAltFactor": this.SKUALTValue || '',
    }

    // console.log(this.productCreationModel, "Product Creation model")
    this.InsertProductCreation()

  }

  InsertProductCreation() {

    if (this.validation() == true) {
      this.service.insertUpdateProductCreate(this.productCreationModel).subscribe((response: any) => {
        // console.log(response);

        if (response.success == false) {
          this.toastr.error(response?.msg);
          $('#productName').focus()
        }
        else if (response.success == true) {
          this.toastr.success(response?.msg);
          this.resetProductCreation()
          this.getProductCreationFilteredList()

          setTimeout(() => {

            $('#productName').focus()
          }, 50)

        }

      },
        (error: any) => {
          this.toastr.error(error?.error?.Messages);
          $('#productName').focus();
        }

      )

    }
  }

  //Get Product Creation data by id

 getProductCreationById(Id: any) {


    let Model = {
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
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPC.fromDate,
      "fromDate": this.fiscalPC.fromDate,
      "endDate": this.fiscalPC.toDate,
      "toDate": this.fiscalPC.toDate,
      "decimalPlace": this.globalVariablePC[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": Id,
      "searchtext": "",
      "cid": 0

    };

    this.service.getProductCreateByID(Model).subscribe((data: any) => {

      console.log("get product create data by id ", data);

      if (data?.returnMsg?.success == true) {
        this.productCreationDataByID = data;

        //  console.log("get product Creation by id ",this.productCreationDataByID);

        this.EditProductCreation(this.productCreationDataByID);

      }
      else if (data?.returnMsg?.success == false) {
        this.toastr.info(data?.returnMsg?.errors)
      }
    });

  }

   EditProductCreation(value: any) {
    this.productCreationDeleteData = false
    this.submitButton = 'Update'
this.productCodeDisable=true

this.service.productCreationModel.productDetailsID=value?.viewProductDetail?.productDetailsID
    this.service.productCreationModel.productID = value?.viewData?.productID
    this.service.productCreationModel.productCode = value?.viewData?.productCode
    this.service.productCreationModel.productName=value?.viewData?.productName

    this.service.productCreationModel.UUID=value?.viewProductDetail?.uuid
    this.service.productCreationModel.minStock=value?.viewProductDetail?.minimumStock
    this.service.productCreationModel.maxStock=value?.viewProductDetail?.maximumStock
    this.service.productCreationModel.reorderLevel=value?.viewProductDetail?.reorderLevel
    this.service.productCreationModel.HSCode=value?.viewProductDetail?.extra1
    this.service.productCreationModel.productDescription=value?.viewProductDetail?.productDescription





    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

      if ($('#group').length) {
        const dropdown = document.getElementById("group") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.groupID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#productCategory').length) {
        const dropdown = document.getElementById("productCategory") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.categoryID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#sku').length) {
        const dropdown = document.getElementById("sku") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.skuId; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      setTimeout(() => {
 if ($('#alternativeUnit').length) {
        const dropdown = document.getElementById("alternativeUnit") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.alternateUnitID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
      this.closeAlternativePopup()
      },500)
      

       if ($('#vatable').length) {
        const dropdown = document.getElementById("vatable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.isVatable; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


       if ($('#assetsType').length) {
        const dropdown = document.getElementById("assetsType") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.assetsTypeID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#consumable').length) {
        const dropdown = document.getElementById("consumable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.isConsumable; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#allowBatch').length) {
        const dropdown = document.getElementById("allowBatch") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.allowBatch; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
       if ($('#IsExpirable').length) {
        const dropdown = document.getElementById("IsExpirable") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.expirable; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#public').length) {
        const dropdown = document.getElementById("public") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.isPublic; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#BOM').length) {
        const dropdown = document.getElementById("BOM") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.bom; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#productStatus').length) {
        const dropdown = document.getElementById("productStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewData?.status // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#manufacturer').length) {
        const dropdown = document.getElementById("manufacturer") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewProductDetail?.manufacturerID // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#branded').length) {
        const dropdown = document.getElementById("branded") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewProductDetail?.brandID // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

        if ($('#model').length) {
        const dropdown = document.getElementById("model") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewProductDetail?.modelNO // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }


        if ($('#size').length) {
        const dropdown = document.getElementById("size") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.viewProductDetail?.sizeID // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
    }, 100);


    this.tempVariableFormList=value?.variableList,
    this.SKUALTValue=value?.skuAltFactor
    setTimeout(() =>{

      this.tab = 'General';
    },1000)

     setTimeout(() =>{

       $('#productName').focus()
     },1000)

  }

  //................. Conformation of product Creation Delete

  confirmBoxProductCreationDelete(Id: any) {
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
    if (this.productCreationDeleteData == true) {
      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.DeleteProductCreation(Id);

        }
      });
    }
    else {
      this.toastr.error("Complete pending edit task!")
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


  //Delete Product Creation

  DeleteProductCreation(Id: number) {

    let Model = {
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
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPC.fromDate,
      "fromDate": this.fiscalPC.fromDate,
      "endDate": this.fiscalPC.toDate,
      "toDate": this.fiscalPC.toDate,
      "decimalPlace": this.globalVariablePC[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": Id,
      "searchtext": "",
      "cid": 0
    };

    this.service.deleteProductCreate(Model).subscribe((res: any) => {
      if (res?.success == true) {
        this.toastr.success(res?.msg)
        setTimeout(() => {

          this.getProductCreationFilteredList()

        }, 100)
        $('#productName').focus()
      }
      else if (res?.success == false) {
        this.toastr.error(res?.errors)
      }
    }, (error: any) => {
      this.toastr.error(error?.error?.Message)
    })


  }


  //Reset  product Creation

  resetProductCreation() {
    setTimeout(() => {

      $('#productName').focus();
    }, 500)

this.productCodeDisable=false

    this.pageIndex = 0;

    this.service.productCreationModel.productID = 0
    this.service.productCreationModel.productDetailsID=0
    this.service.productCreationModel.productCode = ""
    this.service.productCreationModel.productName = ""
    this.service.productCreationModel.UUID = 0
    this.service.productCreationModel.minStock = 0
    this.service.productCreationModel.maxStock = 0
    this.service.productCreationModel.reorderLevel = 0
    this.service.productCreationModel.HSCode = ""
    this.service.productCreationModel.productDescription = ''
    this.service.productCreationModel.value = ""
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
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#branded').length) {
        const dropdown = document.getElementById("branded") as HTMLInputElement | null;
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
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
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

    this.productCreationDeleteData = true
    this.submitButton = 'Save'

    setTimeout(() => {

      this.tab = 'General'
    }, 200);

    this.variableOptionDropdownList = []
    this.tempVariableFormList = []

    this.SKUALTValue = ''
    this.selectedNatureID = 1
  }

  //Pagination of Product Creation

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductCreationFilteredList()
  }


  //................................ Additonal information form..................


  //validation of additional info form

  variableFormValidation() {

    if ($('#variableType').val() == null || $('#variableType').val() == "") {
      $('#variableType').focus();
      this.toastr.error("Variable Type is required");
      return false
    }

    else if (this.selectedNatureID == 1 && (this.service.productCreationModel.value == null || this.service.productCreationModel.value == "")) {
      $('#value').focus();
      this.toastr.error("Value is required");
      return false
    }
    else if (this.selectedNatureID == 2 && (this.service.productCreationModel.wholeNumber == null || this.service.productCreationModel.wholeNumber <= 0)) {
      $('#wholeNumberValue').focus();
      this.toastr.error("Value is required");
      return false
    }

    else if (this.selectedNatureID == 3 && (this.service.productCreationModel.decimalNumber == null || this.service.productCreationModel.decimalNumber <= 0)) {
      $('#decimalValue').focus();
      this.toastr.error("Value is required");
      return false
    }

    else if (this.selectedNatureID == 4 && ($('#variableOption').val() == null || $('#variableOption').val() == "")) {
      $('#variableOption').focus();
      this.toastr.error("Value is required");
      return false
    }
    else if (this.selectedNatureID == 5 && (this.service.productCreationModel.multiSelectValue == null || this.service.productCreationModel.multiSelectValue == "")) {
      // $('#variableOption').focus();
      this.toastr.error("Value is required");
      return false
    }
    return true
  }




  //Submit additional form

  submitVariableForm() {
    if (this.variableFormValidation() == true) {
      const exists = this.tempVariableFormList.some(
        (item:any) => item?.variableId == $('#variableType').val()?.split('-')[0].toString()
      );

      if (!exists) {
        this.tempVariableFormList.push(
          {
            //   "variableTypeID":$('#variableType').val(),
            //   "variableTypeName":$('#variableType option:selected').text(),
            //   "valueID":this.selectedNatureID==4?$('#variableType').val():this.selectedNatureID==5?this.service.productCreationModel.multiSelectValue:0,
            //   "valueName":this.selectedNatureID==1?this.service.productCreationModel.value:this.selectedNatureID==2?this.service.productCreationModel.wholeNumber:this.selectedNatureID==3?this.service.productCreationModel.decimalNumber:this.selectedNatureID==4?$('#variableOption option:selected').text():this.selectedNatureID==5 && this.service.productCreationModel.multiSelectValue.length>0?this.service.productCreationModel.multiSelectValue.map((item: any) => item.optionName).join(','):'',

            "productInfoId": 0,
            "variableId": $('#variableType').val()?.split('-')[0].toString(),
            "variableNatureID": $('#variableType').val()?.split('-')[1].toString(),
            "variableText": $('#variableType option:selected').text(),
            "variableValue": this.selectedNatureID == 1 ? this.service.productCreationModel.value : this.selectedNatureID == 2 ? this.service.productCreationModel.wholeNumber : this.selectedNatureID == 3 ? this.service.productCreationModel.decimalNumber : this.selectedNatureID == 4 ? $('#variableOption option:selected').text() : this.selectedNatureID == 5 && this.service.productCreationModel.multiSelectValue.length > 0 ? this.service.productCreationModel.multiSelectValue.map((item: any) => item.optionName).join(',') : ''
          }
        );
        this.tempVariableFormReset()
        setTimeout(() => {

          $('#variableType').focus()
        }, 100)
      }
      else {
        this.toastr.error("Already Exist")
        $('#variableType').focus()
      }

    }
    console.log(this.tempVariableFormList, "temp list variable");

  }


  //Delete additional form data

  DeleteVariableFormData(index: number) {

    this.tempVariableFormList.splice(index, 1);

  }


  //Reset Additional info form
  tempVariableFormReset() {
    this.service.productCreationModel.value = ''
    this.service.productCreationModel.decimalNumber = 0
    this.service.productCreationModel.wholeNumber = 0
    this.service.productCreationModel.multiSelectValue = ''
    this.selectedNatureID = 1
    this.variableOptionDropdownList = []

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



  //......................ProductUnit Relation Form.......................



  //Product Unit Relation validation
  productRelationFormValidation() {
    if (this.popupSKUValue == null || this.popupSKUValue == 0) {
      $('#popupSKUUnit').focus();
      this.toastr.error("SKU Value is required");
      return false
    }

    else if (this.popupALTValue == null || this.popupALTValue == "") {
      $('#popupALTUnit').focus();
      this.toastr.error("Alternative Value is required");
      return false
    }

    return true
  }



  //Submit productunit Relation form
  onSubmitProductionUnitRelation() {
    if (this.productRelationFormValidation() == true) {
      this.SKUALTValue = `${this.popupSKUValue}--${this.popupALTValue}`
      this.closeAlternativePopup()
      this.tempProductUnitRelationReset()
    }

  }

  //Reset productUnit Relation form
  tempProductUnitRelationReset() {
    this.popupALTValue = 0
    this.popupSKUValue = 0
  }




  //............................................ADD Variable  form................................................


  //open ADD varibale Popup
  openAddVariablePopup() {
    this.modalAnimationClass = 'modal-enter';
    this.addVariablePopup = true;
    this.getNatureDropdownList()
    this.getAddVariableFilteredList()
  }

  //Close ADD varibale Popup
  closeAddVariablePopup() {
    this.modalAnimationClass = 'modal-exit';
    this.addVariablePopup = false;
    this.getProductCreationDropdownList()
    this.addVariableReset()

  }

  onSearchAddVariable(event: any) {
    this.getAddVariableFilteredList()
  }


  handlePageEventOfAddVariable(e: any) {
    this.lengthAV = e.length;
    this.pageSizeAV = e.pageSize;
    this.pageIndexAV = e.pageIndex;
    this.getAddVariableFilteredList()
  }

  //Get Add Variable Nature   dropdownlists
  getNatureDropdownList() {
    let Model = {
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
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": 0,
      "searchtext": "",
      "cid": 0

    };

    this.service.getNatureDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        // console.log(result, 'add variable dropdown data');
        if (result) {
          this.natureDropdownList = result?.list

          console.log(this.natureDropdownList, "Add variable Nature dropdown data");

        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  //Add Variable Filtered List
  getAddVariableFilteredList() {
    let Model = {
      "dataFilterModel": {
        "tblName": "ProductInfoVariable--ProductInfoVariable",
        "columnName": "",
        "strName": $('#addVariableSearchString').val(),
        "underColumnName": "",
        "underIntID": 0,
        "filterColumnsString": `[\"variable--${$('#addVariableSearchString').val()}\"]`,
        "currentPageNumber": this.pageIndexAV + 1,
        "pageRowCount": this.pageSizeAV,
        "strlistNames": "string"
      },
      "mainInfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": 0,
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
        console.log(result, 'Add Variable FIlterd list');
        if (result) {
          this.addVariableGridList = result[0]
          this.addVariableGridDetails = result[1]

          //  console.log(this.addVariableGridList,"gridddd");
          // console.log(result[1].totalRecords,"total");

          this.lengthAV = this.addVariableGridDetails?.totalRecords
          // this.pageSize=this. this.addVariableGridDetails?.pageSize
          // this.pageIndex=this. this.addVariableGridDetails?.currentPageNumber - 1


        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }


  //validaion of add variable page
  validationAddVariable() {

    if (this.addVariableModel.productInfoVariable.variable == null || this.addVariableModel.productInfoVariable.variable == "") {
      $('#variableName').focus();
      this.toastr.error("Variable Name is required");
      return false
    }

    else if ($('#nature').val() == null || $('#nature').val() == "") {
      $('#nature').focus();
      this.toastr.error("Nature is required");
      return false
    }
    return true
  }

  onSubmitAddVariable() {

    this.addVariableModel = {
      "productInfoVariable": {
        "variableID": this.service.addVariableModel.variableID || 0,
        "variable": this.service.addVariableModel.variableName?.replace(/\s+/g, ' ').trim(),
        "nature": +$("#nature").val(),
        "status": $("#addVariableStatus").val(),
        "extra1": "",
        "extra2": "",

      },
      "maininfo": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "string",
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
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": 0
      }
    }

    // console.log(this.addVariableModel, "add variable model")

    if (this.insertedAddVariable == true) {
      this.insertedAddVariable = false
      this.InsertAddVariable()
    }

  }

  InsertAddVariable() {

    if (this.validationAddVariable() == true) {
      this.service.insertUpdateAddVariable(this.addVariableModel).subscribe((response: any) => {
        // console.log(response);
        if (response?.success == false) {
          this.toastr.error(response?.errors);
          $('#variableName').focus()
        }
        else if (response?.success == true) {

          this.toastr.success(response?.msg);
          this.addVariableReset()
          this.getAddVariableFilteredList()


          setTimeout(() => {

            $('#variableName').focus()
          }, 50)

        }

      },
        (error: any) => {
          this.toastr.error(error?.error?.Messages);
          $('#variableName').focus();
        }

      )



    }
    setTimeout(() => {

      this.insertedAddVariable = true
    }, 1000)
  }

  getAddVariableById(Id: any) {


    let Model = {
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
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": Id,
      "searchtext": "",
      "cid": 0

    };

    this.service.getAddVariableByID(Model).subscribe((d: any) => {

      console.log("get add variable data by id ", d);

      if (d?.returnMsg?.success == true) {
        this.addVariableDataByID = d?.details;

        //  console.log("get add variable by id ",this.addVariableDataByID);

        this.EditAddVariable(this.addVariableDataByID);

      }
      else if (d?.returnMsg?.success == false) {
        this.toastr.info(d?.returnMsg?.errors)
      }
    });

  }


  EditAddVariable(value: any) {
    this.addVariableDeleteData = false
    this.submitButtonAV = 'Update'
    this.service.addVariableModel.variableID = value?.variableID

    this.service.addVariableModel.variableName = value?.variable


    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

      if ($('#nature').length) {
        const dropdown = document.getElementById("nature") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.natureID; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#addVariableStatus').length) {
        const dropdown = document.getElementById("addVariableStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = value?.status == 'True' ? "1" : "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
    }, 100);


    $('#variableName').focus()

  }


  //Delete Conformation of add Variable page

  confirmBoxAddVariableDelete(Id: any) {
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
    if (this.addVariableDeleteData == true) {


      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.DeleteAddVariable(Id);
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


  DeleteAddVariable(Id: number) {

    let Model = {
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
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPC.fromDate,
      "fromDate": this.fiscalPC.fromDate,
      "endDate": this.fiscalPC.toDate,
      "toDate": this.fiscalPC.toDate,
      "decimalPlace": this.globalVariablePC[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": Id,
      "searchtext": "",
      "cid": 0
    };

    this.service.deleteAddVariable(Model).subscribe((res: any) => {
      if (res?.success == true) {
        this.toastr.success(res?.msg)
        setTimeout(() => {

          this.getAddVariableFilteredList()

        }, 100)
        $('#variableName').focus()
      }
      else if (res?.success == false) {
        this.toastr.error(res?.errors)
      }
    }, (error: any) => {
      this.toastr.error(error?.error?.Message)
    })


  }

  //reset addVariable
  addVariableReset() {
    this.service.addVariableModel.variableID = 0
    this.service.addVariableModel.variableName = ''


    if ($('#nature').length) {
      const dropdown = document.getElementById("nature") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }

    if ($('#addVariableStatus').length) {
      const dropdown = document.getElementById("addVariableStatus") as HTMLInputElement | null;
      if (dropdown) {
        dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      }
    }
    $('#variableName').focus()

    this.addVariableDeleteData = true
    this.submitButtonAV = 'Save'

  }



  //................................variable Option page................................................

  //ADD variable Option in ADD Variable page
  //open ADD varibale Popup
  openVariableOptionPopup(id: any) {
    this.modalAnimationClass = 'modal-enter';
    this.variableOptionPopup = true;
    this.selectedAddVariableID = id
    this.getVariableOptionList(id)
  }
  //Close ADD varibale Popup
  closeVariableOptionPopup() {
    this.selectedAddVariableID = 0
    this.modalAnimationClass = 'modal-exit';
    this.variableOptionPopup = false;
  }

  //Variable Option Filtered List
  getVariableOptionList(ID: any) {
    let Model = {
      "userId": this.userIdPC,
      "fiscalID": this.fiscalPC.financialYearId,
      "branchDepartmentId": 0,
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
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": ID,
      "searchtext": "",
      "cid": 0
    };




    this.service.getVariableOptionList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'Variable option list');
        if (result) {
          this.variableOptionGridList = result
        }
      },
      (error) => {
        this.toastr.error(error?.error?.Messages);
      }
    );
  }



  //variable option validation
  validationVariableOption() {

    if (this.variableOptionModel.option == null || this.variableOptionModel.option == "") {
      $('#option').focus();
      this.toastr.error("Option is required");
      return false
    }
    return true
  }



  //Submit variable option form

  onSubmitVariableOption() {


    this.variableOptionModel = {

      "variableID": this.selectedAddVariableID || 0,
      "option": this.optionName?.replace(/\s+/g, ' ').trim(),
      "userID": this.userIdPC,

      "maininfoModel": {
        "userId": this.userIdPC,
        "fiscalID": this.fiscalPC.financialYearId,
        "branchDepartmentId": this.branchIdPC,
        "branchId": this.branchIdPC,
        "dbName": "string",
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
        "bookClose": 0,
        "sessionId": this.sessionIdPC,
        "id": 0,
        "searchtext": "",
        "cid": $("#VariableOptionStatus").val() == "1" ? 1 : 0
      }
    }

    // console.log(this.variableOptionModel, "variable option model")

    if (this.insertedVariableOption == true) {
      this.insertedVariableOption = false
      this.InsertVariableOption()
    }

  }



  InsertVariableOption() {

    if (this.validationVariableOption() == true) {

      this.service.insertUpdateVariableOption(this.variableOptionModel).subscribe((response: any) => {
        // console.log(response);
        if (response?.success == false) {
          this.toastr.error(response?.errors);
          $('#option').focus()
        }
        else if (response?.success == true) {

          this.toastr.success(response?.msg);

          this.optionName = ''

          if ($('#VariableOptionStatus').length) {
            const dropdown = document.getElementById("VariableOptionStatus") as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }


          this.getVariableOptionList(this.selectedAddVariableID)
          setTimeout(() => {

            $('#option').focus()
          }, 50)

        }

      },
        (error: any) => {
          this.toastr.error(error?.error?.Messages);
          $('#option').focus();
        }

      )



    }
    setTimeout(() => {

      this.insertedVariableOption = true
    }, 1000)
  }


  //Delete Conformation of variable option

  confirmBoxVariableOptionDelete(Id: any) {
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
    confirmBox.openConfirmBox$().subscribe(resp => {
      // do some action after user click on a button
      if (resp.success === true && resp.clickedButtonID === 'yes') {
        this.DeleteVariableOption(Id);
        // this.toastr.error("No Permission to delete")

      }
    });


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


  DeleteVariableOption(Id: number) {

    let Model = {
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
      "mainId": Id,
      "strId": "",
      "startDate": this.fiscalPC.fromDate,
      "fromDate": this.fiscalPC.fromDate,
      "endDate": this.fiscalPC.toDate,
      "toDate": this.fiscalPC.toDate,
      "decimalPlace": this.globalVariablePC[2].value,
      "bookClose": 0,
      "sessionId": this.sessionIdPC,
      "id": Id,
      "searchtext": "",
      "cid": 0
    };

    this.service.deleteVariableOption(Model).subscribe((res: any) => {
      if (res?.success == true) {
        this.toastr.success(res?.msg)
        setTimeout(() => {

          this.getVariableOptionList(this.selectedAddVariableID)

        }, 100)
        $('#option').focus()
      }
      else if (res?.success == false) {
        this.toastr.error(res?.errors)
      }
    }, (error: any) => {
      this.toastr.error(error?.error?.Message)
    })


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

}
