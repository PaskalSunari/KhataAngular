import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { DemandService } from './service/demand.service';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html'
})
export class DemandComponent {
  @ViewChild('requestBy') requestBy!: ElementRef;
  @ViewChild('requestTo') requestTo!: ElementRef;
  @ViewChild('department') department!: ElementRef;
  @ViewChild('product') product!: ElementRef;
  @ViewChild('quantity') quantity!: ElementRef;
  @ViewChild('unit') unit!: ElementRef;
  @ViewChild('availableQuantity') availableQuantity!: ElementRef;
  @ViewChild('remarks') remarks!: ElementRef;
  @ViewChild('expectedDate') expectedDate!: ElementRef;
  showForm = true;
  today = new Date().toISOString().split('T')[0];
  requestedByDropdownList:any[]=[];
  requestedToDropdownList:any []=[];
  getDepartmentList: any[]=[];
  productList: any[]=[];
  unitList: any[]=[];
  tableRows: any[] = [];
  selectedRequestById : number | null = null;
  // ⭐ ADDED FLAG – this locks the three dropdowns after 1st addRowToTable()
  lockDropdown = false;
  toggleForm() {
    this.showForm = !this.showForm;
  }
 constructor(private el: ElementRef,public service: DemandService, private toastr: ToastrService) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
      this.getRequestByDropdownList();
      this.getDepartmentDropdownList();
      this.getProductList();
      this.enterFun();
    }, 0);
  }
  ngOnDestroy(): void{
    try{
      $(this.el.nativeElement).find('select').each(function (this: any){
        if ($(this).hasClass('select2-hidden-accessible')){
          $(this).select2('destroy');
        }
      });
      $(document).off('keydown blur');
      $(document).off('select2:close');
    }catch(e){

    }
  }
  enterFun() {
    const component = this;
    $(document).ready(function () {
      $('input, select, .focussable, textarea ,button').on(
        'keydown blur',
       function (this: HTMLElement, event: any) {
          if (event.keyCode === 13) {
            event.preventDefault();
            const current = $(event.target);
            if (current.attr('id') === 'button1'){
              component.addRowToTable();
              return;
            } else if (current.attr('id') === 'finalPostButton') {
              component.FinalPost();
              return;
            }
            if (!current.hasClass('select2-hidden-accessible')) {
              setFocusOnNextElement.call(current);
            }
          }
        }
      );

      $('select').on('select2:close', function (this: HTMLElement, event: any) {
        const $this = $(this);
        setTimeout(() => {
          setFocusOnNextElement.call($this);
        }, 0);
      });
    });
  }
  
     getRequestByDropdownList() {
    this.service.getRequestedByDropdownList().subscribe(
      (res) => {
        const result: any = res;
        if (result) {
          this.requestedByDropdownList = result?.result || [];
          setTimeout(() => {
            if (this.requestBy && this.requestBy.nativeElement) {
              const $el = $(this.requestBy.nativeElement);
              if (!$el.hasClass('select2-hidden-accessible')) {
                $el.select2();
              }

              const component = this;
              $el.off('change.demandRequestBy').on('change.demandRequestBy', function () {
                if (component.lockDropdown) return; // ⭐ BLOCK CHANGES WHEN LOCKED
                const value = $(component.requestBy.nativeElement).val();
                const userId = Number(value);
                if (!isNaN(userId) && userId > 0) {
                  component.selectedRequestById = userId;
                  component.getRequestToDropdownList(userId);
                } else {
                  component.selectedRequestById = null;
                  component.requestedToDropdownList = [];
                }
              });

              try {
                $el.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
              } catch (e) {
                try { (this.requestBy.nativeElement as HTMLElement).focus(); } catch {}
              }
            }
          }, 0);
        }
      },
      (error) => {
      }
    );
  }

  getRequestToDropdownList(userId: number) {
    if (!userId || this.lockDropdown) return;   // ⭐ PREVENT CHANGES IF LOCKED
    this.service.getRequestedToDropdownList(userId).subscribe(
      (res) => {
        let result: any = res;
        if (result) {
          this.requestedToDropdownList = result?.result ;
        }
      },
      (error) => {
      }
    );    
  }
  getDepartmentDropdownList() {
    this.service.getDepartmentDropdownList().subscribe(
      (res) => {
        let result: any = res;
        if (result){
          this.getDepartmentList = result?.result;
        }
      },
      (error) => {

      }
    );
  }
  getProductList(){
   this.service.getProductList().subscribe(
    (res) => {
      let result: any = res;
      if (result){
        this.productList = result?.result;
        setTimeout(() => {
          if (this.product && this.product.nativeElement) {
            const $el = $(this.product.nativeElement);
            if (!$el.hasClass('select2-hidden-accessible')) {
              $el.select2();
            }

            const component = this;
            $el.off('change.demandProduct').on('change.demandProduct', function () {
              const value = $(component.product.nativeElement).val();
              const productId = Number(value);
              if (!isNaN(productId) && productId > 0) {
                component.getUnitList(productId);
              } else {
                component.unitList = [];
              }
            });
          }
        }, 0);
      }
    },
    (error) => {

    }
   )
  }
  getUnitList(productId: number){
    if (!productId) {
      this.unitList = [];
      return;
    }

    this.service.getUnitList(productId).subscribe(
      (res) => {
        let result: any = res;
        if (result){
          this.unitList = result?.result;
        }
      },
      (error) => {

      }
    );
  }
  addRowToTable() {
    const requestByValue = $(this.requestBy.nativeElement).val();
    const requestByText = $(this.requestBy.nativeElement).find('option:selected').text();
    
    const requestToValue = $(this.requestTo.nativeElement).val();
    const requestToText = $(this.requestTo.nativeElement).find('option:selected').text();
    
    const departmentValue = $(this.department.nativeElement).val();
    const departmentText = $(this.department.nativeElement).find('option:selected').text();
    
    const productValue = $(this.product.nativeElement).val();
    const productText = $(this.product.nativeElement).find('option:selected').text();
    
    const quantityValue = (this.quantity.nativeElement as HTMLInputElement).value;
    const unitValue = $(this.unit.nativeElement).val();
    const unitText = $(this.unit.nativeElement).find('option:selected').text();
    
    const availableQuantityValue = (this.availableQuantity.nativeElement as HTMLInputElement).value;

    if (!requestByValue || requestByValue === 'Choose' || 
        !requestToValue || requestToValue === 'Choose' ||
        !departmentValue || departmentValue === 'Choose' ||
        !productValue || productValue === 'Choose' ||
        !quantityValue || !unitValue || unitValue === 'Choose') {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }
    if (!quantityValue || isNaN(Number(quantityValue)) || Number(quantityValue) <= 0){
      this.toastr.warning('Please enter the valid quantity greater than zero.', 'Validation Eror');
      return;
    }
    if(!availableQuantityValue || isNaN(Number(availableQuantityValue)) || Number(availableQuantityValue) < 0){
      this.toastr.warning('Please enter the valid availabel quantity.', 'Validation Eroor');
      return;
    }
    const rowData = {
      sn: this.tableRows.length + 1,
      date: new Date().toLocaleDateString(),
      requestedBy: requestByText,
      requestedByValue: requestByValue,
      requestedTo: requestToText,
      requestedToValue: requestToValue,
      category: departmentText,
      departmentValue: departmentValue,
      particulars: productText,
      productValue: productValue,
      quantity: quantityValue,
      unit: unitText,
      unitValue: unitValue,
      unitID: Number(unitValue),
      availableQuantity: availableQuantityValue || '0'
    };
    this.tableRows.push(rowData);
    const shouldLockDropdowns = !this.lockDropdown;
    if (shouldLockDropdowns){
      this.lockDropdown = true;
    }
    setTimeout(() => {
      if (shouldLockDropdowns){
        $(this.requestBy.nativeElement).prop('disabled', true).trigger('change.select2');
        $(this.requestTo.nativeElement).prop('disabled', true).trigger('change.select2');
        $(this.department.nativeElement).prop('disabled', true).trigger('change.select2');
      }
      if (this.product && this.product.nativeElement){
        const $product =  $(this.product.nativeElement);
        try{
          $product.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
        }catch{
          (this.product.nativeElement as HTMLElement).focus();
        }
      }
    }, 0);
    $(this.product.nativeElement).val('Choose').trigger('change');
    (this.quantity.nativeElement as HTMLInputElement).value = '';
    $(this.unit.nativeElement).val('Choose').trigger('change');
    (this.availableQuantity.nativeElement as HTMLInputElement).value = '';    
    this.toastr.success('Item added to table successfully.', 'Success');
  }
  
  removeRowFromTable(index: number) {
    this.tableRows.splice(index, 1);
    this.tableRows.forEach((row, idx) => {
      row.sn = idx + 1;
    });
    if (this.tableRows.length === 0 && this.lockDropdown){
      this.lockDropdown = false;
      $(this.requestBy.nativeElement).prop('disabled', false).trigger('change.select2');
      $(this.requestTo.nativeElement).prop('disabled', false).trigger('change.select2');
      $(this.department.nativeElement).prop('disabled', false).trigger('change.select2');
    }
    this.toastr.success('Item removed from table.', 'Success');
  }
  FinalPost(){
    const fiscalYear = localStorage.getItem('fiscalYear');
    const fiscalYearId = fiscalYear ? JSON.parse(fiscalYear).financialYearId: 0;
    const userId = Number(localStorage.getItem('userId')) || 0;
    const remarks = this.remarks.nativeElement.value;
    const expectedDate = this.expectedDate.nativeElement.value;
    if (this.tableRows.length === 0) {
      this.toastr.warning('Please add at least one item to the table.', 'Validation Error');
      return;
    }
    if (!remarks || remarks.trim() === ''){
      this.toastr.warning('Please add the remarks.', 'Validation Error');
      return;
    }   
    const items = this.tableRows.map(row => ({
      productId: +row.productValue,
      departmentID: +row.departmentValue,
      unitID: +row.unitID,
      transactionQty: +row.quantity,
      skuQty: 0,              // set as needed
      requestBy: +row.requestedByValue,
      requestedTo: +row.requestedToValue,
      requestedToDept: +row.departmentValue,
      availableQuantity: +row.availableQuantity || 0,
    }))
    const payload = {
      userID: userId,
      userName: "string",
      flag: "Insert",
      estimatedDate:expectedDate ? new Date(expectedDate): new Date(),     
      fiscalYearID: fiscalYearId,
      remarks: remarks,             
      status: true,
      entryDate: new Date(),
      entryBy: userId,
      items: items                   
    };
    this.service.postDemand(payload).subscribe(
      res => {
        this.toastr.success('Demand posted successfully.', 'Success');
        this.tableRows = [];
        this.lockDropdown = false;
        $(this.requestBy.nativeElement).val('Choose').trigger('change');
        $(this.requestTo.nativeElement).val('Choose').trigger('change');
        $(this.department.nativeElement).val('Choose').trigger('change');
        $(this.requestBy.nativeElement).prop('disabled', false).trigger('change.select2');
        $(this.requestTo.nativeElement).prop('disabled', false).trigger('change.select2');
        $(this.department.nativeElement).prop('disabled', false).trigger('change.select2');
        try {
          const $reqBy = $(this.requestBy.nativeElement);
          $reqBy.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
        } catch {
          try {
            (this.requestBy.nativeElement as HTMLElement).focus();
          } catch {}
        }
        try {
          (this.remarks.nativeElement as HTMLInputElement).value = '';
        } catch {}
      },
      err =>{
        console.error('Error in posting demand', err);
      }
    )
  }
}
