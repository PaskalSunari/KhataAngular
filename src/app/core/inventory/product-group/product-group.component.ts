import { AfterViewInit, Component, ElementRef } from '@angular/core';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';
import { ToastrService } from 'ngx-toastr';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';

import { ProductGroupService } from './service/product-group.service';
@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html'
})
export class ProductGroupComponent implements AfterViewInit {
   isSubmitGroup:boolean=true
   showForm = true;
productGroupUnderList:any;
productGroupUnderFilterList:any;
productGroupFilterList:any;

productGroupGridList:any;
productGroupGridDetails:any;
productGroupModel:any;
deleteData:boolean=true
productGroupDataByID:any;
  toggleForm() {
    this.showForm = !this.showForm;
  }

globalVariablePG:any;
baseUrlPG:any = '';
 userIdPG:any = ''
 branchIdPG:any = ''
sessionIdPG:any = ''
fiscalPG:any = ''
otherInfoPG:any = ''
userPG:any = '';
submitButton:any='Save'


//pagination variable
 length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

 constructor(private el: ElementRef, public service: ProductGroupService, private toastr: ToastrService,) {}
  ngAfterViewInit(): void {
     $('#groupName').focus();
     this.globalVariablePG = JSON.parse(localStorage.getItem("globalVariable")||'');
     this.baseUrlPG = localStorage.getItem("baseUrl")
     this.userIdPG = localStorage.getItem("userId");

    this.branchIdPG = localStorage.getItem("branch");
    this.sessionIdPG = localStorage.getItem("sessionId");
    this.fiscalPG = JSON.parse(localStorage.getItem("fiscalYear")||'');
   
    this.otherInfoPG = JSON.parse(localStorage.getItem("otherInfo")||'');
    this.userPG = JSON.parse(localStorage.getItem("userInfo")||'');
     this.getProductUnderDropdownList()
    //  this. getProductGroupGridList()
     this.getProductGroupFilteredList()
this.enterFun();
    $(this.el.nativeElement).find('select').select2();
let self=this
  $('#filterByGroupName').on('change', function (event: any) {
    if(event.target.value){
 self.getProductGroupFilteredList()
    }
     })

      $('#filterByGroupUnder').on('change', function (event: any) {
    if(event.target.value){
 self.getProductGroupFilteredList()
    }
     })
  }
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



//Get product under dropdownlist
    getProductUnderDropdownList() {
    let Model = {
    "mainInfoModel": {
        "userId": this.userIdPG,
        "fiscalID":this.fiscalPG.financialYearId,
        "branchDepartmentId": 1001,
        "branchId": this.branchIdPG,
        "dbName": "",
        "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
        "isMenuVerified": true,
        "filterId": 0,
        "refId": 0,
        "mainId": 0,
        "strId": "",
        "startDate": this.fiscalPG.fromDate,
        "fromDate": this.fiscalPG.fromDate,
        "endDate": this.fiscalPG.toDate,
        "toDate": this.fiscalPG.toDate,
        "decimalPlace": this.globalVariablePG[2].value,
        "bookClose": 0,
        "sessionId": this.sessionIdPG,
        "id": 0,
        "searchtext": "",
        "cid": 0
    },
    "refName": "ProductGroup",
    "listNameId": "[\"productUnderGroup\",\"productGroupSearch\",\"productUnderGroupSearch\"]",
    "conditionalvalues": "",
    "isSingleList": "false",
    "singleListNameStr": ""
      
    };

    this.service.getGroupUnderDropdownList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'product under data');
        if (result) {
           this.productGroupUnderList=result[0]
           this.productGroupFilterList=result[1]
             this.productGroupUnderFilterList=result[2]
          //  console.log(this.productGroupUnderList,"productGroupunder");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }




  //Get product group list
    getProductGroupGridList() {
    let Model = {
     "userId": this.userIdPG,
  "fiscalID": this.fiscalPG.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPG,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPG.fromDate,
  "fromDate": this.fiscalPG.fromDate,
  "endDate": this.fiscalPG.toDate,
  "toDate": this.fiscalPG.toDate,
  "decimalPlace": this.globalVariablePG[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPG,
  "id": 0,
  "searchtext": "",
  "cid": 0
    };




    this.service.getProductGroupList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'product group data list');
        if (result) {
           this.productGroupGridList=result?.details
          
          //  console.log(this.productGroupGridList,"productGroupgridlist");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

  validation() {
  
  if (this.productGroupModel.productgroup.groupName == null ||  this.productGroupModel.productgroup.groupName == "") {
    $('#groupName').focus();
    this.toastr.error("Group Name is required");
    return false
  }

 else if ( $('#groupUnder').val() == null ||  $('#groupUnder').val() == "") {
    $('#groupUnder').focus();
    this.toastr.error("Group Under is required");
    return false
  }
  return true
}


  //post data of product Group form
    onSubmitProductGroup() {

      this.productGroupModel = {  

        "productgroup": {
    "groupID": this.service.productGroupModel.groupID,
    "groupName": this.service.productGroupModel.groupName?.replace(/\s+/g, ' ').trim(), //$("#groupName").val()?.replace(/\s+/g, ' ').trim(),
    "parentID":$("#groupUnder").val(),
    "remarks": this.service.productGroupModel.remarks, //$("#groupRemarks").val()?.replace(/\s+/g, ' ').trim(),
    "status": $("#groupStatus").val()=="1"? 1:0,
    "extra1": "",
    "extra2": "",
    "cid": ""
  },
  "maininfo": {
    "userId": this.userIdPG,
    "fiscalID": this.fiscalPG.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPG,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPG.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPG.fromDate,
    "fromDate": this.fiscalPG.fromDate,
    "endDate": this.fiscalPG.toDate,
    "toDate": this.fiscalPG.toDate,
    "decimalPlace": this.globalVariablePG[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPG,
    "id": 0,
    "searchtext": "",
    "cid": 0
  }
      }
    
      // console.log(this.productGroupModel, "model")
        // this.InsertProductGroup()
      if(this.isSubmitGroup==true){
          this.InsertProductGroup()
this.isSubmitGroup=false
        }
        setTimeout(() => {
this.isSubmitGroup=true
        },1000)
    }



      InsertProductGroup() {
        console.log(this.productGroupModel);
        
      if (this.validation() == true) {
        this.service.insertUpdateProductGroup( this.productGroupModel).subscribe((response: any) => {
          // console.log(response);
          
          if (response.success == false) {
            this.toastr.error(response?.msg);
            $('#groupName').focus()
          }
          else if (response.success == true) {
            this.toastr.success(response?.msg);
            this.resetProductGroup()
            //  this.getProductUnderDropdownList()
             this.getProductUnderDropdownList()
               this.getProductGroupFilteredList()
            // this. getProductGroupGridList()
            setTimeout(() => {
  
              $('#groupName').focus()
            }, 50)
  
          }
  
        },
          (error:any) => {
            this.toastr.error(error?.error?.Messages);
            $('#groupName').focus();
          }
  
        )
  
      }
    }

   getProductGroupById(Id: any) {
      this.deleteData = false

 let Model = {
     "userId": this.userIdPG,
  "fiscalID": this.fiscalPG.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPG,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPG.fromDate,
  "fromDate": this.fiscalPG.fromDate,
  "endDate": this.fiscalPG.toDate,
  "toDate": this.fiscalPG.toDate,
  "decimalPlace": this.globalVariablePG[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPG,
  "id": Id,
  "searchtext": "",
  "cid": 0
    };

      this.service.getProductGroupByID(Model).subscribe((d: any) => {
        this.productGroupDataByID = d?.details;
        console.log("get by id",d);
  
        this.EditProductGroup(this.productGroupDataByID);
      });
  
    }


     EditProductGroup(value: any) {
        
this.submitButton='Update'
      this.service.productGroupModel.groupID = value?.groupID
      this.service.productGroupModel.groupName = value?.groupName
      this.service.productGroupModel.remarks = value?.remarks
     
      
      setTimeout(() => {
        // Check if 'parentMenu' select element exists and trigger the change event
       
        if ($('#groupUnder').length) {
          const dropdown = document.getElementById("groupUnder") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.parentID; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }

         if ($('#groupStatus').length) {
          const dropdown = document.getElementById("groupStatus") as HTMLInputElement | null;
          if (dropdown) {
            dropdown.value = value?.gStatus=='True'?"1":"0"; // Assuming val.parentID is a string, convert it to a string if needed
            const event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
          }
        }
      }, 100);
     
  
       $('#groupName').focus()
     
    }


      resetProductGroup() {
  
this. pageIndex = 0;
    this.service.productGroupModel.groupID = 0
      this.service.productGroupModel.groupName = ""
      this.service.productGroupModel.remarks = ""

    setTimeout(() => {
      // Check if 'parentMenu' select element exists and trigger the change event

        if ($('#groupUnder').length) {
        const dropdown = document.getElementById("groupUnder") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

      if ($('#groupStatus').length) {
        const dropdown = document.getElementById("groupStatus") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "1"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#filterByGroupName').length) {
        const dropdown = document.getElementById("filterByGroupName") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }

       if ($('#filterByGroupUnder').length) {
        const dropdown = document.getElementById("filterByGroupUnder") as HTMLInputElement | null;
        if (dropdown) {
          dropdown.value = "0"; // Assuming val.parentID is a string, convert it to a string if needed
          const event = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(event);
        }
      }
     
    }, 100);
    $('#groupName').focus()

this.deleteData=true
this.submitButton='Save'
  }


   ///Delete Conformation

 confirmBoxProductGroupDelete(Id: any) {
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
  // Simply open the popup and listen which button is clicked
  if (this.deleteData== true) {


    confirmBox.openConfirmBox$().subscribe(resp => {
      // do some action after user click on a button
      if (resp.success === true && resp.clickedButtonID === 'yes') {
        this.DeleteProductGroup(Id);
        // this.toastr.error("No Permission to delete")

      }
    });
  }
  else {
    this.toastr.error("Complete pending task!")
  }
  setTimeout(() => {

    $('.ed-btn-danger').focus()

    $('.ed-btn-danger').on('keydown', (e:any) => {
      if (e.key === 'ArrowRight') {
        $('.ed-btn-secondary').focus()
      }
    })

    $('.ed-btn-secondary').on('keydown', (e:any) => {
      if (e.key === 'ArrowLeft') {
        $('.ed-btn-danger').focus()
      }
    })


  }, 0)

}


DeleteProductGroup(Id: number) {

 let Model = {
     "userId": this.userIdPG,
  "fiscalID": this.fiscalPG.financialYearId,
  "branchDepartmentId": 0,
  "branchId": this.branchIdPG,
  "dbName": "",
  "isEngOrNepaliDate": this.otherInfoPG.isEngOrNepali,
  "isMenuVerified": true,
  "isPrintView": true,
  "filterId": 0,
  "refId": 0,
  "mainId": 0,
  "strId": "",
  "startDate": this.fiscalPG.fromDate,
  "fromDate": this.fiscalPG.fromDate,
  "endDate": this.fiscalPG.toDate,
  "toDate": this.fiscalPG.toDate,
  "decimalPlace": this.globalVariablePG[2].value,
  "bookClose": 0,
  "sessionId":this.sessionIdPG,
  "id": Id,
  "searchtext": "",
  "cid": 0
    };

  this.service.deleteProductGroup(Model).subscribe((res: any) => {
    // console.log(res,"delete");
    
    if (res?.success == true) {
      this.toastr.success(res?.msg)
      setTimeout(() => {

        // this.getProductGroupGridList()
         this.getProductGroupFilteredList()
          this.getProductUnderDropdownList()

      }, 100)
      $('#groupName').focus()

      // this.costCategoryID1.nativeElement.focus();
    }
    else if (res.success == false) {
      this.toastr.error(res?.msg)
    }
  }, (error:any) => {
    this.toastr.error(error?.error?.Message)
  })


}


//Get product group list
    getProductGroupFilteredList() {
    let Model = {
   "dataFilterModel": {
    "tblName": "ProductGroup--ProductGroup",
    "columnName": "",
    "strName": "",
    "underColumnName": "",
    "underIntID": 0,
    "filterColumnsString": `[\"group--${$('#filterByGroupName').val()==0?'':$('#filterByGroupName').val()}\",\"underGroup--${$('#filterByGroupUnder').val()==0?'':$('#filterByGroupUnder').val()}\"]`,
    "currentPageNumber": this.pageIndex+1,
    "pageRowCount": this.pageSize,
    "strlistNames": "string"
  },
  "mainInfoModel": {
     "userId": this.userIdPG,
    "fiscalID": this.fiscalPG.financialYearId,
    "branchDepartmentId": 0,
    "branchId": this.branchIdPG,
    "dbName": "string",
    "isEngOrNepaliDate":  this.otherInfoPG.isEngOrNepali,
    "isMenuVerified": true,
    "isPrintView": true,
    "filterId": 0,
    "refId": 0,
    "mainId": 0,
    "strId": "",
    "startDate": this.fiscalPG.fromDate,
    "fromDate": this.fiscalPG.fromDate,
    "endDate": this.fiscalPG.toDate,
    "toDate": this.fiscalPG.toDate,
    "decimalPlace": this.globalVariablePG[2].value,
    "bookClose": 0,
    "sessionId": this.sessionIdPG,
    "id": 0,
    "searchtext": "",
    "cid": 0
  },
  "print": true
    };




    this.service.getProductGroupFilteredList(Model).subscribe(
      (res) => {
        let result: any = res;
        console.log(result, 'product group data list');
        if (result) {
           this.productGroupGridList=result[0]
           this.productGroupGridDetails=result[1]
          
           console.log(this.productGroupGridList,"gridddd");
            console.log(result[1].totalRecords,"total");
           
          this.length=result[1]?.totalRecords
          // this.pageSize=this.productGroupGridList[1]?.pageSize
          // this.pageIndex=this.productGroupGridList[1]?.currentPageNumber - 1
          //  console.log(result,"productGroupgridlist");
           
        }
      },
      (error) => {
        // console.error('Error:', error); // Inspect full error message
        this.toastr.error(error?.error?.Messages);
      }
    );
  }

   handlePageEvent(e: any) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductGroupFilteredList()
  }

}
