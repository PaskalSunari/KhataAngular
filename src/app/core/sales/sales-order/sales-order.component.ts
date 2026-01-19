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

  branchId:any;
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
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
   
  }
  private loadSalesLedger(): void {
    
    this.service.getSalesLedger(this.branchId).subscribe(
      (res: any) => {
        const $sel = $(this.el.nativeElement).find('#salesLedger');
        $sel.empty().append('<option value=""></option>');
        const list = res.result || [];
        list.forEach((item: any) => {
          const val = item.value ?? item.id ?? item.salesLedgerId ?? '';
          const txt = item.text ?? item.name ?? item.ledgerName ?? '';
          $sel.append(`<option value="${val}">${txt}</option>`);
        });

        $sel.select2({ placeholder: '--Choose--', allowClear: true, width: '100%' })
      },
      (err) => {
        this.toastr.error('Failed to load sales ledger', 'Error');
        console.error(err);
      }
    );
  }


    //get prefix suffix
      getProductDropdownList() {
    this.service.getProductName(1,undefined,this.branchId).subscribe(
      (res) => {
        let result: any = res;
         console.log(result, 'product list');
        if (result) {
          // this.prefixSuffixList=result
          //  console.log(result,"product dropdown data");
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }
}
