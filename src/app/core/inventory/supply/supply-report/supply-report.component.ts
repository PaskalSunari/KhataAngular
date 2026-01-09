import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SupplyReportService } from './service/supply-report.service';
declare const nepaliDatePicker: any;
declare const englishDatePicker: any;
declare var $: any;
@Component({
  selector: 'app-supply-report',
  templateUrl: './supply-report.component.html'
})
export class SupplyReportComponent implements OnInit, AfterViewInit {
  isFormVisible: boolean = true;
  isDatePickerVisible: boolean = true;
  isDateFormat: boolean = false;

  fromDate: any;
  toDate: any;
  userId: number = 0;
  fiscalId: number = 0;
  branchId: number = 0;
  locationId: number = 0;
  status: number = 0;

  locationList: any;;

  constructor(
    private titleService: Title,
    private service: SupplyReportService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    const fiscalYear = localStorage.getItem('fiscalYear') || '';
    const fy = JSON.parse(fiscalYear);
    this.fromDate = fy?.fromDate.split('T')[0];
    this.toDate = fy?.toDate.split('T')[0];
    this.fiscalId = fy?.financialYearId;
    this.userId = fy?.userId;
    this.branchId = localStorage.getItem('branch') ? Number(localStorage.getItem('branch')) : 0;

    const globalVariableStr = localStorage.getItem('globalVariable') || ''

    if (globalVariableStr) {
      const globalVariable = JSON.parse(globalVariableStr);
      this.isDatePickerVisible = globalVariable[1]?.value === "1";
    }

    this.titleService.setTitle("Supply Report");

  }

  ngAfterViewInit(): void {
    $(this.el.nativeElement).find('select').select2();
    this.initilizedDate();
    this.getSupplyList();
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.initilizedDate();
  }

  initilizedDate() {
    this.getLocationList();
    this.getLocationList.length > 0 ?
      $("#locationId").val(0).trigger('change') : "";

    if (this.isDatePickerVisible) {
      setTimeout(() => englishDatePicker('engFromDate', 'hiddenFromDate', "engToDate", 1), 0);
      setTimeout(() => englishDatePicker('engToDate', 'hiddenToDate', "locationId", 0), 0);
    } else {
      setTimeout(() => nepaliDatePicker('nepFromtDate', 'hiddenFromDate', "nepaliToDate", 1), 0);
      setTimeout(() => nepaliDatePicker('nepaliToDate', 'hiddenToDate', "locationId", 0), 0);
    }
  }
  getLocationList() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'getStockLocationList',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        branchId: String(this.branchId),
      }
    };
    this.service.getGenericServices(payload).subscribe((res: any) => {
      if (res && res.data.length > 0) {
        this.locationList = res.data;
      }
      console.log(res);
      console.log('this.locationList', this.locationList);
    });

  }

  getSupplyList() {
    const payload = {
      userId: 1162,
      branchId: 1001,
      fiscalId: 114,
      fromDate: "2026-01-01T10:00:14.081Z",
      toDate: "2026-01-09T10:00:14.081Z",
      locationId: 49,
      status: 0,
      pageIndex: 1,
      pageSize: 10,
      searchData: "",
      flag: "string"
    };
    this.service.getSupplyList(payload).subscribe((res: any) => {
      console.log(res);
    });
  }

  getLocationList1() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'deleteSupplyData',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        branchId: String(this.branchId),
        locationId: String(this.locationId),
        status: String(this.status)
      }
    };
    this.service.getGenericServices(payload).subscribe((res: any) => {
      console.log(res);
    });

  }
}
