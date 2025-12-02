import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { PosService } from './pos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
})
export class PosComponent implements AfterViewInit {
  loading: boolean = false;

  constructor(
    private el: ElementRef,
    public service: PosService,
    private toastr: ToastrService
  ) {}
  ngAfterViewInit(): void {
    this.fetchSalesLedger();
    this.fetchProductList(); // <-- FIXED
    this.selectProductName();
    this.selectMode();
    this.fetchUnit();
    // this.fetchTableData();
    this.enterFun();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
  }
  //=====================================================================
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
  //=====================================================================
  salesLedgerList: any[] = [];

  fetchSalesLedger() {
    this.loading = true;
    this.service.salesLedger().subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.loading = false;
          this.salesLedgerList = data.result;
        }
      },
      error: (err) => {
        console.error('Error fetching sales ledger data:', err);
        this.toastr.error('Failed to load sales ledger data');
        this.loading = false;
      },
    });
  }
  //=====================================================================
  productList: any[] = [];
  ProductData: any[] = [];
  productCode: any;
  vat: any;
  unit: any;
  batch: any[] = [];
  skuunit: any[] = [];

  selectProductName() {
    $('#productSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;
      this.productCode = selectedValue;
      this.fetchProductDetail(this.productCode); // <-- Pass selected product code here
    });
  }

  //=====================================================================
  fetchProductDetail(productCode: any) {
    this.service.GetProductDetail(productCode).subscribe({
      next: (data: any) => {
        if (data.code === 200) {
          this.ProductData = data.result;
          console.log("object");
        }
      },
    });
  }

  //=====================================================================
  fetchProductList() {
    this.service.GetAllProducts().subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.productList = data.result;
          console.log(data.result, 'prod data');
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================
  fetchUnit() {
    this.loading = true;
    this.service.GetUnits().subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.loading = false;

          this.ProductData = data.result;
        }
      },
      error: (err) => {
        console.error('Error fetching unit data:', err);
        this.toastr.error('Failed to load unit data');
        this.loading = false;
      },
    });
  }
  //=====================================================================

  // fetchBatch(productCode: any) {
  //   this.loading = true;
  //   const obj = {
  //     batch: '',
  //     branch: '',
  //     flag: 9,
  //     productCode: productCode,
  //     productId: '0',
  //   };
  //   this.service.GetBatch(obj).subscribe(
  //     (res: any) => {
  //       // const transactionData = res.data;

  //       if (res.code == 200) {
  //         console.log(res, 'batch');
  //         this.batch = res.result;
  //       }
  //       this.loading = false;
  //     },
  //     (err) => {
  //       console.error('Error fetching Batch data:', err);
  //       this.loading = false;

  //       this.toastr.error('Failed to load Batch data');
  //     }
  //   );
  // }

  IscustomerPopup: boolean = false;
  tab = 'main';
  customerPopup() {
    this.IscustomerPopup = true;
  }
  closecustomerPopup() {
    this.IscustomerPopup = false;
  }

  //=====================================================================

  // tableData: any[] = [];
  // sesessionId: string = localStorage.getItem('sessionId') || '';
  // userId: string = localStorage.getItem('userId') || '';
  // branch:string = localStorage.getItem('branch') || '';

  // fetchTableData() {
  //   this.loading = true;

  //   const obj = {
  //     dataFilterModel: {
  //       tblName: 'Customer',
  //       columnName: null,
  //       strName: '',
  //       underColumnName: null,
  //       underIntID: 0,
  //       filterColumnsString:
  //         '["ledgerName","accountGroupName","address","phone","pan","openingBalance"]',
  //       currentPageNumber: '1',
  //       pageRowCount: '25',
  //       StrlistNames: '',
  //     },
  //     mainInfoModel: {
  //       userId: '1',
  //       fiscalID: 2,
  //       branchDepartmentId: 0,
  //       branchId: this.branch,
  //       dbName: 'string',
  //       isEngOrNepaliDate: true,
  //       isMenuVerified: true,
  //       filterId: 0,
  //       refId: 0,
  //       mainId: 0,
  //       strId: 'string',
  //       startDate: '2025-07-17T00:00:00',
  //       fromDate: '2025-07-17T00:00:00',
  //       endDate: '2026-07-17T00:00:00',
  //       toDate: '2026-07-17T00:00:00',
  //       decimalPlace: '2',
  //       bookClose: 0,
  //       sessionId: this.sesessionId,
  //       id: 0,
  //       searchtext: '',
  //       cid: 0,
  //     },
  //     print: false,
  //   };

  //   this.service.GetFilterAnyDataPagination(obj).subscribe(
  //     (res: any) => {
  //       console.log(res, 'tableData');
  //       if (res.code == 200) {
  //         this.tableData = res.result;
  //       }
  //       this.loading = false;
  //     },
  //     (err) => {
  //       console.error('Error fetching Batch data:', err);
  //       this.loading = false;
  //       this.toastr.error('Failed to load Batch data');
  //     }
  //   );
  // }
  customerList: any[] = [];
  mode: any;
  selectMode() {
    $('#modeSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;
      if (selectedValue == 'cash') {
        this.mode = 9;
        this.fetchCustomerList(this.mode);
      }

      if (selectedValue == 'credit') {
        this.mode = 2;
        this.fetchCustomerList(this.mode);
      }

      // Mode अनुसार Customer list fetch गर्नुहोस्
    });
  }

  fetchCustomerList(mode: string) {
    this.loading = true;
    this.service.GetCustomersByMode(mode).subscribe({

      next: (data: any) => {
        if (data.code == 200) {
          this.customerList = data.result;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.toastr.error('Failed to load customer list');
        this.loading = false;
      },
    });
  }
}
