import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html'
})
export class SupplyComponent implements OnInit {

  constructor(private titleService: Title) { }
  
  ngOnInit(): void {
    this.titleService.setTitle("Supply");
  }

  isFormVisible: boolean = true;
  isEditMode: boolean = false;

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

}
