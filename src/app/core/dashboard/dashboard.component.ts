import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements  OnInit {
  loading: boolean = false;

  userId = localStorage.getItem('userId') || '';
  branchId = localStorage.getItem('branch') || '';
  sessionId = localStorage.getItem('sessionId') || '';
  fiscal = JSON.parse(localStorage.getItem('fiscalYear') || '{}');
  globalVariable = JSON.parse(localStorage.getItem('globalVariable') || '[]');
  otherInfo = JSON.parse(localStorage.getItem('otherInfo') || '{}');
  user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  decimalplace = this.globalVariable[2].value;

  sales: any;
  purchase: any;
  bank: any;
  cashInHand: any;
  salesSymbol: any;
  purchaseSymbol: any;
  bankSymbol: any;
  cashInHandSymbol: any;

  nrsSale: any;
  nrsPurchase: any;
  nrsBank: any;
  nrsCashInHand: any;

  constructor(
    private service: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getDashboardData();
    this.GetTransaction();
  }
  getDashboardData() {
    this.loading = true;
    const objData = {
      userId: this.userId,
      fiscalID: this.fiscal.financialYearId,
      branchDepartmentId: 0,
      branchId: this.branchId,
      dbName: 'string',
      isEngOrNepaliDate: this.otherInfo.isEngOrNepali,
      isMenuVerified: true,
      filterId: 0,
      refId: 0,
      mainId: 0,
      strId: '0',
      startDate: this.fiscal.fromDate,
      fromDate: this.fiscal.fromDate,
      endDate: this.fiscal.toDate,
      toDate: this.fiscal.toDate,
      decimalPlace: this.globalVariable[2].value,
      bookClose: 0,
      sessionId: this.sessionId,
      id: 0,
      searchtext: '',
      cid: 0,
    };

    this.service.getDashboardData(objData).subscribe({
      next: (data: any) => {
        
        if (data && data.length > 0) {
            this.loading = false;
          this.sales = data[0].Balance;
          this.purchase = data[1].Balance;
          this.bank = data[3].Balance;
          this.cashInHand = data[2].Balance;

          this.salesSymbol = data[0].BalanceType;
          this.purchaseSymbol = data[1].BalanceType;
          this.bankSymbol = data[3].BalanceType;
          this.cashInHandSymbol = data[2].BalanceType;

          this.nrsSale = `NRS: ${
            this.sales > 0
              ? this.sales.toFixed(this.decimalplace)
              : Math.abs(this.sales.toFixed(this.decimalplace))
          } ${this.salesSymbol}`;

          this.nrsPurchase = `NRS: ${
            this.purchase > 0
              ? this.purchase.toFixed(this.decimalplace)
              : Math.abs(this.purchase.toFixed(this.decimalplace))
          } ${this.purchaseSymbol}`;

          this.nrsBank = `NRS: ${
            this.bank > 0
              ? this.bank.toFixed(this.decimalplace)
              : Math.abs(this.bank.toFixed(this.decimalplace))
          } ${this.bankSymbol}`;

          this.nrsCashInHand = `NRS: ${
            this.cashInHand > 0
              ? this.cashInHand.toFixed(this.decimalplace)
              : Math.abs(this.cashInHand.toFixed(this.decimalplace))
          } ${this.cashInHandSymbol}`;
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.toastr.error('Failed to load dashboard data');
          this.loading = false;
      },
    });
  }

  purchaseList: any = '';
  salesList: any = '';
  paymentList: any = '';

  //GetTransaction************************************************************
  tab = 'sales';

  GetTransaction() {
    this.loading = true;
    const transactionObj = {
      tableName: 'Transactions',
      parameter: {
        flag: '1',
      },
    };

    this.service.GetTransaction(transactionObj).subscribe(
      (res: any) => {
        const transactionData = res.data;
        if (res.succeeded == true) {
          debugger
          const newPurchaseArry = transactionData.filter((item: any) => {
            return item.TransactionType == 'Purchase';
          });
          const newSalesArry = transactionData.filter((item: any) => {
            return item.TransactionType == 'Sales';
          });

          const newPaymentArry = transactionData.filter((item: any) => {
            return item.TransactionType == 'Payments';
          });


          this.purchaseList = newPurchaseArry;
          this.salesList = newSalesArry;
          this.paymentList = newPaymentArry;
          this.loading = false;

          console.log(this.paymentList);
        }
      },
      (err) => {
        console.error('Error fetching transaction data:', err);
        this.loading = false;

        this.toastr.error('Failed to load transaction data');
      }
    );
  }
}
