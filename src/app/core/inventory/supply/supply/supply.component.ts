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
  isLocationVisible: boolean = false;
  isEditMode: boolean = false;

  userId: any;
  branchId: any;
  fiscalId: any;
  stockLocationId: number | null = null;
  stockLocationName: string | null = null;
  modalAnimationClass: any = "";

  demandList: any;
  LocationList: any;

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
    const fiscalYear = localStorage.getItem('fiscalYear') || '';
    const fy = JSON.parse(fiscalYear);
    this.fiscalId = fy.financialYearId

  }
  ngAfterViewInit(): void {
    const that = this;
    $(this.el.nativeElement).find('select').select2();

    $("#locationId").on("select2:select", function (e: any) {
      const selected = e.params.data.id;
      const selectedText = e.params.data.text;
      const el = e.params.data.element;
      const departmentId = $(el).data("department-id");

      const data = { locationId: selected, locationName: selectedText, departmentId: departmentId };
      localStorage.setItem('stockLocation', JSON.stringify(data)
      );
      that.getStockLocation();
      that.closeLocationPopup();
    });

    this.getStockLocation();


  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  getStockLocation() {
    const storeLocation: any = localStorage.getItem("stockLocation");
    if (storeLocation) {
      const data = JSON.parse(storeLocation);
      this.stockLocationId = data?.locationId;
      this.stockLocationName = data?.locationName;
      this.cdr.detectChanges();
      this.getDemandList();
    }
  }

  getDemandList() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: "GetDemandList",
        UserId: this.userId?.toString() ?? '',
        FiscalId:  this.fiscalId?.toString() ?? ''
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

  closeLocationPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.isLocationVisible = false;
  }

  getStockLocationList() {
    const getLocaltion = localStorage.getItem('stockLocation');

    const payload = {
      tableName: 'LocationByUser',
      parameter: {
        UserId: this.userId,
      },
    };

    this.service.getStockLocationList(payload).subscribe(
      (res: any) => {
        this.LocationList = res?.data;
        //console.log('stock Location List:', this.LocationList)

        if (this.LocationList.length > 0) {
          this.isLocationVisible = true;
          setTimeout(() => { $("#locationId").select2('open'); }, 100);
        }
      },
      (err) => {
        console.error('Error fetching location data:', err);

      }
    );
  }

  changeStockDepartment() {
    this.isLocationVisible = true;
    setTimeout(() => {
      this.getStockLocationList();
    }, 10);
  }

}
