import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare const nepaliDatePicker: any;
declare const englishDatePicker: any;

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


  constructor(private titleService: Title) { }

  ngOnInit(): void {
    const fiscalYear = localStorage.getItem('fiscalYear') || '';
    const fy = JSON.parse(fiscalYear);
    this.fromDate = fy?.fromDate.split('T')[0];
    this.toDate = fy?.toDate.split('T')[0];

    const globalVariableStr = localStorage.getItem('globalVariable') || ''

    if (globalVariableStr) {
      const globalVariable = JSON.parse(globalVariableStr);
      this.isDatePickerVisible = globalVariable[1]?.value === "1";
    }

    this.titleService.setTitle("Supply Report");

  }

  ngAfterViewInit(): void {
   this.initilizedDate();
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.initilizedDate();
  }

  initilizedDate() {
    if (this.isDatePickerVisible) {
      setTimeout(() => englishDatePicker('engFromDate', 'hiddenFromDate', "engToDate", 1), 0);
      setTimeout(() => englishDatePicker('engToDate', 'hiddenToDate', "locationId", 0), 0);
    } else {
      setTimeout(() => nepaliDatePicker('nepFromtDate', 'hiddenFromDate', "nepaliToDate", 1), 0);
      setTimeout(() => nepaliDatePicker('nepaliToDate', 'hiddenToDate', "locationId", 0), 0);
    }
  }
}
