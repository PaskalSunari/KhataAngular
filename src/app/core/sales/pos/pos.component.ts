import {
  AfterViewInit,
  Component,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
declare const AD2BS: any;
declare const BS2AD: any;
declare const oninitial: any;
declare const CurrentBSDate: any;
import { forkJoin } from 'rxjs';
import 'select2';
import { PosService } from './pos.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
})
export class PosComponent implements AfterViewInit {
  loading: boolean = false;
  tab = 'main';
  fiscalYear = JSON.parse(localStorage.getItem('fiscalYear') || '');
  userId: number = Number(localStorage.getItem('userId')) || 0;
  branch: number = Number(localStorage.getItem('branch')) || 0;
  isDisabled: boolean = false;
  IsCdisabled: boolean = false;
  isSubmitting: boolean = false;

  fieldDisabled: boolean = true;

  expiryDate: any;

  // localstorage bata
  salesDetails: any[] = [];
  salesTransactionList: any[] = [];

  salesMasterIDLocal = Number(localStorage.getItem('salesMasterID')) || 0;
  customerDetails: any;
  // localstorage bata end
  constructor(
    private el: ElementRef,
    public service: PosService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    // keyboard listener
    window.addEventListener('keydown', (event) => this.handleKey(event));
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // F1 → Focus customer
    if (event.key === 'F1') {
      event.preventDefault(); // stop browser help
      document.getElementById('customerSelect')?.focus();
      return;
    }

    // Ctrl + a → Save
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      this.InsertSalesInfo();
      return;
    }
  }
  /* ------------ CALCULATOR ------------ */
  IsCalculatorPopup = false;
  display: string = '0';
  history: string[] = [];
  showHistory: boolean = false;
  isNumShow: boolean = false;

  toggleHistory() {
    this.showHistory = !this.showHistory;
    this.isNumShow = !this.isNumShow;
  }

  calculatorPopup() {
    this.IsCalculatorPopup = true;
  }

  closeCalculatorPopup() {
    this.IsCalculatorPopup = false;
    this.clear();
  }

  press(value: string) {
    if (this.display === '0') this.display = '';
    this.display += value;
  }

  clear() {
    this.display = '0';
  }

  del() {
    this.display = this.display.slice(0, -1);
    if (this.display === '') this.display = '0';
  }

  percentage() {
    try {
      const result = eval(this.display) / 100;
      this.history.push(this.display + ' = ' + result);
      this.display = result.toString();
    } catch {
      this.display = 'Error';
    }
  }

  calculate() {
    try {
      const result = eval(this.display);
      this.history.push(this.display + ' = ' + result);
      this.display = result.toString();
    } catch {
      this.display = 'Error';
    }
  }

  /* ------------ HISTORY ------------ */
  clearHistory() {
    this.history = [];
  }

  /* ------------ KEYBOARD SUPPORT ------------ */
  handleKey(event: KeyboardEvent) {
    if (!this.IsCalculatorPopup) return;

    const key = event.key;

    if (!isNaN(Number(key))) this.press(key); // 0–9
    if (['+', '-', '*', '/', '.'].includes(key)) this.press(key);

    if (key === 'Enter') this.calculate();
    if (key === 'Backspace') this.del();
    if (key === 'Escape') this.closeCalculatorPopup();
  }

  /* ------------ CALCULATOR END ------------ */

  ngAfterViewInit(): void {
    this.salesMasterID = this.getMasterID();
    this.isDisabled = false;
    this.fetchSalesLedger();
    this.fetchProductList(); // <-- FIXED
    this.selectProductName();
    this.selectMode();
    this.fullScreen();
    this.selecBatch();
    this.selecUnit();
    this.fetchSuffixPrefix();
    // this.fetchTableData();
    this.enterFun();
    this.RecievedLedger();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);

    Promise.resolve().then(() => {
      const stored = JSON.parse(localStorage.getItem('salesInfo') || '[]');
      this.salesDetails = Array.isArray(stored) ? stored : [];

      if (this.salesDetails?.length) {
        const salesLedgerText = JSON.parse(
          localStorage.getItem('salesLedgerText') || ''
        );

        if (stored.length != 0) {
          localStorage.setItem('salesMasterID', stored[0].salesMasterID);
          this.salesMasterID = stored[0].salesMasterID;
        }

        const mode = JSON.parse(localStorage.getItem('mode') || '');

        setTimeout(() => {
          if ($('#salesLedger').length) {
            const dropdown = document.getElementById(
              'salesLedger'
            ) as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = salesLedgerText; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }

          if ($('#modeSelect').length) {
            const dropdown = document.getElementById(
              'modeSelect'
            ) as HTMLInputElement | null;
            if (dropdown) {
              dropdown.value = mode; // Assuming val.parentID is a string, convert it to a string if needed
              const event = new Event('change', { bubbles: true });
              dropdown.dispatchEvent(event);
            }
          }
        }, 500);

        this.isDisabled = true;
      }
    });

    Promise.resolve().then(() => {
      const storedSummary = localStorage.getItem('billSummary');
      if (storedSummary) {
        this.billSummary = JSON.parse(storedSummary);
      }
    });

    Promise.resolve().then(() => {
      const stored = JSON.parse(
        localStorage.getItem('salesTransactionList') || '[]'
      );
      this.salesTransactionList = Array.isArray(stored) ? stored : [];
    });

    Promise.resolve().then(() => {
      const customerDetails = localStorage.getItem('customerDetails');
      if (customerDetails) {
        this.customerDetails = JSON.parse(customerDetails);
      }
    });

    this.suffixPrefix = JSON.parse(localStorage.getItem('suffixPrefix') || ' ');

    this.customerSelecChange();
  }
  // ================= MASTER ID HELPER =================
  getMasterID(): number {
    return this.salesMasterID && this.salesMasterID !== 0
      ? this.salesMasterID
      : Number(localStorage.getItem('salesMasterID')) || 0;
  }
  //=====================================================================
  // Enter functon
  enterFun() {
    const self = this; // keep Angular context

    $(document).ready(function () {
      // Keydown event handler for inputs and selects
      $('input, select, .focussable, textarea, button').on(
        'keydown',
        function (this: HTMLElement, event: any) {
          if (event.keyCode === 13) {
            event.preventDefault();

            const current = $(event.target);

            // If ENTER pressed on BUTTON
            if (current.hasClass('button')) {
              // trigger angular click
              current.trigger('click');

              // wait DOM update then focus next field
              setTimeout(() => {
                $('#productSelect').focus();
              }, 0);

              return; // important: stop further execution
            }

            if (current.hasClass('receivedLedgerbtn')) {
              current.trigger('click');
              return;
            }

            // ✅ Normal input flow
            if (!current.hasClass('select2-hidden-accessible')) {
              setFocusOnNextElement.call(current);
            }

            // self.netBill();
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
  //=====================================================================
  salesLedgerList: any[] = [];

  fetchSalesLedger() {
    this.loading = true;
    this.service.salesLedger().subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.loading = false;
          this.salesLedgerList = data.result;
        }
      },
      error: (err) => {
        console.error('Error fetching sales ledger data:', err);
        this.toastr.error('Failed to load sales ledger data');
        this.loading = false;
      },
    });
  }
  //=====================================================================
  productList: any[] = [];
  productCode: string = '';
  vat: any;
  rateDetails: any[] = [];
  productId: any;
  unit: any;
  batch: any[] = [];
  skuunit: any;
  rate: number = 0;
  qty: any;
  conversionFactor: any;
  selectProductName() {
    $('#productSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;
      this.fetchProductDetail(selectedValue); // <-- Pass selected product code here

      setTimeout(() => {
        if ($('#batchSelect').length) {
          const dropdown = document.getElementById(
            'batchSelect'
          ) as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = ''; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);

      this.qtyNum = 0;
      this.discountAmount = 0;
      this.discountPercent = 0;
      this.netTotal = 0;
    });
  }

  //=====================================================================
  fetchProductDetail(selectedValue: any) {
    this.service.GetProductDetail(selectedValue).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.batch = data?.result;
          this.productCode = data?.result[0]?.productCode;
          this.vat = data?.result[0]?.isvatable;
          this.productId = data?.result[0]?.productId;
        }
      },
      error: () => {
        this.toastr.error('Failed to load');
      },
    });
  }

  //=====================================================================
  fetchProductList() {
    this.service.GetAllProducts().subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.productList = data?.result;
          // all batch list
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================

  selecBatch() {
    $('#batchSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;
      // console.log(selectedValue, 'batch');

      const selectedBatchObject = this.batch?.find(
        (p) => p?.batch == selectedValue
      );

      this.fetchUnits(selectedBatchObject); // <-- Pass selected product code here
      this.qty = selectedBatchObject?.qty;
      this.rate = 0;
    });
  }

  fetchUnits(batchObj: any) {
    this.loading = true;
    const obj = {
      batch: batchObj?.batch,
      branch: this.branch,
      flag: 9,
      productCode: batchObj?.productCode,
      productId: batchObj?.productId?.toString(),
    };
    this.service.GetUnits(obj).subscribe(
      (res: any) => {
        // const transactionData = res.data;
        if (res.code == 200) {
          this.unit = res?.result;
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching Unit data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Unit data');
      }
    );
  }

  selecUnit() {
    console.log(this.fiscalYear, 'fiscalYear');
    $('#selecUnit').on('change', (event: any) => {
      const selectedValue = event.target.value;
      const selectedObject = this.unit?.find(
        (p: any) => p?.fromUnitId == selectedValue
      );
      this.expiryDate = selectedObject.expirydate;

      this.fetchMissingUnit(selectedObject);
      // this.fetchRate(selectedObject);
      this.fetchRate();
    });
  }

  fetchMissingUnit(selectedObj: any) {
    this.loading = true;
    const obj = {
      productCode: 'N/A',
      flag: 13,
      branch: this.branch,
      productId: selectedObj.productId,
      unit: selectedObj.fromUnitId,
      batch: 'N/A',
    };
    this.service.GetMissingUnit(obj).subscribe(
      (res: any) => {
        // const transactionData = res.data;

        if (res.code == 200) {
          this.conversionFactor = res?.result[0]?.conversionFactor;
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching ConversionFact data:', err);
        this.loading = false;

        this.toastr.error('Failed to load ConversionFact data');
      }
    );
  }
  //=====================================================================

  fetchRate() {
    this.loading = true;

    const obj = {
      batch: $('#batchSelect').val(),
      branch: this.branch,
      flag: 5,
      productCode: this.productCode,
      productId: $('#productSelect').val(),
      unit: $('#selecUnit').val(),
    };
    this.service.GetRate(obj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.rate = res?.result[0]?.salesRate;
          this.skuunit = res?.result[0]?.skuunit;
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching Rate data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Rate data');
      }
    );
  }

  //=====================================================================
  // rate: number = 97.35;

  qtyNum: number = 0;

  discountPercent: number = 0;
  discountAmount: number = 0;

  netTotal: number = 0;

  // ------------------------
  // When Discount % changes
  // ------------------------
  percentChanged() {
    if (this.qtyNum <= 0) return;
    this.discountAmount = parseFloat(
      ((this.rate * this.qtyNum * this.discountPercent) / 100).toFixed(2)
    );
    this.calculateNetTotal();
  }

  // ------------------------
  // When Discount Amount changes
  // ------------------------
  amountChanged() {
    if (this.qtyNum <= 0) return;
    this.discountPercent = parseFloat(
      ((this.discountAmount / (this.rate * this.qtyNum)) * 100).toFixed(2)
    );
    this.calculateNetTotal();
  }

  qtyValidation(event: KeyboardEvent) {
    const invalidKeys = ['-', 'e', 'E', '.'];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault(); // key type नै हुन नदिने
    }
  }
  disValidation(event: KeyboardEvent) {
    const invalidKeys = ['-', 'e', 'E'];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault(); // key type नै हुन नदिने
    }
  }

  // ------------------------
  // When Quantity changes
  // ------------------------
  quantityChanged() {
    if (!this.qtyNum || this.qtyNum <= 0) {
      this.qtyNum = 0;
      this.discountAmount = 0;
      this.discountPercent = 0;
      this.netTotal = 0;
      return;
    }

    // Recalculate discount based on which field is active
    if (this.discountPercent > 0) {
      this.discountAmount =
        (this.rate * this.qtyNum * this.discountPercent) / 100;
    } else if (this.discountAmount > 0) {
      this.discountPercent =
        (this.discountAmount / (this.rate * this.qtyNum)) * 100;
    }

    this.calculateNetTotal();
  }

  // ------------------------
  // NET TOTAL CALCULATION
  // ------------------------
  calculateNetTotal() {
    const subtotal = this.rate * this.qtyNum;
    const afterDiscount = subtotal - this.discountAmount;

    let vatAmount = 0;

    if (this.vat == true) {
      vatAmount = afterDiscount * 0.13; // 13% VAT
    } else {
      vatAmount = 0;
    }

    this.netTotal = parseFloat((afterDiscount + vatAmount).toFixed(2));
  }

  //=====================================================================
  modalAnimationClass = '';

  IscustomerPopup: boolean = false;

  customerPopup() {
    this.modalAnimationClass = 'modal-enter';
    this.IscustomerPopup = true;
    setTimeout(() => {
      $('#recieptMode').focus();
    }, 10);
  }

  closecustomerPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.IscustomerPopup = false;
    setTimeout(() => {
      $('#discountOffer').focus();
    }, 10);
  }

  //=====================================================================
  suffixPrefix: any;
  fetchSuffixPrefix() {
    this.service.GetSuffixPrefix().subscribe({
      next: (data: any) => {
        this.suffixPrefix = data;
        localStorage.setItem('suffixPrefix', JSON.stringify(this.suffixPrefix));
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================

  validation() {
    // const selectedText = $('#productSelect option:selected').text().trim();
    if ($('#salesLedger').val() == '') {
      $('#salesLedger').select2('open');
      this.toastr.error('salesLedger is required');
      return false;
    } else if ($('#modeSelect').val() == '') {
      $('#modeSelect').select2('open');
      this.toastr.error('Mode is required');
      return false;
    } else if ($('#productSelect').val() == '') {
      $('#productSelect').select2('open');
      this.toastr.error('Product  is required');
      return false;
    } else if ($('#batchSelect').val() == '') {
      $('#batchSelect').select2('open');
      this.toastr.error('Batch  is required');
      return false;
    } else if ($('#selecUnit').val() == '') {
      $('#selecUnit').select2('open');
      this.toastr.error('Unit  is required');
      return false;
    } else if ($('#qtyId').val() == 0) {
      $('#qtyId').focus();
      this.toastr.error('Qty  is required');
      return false;
    }
    return true;
  }
  salesMasterID: any;
  fetchSalesData() {
    console.log(this.fiscalYear, 'fiscalYear');
    this.loading = true;
    const vatApplicable = this.vat; // true or false

    // example: 80
    // 1️⃣ Gross Amount
    const grossAmount = +(this.rate * this.qtyNum).toFixed(2);

    // 2️⃣ Discount Amount
    const discountAmt = +((grossAmount * this.discountPercent) / 100).toFixed(
      2
    );

    // 3️⃣ Net Amount (Discount पछि)
    const netAmt = +(grossAmount - discountAmt).toFixed(2);

    // 4️⃣ Taxable Amount (VAT लाग्ने amount)
    // - यदि item taxable छ र VAT लाग्छ भने netAmt नै taxableAmount हुन्छ
    // - अन्यथा 0
    const taxableAmount = vatApplicable ? netAmt : 0;
    const nonTaxableAmount = vatApplicable ? 0 : netAmt;

    // 5️⃣ VAT Amount (13% VAT)
    const vatAmount = +(taxableAmount * 0.13).toFixed(2);

    // 6️⃣ Net Total (Final Payable)
    const netTotal = +(netAmt + vatAmount).toFixed(2);

    let transactionUnitCost = 0;

    if (vatApplicable) {
      // Selling unit price (VAT included)
      transactionUnitCost = +(netTotal / this.qtyNum).toFixed(2);
    } else {
      // Cost / price without VAT
      transactionUnitCost = +(netAmt / this.qtyNum).toFixed(2);
    }

    // 🔹 SKU Unit Cost (from Product Master / API)
    const skuUnitCost = +(transactionUnitCost * this.conversionFactor).toFixed(
      2
    );

    // console.log({
    //   grossAmount,
    //   discountAmt,
    //   netAmt,
    //   taxableAmount,
    //   vatAmount,
    //   netTotal,
    // });

    let cuurentDate = new Date().toISOString().split('T')[0];
    let BS = AD2BS(cuurentDate);

    // return;

    const obj1 = {
      SalesMasterID: this.salesMasterID,
      VoucherDate: new Date().toISOString(),
      VoucherNo: this.suffixPrefix,
      InvoiceNo: 0,
      ManualRefNo: '0',
      VouchertypeID: 19,

      TransactionMode: $('#modeSelect').val(),
      FinancialYearID: Number(this.fiscalYear.financialYearId),
      BranchID: this.branch,

      SalesAccountID: Number($('#salesLedger').val()),
      SalesOrderMasterID: 0,
      ChallanMasterID: 0,
      CustomerID: Number($('#customerSelect').val()),
      RefererID: 0,
      PricingLevelID: 0,

      GrossAmt: grossAmount,
      ItemDiscount: discountAmt,
      BillDiscountAmt: 0,
      BillDiscountPercent: 0,
      OtherTaxAmt: 0,
      ChargeAmt: 0,
      AdditionalIncomeAmt: 0,

      TaxableAmt: taxableAmount,
      NonTaxableAmt: nonTaxableAmount,
      VATAmt: vatAmount,
      NetBillAmt: netTotal,

      IsExport: false,
      Narration: '0',
      Status: true,
      UserID: this.userId,

      EntryDate: new Date().toISOString(),
      UpdatedBy: 0,
      UpdatedDate: new Date().toISOString(),

      Extra1: BS,
      Extra2: '0',
      flag: 2,
      IsDraft: false,
      BillAdjustment: 0,

      SalesDetailsDraftID: 0,
      ChallanDetailsID: 0,
      OrderDetailsID: 0,

      ProductID: this.productId,
      Batch: $('#batchSelect').val(),
      ExpiryDate: this.expiryDate,

      Rate: this.rate,
      TransactionUnitID: $('#selecUnit').val(),
      SKU: this.skuunit,
      ProductUnitID: 0,

      ItemDiscountPercent: this.discountPercent,
      ItemDiscountAmt: discountAmt,
      NetAmt: netAmt,

      TransactionUnitCost: transactionUnitCost,
      SKUUnitCost: skuUnitCost,

      Stockqty: this.qtyNum,
      locationId: 1,
      Vat: Number(this.vat),
    };

    // rese

    if (this.validation() == true) {
      // this.salesDetails.push(obj);
      //update in localstoage
      //localStorage.setItem('salesInfo', JSON.stringify(this.salesDetails));
      //  this.isDisabled = true;

      this.service.AddSalesMasterDetails(obj1).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.isDisabled = true;

            this.fieldDisabled = false;

            this.salesMasterID = res.result.salesMasterID;

            localStorage.setItem(
              'salesMasterID',
              JSON.stringify(this.salesMasterID)
            );
            localStorage.setItem(
              'salesLedgerText',
              JSON.stringify($('#salesLedger').val())
            );

            localStorage.setItem(
              'mode',
              JSON.stringify($('#modeSelect').val())
            );

            this.fetchTableSales(this.suffixPrefix);

            const masterID = this.getMasterID();

            if (masterID) {
              this.fetchSalesMasterDraftOnly(masterID);
              setTimeout(() => {
                this.FetchSalesTransactionCrDrList(masterID);
              }, 1200);
            }

            this.rateDetails = res.result;

            this.reset();
          }
          this.loading = false;
        },
        (err) => {
          console.error('Error fetching AddSalesMasterDetails data:', err);
          this.loading = false;
          this.isSubmitting = true;
          this.reset();
          this.toastr.error('Failed to load AddSalesMasterDetails data');
        }
      );
    }
  }
  reset() {
    setTimeout(() => {
      if ($('#productSelect').length) {
        const dropdown = document.getElementById(
          'productSelect'
        ) as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = ''; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
    }, 10);
  }

  text: string = '';

  customerSelecChange() {
    $('#customerSelect').on('change', () => {
      this.fieldDisabled = false;
      setTimeout(() => {
        if ($('#receivedLedger').length) {
          const dropdown = document.getElementById(
            'receivedLedger'
          ) as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = ''; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 10);
      const selectedOption = $('#customerSelect option:selected');

      this.text = selectedOption.text();

      this.customerDetails = '';

      this.fetchCustomer();
      this.customerPopup();
    });
  }

  fetchCustomer() {
    this.loading = true;

    const obj = {
      flag: 11,
      searchtext: '',
      text: this.text,
      value: 0,
      vcode: '',
    };
    this.service.getCustomerbyId(obj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.result;

          this.service.customerDetailModel.customer = data?.ledgerName;
          this.service.customerDetailModel.mailingName = data?.mailingName;
          this.service.customerDetailModel.address = data?.address;
          this.service.customerDetailModel.email = data?.email;
          this.service.customerDetailModel.pan = data?.pan;
          this.service.customerDetailModel.date =
            data?.inserted_Date.split('T')[0];
          this.customerDetails = data;

          localStorage.setItem('customerDetails', JSON.stringify(data));
        }

        this.loading = false;
      },
      (err) => {
        console.error('Error fetching customer data:', err);
        this.loading = false;

        this.toastr.error('Failed to load customer data');
      }
    );
  }

  InsertSalesInfo() {
    this.loading = true;
    const obj = {
      CustomerID: Number($('#customerSelect').val()), //48,
      CustomerName: this.service.customerDetailModel.customer, //'Tapan Import And Export Pt Ltd',
      CustomerAddress: this.service.customerDetailModel.address, // 'Kalanki kathmandu',
      MailingName: this.service.customerDetailModel.mailingName, // 'Tapan Import And Export',
      PAN: this.service.customerDetailModel.pan, // '609899939',
      Email: this.service.customerDetailModel.email,
      CreditPeriod: this.service.customerDetailModel.creditPeriod,
      ReceiptMode: this.recieptMode,
      DispatchedDate: new Date().toISOString().split('T')[0], // '2025-12-19T00:00:00.000Z',
      DispatchedThrough: this.service.customerDetailModel.dispatched,
      Destination: this.service.customerDetailModel.Destination,
      CarrierAgent: this.service.customerDetailModel.carrierName,
      VehicleNo: this.service.customerDetailModel.vehicleNo,
      OrginalInvoiceNo: 'n/a',
      OrderChallanNo: this.service.customerDetailModel.challanNo,
      OrginalInvoiceDate: new Date().toISOString().split('T')[0],
      EntryDate: new Date().toISOString().split('T')[0],
      UpdatedDate: new Date().toISOString().split('T')[0],
      LR_RRNO_BillOfLanding: this.service.customerDetailModel.RRNo,
      Remarks: this.service.customerDetailModel.Remarks,
      Extra1: this.suffixPrefix,
      userID: this.userId,
      branch: this.branch,
    };
    this.service.InsertSalesInfoDrafts(obj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.result;
          this.closecustomerPopup();
          this.resetSalesInfo();
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error InsertSalesInfo', err);
        this.loading = false;

        this.toastr.error('Failed InsertSalesInfo');
      }
    );
  }

  resetSalesInfo() {
    this.service.customerDetailModel.customer = '';
    this.service.customerDetailModel.address = '';
    this.service.customerDetailModel.mailingName = '';
    this.service.customerDetailModel.pan = '';
    this.service.customerDetailModel.email = '';
    this.service.customerDetailModel.creditPeriod = 0;
    // this.recieptMode = '';
    this.service.customerDetailModel.date = new Date()
      .toISOString()
      .split('T')[0];
    this.service.customerDetailModel.dispatched = '';
    this.service.customerDetailModel.Destination = '';
    this.service.customerDetailModel.carrierName = '';
    this.service.customerDetailModel.vehicleNo = '';
    this.service.customerDetailModel.challanNo = '';
    this.service.customerDetailModel.RRNo = '';
    this.service.customerDetailModel.Remarks = '';
    this.suffixPrefix = '';
    this.userId = 0;
    this.branch = 0;
  }

  deleteItem(Id: number) {
    this.salesDetails = this.salesDetails.filter((item) => {
      return item.salesDetailsDraftID != Id;
    });

    this.service.DeleteSalesMasterDraftEntry(Id).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.isDisabled = false;

          const masterID = this.getMasterID();

          if (masterID) {
            this.fetchSalesMasterDraftOnly(masterID);
            setTimeout(() => {
              this.FetchSalesTransactionCrDrList(masterID);
            }, 1200);
          }
          // if (!data.result || data.result.length === 0) {
          //   this.salesDeleteUpdate();
          // }
        }
      },
      error: () => {
        this.toastr.error('Failed to load ledger list');
      },
    });

    // Update localStorage after delete
    localStorage.setItem('salesInfo', JSON.stringify(this.salesDetails));

    localStorage.setItem('billSummary', JSON.stringify(this.billSummary));
    localStorage.setItem(
      'salesTransactionList',
      JSON.stringify(this.salesTransactionList)
    );

    this.toastr.success('Item removed');
  }

  // salesDeleteUpdate() {
  //   this.loading = true;

  //   const obj = {
  //     masterID: this.salesMasterID,
  //     ledgerID: 6,
  //     grossAmt: 0,
  //   };
  //   this.service.DeleteUpdate(obj).subscribe(
  //     (res: any) => {
  //       if (res.code == 200) {
  //         this.fetchSalesMasterDraftOnly(this.salesMasterID);
  //         setTimeout(() => {
  //           this.FetchSalesTransactionCrDrList(this.salesMasterID);
  //         }, 2000);

  //         this.loading = false;
  //       }
  //     },
  //     (err) => {
  //       console.error('Error salesDeleteUpdate', err);
  //       this.loading = false;

  //       this.toastr.error('Failed salesDeleteUpdate');
  //     }
  //   );
  // }

  // tableList: any[] = [];

  // salesInfoLocalStorage(){

  // }

  //=====================================================================
  discItem: number = 0.0;
  fetchTableSales(VoucherNo: any) {
    this.service.LoadSalesDetails(VoucherNo).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          //  localStorage बाट existing data निकाल्ने
          const stored = JSON.parse(localStorage.getItem('salesInfo') || '[]');

          //   API बाट आएको data
          const newData = data.result || [];

          if (data.result && data.result.length > 0) {
            const lastIndex = data.result.length - 1;
            this.discItem = data.result[lastIndex].itemDiscountAmt;

            console.log(this.discItem, 'last item discount');
          }

          // this.discItem = data.result[0].itemDiscountAmt;
          console.log(data.result, 'result data');
          //   duplicate हटाएर merge गर्ने
          const merged = [
            ...stored,
            ...newData.filter(
              (n: any) =>
                !stored.some(
                  (s: any) => s.salesDetailsDraftID === n.salesDetailsDraftID
                )
            ),
          ];

          //  table update
          this.salesDetails = merged;

          // localStorage update
          localStorage.setItem('salesInfo', JSON.stringify(this.salesDetails));
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================
  // GrossAmt: number = 0;
  itemDiscount: number = 0;
  billDiscountAmt: number = 0;
  additionalIncomeAmt: number = 0;
  nonTaxableAmt: number = 0;
  taxableAmt: number = 0;
  vatAmt: number = 0;
  netBillAmt: number = 0;

  billSummary: any = {
    GrossAmt: 0,
    itemDiscount: 0,
    billDiscountAmt: 0,
    additionalIncomeAmt: 0,
    nonTaxableAmt: 0,
    taxableAmt: 0,
    vatAmt: 0,
    netBillAmt: 0,
  };

  // old

  fetchSalesMasterDraftOnly(MasterID: any) {
    this.service.getSalesMasterDraftOnly(MasterID).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          // this.GrossAmt = +data?.result.grossAmt.toFixed(2);
          // this.itemDiscount = +data?.result.itemDiscount.toFixed(2);
          // this.billDiscountAmt = +data?.result.billDiscountAmt.toFixed(2);
          // this.additionalIncomeAmt =
          //   data?.result.additionalIncomeAmt.toFixed(2);
          // this.nonTaxableAmt = +data?.result.nonTaxableAmt.toFixed(2);

          // this.taxableAmt = +data?.result.taxableAmt.toFixed(2);
          // this.vatAmt = +data?.result.vatAmt.toFixed(2);
          // this.netBillAmt = +data?.result.netBillAmt.toFixed(2);

          this.billSummary = {
            GrossAmt: +data?.result.grossAmt.toFixed(2),
            itemDiscount: +data?.result.itemDiscount.toFixed(2),
            billDiscountAmt: +data?.result.billDiscountAmt.toFixed(2),
            additionalIncomeAmt: data?.result.additionalIncomeAmt.toFixed(2),
            nonTaxableAmt: +data?.result.nonTaxableAmt.toFixed(2),

            taxableAmt: +data?.result.taxableAmt.toFixed(2),
            vatAmt: +data?.result.vatAmt.toFixed(2),
            netBillAmt: +data?.result.netBillAmt.toFixed(2),
          };

          localStorage.setItem('billSummary', JSON.stringify(this.billSummary));

          this.InsertTransactionSalesLedger(data?.result);

          this.originalNetBillAmt = Number(this.billSummary.netBillAmt);
          this.NetBillAmt = this.originalNetBillAmt; // initially 86.52
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================

  // InsertTransactionSalesLedger(result: any) {

  //   const masterID = this.getMasterID();
  //   // VAT Ledger
  //   if (+result?.vatAmt > 0) {
  //     const vatAmt = +result.vatAmt
  //     const obj1 = {
  //       VoucherTypeID: 19,
  //       CrAmt: +result.vatAmt,
  //       DrAmt: 0,
  //       LedgerId: 7,
  //       MasterID: masterID,
  //       UserID: this.userId,
  //       extra1: this.suffixPrefix,
  //     };

  //     this.service.GetTransactionSalesLedger(obj1).subscribe(
  //       (res: any) => {
  //         if (res.code === 200) {
  //           console.log(res.result, 'vat');
  //         }
  //         this.loading = false;
  //       },
  //       (err) => {
  //         console.error('Error InsertTransactionSalesLedger', err);
  //         this.loading = false;
  //         this.toastr.error('Failed InsertTransactionSalesLedger');
  //       }
  //     );
  //   }

  //   // Discount Ledger
  //   if (+result?.itemDiscount > 0) {
  //     const itemDiscount =  +result.itemDiscount
  //     const obj2 = {
  //       VoucherTypeID: 19,
  //       MasterID: masterID,
  //       LedgerId: 3,
  //       DrAmt: itemDiscount,
  //       CrAmt: 0,
  //       extra1: this.suffixPrefix,
  //       UserID: this.userId,
  //       extra2: '1',
  //     };

  //     this.service.GetTransactionSalesLedger(obj2).subscribe(
  //       (res: any) => {
  //         if (res.code === 200) {
  //           console.log(res.result, 'discountAmount');
  //         }
  //         this.loading = false;
  //       },
  //       (err) => {
  //         console.error('Error InsertTransactionSalesLedger', err);
  //         this.loading = false;
  //         this.toastr.error('Failed InsertTransactionSalesLedger');
  //       }
  //     );
  //   }

  //   // Sales Ledger
  //   if (+result?.grossAmt > 0) {
  //     let grossAmt = +result?.grossAmt ;
  //     const obj3 = {
  //       VoucherTypeID: 19,
  //       MasterID: masterID,
  //       LedgerId: Number($('#salesLedger').val()), // (kept same)
  //       DrAmt: 0,
  //       CrAmt: grossAmt,
  //       extra1: this.suffixPrefix,
  //       UserID: this.userId,
  //       extra2: '2',
  //       Flag: 1,
  //     };

  //     this.service.GetTransactionSalesLedger(obj3).subscribe(
  //       (res: any) => {
  //         if (res.code === 200) {
  //           console.log(res.result, 'GrossAmt');
  //         }
  //         this.loading = false;
  //       },
  //       (err) => {
  //         console.error('Error InsertTransactionSalesLedger', err);
  //         this.loading = false;
  //         this.toastr.error('Failed InsertTransactionSalesLedger');
  //       }
  //     );
  //   }
  // }

  async InsertTransactionSalesLedger(result: any) {
    this.loading = true;

    const masterID = this.getMasterID();
    const requests: Promise<any>[] = [];

    try {
      // VAT Ledger
      if (+result?.vatAmt > 0) {
        const obj1 = {
          VoucherTypeID: 19,
          CrAmt: +result.vatAmt,
          DrAmt: 0,
          LedgerId: 7,
          MasterID: masterID,
          UserID: this.userId,
          extra1: this.suffixPrefix,
        };

        requests.push(
          lastValueFrom(this.service.GetTransactionSalesLedger(obj1))
        );
      }

      // Discount Ledger
      if (+result?.itemDiscount > 0) {
        const obj2 = {
          VoucherTypeID: 19,
          MasterID: masterID,
          LedgerId: 3,
          DrAmt: +result?.itemDiscount, // this.discItem,
          CrAmt: 0,
          extra1: this.suffixPrefix,
          UserID: this.userId,
          extra2: '1',
        };

        requests.push(
          lastValueFrom(this.service.GetTransactionSalesLedger(obj2))
        );
      }

      // Sales Ledger
      if (+result?.grossAmt > 0) {
        const obj3 = {
          VoucherTypeID: 19,
          MasterID: masterID,
          LedgerId: Number($('#salesLedger').val()),
          DrAmt: 0,
          CrAmt: +result.grossAmt,
          extra1: this.suffixPrefix,
          UserID: this.userId,
          extra2: '2',
          Flag: 1,
        };

        requests.push(
          lastValueFrom(this.service.GetTransactionSalesLedger(obj3))
        );
      }

      // 🔥 WAIT FOR ALL INSERTS
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        if (res?.code === 200) {
          console.log('Inserted ledger', index + 1, res.result);
        }
      });
    } catch (error) {
      console.error('Ledger insert failed', error);
      this.toastr.error('Failed to insert sales ledger');
    } finally {
      this.loading = false;
    }
  }
  // private ledgerSubmitting = false;
  // async InsertTransactionSalesLedger(result: any) {
  //   if (this.ledgerSubmitting) return; // 🛑 stop double entry
  //   this.ledgerSubmitting = true;

  //   debugger;
  //   this.loading = true;

  //   const masterID = this.getMasterID();
  //   const requests: Promise<any>[] = [];

  //   try {
  //     // VAT Ledger
  //     if (+result?.vatAmt > 0) {
  //       const obj1 = {
  //         VoucherTypeID: 19,
  //         CrAmt: +result.vatAmt,
  //         DrAmt: 0,
  //         LedgerId: 7,
  //         MasterID: masterID,
  //         UserID: this.userId,
  //         extra1: this.suffixPrefix,
  //       };

  //       requests.push(
  //         lastValueFrom(this.service.GetTransactionSalesLedger(obj1))
  //       );
  //     }

  //     // Discount Ledger
  //     if (+result?.itemDiscount > 0) {
  //       const obj2 = {
  //         VoucherTypeID: 19,
  //         MasterID: masterID,
  //         LedgerId: 3,
  //         DrAmt: +result.itemDiscount,
  //         CrAmt: 0,
  //         extra1: this.suffixPrefix,
  //         UserID: this.userId,
  //       };

  //       requests.push(
  //         lastValueFrom(this.service.GetTransactionSalesLedger(obj2))
  //       );
  //     }

  //     // Sales Ledger
  //     if (+result?.grossAmt > 0) {
  //       const obj3 = {
  //         VoucherTypeID: 19,
  //         MasterID: masterID,
  //         LedgerId: Number($('#salesLedger').val()),
  //         DrAmt: 0,
  //         CrAmt: +result.grossAmt,
  //         extra1: this.suffixPrefix,
  //         UserID: this.userId,
  //         extra2: '2',
  //         Flag: 1,
  //       };

  //       requests.push(
  //         lastValueFrom(this.service.GetTransactionSalesLedger(obj3))
  //       );
  //     }

  //     // 🟡 Nothing to insert
  //     if (requests.length === 0) return;

  //     // 🔥 WAIT FOR ALL INSERTS
  //     const responses = await Promise.all(requests);

  //     responses.forEach((res, index) => {
  //       if (res?.code === 200) {
  //         console.log('Inserted ledger', index + 1, res.result);
  //       } else {
  //         throw new Error('Ledger insert failed');
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Ledger insert failed', error);
  //     this.toastr.error('Failed to insert sales ledger');
  //   } finally {
  //     this.loading = false;
  //     this.ledgerSubmitting = false; // 🔓 unlock
  //   }
  // }

  // fetchSalesMasterDraftOnly(MasterID: any) {
  //   this.service.getSalesMasterDraftOnly(MasterID).subscribe({
  //     next: (data: any) => {
  //       if (data.code == 200) {
  //         const storedBillSummary = JSON.parse(
  //           localStorage.getItem('billSummary') || '{}'
  //         );

  //         const lastMasterID = localStorage.getItem('lastMasterID');

  //         const newBillSummary = {
  //           GrossAmt: +data.result.grossAmt.toFixed(2),
  //           itemDiscount: +data.result.itemDiscount.toFixed(2),
  //           billDiscountAmt: +data.result.billDiscountAmt.toFixed(2),
  //           additionalIncomeAmt: +data.result.additionalIncomeAmt.toFixed(2),
  //           nonTaxableAmt: +data.result.nonTaxableAmt.toFixed(2),
  //           taxableAmt: +data.result.taxableAmt.toFixed(2),
  //           vatAmt: +data.result.vatAmt.toFixed(2),
  //           netBillAmt: +data.result.netBillAmt.toFixed(2),
  //         };

  //         // 🔥 SAME MASTER → replace
  //         if (lastMasterID == MasterID) {
  //           this.billSummary = newBillSummary;
  //         }
  //         // 🔥 NEW MASTER → add localStorage + API
  //         else {
  //           this.billSummary = {
  //             GrossAmt:
  //               (storedBillSummary.GrossAmt || 0) + newBillSummary.GrossAmt,
  //             itemDiscount:
  //               (storedBillSummary.itemDiscount || 0) +
  //               newBillSummary.itemDiscount,
  //             billDiscountAmt:
  //               (storedBillSummary.billDiscountAmt || 0) +
  //               newBillSummary.billDiscountAmt,
  //             additionalIncomeAmt:
  //               (storedBillSummary.additionalIncomeAmt || 0) +
  //               newBillSummary.additionalIncomeAmt,
  //             nonTaxableAmt:
  //               (storedBillSummary.nonTaxableAmt || 0) +
  //               newBillSummary.nonTaxableAmt,
  //             taxableAmt:
  //               (storedBillSummary.taxableAmt || 0) + newBillSummary.taxableAmt,
  //             vatAmt: (storedBillSummary.vatAmt || 0) + newBillSummary.vatAmt,
  //             netBillAmt:
  //               (storedBillSummary.netBillAmt || 0) + newBillSummary.netBillAmt,
  //           };
  //         }

  //         localStorage.setItem('billSummary', JSON.stringify(this.billSummary));
  //         localStorage.setItem('lastMasterID', MasterID);

  //         // this.InsertTransactionSalesLedger(data.result);
  //         this.InsertTransactionSalesLedger(newBillSummary);
  //       }
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to load product list');
  //     },
  //   });
  // }

  //=====================================================================
  ledgerName: any;
  drAmt: any;
  crAmt: any;

  FetchSalesTransactionCrDrList(masterID: any) {
    this.service.GetSalesTransactionCrDrList(masterID).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.salesTransactionList = data?.result;
          localStorage.setItem(
            'salesTransactionList',
            JSON.stringify(this.salesTransactionList)
          );
        }
      },
      error: () => {
        this.toastr.error('Failed to load ledger list');
      },
    });
  }

  // grossAmount: any;
  // calculateGrossAmount() {
  //   this.grossAmount = Number(this.rate) * Number(this.qty);
  // }

  // tableData: any[] = [];
  // sesessionId: string = localStorage.getItem('sessionId') || '';
  // userId: string = localStorage.getItem('userId') || '';
  // branch:string = localStorage.getItem('branch') || '';

  // fetchTableData() {
  //   this.loading = true;

  //   const obj = {
  //     dataFilterModel: {
  //       tblName: 'Customer',
  //       columnName: null,
  //       strName: '',
  //       underColumnName: null,
  //       underIntID: 0,
  //       filterColumnsString:
  //         '["ledgerName","accountGroupName","address","phone","pan","openingBalance"]',
  //       currentPageNumber: '1',
  //       pageRowCount: '25',
  //       StrlistNames: '',
  //     },
  //     mainInfoModel: {
  //       userId: '1',
  //       fiscalID: 2,
  //       branchDepartmentId: 0,
  //       branchId: this.branch,
  //       dbName: 'string',
  //       isEngOrNepaliDate: true,
  //       isMenuVerified: true,
  //       filterId: 0,
  //       refId: 0,
  //       mainId: 0,
  //       strId: 'string',
  //       startDate: '2025-07-17T00:00:00',
  //       fromDate: '2025-07-17T00:00:00',
  //       endDate: '2026-07-17T00:00:00',
  //       toDate: '2026-07-17T00:00:00',
  //       decimalPlace: '2',
  //       bookClose: 0,
  //       sessionId: this.sesessionId,
  //       id: 0,
  //       searchtext: '',
  //       cid: 0,
  //     },
  //     print: false,
  //   };

  //   this.service.GetFilterAnyDataPagination(obj).subscribe(
  //     (res: any) => {
  //       console.log(res, 'tableData');
  //       if (res.code == 200) {
  //         this.tableData = res.result;
  //       }
  //       this.loading = false;
  //     },
  //     (err) => {
  //       console.error('Error fetching Batch data:', err);
  //       this.loading = false;
  //       this.toastr.error('Failed to load Batch data');
  //     }
  //   );
  // }
  customerList: any[] = [];
  recieptMode: any;

  mode: any;

  selectMode() {
    $('#modeSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;

      if (selectedValue == '1') {
        this.mode = 9;
        this.fetchCustomerList(this.mode);
        this.recieptMode = 'Cash';
        this.IsCdisabled = true;
        this.service.customerDetailModel.creditPeriod = 0;
      }

      if (selectedValue == '0') {
        this.mode = 2;
        this.fetchCustomerList(this.mode);
        this.recieptMode = 'Credit';
        this.IsCdisabled = false;
        this.service.customerDetailModel.creditPeriod = 1;
      }

      // Mode अनुसार Customer list fetch गर्नुहोस्
    });
  }

  fetchCustomerList(mode: string) {
    this.loading = true;
    this.service.GetCustomersByMode(mode).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.customerList = data.result;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.toastr.error('Failed to load customer list');
        this.loading = false;
      },
    });
  }

  fullScreen() {
    const fullScreenBtn = document.querySelector('#fullScreen') as HTMLElement;

    fullScreenBtn.addEventListener('click', function (event) {
      const body = document.body;

      if (body.classList.contains('fullscreen-pos')) {
        body.classList.remove('fullscreen-pos');
      } else {
        body.classList.add('fullscreen-pos');
      }
    });
  }

  //

  isCashTransactionPop: boolean = false;
  cashTransactionAnimation: string = '';

  cashTransactionPop() {
    this.isCashTransactionPop = true;
    this.cashTransactionAnimation = 'modal-enter';
  }

  closeCashTransactionPop() {
    this.cashTransactionAnimation = 'modal-exit';
    this.isCashTransactionPop = false;
  }

  //print
  print() {
    const content = document.getElementById('printSection')?.innerHTML;

    const popup = window.open('', '_blank', 'width=800,height=600');

    if (popup) {
      popup.document.open();
      popup.document.write(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Printable Form</title>
  <style>
    @media print {
      .print-btn {
        display: none;
      }

    }

    /*reset css*/
    * {
      margin: 0;
      padding: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    html,
    body {
      height: 100%;
    }

    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      font-size: 13px;
    }

    .m-t-20 {
      margin-top: 20px;
    }

    .m-t-10 {
      margin-top: 10px;
    }

    .m-b-20 {
      margin-bottom: 20px;
    }

    .m-b-10 {
      margin-bottom: 10px;
    }


    .table1 tr td {
      vertical-align: top;
    }

    .bg-gray {
      background: #f2f2f2;
    }

    .print-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px;
      margin-bottom: 200px;
    }

    /*spacing*/
    .p-0 {
      padding: 0 !important;
    }

    .w-50 {
      width: 50%;
    }

    .w-33 {
      width: 33.33%;
    }

    /*layout*/

    .flex {
      display: flex;
    }

    .align-items-center {
      align-items: center;
    }

    .justify-between {
      justify-content: space-between;
    }


    .justify-center {
      justify-content: center;
    }



    .gap-20 {
      gap: 20px;
    }

    .gap-10 {
      gap: 10px;
    }

    .gap-8 {
      gap: 8px;
    }


    /*layout end*/

    /*text align*/
    .text-center {
      text-align: center !important;
    }

    .text-left {
      text-align: left !important;
    }

    .text-right {
      text-align: right !important;
    }

    /*table css here*/


    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      /* border: 1px solid #000; */
      padding: 4px;
      text-align: left;
    }


    th {
      background-color: #f2f2f2;
    }


    .text-right-table td,
    .text-right-table th {
      text-align: right;
    }


    .bg-none {
      background: none !important;
    }

    .border-top-0 td {
      border-top: none !important;
    }

    .border-bottom-0 td {
      border-bottom: none !important;
    }

    .border-left-0 td {
      border-left: none !important;
    }

    .border-right-0 td {
      border-right: none !important;
    }

    .border-last-right-0 td:last-child {
      border-right: none !important;
    }


    /*table css end here*/
    .border-line {
      border-bottom: 1px dotted #000;
    }

    .print-footer-middle {
      border: 1px solid #000;
      padding: 1rem;
    }

    .flex-1 {
      flex: 1;
    }

    .vertical-middle {
      vertical-align: middle !important;
    }

    .print-header {
      padding-bottom: 1rem;
      border-bottom: 1px solid #333;
    }

    .middle-content {
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .customer-copy {
      background: #f2f2f2;
      padding: 8px;
    }

    .invoice-number {
      font-size: 12px;
    }
      .p-content{
      border: 1px solid #ccc;
      padding: 8px;
      }
  </style>
</head>

<body>
  <div class="print-container">

    <div class="p-content flex justify-between align-items-center m-t-20">
      <div class="left-content">
        <div class="invoice-number flex gap-8 align-items-center">
          <span> <strong> Invoice No.:</strong></span>
          <span>DASR0004492</span>
        </div>
        <div class="time flex gap-8 align-items-center">
          <span> <strong>Time :</strong></span>
          <span>21:09:31 PM</span>
        </div>
        <div class="b-name flex gap-8 align-items-center m-t-10">
          <strong>Name:</strong>
          <span>Surendra Neupane</span>
        </div>
        <div class="b-add flex gap-8 align-items-center m-t-10">
          <strong>Add:</strong>
          <span></span>
        </div>
        <div class="b-pan flex gap-8 align-items-center m-t-10">
          <strong>Pan:</strong>
          <span></span>
        </div>
        <div class="prescribe-by">
          <strong>Prescribe By:</strong>
          <span>Dr.Lekh Jung Thapa</span>
        </div>
      </div>
      <div class="middle-content">
        Invoice
      </div>
      <div class="right-content">
        <div class="transaction-date ">
          <strong>Transaction Date:</strong>
          <span>2080/10/16</span>
        </div>
        <div class="transaction-date flex">
          <strong>Invoice Issue Date: </strong>
          <div>
            <span>2024/01/30</span> <br>
            <span>2080/10/16</span>
          </div>

        </div>
        <div class="billing-mode">
          <strong>Billing Mode:</strong>
          <span>General</span>
        </div>
        <div class="billing-mode m-t-10">
          <strong>Payment Mode:</strong>
          <span>Cash</span>
        </div>
      </div>

    </div>

    <table class="table1 m-t-20 text-right-table">
      <tbody>
        <tr>
          <th class="text-left">
            S.N.
          </th>
          <th class="text-left">Particular</th>
          <th>Batch</th>
          <th>Expiry</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td class="text-left">1</td>
          <td class="text-left">Maxgalin M 50</td>
          <td>005B</td>
          <td>Jun 25</td>
          <td>30</td>
          <td>14.24</td>
          <td>427.20</td>
        </tr>
        <tr>
          <td class="text-left">2</td>
          <td class="text-left">Vacl-m</td>
          <td>3201</td>
          <td>May 25</td>
          <td>30</td>
          <td>35.00</td>
          <td>1050.00</td>
        </tr>
        <tr style="border-top: 1px solid #999;">
          <td colspan="6" class="text-right">Total:</td>
          <td>1477.20</td>
        </tr>

        <tr>
          <td colspan="6" class="text-right">Discount:</td>
          <td>7.00</td>
        </tr>

        <tr>
          <td colspan="6" class="text-right">Rounding:</td>
          <td style="border-bottom: 1px  solid #999;">-0.20</td>
        </tr>

        <tr>
          <td colspan="6" class="text-right">Net Amount:</td>
          <td>1470.00</td>
        </tr>


      </tbody>

    </table>

    <div class="customer-copy">
      <p>Customer Copy</p>
      <p>In Words: <span>Rs. One Thousand Four Hundred Seventy Only.</span></p>
    </div>

    <div class="print-footer m-t-20 flex justify-between align-items-center">
      <div class="print-footer-left">
        <div class="note m-b-20">Note:</div>
        <div class="received-by">Received By:</div>
        <div class="printed-by">Printed By: <span>Supervisor</span></div>

      </div>

      <div class="print-footer-right text-center">
        <div class="users">User: Supervisor</div>

      </div>
    </div>


    <button class="print-btn" style="margin-top: 20px; text-align: right;" onclick="window.print()">Print</button>
  </div>
</body>

</html>
    `);
      popup.document.close();
    }
  }

  isreceivedLedger: boolean = false;
  receivedLedgerAnimation: string = '';

  receivedLedgerPopup() {
    this.isreceivedLedger = true;
    this.receivedLedgerAnimation = 'modal-enter';
  }

  closeReceivedLedgerPopup() {
    this.receivedLedgerAnimation = 'modal-exit';
    this.isreceivedLedger = false;
  }

  recievedLedgerList: any[] = [];

  RecievedLedger() {
    const branchID = this.branch;
    this.service.RecievedLedger(branchID).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.recievedLedgerList = data?.result;
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  originalNetBillAmt: number = 0; // API बाट आएको NetBill (86.52)
  NetBillAmt: number = 0; // input field मा देखिने value

  // netBill() {
  //   // user ले input मा टाइप गरेको value
  //   const receivedAmount = Number(this.NetBillAmt);

  //   const remaining = this.originalNetBillAmt - receivedAmount;

  //   // remaining amount input field मै देखाउने
  //   this.NetBillAmt = +remaining.toFixed(2);

  //   this.calculateAmount();
  // }

  // Bill Adj Amt calculate
  ledgerTableList: any[] = [];

  InsertSalesTransaction() {
    if (this.receivedLedgerValidation() == true) {
      this.loading = true;
      const billAmount = this.calculateAmount();
      const obj = {
        RecievedLedgerID: +$('#receivedLedger').val(),
        RecievedLedgerAmount: billAmount,
        MasterId: this.salesMasterID,
        Extra1: 1,
        userId: 1,
      };

      const selectedOption = $('#receivedLedger option:selected');
      const ledgerId = selectedOption.val();
      const ledgerText = selectedOption.text();

      this.service.InsertSalesTransactionDraft(obj).subscribe(
        (res: any) => {
          if (res.code == 200) {
            debugger;
            // this.ledgerTableList = res?.result;
            const alreadyExists = this.ledgerTableList.some(
              (item) => item.receivedLedgerId == ledgerId
            );

            if (!alreadyExists) {
              this.ledgerTableList.push({
                receivedLedgerId: ledgerId,
                receivedLedger: ledgerText,
                RecievedLedgerAmount: billAmount,
              });
            } else {
              this.toastr.error('This ledger is already added');
            }

            console.log(this.ledgerTableList, 'list');
            this.BillAdjustmentMaster();
            this.GetSalesTransaction();
            this.fetchTableSales(this.suffixPrefix);

            const masterID = this.getMasterID();
            this.fetchSalesMasterDraftOnly(masterID);
            this.FetchSalesTransactionCrDrList(masterID);
            // if (masterID) {
            //   this.fetchSalesMasterDraftOnly(masterID);
            //   setTimeout(() => {
            //     this.FetchSalesTransactionCrDrList(masterID);
            //   }, 1200);
            // }
            //  this.FetchSalesTransactionCrDrList(this.getMasterID());
            this.resetledgerTableList();
          }
          this.loading = false;
        },
        (err) => {
          console.error('Error fetching salesTransactionDraft data:', err);
          this.loading = false;
          this.toastr.error('Failed to load salesTransactionDraft data');
        }
      );
    }
  }

  resetledgerTableList() {
    setTimeout(() => {
      if ($('#receivedLedger').length) {
        const dropdown = document.getElementById(
          'receivedLedger'
        ) as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = ''; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
    }, 10);

    setTimeout(() => {
      this.NetBillAmt = this.calculateAmount();
    }, 10);
  }

  removeTableItem(ID: number) {
    this.ledgerTableList = this.ledgerTableList.filter(
      (item) => item.receivedLedgerId != ID
    );
    this.calculateAmount();
    this.billDiscountPercent = 0;
    this.billDiscountAmount = 0;
    this.billAdjustAmount = 0;
  }

  // ------------------------
  // When Bill Discount % changes
  // ------------------------

  billDiscountPercent: number = 0;
  billDiscountAmount: number = 0;

  billAmount: number = 0;
  billAdjustAmount: number = 0;

  billDiscountPercentChanged() {
    if (this.billDiscountPercent > 100) {
      this.toastr.error('percent should not be more than 100');
      return;
    }
    this.billDiscountAmount = parseFloat(
      ((this.NetBillAmt * this.billDiscountPercent) / 100).toFixed(2)
    );
    this.calculateAmount();
  }

  // ------------------------
  // When Bill Discount Amount changes
  // ------------------------
  billDiscountAmountChanged() {
    if (this.billDiscountAmount > this.NetBillAmt) {
      this.toastr.error('Bill Dis Amt should not be more than Net Amount');
      return;
    }
    this.billDiscountPercent = parseFloat(
      ((this.billDiscountAmount / this.NetBillAmt) * 100).toFixed(2)
    );
    this.calculateAmount();
  }

  calculateAmount() {
    this.billAmount = parseFloat(
      (this.originalNetBillAmt - this.billDiscountAmount).toFixed(2)
    );

    this.NetBillAmt = this.billAmount;

    return this.billAmount;
  }

  isUpdating = false;

  onNetBillChange(value: number) {
    // loop रोक्न
    if (this.isUpdating) return;

    this.isUpdating = true;

    const amountAfterDiscount = this.calculateAmount();
    console.log('Net Bill Changed:', value);

    // calculation
    this.NetBillAmt = amountAfterDiscount - value;

    this.isUpdating = false;
  }

  receivedLedgerValidation() {
    if ($('#receivedLedger').val() == '') {
      $('#receivedLedger').select2('open');
      this.toastr.error('Received Ledger is required');
      return false;
    } else if (this.NetBillAmt == 0) {
      $('#netBillAmtInput').focus();
      this.toastr.error('Amount is required');
      return false;
    }
    return true;
  }

  // Bill Adjustment =====================================================================

  calculateBillAdjustment() {
    let amount = this.calculateAmount();

    const decimalValue = Number('0.' + amount.toFixed(2).split('.')[1]);

    const finalDecimalValue =
      decimalValue >= 0.5 ? `+${decimalValue}` : `-${decimalValue}`;

    this.billAdjustAmount = +finalDecimalValue;
    return this.billAdjustAmount;
  }

  BillAdjustmentMaster() {
    const billAdjustValue = this.calculateBillAdjustment();
    this.loading = true;
    const obj = {
      MasterId: this.salesMasterID,
      billAdjAmt: billAdjustValue, //0.34,
      Extra1: this.suffixPrefix,
    };

    this.service.UpdateSalesBillAdjustmentMaster(obj).subscribe(
      (res: any) => {
        if (res.code == 200) {
        }
        this.loading = false;
      },
      (err) => {
        console.error(
          'Error fetching UpdateSalesBillAdjustmentMaster data:',
          err
        );
        this.loading = false;
        this.toastr.error(
          'Failed to load UpdateSalesBillAdjustmentMaster data'
        );
      }
    );
  }

  ledgerTransaction: any;

  GetSalesTransaction() {
    const masterID = this.salesMasterID;
    this.service.GetSalesTransactionList(masterID).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.ledgerTransaction = data?.result;
          console.log(this.ledgerTransaction, ' ledgerTransaction here');
        }
      },
      error: () => {
        this.toastr.error('Failed to load GetSalesTransactionList');
      },
    });
  }
}
