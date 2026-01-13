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
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
  }
}
