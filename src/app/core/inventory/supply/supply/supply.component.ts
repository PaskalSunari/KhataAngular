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
  decimalPlace: any;
  stockLocationId: number | null = null;
  stockLocationName: string | null = null;
  modalAnimationClass: any = "";
  masterId: any;
  stockQty: any = 0;
  supplyId: any;
  supplyDetailsId: any;

  demandMasterId: any;
  fromLocationId: any;
  toLocationId: any;
  assignToUserId: any;

  demandList: any;
  LocationList: any;
  fromLocationList: any;
  toLocationList: any;
  assignedToList: any;
  supplyDetailsList: any;


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
    const globalVariable = localStorage.getItem("globalVariable") || '';
    const gv = JSON.parse(globalVariable);
    this.decimalPlace = gv[2].value;
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

      if (id != '' || id != 0) {
        self.getDropDownList();
      }

    });

    $('#fromLocationId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.fromLocationId = id || 0;
    });

    $('#toLocationId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.toLocationId = id || 0;
    });

    $('#assignedToUserId').on('select2:close', function (e: any) {
      const id = e.target.value;
      self.assignToUserId = id || 0;
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
        this.supplyDetailsList = [];
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
        else {
          //this.toastr.error(data[0].message);
          console.log('message: ', data);
          if (data.length > 0) {
            //this.isDisabled = true;
            this.masterId = data[0].supplyId;
            this.getSupplyDraftList();
          }


          console.log('masterId: ', this.masterId);

        }
      }
    });
  }

  //Fill supply draft list
  getSupplyDraftList() {
    this.service.getSupplyDraftList(this.userId, this.branchId, this.fiscalId, this.masterId).subscribe((res: any) => {
      console.log('draft list: ', res);

      const supplyMaster = JSON.parse(res?.supplyMaster);

      this.supplyDetailsList = res?.supplyDetails || [];
      this.supplyId = supplyMaster.supplyId;


      //const detailsList = res.supplyDetails;
      //this.supplyDetailsList = res.supplyDetails;
      //console.log('Supply Details from local Storage:', this.supplyDetailsList);

      setTimeout(() => {
        const firstValidIndex = this.supplyDetailsList.findIndex(
          (x: any) => x.stockInfoList && x.stockInfoList.length > 0
        );

        if (firstValidIndex > -1) {
          $(`#transferType${firstValidIndex}`).focus();
        }
      }, 100);

      // Initialize Select2 for table batch selects after view render
      setTimeout(() => {
        $('.batch-select, .from-select').select2();

        $('.batch-select').on('change', (event: any) => {
          const $select = $(event.target);
          const index = $select.data('index');

          const selectedOption = $select.find('option:selected');
          const stockQty = Number(selectedOption.data('stock')) || 0;

          if (this.supplyDetailsList[index]) {
            this.supplyDetailsList[index].batch = selectedOption.val();
            this.supplyDetailsList[index].stockQty = stockQty;
          }
        });


      }, 0);

      this.initRowWiseFocus();
    })
  }

  initRowWiseFocus() {

    // TransferType → Batch
    $(document).off('select2:select.transfer')
      .on('select2:select.transfer', '.from-select', (e: any) => {

        const id = e.target.id;
        const rowId = id.match(/\d+$/)?.[0];
        if (!rowId) return;

        setTimeout(() => {
          $(`#batch${rowId}`).focus();
        }, 50);
      });

    // Batch → Qty
    $(document).off('select2:select.batch')
      .on('select2:select.batch', '.batch-select', (e: any) => {

        const id = e.target.id;
        const rowId = id.match(/\d+$/)?.[0];
        // debugger
        if (!rowId) return;

        setTimeout(() => {
          $(`#inputQty${rowId}`).focus();
        }, 50);
      });

    // Qty → Save (ENTER)
    $(document).off('keydown.qty')
      .on('keydown.qty', '.qty-input', (e: any) => {

        if (e.keyCode !== 13) return;
        e.preventDefault();

        const index = Number($(e.target).data('index'));
        const inputQty = Number($(e.target).val());
        const stockQty = Number(this.supplyDetailsList[index]?.stockQty || 0);

        if (inputQty <= 0) {
          this.toastr.error('Input quantity must be greater than 1.');
          $(e.target).focus();
          $(e.target).select();
          return;
        }
        if (inputQty > stockQty) {
          this.toastr.error('Input Qty cannot exceed available Qty.');
          $(e.target).focus();
          return;
        }

        // store qty
        this.supplyDetailsList[index].inputQty = inputQty;
        //const stockQty = this.supplyDetailsList[index].stockQty;
        //const remQty = this.truncateDecimal(stockQty,0)  - inputQty;
        this.supplyDetailsList[index].stockQty = this.supplyDetailsList[index].stockQty - inputQty;
        this.supplyDetailsList[index].isPosting = 1;
        // move to save
        $(`#save${index}`).focus();
      });


    // Save → Next Row
    const handleSave = (e: any) => {
      // Allow click OR Enter key
      if (e.type === 'keydown' && e.keyCode !== 13) return;

      e.preventDefault();

      const btn = e.currentTarget as HTMLElement;
      const index = Number(btn.id.match(/\d+$/)?.[0]);

      const transferType = Number($(`#transferType${index}`).val());
      const batch = $(`#batch${index}`).val();
      const qty = Number($(`#inputQty${index}`).val());

      // 🔒 VALIDATION
      if (!transferType || transferType === 0) {
        this.toastr.error('Please choose Transfer Type');
        $(`#transferType${index}`).focus();
        return;
      }

      if (!batch || batch === '0') {
        this.toastr.error('Please choose Batch');
        $(`#batch${index}`).focus();
        return;
      }

      if (!qty || qty <= 0) {
        this.toastr.error('Quantity must be greater than 0');
        $(`#inputQty${index}`).focus();
        return;
      }

      // ✅ Only executes if all values are valid
      this.supplyDetailsId = Number(btn.dataset?.['supplydetailsid']);

      console.log('index:', index);
      console.log('Supply Details Id:', this.supplyDetailsId);
      console.log('Qty:', qty);
      console.log('supply details data: ', this.supplyDetailsList.filter);

      const detailsId = 2;

      const result = this.supplyDetailsList.filter((d: { supplyDetailsId: number; }) =>
        d.supplyDetailsId === this.supplyDetailsId
      );

      console.log('partiuclar row data:', result[0]);


    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'updateSupplyDetails',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        fromLocationId: String(this.fromLocationId),
        toLocationId: String(this.toLocationId),
        demandId: String(this.demandMasterId),
        branchId: String(this.branchId),
        jsonStringData : String(JSON.stringify(result))
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      console.log('update response:', data);
      // if (data?.length > 0) {
      //   if (data[0].status == 200) {
      //     this.toastr.success(data[0].message);
      //     this.isDisabled = true;
      //   }
      //   else {
      //     //this.toastr.error(data[0].message);
      //     console.log('message: ', data);
      //     if (data.length > 0) {
      //       //this.isDisabled = true;
      //       this.masterId = data[0].supplyId;
      //       this.getSupplyDraftList();
      //     }


      //     console.log('masterId: ', this.masterId);

      //   }
      // }
    });
  

      this.toastr.success('Update successfully.');
      this.focusNextValidRow(index);
    };

    $(document)
      .off('keydown.save click.save')
      .on('keydown.save click.save', '[id^="save"]', handleSave);



  }

  focusNextValidRow(currentIndex: number) {
    for (let i = currentIndex + 1; i < this.supplyDetailsList.length; i++) {
      if (this.supplyDetailsList[i].stockInfoList?.length > 0) {
        setTimeout(() => {
          $(`#transferType${i}`).focus();
        }, 50);
        return;
      }
    }

    setTimeout(() => {
      $('#narration').focus();
    }, 50);
  }

  postingSupply() {
    console.log(this.supplyDetailsList);
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
    this.supplyDetailsList = [];

    $("#demandId").focus();
  }


  truncateDecimal(value: number | string, digits: number = this.decimalPlace): string {
    if (value === null || value === undefined) {
      return '0.00';
    }

    const num = Number(value);
    if (isNaN(num)) {
      return '0.00';
    }

    const factor = Math.pow(10, digits);
    const truncated = Math.trunc(num * factor) / factor;

    return truncated.toFixed(digits);
  }


}
