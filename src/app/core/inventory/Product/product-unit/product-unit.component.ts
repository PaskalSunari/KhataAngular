import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';

@Component({
  selector: 'app-product-unit',
  templateUrl: './product-unit.component.html'
})
export class ProductUnitComponent implements AfterViewInit {
 showForm = true;
 unitTypeStatus:boolean=true

  toggleForm() {
    this.showForm = !this.showForm;
  }
 constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
this.enterFun();
    $(this.el.nativeElement).find('select').select2();
     let self = this;
       $('#unitType').on('change', function (event: any) {
      if (event.target.value == "1"||event.target.value == "3") {
       self.unitTypeStatus=true
      }
      else if (event.target.value == "2") {
       self.unitTypeStatus=false
      }
    })
  }
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
}
