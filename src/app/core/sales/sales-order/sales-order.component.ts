import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import 'select2';
import { salesOrderService } from './sales-order.service';
declare var $: any;
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
})
export class SalesOrderComponent implements AfterViewInit {

  branchId: any;
  salesLedgerList: Array<{ value: string; text: string }> = [];
  selectedSalesLedger: string = '';
  constructor(
    private el: ElementRef,
    public service: salesOrderService,
    private toastr: ToastrService
  ) {
    // keyboard listener

  }
  ngAfterViewInit(): void {
    this.branchId = localStorage.getItem('branch') || '';
    this.loadSalesLedger();
    this.getProductDropdownList();
    this.getCustomerDropdown();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);

  }
    // Refactored loadSalesLedger without jQuery
  private loadSalesLedger(): void {
    this.service.getSalesLedger(this.branchId).subscribe(
      (res: any) => {
        const ledgerList = res?.result || [];
        this.salesLedgerList = ledgerList.map((item: any) => ({
          value: item.value ?? item.id ?? item.salesLedgerId ?? '',
          text: item.text ?? item.name ?? item.ledgerName ?? ''
        }));
      },
      (err) => {
        this.toastr.error('Failed to load sales ledger', 'Error');
        console.error(err);
      }
    );
  }

  getProductDropdownList() {
    this.service.getProductName(1, this.branchId, 'null').subscribe(
      (res: any) => {
        const products = res?.result || [];
        const $sel = $(this.el.nativeElement).find('#productSelect');
        const $codeInput = $(this.el.nativeElement).find('#productCode');
        const $batch = $(this.el.nativeElement).find('#batch');
        $sel.empty().append('<option value=""></option>');
        products.forEach((item: any) => {
          $sel.append(`<option value="${item.productId}">${item.productName}</option>`);
        });
        $sel.select2({
          placeholder: '--Choose--',
          allowClear: true,
          width: '100%'
        });
        $sel.on('change',  () =>{
          const selectedId =$sel.val();
          const selectedProduct = products.find((p: any) => p.productId == selectedId);
          if (selectedProduct){
            $codeInput.val(selectedProduct.productCode);
            this.service.getProductName(2, this.branchId, selectedId).subscribe(
              (batchRes: any) => {
                const batchList = batchRes?.result || [];
                console.log(batchList);
                $batch.empty().append('<option value=""></option>');
                batchList.forEach((b: any) => {
                   $batch.append(`<option value="${b.batch || ''}">${b.batch || '--No Batch--'}</option>`);
                });
                $batch.select2({
                  placeholder: '--Choose--',
                  allowClear: true,
                  width: '100%'
                });
              },
              (batchErr) => {
                this.toastr.error('Failed to load batches', 'Error');
                console.error(batchErr);
              }
            );
          }else{
            $codeInput.val('');
          }
        });
      },
      (error) => {
        this.toastr.error(error?.error?.Messages);
      }
    );
  }
  getCustomerDropdown(): void {
    const flag = 9;
    const branchId = this.branchId;
    this.service.getCustomer(flag, branchId).subscribe(
      (res: any) => {
        const customers = res?.result || [];
        const $sel = $(this.el.nativeElement).find('#Customer');
        $sel.empty().append('<option value=""></option>');
        customers.forEach((item: any) => {
          $sel.append(`<option value="${item.value}">${item.text}</option>`);
        });
        $sel.select2({
          placeholder: '--Choose--',
          allowClear: true,
          width: '100%'
        });
      },
      (error) => {
        this.toastr.error('Failed to load customers', 'Error');
        console.error(error);
      }
    );
  }
}
