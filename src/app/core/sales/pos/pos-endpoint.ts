import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class posUrl {
  SalesLedger: string = 'Inventory/Sales/SalesLedger';
  Customer: string = 'Inventory/Sales/Customer';
  GetProductByCode: string = 'Inventory/Sales/GetProductByCode';
  GetUnits: string = 'Inventory/Sales/GetUnitByBatch';
  GetRate: string = 'Inventory/Sales/GetRateByUnitbatch';
  GetMissingUnit: string = 'Inventory/Sales/GetMissingUnitConversionFact';

  GetFilterAnyDataPagination: string =
    'Account/MyFunction/GetFilterAnyDataPagination';

  AddSalesMasterDetails: string = 'Inventory/Sales/AddSalesMasterDetails';
  GetSuffixPrefix: string = 'Inventory/Sales/GetSuffixPrefix';

  LoadSalesMasterDetails: string = 'Inventory/Sales/LoadSalesMasterDetails';

  CustomerbyId: string = 'Inventory/Sales/CustomerbyId';
  InsertSalesInfoDrafts: string = 'Inventory/Sales/InsertSalesInfoDrafts';

  LoadSalesMasterDraftOnly: string = 'Inventory/Sales/LoadSalesMasterDraftOnly';
  GetSalesTransactionCrDrList: string = 'Inventory/Sales/GetSalesTransactionCrDrList';

  GetTransactionSalesLedger: string = 'Inventory/Sales/AddTransactionSalesLedger';
  DeleteSalesMasterDraftEntry: string = 'Inventory/Sales/DeleteSalesMasterDraftEntry';


  SalesTransactionDetailsDeleteUpdate: string = 'Inventory/Sales/SalesTransactionDetailsDeleteUpdate';
  InsertSalesTransactionDraft: string = 'Inventory/Sales/InsertSalesTransactionDraft';

  RecievedLedger: string = 'Inventory/Sales/RecievedLedger';



}

// https://api.khatasystem.com/api/Inventory/Sales/SalesTransactionDetailsDeleteUpdate

// https://api.khatasystem.com/api/Inventory/Sales/GetLastDraftByUser?userId=1&branchId=1001&yearId=1

//https://api.khatasystem.com/api/Inventory/Sales/AddAllMasterTable


//https://api.khatasystem.com/api/Inventory/Sales/InsertSalesTransactionDraft?RecievedLedgerID=50&RecievedLedgerAmount=97&MasterId=615&Extra1=1&userId=1
//https://api.khatasystem.com/api/Inventory/Sales/RecievedLedger?branchId=1001