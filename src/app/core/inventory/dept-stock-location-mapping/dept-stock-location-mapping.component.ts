import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DeptStockLocationMappingService } from './service/dept-stock-location-mapping.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const setFocusOnNextElement: any;

@Component({
  selector: 'app-dept-stock-location-mapping',
  templateUrl: './dept-stock-location-mapping.component.html'
})
export class DeptStockLocationMappingComponent implements AfterViewInit, OnInit {

  userId: any = 0;
  branchId: any = 0;
  submitButton: any = 'Save'

  //pagination variable
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  //List data
  DepartmentList: any[] = [];
  UserList: any[] = [];
  StockLocationList: any[] = [];

  constructor(private el: ElementRef, private titleService: Title, public service: DeptStockLocationMappingService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Department Stock Location Mapping");
  }

  ngAfterViewInit(): void {
    this.userId = localStorage.getItem("userId");
    this.branchId = localStorage.getItem("branch");
    this.enterFun();
    $(this.el.nativeElement).find('select').select2();
    this.getDropdownList();
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

  getDropdownList() {
    this.service.getDropdownList(this.userId, this.branchId).subscribe((res: any) => {
      //let result:any:res;
      console.log('response:', res);
      this.DepartmentList = res.department || [];
      this.UserList = res.user || [];
      this.StockLocationList = res.location || [];
    })
  }

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    //this.getProductBrandFilteredList()
  }
}
