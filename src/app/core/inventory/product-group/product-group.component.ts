import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';

import { ProductGroupService } from './service/product-group.service';
@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html'
})
export class ProductGroupComponent implements AfterViewInit {
   showForm = true;
productGroupUnderList:any;
  toggleForm() {
    this.showForm = !this.showForm;
  }
 constructor(private el: ElementRef, public service: ProductGroupService) {}
  ngAfterViewInit(): void {
     this.getProductUnderDropdownList()
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



//Get product under dropdownlist
    getProductUnderDropdownList() {
    let Model = {
    


    "mainInfoModel": {
        "userId": "1",
        "fiscalID": 3,
        "branchDepartmentId": 1001,
        "branchId": 1001,
        "dbName": "",
        "isEngOrNepaliDate": true,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": "2025-07-17T00:00:00",
        "fromDate": "2025-07-17T00:00:00",
        "endDate": "2026-07-16T00:00:00",
        "toDate": "2026-07-16T00:00:00",
        "decimalPlace": "2",
        "bookClose": 0,
        "sessionId": "545efb3e-52bc-49da-86b2-ccc58fe5a10b",
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "ProductGroup",
    "listNameId": "[\"productUnderGroup\",\"productGroupSearch\",\"productUnderGroupSearch\"]",
    "conditionalvalues": "",
    "isSingleList": "false",
    "singleListNameStr": ""



      
    };

    this.service.getGroupUnderDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'table data for country map');
        if (result) {
          // this.countryMapTableData = result?.data;
          //  this.countryMapTableData =JSON.parse(result?.data[0]?.data);
          //  console.log('this.countryMapTableData',this.countryMapTableData);
           this.productGroupUnderList=result
           console.log(this.productGroupUnderList,"productGroupunder");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        // this.toastr.error(error?.error?.Messages);
      }
    );
  }
}
