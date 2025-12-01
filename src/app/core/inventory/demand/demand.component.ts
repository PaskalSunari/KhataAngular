import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('requestBy') requestBy!: ElementRef;
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
    $(this.el.nativeElement).find('select').select2();
     this.getRequestByDropdownList()
     this.getRequestToDropdownList()
     this.getDepartmentDropdownList()
     this.getProductList()
     this.getUnitList()
     this.enterFun();    
  }
  ngOnDestroy(): void{
    try{
      $(this.el.nativeElement).find('select').each(function (this: any){
        if ($(this).hasClass('select2-hidden-accessible')){
          $(this).select2('destroy');
        }
      });
      $(document).off('keydown blur');
      $(document).off('select2:close');
    }catch(e){

    }
  }
    // Enter functon
  enterFun() {
    $(document).ready(function () {
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
        setTimeout(() => {
          setFocusOnNextElement.call($this);
        }, 0);
      });
    });
  }
  
     getRequestByDropdownList() {
    this.service.getRequestedByDropdownList().subscribe(
      (res) => {
        const result: any = res;
        if (result) {
          this.requestedByDropdownList = result?.result || [];
          setTimeout(() => {
            if (this.requestBy && this.requestBy.nativeElement) {
              const $el = $(this.requestBy.nativeElement);
              if (!$el.hasClass('select2-hidden-accessible')) {
                $el.select2();
              }

              try {
                $el.next('.select2-container').find('.select2-selection').trigger('focus').trigger('click');
              } catch (e) {
                try { (this.requestBy.nativeElement as HTMLElement).focus(); } catch {}
              }
            }
          }, 0);
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
