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
  isPrefixSuffix: boolean = false;
  isDisabled: boolean = false;

  userId: any;
  branchId: any;
  fiscalId: any;
  stockLocationId: number | null = null;
  stockLocationName: string | null = null;
  modalAnimationClass: any = "";

  demandMasterId: any;
  fromLocationId: any;
  toLocationId: any;
  assignToUserId: any;

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

    this.getPrefixSuffix();
    this.focusNextFun();

    $('#demandId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.demandMasterId = id;
      console.log('Demand MasterId:', id);

      if (id != '' || id != 0) {
        self.getDropDownList();
      }

    });

    $('#fromLocationId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.fromLocationId = id || 0;
      console.log('From LocationId: ', id);
    });

    $('#toLocationId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.toLocationId = id || 0;
      console.log('To LocationId: ', id);
    });

    $('#assignedToUserId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.assignToUserId = id || 0;
      console.log('Assign to userId: ', id);
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
        }, 10);
      });
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  getPrefixSuffix() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: "getPrefixSuffix",
        FiscalId: this.fiscalId?.toString() ?? '',
        BranchId: this.branchId?.toString() ?? ''
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      this.isPrefixSuffix = !!(res?.data?.length > 0);
      if (this.isPrefixSuffix) {
        this.getStockLocation();   // ✅ CALL HERE
      } else {
        this.isPrefixSuffix = false;
        this.toastr.error('Prefix/Suffix not found.');
        this.demandMasterId = 0;
        this.fromLocationId = 0;
        this.toLocationId = 0;
        this.assignToUserId = 0;

        this.demandList = [];
        this.fromLocationList = [];
        this.toLocationList = [];
        this.assignedToList = [];
        return;
      }
    });
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

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data && data?.length > 0) {
        this.demandMasterId = data[0]?.demandMasterId;
        this.demandList = res?.data;
        $("#departmentId").focus();
      } else {
        this.resetSupply();
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

    this.service.getGenericServices(payload).subscribe((res: any) => {
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

  private isInvalidId(value: any): boolean {
    return Number(value) <= 0 || isNaN(Number(value));
  }

  transformDemandToSupply() {

    if (this.isInvalidId(this.demandMasterId)) {
      this.toastr.error('Demand is required.');
      $('#demandId').focus();
      return;
    }

    if (this.isInvalidId(this.fromLocationId)) {
      this.toastr.error('From Location is required.');
      $('#demandId').focus();
      return;
    }

    if (this.isInvalidId(this.toLocationId)) {
      this.toastr.error('To Location is required.');
      $('#toLocationId').focus();
      return;
    }

    if (this.isInvalidId(this.assignToUserId)) {
      this.toastr.error('Assigned to user is required.');
      $('#assignedToUserId').focus();
      return;
    }

    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'transformDemandToSupply',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        fromLocationId: String(this.fromLocationId),
        toLocationId: String(this.toLocationId),
        demandId: String(this.demandMasterId),
        branchId: String(this.branchId)
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data?.length > 0) {
        if (data[0].status == 200) {
          this.toastr.success(data[0].message);
          this.isDisabled = true;
        }
        else { this.toastr.error(data[0].message); }
      }
    });
  }

  resetSupply() {
    this.isDisabled = false;
    this.demandMasterId = 0;
    this.fromLocationId = 0;
    this.toLocationId = 0;
    this.assignToUserId = 0;

    // this.demandList = [];
    this.fromLocationList = [];
    this.toLocationList = [];
    this.assignedToList = [];

    $("#demandId").focus();

  }

}
