import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SupplyService } from './service/supply.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const setFocusOnNextElement: any;
@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html'
})

export class SupplyComponent implements OnInit, AfterViewInit {
  isLoading = true;
  isFormVisible: boolean = true;
  isEditMode: boolean = false;
  stockLocationId: number | null = null;
  stockLocationName: string | null = null;
  userId: any;
  branchId: any;
  demandList: any;

  constructor(
    private el: ElementRef,
    private titleService: Title,
    private cdr: ChangeDetectorRef,
    private service: SupplyService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Supply");
    this.userId = localStorage.getItem('userId') || '';
    this.branchId = localStorage.getItem('branch') || '';
  }
  ngAfterViewInit(): void {
    $(this.el.nativeElement).find('select').select2();

    const storeLocation: any = localStorage.getItem("stockLocation");
    if (storeLocation) {
      const data = JSON.parse(storeLocation);
      this.stockLocationId = data?.locationId;
      this.stockLocationName = data?.locationName;
      this.cdr.detectChanges();
    }
    this.getDemandList();
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  getDemandList() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: "GetDemandList",
        UserId: '1196',
        FiscalId: '114'
      }
    };

    this.service.getDemandList(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data && data.length > 0) {
        this.demandList = res?.data;
      } else {
        this.toastr.error('Demand not available.');
      }

    },
      (err) => {
        console.error('Error fetching demand list:', err);
      })
  }

}
