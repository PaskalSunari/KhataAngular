import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { DemandService } from './service/demand.service';
import { error } from 'jquery';
@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html'
})
export class DemandComponent {
  showForm = true;
requestedByDropdownList:any[]=[];
requestedToDropdownList:any []=[];
getDepartmentList: any[]=[];
productList: any[]=[];
unitList: any[]=[];
  toggleForm() {
    this.showForm = !this.showForm;
  }
 constructor(private el: ElementRef,public service: DemandService) {}
  ngAfterViewInit(): void {
     this.getRequestByDropdownList()
     this.getRequestToDropdownList()
     this.getDepartmentDropdownList()
     this.getProductList()
     this.getUnitList()
this.enterFun();
    $(this.el.nativeElement).find('select').select2();
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
  
    getRequestByDropdownList() {
    this.service.getRequestedByDropdownList().subscribe(
      (res) => {
        let result: any = res;
        if (result) {
          this.requestedByDropdownList = result?.result ;
           
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
}
