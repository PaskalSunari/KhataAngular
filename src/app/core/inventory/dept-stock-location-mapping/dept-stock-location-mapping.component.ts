import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DeptStockLocationMappingService } from './service/dept-stock-location-mapping.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationModel } from './dept-stock-location-mapping.model';
declare var $: any;
declare const setFocusOnNextElement: any;


@Component({
  selector: 'app-dept-stock-location-mapping',
  templateUrl: './dept-stock-location-mapping.component.html'
})
export class DeptStockLocationMappingComponent implements AfterViewInit, OnInit {

  id: number = 0;
  userId: any = 0;
  branchId: any = 0;
  submitButton: any = 'Save'
  isSelect2Show: boolean = true;
  hasSubmit = false;

  //pagination variable
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  searchData: any = "";

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;


  //List data
  DepartmentList: any[] = [];
  UserList: any[] = [];
  StockLocationList: any[] = [];
  DepartmentStockLocationMappingList: any[] = [];



  //Multidropdown setting in additional info form
  multidropdownSettings: any = {
    singleSelection: false,
    idField: 'locationId',
    textField: 'locationName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    enableCheckAll: true,
    maxHeight: 120,
  };


  constructor(private el: ElementRef, private titleService: Title, public service: DeptStockLocationMappingService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Department Stock Location Mapping");
  }

  ngAfterViewInit(): void {
    this.userId = localStorage.getItem("userId");
    this.branchId = localStorage.getItem("branch");
    setTimeout(() => {
      $("#departmentId").focus();
    }, 100);

    this.enterFun();
    $(this.el.nativeElement).find('select').select2();
    this.getDropdownList();
    this.getGridList();
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

  getGridList() {
    let model = new PaginationModel();
    model.userId = this.userId;
    model.branchId = this.branchId;
    model.pageIndex = this.pageIndex == 0 ? 1 : this.pageIndex + 1;
    model.pageSize = this.pageSize;
    model.searchData = this.searchData;

    this.service.getGridDataList(model).subscribe((res: any) => {
      console.log('response: ', res);
      this.DepartmentStockLocationMappingList = res?.data;
      const pagiData = JSON.parse(res.paginationData);
      console.log('pagi Data: ', pagiData);
      this.length = pagiData.totalItems;
      //this.pageIndex=pagiData.currentPage;
    })
  }

  onSubmitData() {
    const stringLocationId = $("#storeLocationId").val();
    let locationId = 0;

    if (this.id != 0) {
      locationId = stringLocationId
    } else {
      locationId = stringLocationId.join(',');
    }


    let payload = {
      "id": this.id,
      "deptId": $("#departmentId").val() || 0,
      "userId": $("#userId").val() || 0,
      "branchId": this.branchId,
      "stockLocationIds": locationId,
      "status": $("#status").val() == 1 ? true : false,
      "entryBy": this.userId,
      "extra1": "",
      "extra2": ""
    }


    if (!payload.deptId || payload.deptId == 0) {
      this.toastr.error("Store is required.");
      setTimeout(() => {
        $("#departmentId").focus();
      }, 100);
      this.hasSubmit = false;
      return;
    }

    if (!payload.userId || payload.userId == 0) {
      this.toastr.error("User is required.");
      setTimeout(() => {
        $("#userId").focus();
      }, 100);
      this.hasSubmit = false;
      return;
    }

    if (!locationId) {
      this.toastr.error("Location is required.");
      setTimeout(() => {
        $("#storeLocationId").focus();
      }, 100);
      this.hasSubmit = false;
      return;
    }

    this.hasSubmit = true;
    if (this.hasSubmit) {
      this.service.insertUpdate(payload).subscribe((res: any) => {
        console.log('res: ', res);
        this.hasSubmit = false;
        if (res && res.status == 200) {
          this.toastr.success(res?.message);
          this.resetForm();
          this.getGridList();
        } else {
          this.toastr.error(res?.message);
          setTimeout(() => {
            $("#departmentId").focus();
          }, 100);
        }
        //debugger
      })
    }

  }

  getById(id: any, branchId: any, userId: any) {
    this.service.getById(id, branchId, userId).subscribe((res: any) => {
      if (res && res.status == 200) {
        const data = res.result;
        this.submitButton = "Update";
        this.id = data.id;
        $("#userId").val(data.userId).trigger('change');
        $("#departmentId").val(data.deptId).trigger('change');
        $("#storeLocationId").val(data.stockLocationId).trigger('change');
        $("#status").val(data.status ? 1 : 0).trigger('change');

        // destroy select2 instance
        $('#storeLocationId').select2('destroy');
        // remove multiple attribute
        $('#storeLocationId').prop('multiple', false);
        $("#departmentId").focus();

      } else {
        this.toastr.error(res.message);
      }
      console.log('GetById:', res);
    })
  }

  resetForm() {
    this.id = 0;
    setTimeout(() => {
      //reset department
      const departmentDropdown = document.getElementById("departmentId") as HTMLInputElement | null;
      if (departmentDropdown) {
        departmentDropdown.value = "";
        const event = new Event('change', { bubbles: true });
        departmentDropdown.dispatchEvent(event);
      }

      //reset user
      const userDropdown = document.getElementById("userId") as HTMLInputElement | null;
      if (userDropdown) {
        userDropdown.value = "";
        const event = new Event('change', { bubbles: true });
        userDropdown.dispatchEvent(event);
      }

      // Reset storeLocationId Select2 safely
      const $storeLocation = $('#storeLocationId');

      // Check if Select2 is initialized
      if ($storeLocation.hasClass("select2-hidden-accessible")) {
        $storeLocation.select2('destroy');
      }
      // remove multiple attribute
      $('#storeLocationId').prop('multiple', true);

      $('#storeLocationId').select2({
        placeholder: "--Choose--",
        allowClear: true
      });

      $('#storeLocationId').val(' ').trigger('change');

      //reset status
      const statusDropdown = document.getElementById("status") as HTMLInputElement | null;
      if (statusDropdown) {
        statusDropdown.value = "1";
        const event = new Event('change', { bubbles: true });
        statusDropdown.dispatchEvent(event);
      }
      $("#departmentId").focus();
    }, 100);
  }

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getGridList();
  }
  onSearchData(e: any) {
    this.searchData = e.value;
    this.getGridList();
  }
}
