import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-supply-report',
  templateUrl: './supply-report.component.html'
})
export class SupplyReportComponent implements OnInit {
isFormVisible: boolean = false;

constructor(private titleService: Title) { }
  ngOnInit(): void {
    this.titleService.setTitle("Supply Report");
  }
    toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }


}
