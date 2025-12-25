import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;

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
  constructor(
    private el: ElementRef,
    public service: PosService,
    private toastr: ToastrService,

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
    // this.fetchTableData();
    this.enterFun();
    setTimeout(() => {
      $(this.el.nativeElement).find('select').select2();
    }, 10);
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
  productCode: any[] = [];
  vat: any;
  rateDetails: any[] = [];
  unit: any;
  batch: any[] = [];
  skuunit: any[] = [];
rate:any;
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
    });
  }

  //=====================================================================
  fetchProductDetail(selectedValue: any) {
    this.service.GetProductDetail(selectedValue).subscribe({
      next: (data: any) => {
        // console.log(data, ' data');
        if (data.code == 200) {
          console.log(data.result, ' data aayo');
          this.batch = data?.result;
          this.productCode = data?.result[0]?.productCode;
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
          this.productList = data.result;
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
    $('#selecUnit').on('change', (event: any) => {
      const selectedValue = event.target.value;
      const selectedObject = this.unit?.find(
        (p: any) => p?.fromUnitId == selectedValue
      );

      console.log(selectedObject, 'unit');

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
      productCode: $('#productCode').val(),
      productId: $('#productSelect').val(),
      unit: $('#selecUnit').val(),
    };
    this.service.GetRate(obj).subscribe(
      (res: any) => {
        // const transactionData = res.data;
        debugger;
        // if (res.code == 200) {
        console.log(res.result, 'rate data');
        this.rateDetails = res.result;
        if (this.rateDetails.length) {
          this.service.UnitModel.rate = this.rateDetails[0]?.salesRate;
          this.rate=this.rateDetails[0]?.salesRate;
          
        }
        // }
        // this.loading = false;
      },
      (err) => {
        console.error('Error fetching Batch data:', err);
        this.loading = false;

        this.toastr.error('Failed to load Batch data');
      }
    );
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
      if (selectedValue == 'cash') {
        this.mode = 9;
        this.fetchCustomerList(this.mode);
      }

      if (selectedValue == 'credit') {
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
