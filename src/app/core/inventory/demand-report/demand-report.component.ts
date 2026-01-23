import { Component,OnInit } from '@angular/core';
import { DemandReportService } from './Service/demand-report.service';
import { error } from 'jquery';

@Component({
  selector: 'app-demand-report',
  templateUrl: './demand-report.component.html'
})
export class DemandReportComponent implements OnInit  {
  locationList: any[] = [];
  demandReportList: any[] = [];
  selectedLocationId: number | null = null;
  isFormVisible: boolean = true;
  constructor(private demandReportService: DemandReportService) { }
  ngOnInit(): void {
    this.loadLocations();
    this.loadDemandReports();
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
  loadDemandReports(){
    this.demandReportService.getDemandReportList().subscribe({
      next: (response: any) => {
        this.demandReportList =   response?.result ?? [];
      },
      error: (error) =>{
        console.error('Error fetching demand report list:', error);
      }
    });
  }
  onView(item: any){
    console.log('View button clicked for item:', item);
  }
  onEdit(item: any){
    console.log('Edit button clicked for item:', item);
  }
  onDelete(item: any){
    const isConfirmed = confirm('Are you sure you want to delete this item?');
    if (!isConfirmed){
      return;
    }
    console.log('Delete button clicked for item:', item); 
  }
  onLocationChange(event: any) {
    this.selectedLocationId = event.target.value ? +event.target.value : null;
  }
}
