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
  demandMasterId: any;

  demandList: any;
  LocationList: any;
  fromLocationList: any;
  toLocationList: any;
  assignedToList: any;

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
    $(this.el.nativeElement).find('select').select2();
    const self = this;
    $('#demandId').focus();
    this.getStockLocation();
    this.focusNextFun();

    //debugger;
    $('#demandId').on('select2:close', function (e: any) {
      const demandId = e.target.value;
      self.demandMasterId = demandId;
      console.log(e.target.value);
      self.getDropDownList();
    });


  }

  // Enter focus next function
  focusNextFun() {
    $(document).ready(function () {
      // Keydown event handler for inputs and selects
      $('input, select, .focussable, textarea ,button').on(
        'keydown blur',
        function (this: HTMLElement, event: any) {
          if (event.keyCode === 13) {
            event.preventDefault();
            const current = $(event.target);
            if (!current.hasClass('select2-hidden-accessible')) {
              setFocusOnNextElement.call(current);
            }
          }
        }
      );

      $('select').on('select2:close', function (this: HTMLElement, event: any) {
        const $this = $(this);
        // Wait for Select2 dropdown to close completely
        setTimeout(() => {
          setFocusOnNextElement.call($this);
        }, 0);
      });
    });
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

  //Fill dropdown list
  getDropDownList() {
    this.service.getDropDownList(this.userId, this.branchId, this.fiscalId, this.demandMasterId).subscribe((res: any) => {
      this.fromLocationList = res?.fromLocation || [];
      this.toLocationList = res?.toLocation || [];
      this.assignedToList = res?.assignedToUser || [];
    })
  }

  //Get Demand List
  getDemandList() {
    const storeLocation: any = localStorage.getItem("stockLocation");

    const data = JSON.parse(storeLocation);

    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: "GetDemandList",
        UserId: this.userId?.toString() ?? '',
        FiscalId: this.fiscalId?.toString() ?? '',
        LocationId: data?.locationId?.toString() ?? ''
      }
    };

    this.service.getDemandList(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data && data.length > 0) {
        this.demandList = res?.data;
        $("#departmentId").focus();
      } else {
        this.demandList = [];
        this.fromLocationList = [];
        this.toLocationList = [];
        this.assignedToList = [];
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

  //Get List and set new localStorege 
  getStockLocationList() {
    const payload = {
      tableName: 'LocationByUser',
      parameter: {
        UserId: this.userId,
      },
    };

    this.service.getStockLocationList(payload).subscribe((res: any) => {
      this.LocationList = res?.data || [];

      if (this.LocationList.length > 0) {
        this.modalAnimationClass = '';
        this.isLocationVisible = true;

        setTimeout(() => {
          const $location = $('#locationId');

          // Destroy previous instance if exists
          if ($location.hasClass('select2-hidden-accessible')) {
            $location.select2('destroy');
          }

          // Init select2
          $location.select2();

          // Remove old handlers and bind fresh
          $location.off('select2:select').on('select2:select', (e: any) => {
            const selected = e.params.data.id;
            const selectedText = e.params.data.text;
            const el = e.params.data.element;
            const departmentId = $(el).data('department-id');

            const data = {
              locationId: selected,
              locationName: selectedText,
              departmentId: departmentId
            };

            localStorage.setItem('stockLocation', JSON.stringify(data));
            this.getStockLocation();
            this.closeLocationPopup();
            $('#demandId').focus();
          });

          // Auto open dropdown
          $location.select2('open');

        }, 0);
      }
    });
  }

  //Open Location Popup Modal
  openStockDepartmentModel() {
    this.getStockLocationList();
  }

}
