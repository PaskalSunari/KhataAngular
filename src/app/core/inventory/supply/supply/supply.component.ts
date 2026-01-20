import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SupplyService } from './service/supply.service';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';
import { LoginComponent } from 'src/app/core/Auth/login/login.component';
declare var $: any;
declare const setFocusOnNextElement: any;
@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html'
})

export class SupplyComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  isFormVisible: boolean = true;
  isLocationVisible: boolean = false;
  isEditMode: boolean = false;
  isPrefixSuffix: boolean = false;
  isDisabled: boolean = false;
  isQtyDisabled: boolean = false;
  isSubmitDisabled: boolean = true;
  isDisabledToUser: boolean = false;
  isShowMsg: boolean = true;
  isBtnDisabled: boolean = true;

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

  transferTypeList: any = [
    { id: 1, name: 'Consume' },
    { id: 2, name: 'Transfer' }
  ];

  demandList: any;
  LocationList: any;
  fromLocationList: any;
  toLocationList: any;
  assignedToList: any;
  supplyDetailsList: any;
  requestedToList: any;

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
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'getUserByLocation',
          UserId: String(self.userId ?? ''),
          FiscalId: String(self.fiscalId ?? ''),
          fromLocationId: String(self.fromLocationId),
          toLocationId: String(self.toLocationId),
          branchId: String(self.branchId),
          demandId: String(self.demandMasterId)
        }
      };

      self.service.getGenericServices(payload).subscribe((res: any) => {
        self.isDisabledToUser = true;
        const data = res?.data;
        self.assignedToList = data || [];
        $("#requestedTo").val(self.requestedToList[0].userId).trigger('change');
        $("#assignedToUserId").focus();
      });
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
      this.requestedToList = res?.requestedToList || [];
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
        LocationId: data?.locationId?.toString() ?? '',
        BranchId: this.branchId?.toString() ?? ''
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      //console.log('demand list data:', data);
      if (data && data?.length > 0) {
        this.demandMasterId = data[0]?.demandMasterId;
        this.demandList = res?.data;

        $("#departmentId").focus();
      } else {
        this.resetSupply();
        this.demandList = [];
        if (this.isShowMsg) {
          this.toastr.error('Demand not available.');
        }
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
        branchId: String(this.branchId),
        assignToUserId: String(this.assignToUserId)
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data?.length > 0) {
        if (data[0].status == 200) {
          this.toastr.success(data[0].message);
          this.isDisabled = true;
          this.masterId = data[0].supplyId;
          this.getSupplyDraftList();
        }
        else {
          if (data.length > 0) {
            //this.isDisabled = true;
            this.masterId = data[0].supplyId;
            this.getSupplyDraftList();
          }
        }
      }
    });
  }

  //Fill supply draft list
  getSupplyDraftList() {
    this.service.getSupplyDraftList(this.userId, this.branchId, this.fiscalId, this.masterId).subscribe((res: any) => {
      //console.log('draft list: ', res);
      if (!res && res == null) {
        this.toastr.error('No supply details found.');
        return;
      }
      this.isSubmitDisabled = false;
      const supplyMaster = JSON.parse(res?.supplyMaster);

      this.supplyDetailsList = res?.supplyDetails || [];
      this.supplyId = supplyMaster.supplyId;
      this.isDisabled = true;
      // if (this.supplyDetailsList.length > 0) {
      //   this.isDisabled = true;
      // }      

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
        // Initialize Select2 for TransferType and From selects
        $('.transferType-select, .from-select').select2();
        //$('.transferType-select').on('change', (event: any) => {
        // const $select = $(event.target);
        // const index = $select.data('index');
        // const selectedOption = $select.find('option:selected');

        // if (this.supplyDetailsList[index]) {
        //   this.supplyDetailsList[index].supplyType = selectedOption.val();
        // }
        // });

      }, 0);

      setTimeout(() => {
        this.supplyDetailsList.forEach((item: any, index: any) => {
          $("#transferType" + index).select2();
          $("#batch" + index).select2();

          $("#transferType" + index).val(item.supplyType).trigger('change');
          $("#batch" + index).val(item.batch).trigger('change');
          $("#inputQty" + index).val(item.inputQty).trigger('change');

          const stockQty = Number(item.stockQty) || 0;
          const inputQty = Number(item.inputQty) || 0;

          if (stockQty <= 0) {
            this.supplyDetailsList[index].stockQty = 0;
          } else {
            const remainingQty = stockQty - inputQty;
            this.supplyDetailsList[index].stockQty = this.truncateDecimal(stockQty);
            this.supplyDetailsList[index].remainingQty = remainingQty <= 0 ? 0 : this.truncateDecimal(remainingQty);
          }

        });
      }, 50);

      this.initRowWiseFocus();
    })
  }

  initRowWiseFocus() {
    // TransferType → Batch
    $(document).off('select2:close.transfer')
      .on('select2:close.transfer', '.from-select', (e: any) => {

        const $select = $(e.target);
        const selectedVal = $select.val();

        // If value is '' OR 0 → do NOT move next
        if (selectedVal === '' || selectedVal === 0 || selectedVal === '0' || selectedVal == null) {
          return;
        }

        const id = e.target.id;
        const rowId = id.match(/\d+$/)?.[0];
        if (!rowId) return;

        const index = $select.data('index');
        const selectedOption = $select.find('option:selected');

        if (this.supplyDetailsList[index]) {
          this.supplyDetailsList[index].supplyType = selectedOption.val();
          $(`#save${index}`).prop('disabled', false);
        }

        setTimeout(() => {
          $(`#batch${rowId}`).focus();
        }, 50);
      });


    // Batch → Qty
    $(document).off('select2:close.batch', '.batch-select')
      .on('select2:close.batch', '.batch-select', (e: any) => {

        const $select = $(e.target);
        const selectedVal = $select.val();

        //  If no value selected, do NOT move to qty
        if (!selectedVal) {
          return;
        }

        const id = e.target.id;
        const rowId = id.match(/\d+$/)?.[0];
        if (!rowId) return;

        const index = $select.data('index');
        const selectedOption = $select.find('option:selected');


        $(`#inputQty${index}`).prop('readonly', false);

        const stockQty = Number(selectedOption.data('stock')) || 0;
        const inputQty = Number($("#inputQty" + index).val()) || 0;

        if (this.supplyDetailsList[index]) {
          this.supplyDetailsList[index].batch = selectedVal;
          this.supplyDetailsList[index].stockQty = stockQty;
          this.supplyDetailsList[index].remainingQty = stockQty - inputQty;
          $(`#save${index}`).prop('disabled', false);
        }
        this.isQtyDisabled = false;
        // Move focus only when valid batch selected
        setTimeout(() => {
          const $qty = $(`#inputQty${rowId}`);
          $qty.focus();
          $qty.select();
        }, 50);

      });

    // Double-click → enable Qty input
    $(document).off('dblclick.qty')
      .on('dblclick.qty', '.qty-input', (e: JQuery.DoubleClickEvent) => {

        const input = e.currentTarget as HTMLInputElement;

        $(input).prop('readonly', false);

        setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      });



    // Qty → Save (ENTER)
    $(document).off('keydown.qty')
      .on('keydown.qty', '.qty-input', (e: any) => {

        if (e.keyCode !== 13) return;
        e.preventDefault();

        const index = Number($(e.target).data('index'));
        const inputQty = Number($(e.target).val());
        const stockQty = Number(this.supplyDetailsList[index]?.stockQty || 0);
        // Validation
        if (inputQty <= 0) {
          this.toastr.error('Input quantity must be greater than 1.');
          $(e.target).focus();
          $(e.target).select();
          return;
        }
        // Check against stockQty
        if (inputQty > stockQty) {
          this.toastr.error('Input Qty cannot exceed available Qty.');
          $(e.target).focus();
          return;
        }
        // Check against transactionQty
        const transactionQty = this.supplyDetailsList[index]?.transactionQty || 0;
        if (transactionQty < inputQty) {
          this.toastr.error('Input Qty cannot exceed Transaction Qty.');
          $(e.target).focus();
          return;
        }
        // store qty
        this.supplyDetailsList[index].inputQty = inputQty;
        const stQty = this.supplyDetailsList[index].stockQty;
        const remQty = this.truncateDecimal(stQty) - inputQty;
        this.supplyDetailsList[index].stockQty = stQty;
        this.supplyDetailsList[index].remainingQty = remQty < 0 ? 0 : this.truncateDecimal(remQty);
        this.supplyDetailsList[index].isPartial = transactionQty == inputQty ? 0 : 1;
        this.supplyDetailsList[index].isPosting = 1;
        $(`#save${index}`).prop('disabled', false);
        // move to save
        $(`#details-remarks${index}`).focus();
      });

    // Remarks → Save (ENTER)
    $(document).off('keydown.details')
      .on('keydown.details', '.details-remasks', (e: any) => {

        if (e.key !== 'Enter') return;

        e.preventDefault();   //  stop new line
        e.stopPropagation();  //  stop bubbling

        const $textarea = $(e.target);
        const index = Number($textarea.data('index'));
        const remarks = $textarea.val()?.toString().trim();

        // store remarks
        if (this.supplyDetailsList[index]) {
          this.supplyDetailsList[index].remarks = remarks;
          this.supplyDetailsList[index].isPosting = 1;
        }
        $(`#save${index}`).prop('disabled', false);
        // move focus to Save button
        setTimeout(() => {
          $(`#save${index}`).focus();
        }, 0);
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

      //  VALIDATION
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

      const stockQty = Number(this.supplyDetailsList[index]?.stockQty || 0);

      // Check against stockQty
      if (qty > stockQty) {
        this.toastr.error('Input Qty cannot exceed available Qty.');
        $(e.target).focus();
        return;
      }

      // Check against transactionQty
      const transactionQty = this.supplyDetailsList[index]?.transactionQty || 0;
      if (transactionQty < qty) {
        this.toastr.error('Input Qty cannot exceed Transaction Qty.');
        $(e.target).focus();
        return;
      }
      // store qty
      const stQty = this.supplyDetailsList[index].stockQty;
      const remQty = this.truncateDecimal(stQty) - qty;

      this.supplyDetailsList[index].inputQty = qty;
      this.supplyDetailsList[index].remainingQty = remQty < 0 ? 0 : this.truncateDecimal(remQty);
        this.supplyDetailsList[index].isPartial = transactionQty == qty ? 0 : 1;
      // Only executes if all values are valid
      this.supplyDetailsId = Number(btn.dataset?.['supplydetailsid']);

      const result = this.supplyDetailsList.filter((d: { supplyDetailsId: number; }) =>
        d.supplyDetailsId === this.supplyDetailsId
      );

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
          jsonStringData: String(JSON.stringify(result))
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {
        const data = res?.data;
        //console.log('update response:', data);
        if (data?.length > 0) {
          if (data[0].status == 200) {
            $(`#inputQty${index}`).prop('readonly', true);
            $(`#save${index}`).prop('disabled', true);
            this.isBtnDisabled = true;
            this.toastr.success(data[0].message);
            this.focusNextValidRow(index);
          }
          else {
            this.toastr.error(data[0].message);
            this.isQtyDisabled = false;
          }
        }
      });
    };

    $(document).off('keydown.save click.save').on('keydown.save click.save', '[id^="save"]', handleSave);


    // Delete → Next Row
    const handleDelete = (e: any) => {
      // Allow click OR Enter key
      if (e.type === 'keydown' && e.keyCode !== 13) return;

      e.preventDefault();

      const btn = e.currentTarget as HTMLElement;
      const index = Number(btn.id.match(/\d+$/)?.[0]);

      // Only executes if all values are valid
      this.supplyDetailsId = Number(btn.dataset?.['supplydetailsid']);

      const result = this.supplyDetailsList.filter((d: { supplyDetailsId: number; }) =>
        d.supplyDetailsId === this.supplyDetailsId
      );

      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'deleteSupplyDetails',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          fromLocationId: String(this.fromLocationId),
          toLocationId: String(this.toLocationId),
          demandId: String(this.demandMasterId),
          branchId: String(this.branchId),
          masterId: String(result[0].supplyMasterId),
          supplyDetailsId: String(result[0].supplyDetailsId)
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {
        const data = res?.data;
        if (data?.length > 0) {
          if (data[0].status == 200) {
            this.toastr.success(data[0].message);
            if (data[0].isDelete == 0) {
              this.resetSupply();
              return;
            }
            this.getSupplyDraftList();
          }
          else {
            this.toastr.error(data[0].message);
          }
        }
      });
    };

    $(document).off('keydown.delete click.delete').on('keydown.delete click.delete', '[id^="delete"]', handleDelete);
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

  deleteSupply() {
    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'deleteSupplyData',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        branchId: String(this.branchId),
        masterId: String(this.masterId),
        demandId: String(this.demandMasterId),
        fromLocationId: String(this.fromLocationId),
        toLocationId: String(this.toLocationId),
      }
    };

    this.service.getGenericServices(payload).subscribe((res: any) => {
      const data = res?.data;
      if (data?.length > 0) {
        if (data[0].status == 200) {
          this.toastr.success(data[0].message);
          this.resetSupply();
        }
        else {
          this.toastr.error(data[0].message);
        }
      }
    });
  }

  postingSupply() {
    if (this.isSubmitDisabled) return;

    this.isSubmitDisabled = true;

    const payload = {
      tableName: 'Supply',
      parameter: {
        Flag: 'supplyFinalPosting',
        UserId: String(this.userId ?? ''),
        FiscalId: String(this.fiscalId ?? ''),
        fromLocationId: String(this.fromLocationId),
        toLocationId: String(this.toLocationId),
        demandId: String(this.demandMasterId),
        branchId: String(this.branchId),
        masterId: String(this.masterId),
        toUserId: String(this.requestedToList[0].userId),
        remarks: String($('#narration').val())
      }
    };

    this.service.getGenericServices(payload).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (data?.[0]?.status === 200) {
          this.toastr.success(data[0]?.message);
          this.isShowMsg = false;
          this.getDemandList();
          this.resetSupply();
        } else {
          this.toastr.error(data?.[0]?.message || 'Error');
        }
        this.isSubmitDisabled = false;
      },
      error: () => {
        this.isSubmitDisabled = false;
      }
    });
  }

  resetSupply() {
    this.isDisabled = false;
    this.isQtyDisabled = true;
    this.isSubmitDisabled = true;
    this.isDisabledToUser = false;
    this.demandMasterId = 0;
    this.supplyId = 0;
    this.masterId = 0;
    this.supplyDetailsId = 0;
    this.fromLocationId = 0;
    this.toLocationId = 0;
    this.assignToUserId = 0;

    // this.demandList = [];
    this.fromLocationList = [];
    this.toLocationList = [];
    this.assignedToList = [];
    this.supplyDetailsList = [];
    this.requestedToList = [];

    $("#narration").val('');
    setTimeout(() => {
      $("#demandId").focus();
    }, 100);
  }

  truncateDecimal(
    value: number | string,
    digits: number = this.decimalPlace
  ): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const num = Number(value);
    if (isNaN(num)) {
      return 0;
    }

    const factor = Math.pow(10, digits);
    return Math.trunc(num * factor) / factor;
  }
}
