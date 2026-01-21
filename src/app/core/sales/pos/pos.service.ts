import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { posUrl } from './pos-endpoint';
import { customerDetailModel, UnitModel } from './pos.model';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  baseurl = environment.appURL;

  //use in html
  UnitModel: UnitModel = new UnitModel();
  customerDetailModel: customerDetailModel = new customerDetailModel();

  constructor(private http: HttpClient, private endPoint: posUrl) {}
  //================================================================================
  // GET request
  salesLedger() {
    const params = new HttpParams().set('flag', 1).set('branchId', 1001);
    return this.http.get(`${this.baseurl}${this.endPoint.SalesLedger}`, {
      params,
    });
  }
  //================================================================================

  GetCustomersByMode(mode: string) {
    const params = new HttpParams()
      .set('flag', mode) // existing parameter
      .set('branchId', '1001'); // existing parameter

    return this.http.get(`${this.baseurl}${this.endPoint.Customer}`, {
      params,
    });
  }

  //================================================================================

  GetAllProducts() {
    const params = new HttpParams()
      .set('flag', 1)
      .set('productcode', '')
      .set('branch', 1001);

    return this.http.get(`${this.baseurl}${this.endPoint.GetProductByCode}`, {
      params,
    });
  }

  GetProductDetail(selectedValue: any) {
    const params = new HttpParams()
      .set('flag', 2)
      .set('productcode', selectedValue)
      .set('branch', 1001);

    return this.http.get(`${this.baseurl}${this.endPoint.GetProductByCode}`, {
      params,
    });
  }

  //================================================================================

  GetUnits(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.GetUnits}`, data);
  }

  //================================================================================
  GetRate(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.GetRate}`, data);
  }
  //================================================================================

  GetFilterAnyDataPagination(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.GetFilterAnyDataPagination}`,
      data
    );
  }
  //================================================================================
  GetMissingUnit(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.GetMissingUnit}`,
      data
    );
  }

  //================================================================================
  AddSalesMasterDetails(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.AddSalesMasterDetails}`,
      data
    );
  }

  //================================================================================
  GetSuffixPrefix() {
    const params = new HttpParams()
      .set('vId', 1)
      .set('branchId', 1001)
      .set('fiscalId', 1);

    return this.http.get(`${this.baseurl}${this.endPoint.GetSuffixPrefix}`, {
      params,
    });
  }

  //================================================================================

  LoadSalesDetails(voucherNo: any) {
    const params = new HttpParams().set('voucherNo', voucherNo);

    return this.http.get(
      `${this.baseurl}${this.endPoint.LoadSalesMasterDetails}`,
      {
        params,
      }
    );
  }

  //================================================================================

  getCustomerbyId(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.CustomerbyId}`, data);
  }

  //================================================================================

  InsertSalesInfoDrafts(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.InsertSalesInfoDrafts}`,
      data
    );
  }

  //================================================================================
  getSalesMasterDraftOnly(salesMasterID: any) {
    const params = new HttpParams()
      .set('masterId', salesMasterID)
      .set('userId', 1)
      .set('branchId', 1001);

    return this.http.get(
      `${this.baseurl}${this.endPoint.LoadSalesMasterDraftOnly}`,
      {
        params,
      }
    );
  }

  //================================================================================
  GetTransactionSalesLedger(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.GetTransactionSalesLedger}`,
      data
    );
  }

  //================================================================================
  GetSalesTransactionCrDrList(masterID: any) {
    const params = new HttpParams().set('id', masterID);

    return this.http.get(
      `${this.baseurl}${this.endPoint.GetSalesTransactionCrDrList}`,
      {
        params,
      }
    );
  }
  //================================================================================

  DeleteSalesMasterDraftEntry(masterID: any) {
    const params = new HttpParams().set('id', masterID);

    return this.http.get(
      `${this.baseurl}${this.endPoint.DeleteSalesMasterDraftEntry}`,
      {
        params,
      }
    );
  }

  //================================================================================

  DeleteUpdate(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.SalesTransactionDetailsDeleteUpdate}`,
      data
    );
  }

  //================================================================================
  InsertSalesTransactionDraft(data: any) {
    const params = new HttpParams()
      .set('RecievedLedgerID', data.RecievedLedgerID)
      .set('RecievedLedgerAmount', data.RecievedLedgerAmount)
      .set('MasterId', data.MasterId)
      .set('Extra1', data.Extra1)
      .set('userId', data.userId);

    return this.http.post(
      `${this.baseurl}${this.endPoint.InsertSalesTransactionDraft}`,
      null, // no body
      { params }
    );
  }

  //================================================================================

  RecievedLedger(branchId: any) {
    const params = new HttpParams().set('masterId', branchId);

    return this.http.get(`${this.baseurl}${this.endPoint.RecievedLedger}`, {
      params,
    });
  }
  //================================================================================
  UpdateSalesBillAdjustmentMaster(data: any) {
    const params = new HttpParams()
      .set('MasterId', data.MasterId)
      .set('billAdjAmt', data.billAdjAmt)
      .set('extra1', data.Extra1)

    return this.http.post(
      `${this.baseurl}${this.endPoint.UpdateSalesBillAdjustmentMaster}`,
      null, // no body
      { params }
    );
  }

  //================================================================================

  GetSalesTransactionList(masterID: any) {
    const params = new HttpParams().set('id', masterID);
    return this.http.get(`${this.baseurl}${this.endPoint.GetSalesTransactionList}`, {
      params,
    });
  }

}
