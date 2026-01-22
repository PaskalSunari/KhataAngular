import { Component,OnInit } from '@angular/core';
import { DemandReportService } from './Service/demand-report.service';

@Component({
  selector: 'app-demand-report',
  templateUrl: './demand-report.component.html'
})
export class DemandReportComponent implements OnInit  {
  locationList: any[] = [];
  selectedLocationId: number | null = null;
  isFormVisible: boolean = true;
  constructor(private demandReportService: DemandReportService) { }
  ngOnInit(): void {
    this.loadLocations();
  }
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
  loadLocations (){
    this.demandReportService.getLocationDropdownList().subscribe({
      next: (Location:any) => this.locationList = Location.result,
      error: (error:any) => console.error('Error fetching location list:', error)
    })
    console.log(this.locationList,"location list");
    
  }
  onLocationChange(event: any) {
    this.selectedLocationId = event.target.value ? +event.target.value : null;
  }
}
