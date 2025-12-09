import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;

import 'select2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
})
export class ProductCreationComponent implements AfterViewInit {
  constructor(private el: ElementRef, private toastr: ToastrService) {}
  tab = 'General';

  ngAfterViewInit(): void {
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
  }
}
