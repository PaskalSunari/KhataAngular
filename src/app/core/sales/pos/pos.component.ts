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
    this.fetchUnit();

    this.enterFun();
    $(this.el.nativeElement).find('select').select2();
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
      console.log(selectedValue, 'code');
      this.productCode = selectedValue;
      this.fetchProductDetail(this.productCode); // <-- Pass selected product code here
    });
  }

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
  fetchProductDetail(productCode: any) {
    this.service.GetProductDetail(productCode).subscribe({
      next: (data: any) => {
        if (data.code === 200) {
          this.ProductData = data.result;

          // // Filter productList to find the selected product
          // const selectedProduct = this.productList.find(
          //   (item) => item.productCode === productCode
          // );

          // // Store only the batch value
          // this.skuunit = selectedProduct?.skuunit ? [selectedProduct.skuunit] : [];

          // console.log('Product skuunit:', this.skuunit);
        }
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
        console.error('Error fetching customer data:', err);
        this.toastr.error('Failed to load customer data');
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

IscustomerPopup:boolean= false;
  tab = 'main';
customerPopup(){
  this.IscustomerPopup = true
}
closecustomerPopup(){
  this.IscustomerPopup = false
}

}
