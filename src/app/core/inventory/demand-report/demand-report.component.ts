import { Component, OnInit } from '@angular/core';
import { DemandReportService } from './Service/demand-report.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-demand-report',
  templateUrl: './demand-report.component.html'
})
export class DemandReportComponent implements OnInit {
  locationList: any[] = [];
  demandReportList: any[] = [];
  demandDetails: any[] = [];
  selectedLocationId: number | null = null;
  isFormVisible: boolean = true;
  isLoadingDetails: boolean = false;
  modalAnimationClass = '';
  demandReportPopup: boolean = false;
  demandMasterId!:number;

  constructor(private demandReportService: DemandReportService,
     private toastr: ToastrService ) { }
  ngOnInit(): void {
    this.loadLocations();
    this.loadDemandReports();
  }
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
  loadLocations() {
    this.demandReportService.getLocationDropdownList().subscribe({
      next: (Location: any) => this.locationList = Location.result,
      error: (error: any) => console.error('Error fetching location list:', error)
    })

  }
  loadDemandReports() {
    this.demandReportService.getDemandReportList().subscribe({
      next: (response: any) => {
        this.demandReportList = response?.result ?? [];
      },
      error: (error) => {
        console.error('Error fetching demand report list:', error);
      }
    });
  }

  onView(demandMasterID: number): void {
    this.demandMasterId = demandMasterID;
    this.openDemandreportModel();
    this.demandDetails = [];
    this.demandReportService.getDemandReportDetails(demandMasterID).subscribe({
      next: (response: any) => {
        this.demandDetails = response?.result ?? [];
        this.isLoadingDetails = false;
       
      },
      error: (error) => {
        console.error('Error fetching demand report details:', error);
        this.isLoadingDetails = false;
      }
    });
  }

  onDelete(item: any) {
    const isConfirmed = confirm('Are you sure you want to delete this item?');
    if (!isConfirmed) {
      return;
    }
   
  }
  onLocationChange(event: any) {
    this.selectedLocationId = event.target.value ? +event.target.value : null;
  }

 
  openDemandreportModel() {
    this.demandReportPopup = true;
    this.modalAnimationClass = 'modal-enter';

  }

  closeDemandPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.demandReportPopup = false;
  }
  OnVerify(): void{
    if (!this.demandMasterId)
      {
        console.error('Invalid demandMasterId for verification.');
        return;
      }
    this.demandReportService.updateVerificationStatus(this.demandMasterId).subscribe({
      next: () => {
        this.toastr.success('Demand report verified successfully.');
        this.demandDetails = this.demandDetails.map(detail => ({
          ...detail,
          status : true
        }));
        this.loadDemandReports();
      },
      error: (error) => {
        console.error('Error verifying demand report:', error);
        this.toastr.error('Failed to verify demand report. Please try again.');
      }
    });
  }
}
