import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SupplyReportService } from './service/supply-report.service';
import { ToastrService } from 'ngx-toastr';
import { AppearanceAnimation, ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';

declare const nepaliDatePicker: any;
declare const englishDatePicker: any;
declare var $: any;
@Component({
  selector: 'app-supply-report',
  templateUrl: './supply-report.component.html'
})
export class SupplyReportComponent implements OnInit, AfterViewInit {
  isFormVisible: boolean = true;
  isDatePickerVisible: boolean = true;
  isDateFormat: boolean = false;
  supplyDetailsPopup: boolean = false;
  isVerified: boolean = false;
  isDeleted: boolean = false;


  fromDate: any;
  toDate: any;
  userId: number = 0;
  fiscalId: number = 0;
  branchId: number = 0;
  locationId: number = 0;
  status: number = 0;

  locationList: any;
  supplyList: any;
  supplyDetailsList: any;


  demandId: number = 0;
  masterId: number = 0;
  voucherNo: any = '';
  modalAnimationClass = '';
  toLocationName: string = '';

  //pagination variable
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  searchData: any = "";

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  constructor(
    private titleService: Title,
    private service: SupplyReportService,
    private el: ElementRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const fiscalYear = localStorage.getItem('fiscalYear') || '';
    const fy = JSON.parse(fiscalYear);
    this.fromDate = fy?.fromDate.split('T')[0];
    this.toDate = fy?.toDate.split('T')[0];
    this.fiscalId = fy?.financialYearId;
    this.branchId = localStorage.getItem('branch') ? Number(localStorage.getItem('branch')) : 0;
    this.userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 0;

    const globalVariableStr = localStorage.getItem('globalVariable') || ''

    if (globalVariableStr) {
      const globalVariable = JSON.parse(globalVariableStr);
      this.isDatePickerVisible = globalVariable[1]?.value === "1";
    }

    this.titleService.setTitle("Supply Report");

  }
  @ViewChild('btnSearchSupply') btnSearchSupply!: ElementRef;

  ngAfterViewInit(): void {
    const self = this;
    $(this.el.nativeElement).find('select').select2();
    this.initilizedDate();
    //this.getSupplyList();

    $('#locationId').on('select2:close', function (e: any) {
      self.locationId = e.target.value;
      $('#status')?.focus();
    });

    $('#status').on('select2:close', function (e: any) {
      self.status = e.target.value;
      $('#btnSearchSupply')?.focus();
    });

    setTimeout(() => {
      this.btnSearchSupply.nativeElement.focus();
    }, 0);

  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.initilizedDate();
  }

  initilizedDate() {
    this.getLocationList();
    this.getLocationList.length > 0 ? $("#locationId").val(0).trigger('change') : "";

    if (this.isDatePickerVisible) {
      setTimeout(() => englishDatePicker('engFromDate', 'hiddenFromDate', "engToDate", 1), 0);
      setTimeout(() => englishDatePicker('engToDate', 'hiddenToDate', "locationId", 0), 0);
    } else {
      setTimeout(() => nepaliDatePicker('nepFromtDate', 'hiddenFromDate', "nepaliToDate", 1), 0);
      setTimeout(() => nepaliDatePicker('nepaliToDate', 'hiddenToDate', "locationId", 0), 0);
    }
  }

  getLocationList() {
    try {
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'getStockLocationList',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          branchId: String(this.branchId),
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.locationList = res.data;
        } else {
          this.locationList = [];
        }
      });

    } catch (error) {
      console.error('Error fetching location list:', error);
    }
  }
  //Get Supply List
  getSupplyList() {
    try {
      const fromDateValue = (document.getElementById('hiddenFromDate') as HTMLInputElement).value;
      const toDateValue = (document.getElementById('hiddenToDate') as HTMLInputElement).value;

      // Convert to Date objects
      const fromDate = new Date(fromDateValue);
      const toDate = new Date(toDateValue);

      if (fromDate > toDate) {
        this.toastr.error('From Date cannot be greater than To Date');
        return;
      }

      const locationIdValue = (document.getElementById('locationId') as HTMLInputElement).value;
      const statusValue = (document.getElementById('status') as HTMLInputElement).value;
      const searchSupplyData = (document.getElementById('searchSupplyData') as HTMLInputElement).value;
      this.searchData = searchSupplyData ? searchSupplyData : this.searchData;

      this.locationId = locationIdValue ? Number(locationIdValue) : this.locationId;
      this.status = statusValue ? Number(statusValue) : this.status;
      this.fromDate = fromDateValue ? fromDateValue : this.fromDate;
      this.toDate = toDateValue ? toDateValue : this.toDate;

      //console.log('From Date:', this.fromDate, 'To Date:', this.toDate, 'Location ID:', this.locationId, 'Status:', this.status);
      const payload = {
        userId: this.userId,
        branchId: this.branchId,
        fiscalId: this.fiscalId,
        fromDate: this.fromDate,
        toDate: this.toDate,
        locationId: this.locationId,
        status: this.status,
        pageIndex: this.pageIndex == 0 ? 1 : this.pageIndex + 1,
        pageSize: this.pageSize,
        searchData: this.searchData,
        flag: "supplyReport"
      };

      this.service.getSupplyList(payload).subscribe((res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.supplyList = res.data;
          const pagiData = JSON.parse(res.paginationData);
          this.length = pagiData.totalItems;
        } else {
          this.supplyList = [];
          this.length = 0;
        }
      });
    } catch (error) { console.error('Error fetching supply list:', error); }
  }

  handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getSupplyList();
  }

  onSearchData(e: any) {
    this.searchData = e.target.value;
    this.getSupplyList();
  }

  openSupplyDetailsModel(item: any) {
    try {
      if (!item) return;

      this.supplyDetailsPopup = true;
      this.modalAnimationClass = 'modal-enter';
      this.toLocationName = item.toLocationName;
      this.demandId = item.demandMasterId;
      this.masterId = item.supplyId;
      this.voucherNo = item.voucherNo;
      this.getSupplyDetails();

    } catch (err) {
      console.error('Error opening supply details modal:', err);
    }
  }

  getSupplyDetails() {
    try {
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'getSupplyDetails',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          branchId: String(this.branchId),
          masterId: String(this.masterId ?? ''),
          demandId: String(this.demandId ?? ''),
          voucherNo: String(this.voucherNo ?? ''),
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {

        if (res && res.data && res.data.length > 0) {
          this.supplyDetailsList = res.data;
        } else {
          this.supplyDetailsList = [];
        }
      });
    } catch (err) { }
  }

  closeSupplyDetailsPopup() {
    this.modalAnimationClass = 'modal-exit';
    this.supplyDetailsPopup = false;
    this.getSupplyList();
  }

  //Open Supply Delete Confirm Box
  deleteSupplyConfirmBox(item: any) {
    try {
      if (!item) return;
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('Are you sure?');
      confirmBox.setMessage('Confirm to Delete !');
      confirmBox.setButtonLabels('YES', 'NO');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER,
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT,
      });

      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.deleteSupplyById(item);
        }
      });
      setTimeout(() => {

        $('.ed-btn-danger').focus()

        $('.ed-btn-danger').on('keydown', (e: any) => {
          if (e.key === 'ArrowRight') {
            $('.ed-btn-secondary').focus()
          }
        })

        $('.ed-btn-secondary').on('keydown', (e: any) => {
          if (e.key === 'ArrowLeft') {
            $('.ed-btn-danger').focus()
          }
        })
      }, 0)

    } catch (error) {
      console.error('Error showing delete confirmation box:', error);
    }
  }

  //Delete supply by Id
  deleteSupplyById(data: any) {
    try {
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'deleteSupply',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          branchId: String(this.branchId),
          masterId: String(data.supplyId ?? ''),
          demandId: String(data.demandMasterId ?? ''),
          voucherNo: String(data.voucherNo ?? ''),
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {

        if (res && res.data && res.data.length > 0) {
          const responseMessage = res.data[0];

          if (responseMessage.status == 200) {
            this.getSupplyList();
            this.toastr.success(responseMessage.message || 'Supply deleted successfully');

          } else {
            this.toastr.error(responseMessage.message || 'Failed to delete supply');
          }
        } else {
          this.toastr.error('Failed to delete supply');
        }
      });
    } catch (error) {
      console.error('Error deleting supply:', error);
      this.toastr.error('An error occurred while deleting the supply');
    }
  }

  //Open Supply Delete Confirm Box
  deleteSupplyDetailsConfirmBox(item: any) {
    try {
      if (!item) return;
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('Are you sure?');
      confirmBox.setMessage('Confirm to Delete !');
      confirmBox.setButtonLabels('YES', 'NO');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER,
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT,
      });

      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.deleteSupplyDetailsById(item);
        }
      });
      setTimeout(() => {

        $('.ed-btn-danger').focus()

        $('.ed-btn-danger').on('keydown', (e: any) => {
          if (e.key === 'ArrowRight') {
            $('.ed-btn-secondary').focus()
          }
        })

        $('.ed-btn-secondary').on('keydown', (e: any) => {
          if (e.key === 'ArrowLeft') {
            $('.ed-btn-danger').focus()
          }
        })
      }, 0)

    } catch (error) {
      console.error('Error showing delete confirmation box:', error);
    }
  }


  //Delete supply Details by Id
  deleteSupplyDetailsById(data: any) {
    try {
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'deleteSupplyDetailsFromVerified',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          branchId: String(this.branchId),
          masterId: String(data.supplyMasterId ?? ''),
          supplyDetailsId: String(data.supplyDetailsId ?? ''),
          voucherNo: String(data.voucherNo ?? ''),
          productId: String(data.productId ?? ''),
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {

        if (res && res.data && res.data.length > 0) {
          const responseMessage = res.data[0];

          if (responseMessage.status == 200) {
            this.getSupplyDetails();
            this.toastr.success(responseMessage.message || 'Supply Details deleted successfully');

          } else {
            this.toastr.error(responseMessage.message || 'Failed to delete supply details');
          }
        } else {
          this.toastr.error('Failed to delete supply details');
        }
      });
    } catch (error) {
      console.error('Error deleting supply details:', error);
      this.toastr.error('An error occurred while deleting the supply details');
    }
  }



  //Open Supply Verify Confirm Box
  verifySupplyConfirmBox(item: any) {
    try {
      if (!item) return;
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('Are you sure?');
      confirmBox.setMessage('Confirm to Verify !');
      confirmBox.setButtonLabels('YES', 'NO');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.SUCCESS,
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT,
      });

      confirmBox.openConfirmBox$().subscribe(resp => {
        // do some action after user click on a button
        if (resp.success === true && resp.clickedButtonID === 'yes') {
          this.verifySupplyDetails(item);
        }
      });
      setTimeout(() => {

        $('.ed-btn-success').focus()

        $('.ed-btn-success').on('keydown', (e: any) => {
          if (e.key === 'ArrowRight') {
            $('.ed-btn-secondary').focus()
          }
        })

        $('.ed-btn-secondary').on('keydown', (e: any) => {
          if (e.key === 'ArrowLeft') {
            $('.ed-btn-success').focus()
          }
        })
      }, 0)

    } catch (error) {
      console.error('Error showing delete confirmation box:', error);
    }
  }

  //Verify supply Details
  verifySupplyDetails(data: any) {
    try {
      const payload = {
        tableName: 'Supply',
        parameter: {
          Flag: 'verifySupplyDetails',
          UserId: String(this.userId ?? ''),
          FiscalId: String(this.fiscalId ?? ''),
          branchId: String(this.branchId),
          masterId: String(data.supplyMasterId ?? ''),
          supplyDetailsId: String(data.supplyDetailsId ?? ''),
          voucherNo: String(data.voucherNo ?? ''),
          productId: String(data.productId ?? ''),
        }
      };

      this.service.getGenericServices(payload).subscribe((res: any) => {
        if (res && res.data && res.data.length > 0) {
          const responseMessage = res.data[0];

          if (responseMessage.status == 200) {
            this.getSupplyDetails();
            this.toastr.success(responseMessage.message || 'Verified successfully.');

          } else {
            this.toastr.error(responseMessage.message || 'Failed to Verified supply details.');
          }
        } else {
          this.toastr.error('Failed to Verified supply details.');
        }
      });
    } catch (error) {
      console.error('Error verifying supply details:', error);
      this.toastr.error('An error occurred while verifying the supply details');
    }
  }

}
