import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare const oninitial: any;
@Component({
  selector: 'app-supply-report',
  templateUrl: './supply-report.component.html'
})
export class SupplyReportComponent implements OnInit, AfterViewInit {
  isFormVisible: boolean = true;
  isDatePickerVisible: boolean = true;


  constructor(private titleService: Title) { }
 
  ngOnInit(): void {
    const fiscalYear = localStorage.getItem('fiscalYearName');

    const globalVariableStr = localStorage.getItem('globalVariable') || ''

    if (globalVariableStr) {
      const globalVariable = JSON.parse(globalVariableStr);

      console.log('global Variable:', globalVariable);
      console.log('DateFormat object:', globalVariable[1]);
      console.log('DateFormat value:', globalVariable[1]?.value);

      // Example usage
      this.isDatePickerVisible = globalVariable[1]?.value === "1";
      console.log('isDatePickerVisible', this.isDatePickerVisible);

    }

    this.titleService.setTitle("Supply Report");
    setTimeout(() => oninitial(), 100);
  }

   ngAfterViewInit(): void {
    
  //     var startDate = document.getElementById("startDate");
  // startDate?.nepaliDatePicker({
  //   readOnlyInput: true,
  //   disableAfter: formatedNepaliDate,
  //   ndpYear: true,
  //   ndpMonth: true,
  //   ndpYearCount: 10,
  // });
  }

  toggleForm() { this.isFormVisible = !this.isFormVisible; }


}
