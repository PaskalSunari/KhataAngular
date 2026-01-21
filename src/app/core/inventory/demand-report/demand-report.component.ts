import { Component } from '@angular/core';

@Component({
  selector: 'app-demand-report',
  templateUrl: './demand-report.component.html'
})
export class DemandReportComponent {

    isFormVisible: boolean = true;
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

}
