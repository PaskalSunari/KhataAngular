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
      this.getUnitList();
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
              setTimeout(() =>{
                if (component.requestBy && component.requestBy.nativeElement){
                  const $el = $(component.requestBy.nativeElement);
                  try{
                    $el.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
                  }catch (e){
                    try{
                      (component.requestBy.nativeElement as HTMLElement).focus(); 
                    }catch{}
                  }
                }
              },0);
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
    if (!userId) {
      this.requestedToDropdownList = [];
      return;
    }
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
          console.log(result);
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
      }
    },
    (error) => {

    }
   )
  }
  getUnitList(){
    this.service.getUnitLIst().subscribe(
      (res) =>{
        let result: any = res;
        if (result){
          this.unitList = result?.result;
        }
      },
      (error) => {

      }
    )
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
      availableQuantity: availableQuantityValue || '0'
    };
    this.tableRows.push(rowData);
    $(this.requestBy.nativeElement).val('Choose').trigger('change');
    $(this.requestTo.nativeElement).val('Choose').trigger('change');
    $(this.department.nativeElement).val('Choose').trigger('change');
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
      unitID: +row.unitValue,
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
