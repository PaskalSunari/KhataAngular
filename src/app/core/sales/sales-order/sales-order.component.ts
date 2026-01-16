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
  constructor(
    private el: ElementRef,
    public service: salesOrderService,
    private toastr: ToastrService
  ) {
    // keyboard listener
  }
  ngAfterViewInit(): void {
    this.loadSalesLedger();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
  }
  private loadSalesLedger(): void {
    const branchId = localStorage.getItem('branch') || '';
    this.service.getSalesLedger(branchId).subscribe(
      (res: any) => {
        const $sel = $(this.el.nativeElement).find('#salesLedger');
        $sel.empty().append('<option value=""></option>');
        const list = res.result || []; // <-- use res.result
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
}
