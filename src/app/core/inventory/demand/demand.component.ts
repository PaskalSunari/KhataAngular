import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnChanges, SimpleChanges, numberAttribute, ChangeDetectorRef } from '@angular/core';
declare var $: any;
declare var bootstrap: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { DemandService } from './service/demand.service';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { timestamp } from 'rxjs';
@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html'
})
export class DemandComponent implements AfterViewInit, OnDestroy {
  @ViewChild('requestBy') requestBy!: ElementRef;
  @ViewChild('requestTo') requestTo!: ElementRef;
  @ViewChild('department') department!: ElementRef;
  @ViewChild('product') product!: ElementRef;
  @ViewChild('quantity') quantity!: ElementRef;
  @ViewChild('unit') unit!: ElementRef;
  @ViewChild('remarks') remarks!: ElementRef;
  @ViewChild('expectedDate') expectedDate!: ElementRef;
  @ViewChild('availableQtyInfo') availableQtyInfo!: ElementRef;
  @ViewChild('requestedToDepartment') requestedToDepartmentRef!: ElementRef;
  showForm = true;
  today = new Date().toISOString().split('T')[0];
  requestedByDropdownList: any[] = [];
  requestedToDropdownList: any[] = [];
  getDepartmentList: any[] = [];
  productList: any[] = [];
  unitList: any[] = [];
  tableRows: any[] = [];
  selectedRequestById: number | null = null;
  lastAvailableQty: number | null = null;
  lockDropdown = false;
  availableQtyPopover: any = null;
  unitName: string = '';
  stockWarningMessage: string = '';
  toggleForm() {
    this.showForm = !this.showForm;
  }
  constructor(private el: ElementRef, public service: DemandService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
      this.getDepartmentDropdownList();
      this.getRequestToDropdownList();
      this.getProductList();
      this.enterFun();
      if (this.department && this.department.nativeElement){
        const $department = $(this.department.nativeElement);
        setTimeout(() => {
          try{
            $department.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
          }catch{
            try{
              (this.department.nativeElement as HTMLElement).focus();
            }catch {}
          }
        }, 100)
      }
    }, 0);
    let self = this
    $('#unit').on('change', function (event: any) {
      if (event.target.value) {
        self.service.AvailableQuantity($('#product').val(), $('#unit').val()).subscribe((res) => {
          const result: any = res;
          console.log('Available Quantity Result:', result);
          const qty =
            result &&
              Array.isArray(result.result) &&
              result.result.length > 0 &&
              typeof result.result[0].transactionQty === 'number'
              ? result.result[0].transactionQty
              : 0;
          self.lastAvailableQty = qty;
          self.unitName = 
          result && Array.isArray(result.result)
          && result.result.length > 0 
          && result.result[0].unitName ? result.result[0].unitName : '';
          self.initAvailableQtyPopover();
        },
          (error) => {
            self.lastAvailableQty = null;
            self.destroyAvailableQtyPopover();
          });
      }
    })
    // $('#requestedToDepartment').on('change', function (event: any) {
    //   if(event.target.value){
    //   self.getRequestToDropdownList($('#requestBY').val(),$('#requestedToDepartment').val())
    //   }
    //    })
  }
  ngOnDestroy(): void {
    try {
      $(this.el.nativeElement).find('select').each(function (this: any) {
        if ($(this).hasClass('select2-hidden-accessible')) {
          $(this).select2('destroy');
        }
      });
      $(document).off('keydown blur');
      $(document).off('select2:close');
      this.destroyAvailableQtyPopover();
    } catch (e) {

    }
  }

  initAvailableQtyPopover() {
    setTimeout(() => {
      if (this.availableQtyInfo && this.availableQtyInfo.nativeElement && this.lastAvailableQty !== null) {
        this.destroyAvailableQtyPopover();
        try {
          const element = this.availableQtyInfo.nativeElement;
          this.availableQtyPopover = new bootstrap.Popover(element, {
            trigger: 'click hover focus',
            placement: 'bottom',
            html: true,
            customClass: 'stock-popover-modern',
            content: ` <div class="popover-content-modern">
            <div class="popover-info-line">
                <span class="stock-icon fancy-chart-icon">
                    <i class="fas fa-chart-line"></i>
                </span>
                <strong>Available Stocks</strong>
            </div>
            <div class="stock-qty">
                ${this.lastAvailableQty}
                <span class="unit-name">${this.unitName}</span>
            </div>
        </div>`,
          });
        } catch (e) {
          console.error('Error initializing popover:', e);
        }
      }
    }, 100);
  }

  destroyAvailableQtyPopover() {
    if (this.availableQtyPopover) {
      try {
        this.availableQtyPopover.dispose();
        this.availableQtyPopover = null;
      } catch (e) {
        console.error('Error destroying popover:', e);
      }
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
            if (current.attr('id') === 'button1') {
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
  getDepartmentDropdownList() {
    this.service.getDepartmentDropdownList().subscribe(
      (res) => {
        let result: any = res;
        if (result) {
          this.getDepartmentList = result?.result;
          setTimeout(() => {
            if (this.department && this.department.nativeElement) {
              const $el = $(this.department.nativeElement);
              if (!$el.hasClass('select2-hidden-accessible')) {
                $el.select2();
              }
              const component = this;
              $el.off('change.demandDepartment').on('change.demandDepartment', function () {
                if (component.lockDropdown) return;
                const value = $(component.department.nativeElement).val();
                const departmentId = value && value !== 'Choose' ? Number(value) : undefined;
                component.getRequestByDropdownList(departmentId);
              });
            }
          }, 0);
        }
      },
      (error) => {
      }
    );
  }
  getRequestByDropdownList(departmentId? : Number) {
    this.service.getRequestedByDropdownList(departmentId).subscribe(
      (res) => {
        const result: any = res;
        if (result) {
          this.requestedByDropdownList = result?.result || [];
          this.cdRef.detectChanges();
          setTimeout(() => {
            if (this.requestBy && this.requestBy.nativeElement) {
              const $el = $(this.requestBy.nativeElement);

              
              const hasSelect2 = $el.hasClass('select2-hidden-accessible');
              if (hasSelect2) {
                $el.select2('destroy');
              }
              $el.select2();
              const component = this;
              const userID = localStorage.getItem('userId');
              if (userID) {
                const userIdNum = Number(userID);
                const existingUser = this.requestedByDropdownList.some((u: any) => u.userID === userIdNum);
                if (existingUser){
                  $el.val(userID).trigger('change.select2');
                  component.selectedRequestById = userIdNum;
                }else{
                  $el.val('Choose').trigger('change.select2');
                  component.selectedRequestById = null;
                  component.requestedToDropdownList = [];
                }               
              }else{
                $el.val('Choose').trigger('change.select2');
                component.selectedRequestById = null;
                component.requestedToDropdownList = [];
              }
              $el.off('change.demandRequestBy').on('change.demandRequestBy', function () {
                if (component.lockDropdown) return;
                const value = $(component.requestBy.nativeElement).val();
                const userId = Number(value);
                if (!isNaN(userId) && userId > 0) {
                  component.selectedRequestById = userId;
                } else {
                  component.selectedRequestById = null;
                  component.requestedToDropdownList = [];
                }
              });

              try {
                $el.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
              } catch (e) {
                try { (this.requestBy.nativeElement as HTMLElement).focus(); } catch { }
              }
            } else {
            }
          }, 100); 
        }
      },
      (error) => {
      }
    );
  }

  getRequestToDropdownList() {
    this.service.getRequestedToDropdownList().subscribe(

      (res) => {
        let result: any = res;
        if (result) {
          this.requestedToDropdownList = result?.result;
        }
      },
      (error) => {
      }
    );
  }  
  getProductList() {
    this.service.getProductList().subscribe(
      (res) => {
        let result: any = res;
        if (result) {
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
                  component.lastAvailableQty = null;
                  component.destroyAvailableQtyPopover();
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
  getUnitList(productId: number) {
    if (!productId) {
      this.unitList = [];
      return;
    }

    this.service.getUnitList(productId).subscribe(
      (res) => {
        let result: any = res;
        if (result) {
          this.unitList = result?.result;
        }
      },
      (error) => {

      }
    );
  }
  addRowToTable() {
    if (
      !this.requestTo?.nativeElement ||
      !this.product?.nativeElement ||
      !this.quantity?.nativeElement ||
      !this.unit?.nativeElement
    )
    {
      this.toastr.error('Some required fields are missing in the form.', 'Error');
      return;
    }
     const requestByValue = localStorage.getItem('userId');
     const userInfo = localStorage.getItem('userInfo');
     const requestByText = userInfo
        ? JSON.parse(userInfo).strUsername
        : '';
     const stockLocation = localStorage.getItem('stockLocation');
     const requestByDeptValue = stockLocation
    ? JSON.parse(stockLocation).locationId
    : null;
     const requestByDeptText = stockLocation
    ? JSON.parse(stockLocation).locationName
    : '';
    // const requestByDeptValue = $('#requestByDepartment').val();
    // const requestByDeptText = $('#requestByDepartment').find('option:selected').text();

    // const requestByValue = $(this.requestBy.nativeElement).val();
    // const requestByText = $(this.requestBy.nativeElement).find('option:selected').text();

    const requestToValue = $(this.requestTo.nativeElement).val();
    const requestToText = $(this.requestTo.nativeElement).find('option:selected').text();

    const requestedToDepartmentValue = $('#requestedToDepartment').val();
    const requestedToDepartmentText = $('#requestedToDepartment').find('option:selected').text();

    const productValue = $(this.product.nativeElement).val();
    const productText = $(this.product.nativeElement).find('option:selected').text();

    const quantityValue = (this.quantity.nativeElement as HTMLInputElement).value;
    const unitValue = $(this.unit.nativeElement).val();
    const unitText = $(this.unit.nativeElement).find('option:selected').text();

    if (!requestByValue || requestByValue === 'Choose' ||
      !requestToValue || requestToValue === 'Choose' ||
      !requestByDeptValue || requestByDeptValue === 'Choose' ||
      !requestedToDepartmentValue || requestedToDepartmentValue === 'Choose' ||
      !productValue || productValue === 'Choose' ||
      !quantityValue || !unitValue || unitValue === 'Choose') {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }
    if (!quantityValue || isNaN(Number(quantityValue)) || Number(quantityValue) <= 0) {
      this.toastr.warning('Please enter the valid quantity greater than zero.', 'Validation Eror');
      return;
    }
    if (this.lastAvailableQty !== null && Number(quantityValue) > this.lastAvailableQty) {
        const proceed = confirm(
          `You are demanding more than the available quantity (${this.lastAvailableQty}). Do you want to proceed?`
        );
        if (!proceed) {
            return; 
        }
    }
    const isDuplilcate = this.tableRows.some(row =>
      row.requestedByValue === requestByValue &&
      row.requestedToValue === requestToValue &&
      row.productValue === productValue 
    );
    if (isDuplilcate) {
      this.toastr.warning('This item is already added to the table.', 'Duplicate Item');
      return;
    }
    const todayDate = new Date().toLocaleDateString();
    const todayTime = new Date().toLocaleTimeString();
    const rowData = {
      sn: this.tableRows.length + 1,
      date: new Date().toLocaleDateString(),
      requestByDepartment: requestByDeptText,
      requestByDepartmentValue: requestByDeptValue,
      requestedBy: requestByText,
      requestedByValue: requestByValue,
      requestedTo: requestToText,
      requestedToValue: requestToValue,
      category: requestedToDepartmentText,
      departmentValue: requestedToDepartmentValue,
      particulars: productText,
      productValue: productValue,
      quantity: quantityValue,
      unit: unitText,
      unitValue: unitValue,
      unitID: Number(unitValue),
      availableQuantity: this.lastAvailableQty != null ? this.lastAvailableQty : 0,
      removing: false
    };
    this.tableRows.push(rowData);
    const shouldLockDropdowns = !this.lockDropdown;
    if (shouldLockDropdowns) {
      this.lockDropdown = true;
    }
    setTimeout(() => {
      if (shouldLockDropdowns) {
        $(this.requestBy.nativeElement).prop('disabled', true).trigger('change.select2');
        $(this.requestTo.nativeElement).prop('disabled', true).trigger('change.select2');
        $(this.department.nativeElement).prop('disabled', true).trigger('change.select2');
        $('#requestedToDepartment').prop('disabled', true).trigger('change.select2');
      }else{
        $(this.requestBy.nativeElement).prop('disabled', false).trigger('change.select2');
        $(this.requestTo.nativeElement).prop('disabled', false).trigger('change.select2');
        $(this.department.nativeElement).prop('disabled', false).trigger('change.select2');
        $('#requestedToDepartment').prop('disabled', false).trigger('change.select2');
      }
      if (this.product && this.product.nativeElement) {
        const $product = $(this.product.nativeElement);
        try {
          $product.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
        } catch {
          (this.product.nativeElement as HTMLElement).focus();
        }
      }
    }, 0);
    $(this.product.nativeElement).val('Choose').trigger('change');
    (this.quantity.nativeElement as HTMLInputElement).value = '';
    $(this.unit.nativeElement).val('Choose').trigger('change');
    this.toastr.success('Item added to table successfully.', 'Success');
  }

  removeRowFromTable(index: number) {
    this.tableRows[index].removing = true;
    this.cdRef.detectChanges();
    const particleCount = 120;
    const animationDuration = 1200;
     setTimeout(() => {
        const tableBody = document.getElementById('sales-main-table__body');
        const trElements = tableBody?.querySelectorAll('tr');

        if (!trElements || index >= trElements.length) {
            console.error('TR element not found or index out of bounds:', index);
            return;
        }

        const trElement = trElements[index] as HTMLElement;
        const rowRect = trElement.getBoundingClientRect();
        trElement.querySelector('.particle-container')?.remove();
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            if (Math.random() < 0.1) {
                particle.classList.add('ember');
            }
            const startX = rowRect.left + Math.random() * rowRect.width;
            const startY = rowRect.top + Math.random() * rowRect.height;

            particle.style.position = 'fixed';
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.setProperty('--randX', Math.random().toString());
            particle.style.setProperty('--randY', Math.random().toString());
            particle.style.animation = `fly-ashes ${animationDuration}ms forwards`;

            document.body.appendChild(particle);
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, animationDuration);
        }
    }, 0);
    setTimeout(() => {
      this.tableRows.splice(index, 1);
    this.tableRows.forEach((row, idx) => { row.sn = idx + 1;});
    if (this.tableRows.length === 0 && this.lockDropdown) {
      this.lockDropdown = false;
      $(this.requestBy.nativeElement).prop('disabled', false).trigger('change.select2');
      $(this.requestTo.nativeElement).prop('disabled', false).trigger('change.select2');
      $(this.department.nativeElement).prop('disabled', false).trigger('change.select2');
    }
    this.toastr.success('Item removed from table.', 'Success');
    }, 1000);    
  }
  FinalPost() {
    const fiscalYear = localStorage.getItem('fiscalYear');
    const fiscalYearId = fiscalYear ? JSON.parse(fiscalYear).financialYearId : 0;
    const userId = Number(localStorage.getItem('userId')) || 0;
    const remarks = this.remarks.nativeElement.value;
    const expectedDate = this.expectedDate.nativeElement.value;
    if (this.tableRows.length === 0) {
      this.toastr.warning('Please add at least one item to the table.', 'Validation Error');
      return;
    }
    if (!remarks || remarks.trim() === '') {
      this.toastr.warning('Please add the remarks.', 'Validation Error');
      return;
    }
    const items = this.tableRows.map(row => ({
      productId: +row.productValue,
      departmentID: +row.departmentValue,
      unitID: +row.unitID,
      transactionQty: +row.quantity,
      skuQty: 0,            
      requestBy: +row.requestedByValue,
      requestedTo: +row.requestedToValue,
      requestedToDept: +row.departmentValue,
      availableQuantity: +row.availableQuantity || 0,
      requestByDepartmentId : +row.requestByDepartmentValue
    }))
    const payload = {
      userID: userId,
      userName: "",
      flag: "Insert",
      estimatedDate: expectedDate ? new Date(expectedDate) : new Date(),
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
         $(this.requestBy.nativeElement).prop('disabled', false).val(userId).trigger('change.select2');
         $(this.requestTo.nativeElement).prop('disabled', false).val('Choose').trigger('change.select2');
         $(this.department.nativeElement).prop('disabled', false).val('Choose').trigger('change.select2');
         $('#requestedToDepartment').prop('disabled', false).val('Choose').trigger('change.select2');
      try { this.remarks.nativeElement.value = ''; } catch {}
       setTimeout(() => {
        try {
          const $dep = $('#requestByDepartment');
          $dep.next('.select2-container')
              .find('.select2-selection')
              .trigger('focus')
              .trigger('click');
        } catch {
          try { ($('#requestByDepartment')[0] as HTMLElement).focus(); } catch {}
        }
      }, 150);
    },        
      err => {
        console.error('Error in posting demand', err);
      }
    )
  }
  resetForm() {
  $(this.requestBy.nativeElement).val('Choose').trigger('change.select2');
  $(this.requestTo.nativeElement).val('Choose').trigger('change.select2');
  $(this.department.nativeElement).val('Choose').trigger('change.select2');
  $('#requestedToDepartment').val('Choose').trigger('change.select2');

  $(this.product.nativeElement).val('Choose').trigger('change.select2');
  $(this.unit.nativeElement).val('Choose').trigger('change.select2');
  this.quantity.nativeElement.value = '';
  this.remarks.nativeElement.value = '';
  this.expectedDate.nativeElement.value = this.today;
  this.requestedByDropdownList = [];
  this.requestedToDropdownList = [];
  this.unitList = [];
  this.tableRows = [];
  this.lockDropdown = false;
  $(this.requestBy.nativeElement).prop('disabled', false);
  $(this.requestTo.nativeElement).prop('disabled', false);
  $(this.department.nativeElement).prop('disabled', false);
  $('#requestedToDepartment').prop('disabled', false);

  // Destroy any popovers
  this.destroyAvailableQtyPopover();
  setTimeout(() => {
    this.getDepartmentDropdownList(); 
    this.getProductList(); 
    try {
      $(this.department.nativeElement)
        .next('.select2-container')
        .find('.select2-selection')
        .trigger('focus')
        .trigger('click');
    } catch {
      this.department.nativeElement.focus();
    }
  }, 100);

  this.toastr.info('Form reset successfully.', 'Info');
}
}
