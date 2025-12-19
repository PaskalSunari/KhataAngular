import {
  AfterViewInit,
  Component,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
declare const AD2BS: any;
declare const BS2AD: any;
declare const oninitial: any;
declare const CurrentBSDate: any;
import 'select2';
import { PosService } from './pos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
})
export class PosComponent implements AfterViewInit {
  loading: boolean = false;
  tab = 'main';
  fiscalYear = JSON.parse(localStorage.getItem('fiscalYear') || '');

  constructor(
    private el: ElementRef,
    public service: PosService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    // keyboard listener
    window.addEventListener('keydown', (event) => this.handleKey(event));
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
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);

    Promise.resolve().then(() => {
      const stored = JSON.parse(localStorage.getItem('salesInfo') || '[]');
      this.salesDetails = Array.isArray(stored) ? stored : [];
    });
  }
  //=====================================================================
  // Enter functon
  enterFun() {
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
      setTimeout(() => {
        if ($('#rate').length) {
          const dropdown = document.getElementById(
            'rate'
          ) as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = ''; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);
    });
  }

  fetchUnits(batchObj: any) {
    this.loading = true;
    const obj = {
      batch: batchObj?.batch,
      branch: '1001',
      flag: 9,
      productCode: batchObj?.productCode,
      productId: batchObj?.productId?.toString(),
    };
    this.service.GetUnits(obj).subscribe(
      (res: any) => {
        // const transactionData = res.data;
        if (res.code == 200) {
          debugger;
          this.unit = res?.result;
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching Batch data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Batch data');
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
      branch: '1001',
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
        console.error('Error fetching Batch data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Batch data');
      }
    );
  }
  //=====================================================================

  fetchRate() {
    this.loading = true;

    const obj = {
      batch: $('#batchSelect').val(),
      branch: '1001',
      flag: 5,
      productCode: this.productCode,
      productId: $('#productSelect').val(),
      unit: $('#selecUnit').val(),
    };
    this.service.GetRate(obj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.rateDetails = res?.result;
          this.skuunit = res?.result[0]?.skuunit;
          if (this.rateDetails.length) {
            this.rate = this.rateDetails[0]?.salesRate;
          }
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching Batch data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Batch data');
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
  }

  closecustomerPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.IscustomerPopup = false;
  }

  //=====================================================================
  suffixPrefix: any;
  fetchSuffixPrefix() {
    this.service.GetSuffixPrefix().subscribe({
      next: (data: any) => {
        this.suffixPrefix = data;
      },
      error: () => {
        this.toastr.error('Failed to load product list');
      },
    });
  }

  //=====================================================================
  salesDetails: any[] = [];

  validation() {
    // const selectedText = $('#productSelect option:selected').text().trim();
    if ($('#salesLedger option:selected').text() == '') {
      $('#salesLedger').select2('open');
      this.toastr.error('salesLedger is required');
      return false;
    }
     else if ($('#modeSelect option:selected').text() == '') {
      $('#modeSelect').select2('open');
      this.toastr.error('modeSelect is required');
      return false;
    } 
    else if (
      this.productCode == '' ||
      this.productCode == undefined ||
      this.productCode == null
    ) {
      // $('#productSelect').select2('open');
      this.toastr.error('productCode is required');
      return false;
    }

    return true;
  }

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
    const obj = {
      SalesMasterID: 0,
      VoucherDate: new Date().toISOString(),
      VoucherNo: this.suffixPrefix,
      InvoiceNo: 0,
      ManualRefNo: '0',
      VouchertypeID: 19,

      TransactionMode: $('#modeSelect').val(),
      FinancialYearID: Number(this.fiscalYear.financialYearId),
      BranchID: '1001',

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
      NonTaxableAmt: 0,
      VATAmt: vatAmount,
      NetBillAmt: netTotal,

      IsExport: false,
      Narration: '0',
      Status: true,
      UserID: '1',

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
      ExpiryDate: null,

      Rate: this.rate,
      TransactionUnitID: 2,
      SKU: this.skuunit,
      ProductUnitID: 0,

      ItemDiscountPercent: this.discountPercent,
      ItemDiscountAmt: discountAmt,
      NetAmt: netAmt,

      TransactionUnitCost: transactionUnitCost,
      SKUUnitCost: skuUnitCost,

      Stockqty: this.qtyNum,
      locationId: 0,
      Vat: Number(this.vat),

      unit: $('#selecUnit option:selected').text(),

      productName: $('#productSelect option:selected').text(),
      batchName: $('#batchSelect').val(),
    };

    // check if already exists

    if (this.validation() == true) {
      const exists = this.salesDetails.some(
        (item) => item.ProductID == obj.ProductID
      );

      if (!exists) {
        this.salesDetails.push(obj);
        localStorage.setItem('salesInfo', JSON.stringify(this.salesDetails));
      } else {
        this.toastr.warning('This product is already added!');
      }
    }

    // this.service.AddSalesMasterDetails(obj).subscribe(
    //   (res: any) => {
    //     if (res.code == 200) {

    //      this.fetchTableSales(this.suffixPrefix)
    //       this.rateDetails = res.result;
    //     }
    //     this.loading = false;
    //   },
    //   (err) => {
    //     console.error('Error fetching Batch data:', err);
    //     this.loading = false;

    //     this.toastr.error('Failed to load Batch data');
    //   }
    // );
  }

  deleteItem(Item: any) {
    this.salesDetails = this.salesDetails.filter((item) => {
      return item != Item;
    });

    // Update localStorage after delete
    localStorage.setItem('salesInfo', JSON.stringify(this.salesDetails));

    this.toastr.success('Item removed');
  }

  tableList: any[] = [];

  //=====================================================================
  fetchTableSales(VoucherNo: any) {
    this.service.LoadSalesDetails(VoucherNo).subscribe({
      next: (data: any) => {
        if (data.code == 200) {
          this.tableList = data?.result;
        }
      },
      error: () => {
        this.toastr.error('Failed to load product list');
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
  mode: any;
  selectMode() {
    $('#modeSelect').on('change', (event: any) => {
      const selectedValue = event.target.value;
      if (selectedValue == '1') {
        this.mode = 9;
        this.fetchCustomerList(this.mode);
      }

      if (selectedValue == '0') {
        this.mode = 2;
        this.fetchCustomerList(this.mode);
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
}
