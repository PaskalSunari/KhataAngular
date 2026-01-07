function mytest() {
  // debugger;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  /* Select your element */
  // var mainInput = document.getElementById("convertnepali");
  NepaliFunctions.ConvertToDateObject("2000-01-01", "YYYY-MM-DD");
  /* Initialize Datepicker with options */
  // mainInput.nepaliDatePicker();

  var aa = NepaliFunctions.AD2BS($("#convertenglish").val());

  $("#convertnepali").val(aa);
  $("#convertenglish").val(today);

  // startDate.nepaliDatePicker();
  // toDate.nepaliDatePicker();

  // let currentNepaliDate = calendarFunctions.getBsDateByAdDate(
  //   currentDate.getFullYear(),
  //   currentDate.getMonth() + 1,
  //   currentDate.getDate()
  // );
  // let formatedNepaliDate = calendarFunctions.bsDateFormat(
  //   "%y-%m-%d",
  //   currentNepaliDate.bsYear,
  //   currentNepaliDate.bsMonth,
  //   currentNepaliDate.bsDate
  // );

  let currentDate = new Date();
  let currentNepaliDate = NepaliFunctions.AD2BS(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()
  );
  let formatedNepaliDate = NepaliFunctions.ConvertDateFormat(
    "%y-%m-%d",
    currentNepaliDate.bsYear,
    currentNepaliDate.bsMonth,
    currentNepaliDate.bsDate
  );

  // console.log("currentDate", currentDate);
  // console.log("currentNepaliDate", currentNepaliDate);
  // console.log("formatedNepaliDate", formatedNepaliDate);
}

function AD2BS(adDate) {
  // let bs = NepaliFunctions.AD2BS(adDate);
  // return bs;

  // console.log("adDate", adDate);

  if (adDate) {
    let adDateArr = adDate.split("-");
    // console.log("adDateArr", adDateArr);
    let adYear = +adDateArr[0];
    let adMonth = +adDateArr[1];
    let AdDay = +adDateArr[2];

    let unformattedDate = NepaliFunctions.AD2BS({
      year: adYear,
      month: adMonth,
      day: AdDay,
    });

    // let unformattedDate = NepaliFunctions.AD2BS(
    //   adYear,
    //   adMonth,
    //   AdDay
    // );

    // console.log("bsDate", unformattedDate);

    let formattedBSDate = `${NepaliFunctions.ConvertToUnicode(
      unformattedDate?.year
    )}-${NepaliFunctions.ConvertToUnicode(
      unformattedDate?.month
    )}-${NepaliFunctions.ConvertToUnicode(unformattedDate?.day)}`;
    // console.log("formattedBSDate", formattedBSDate);
    // console.log(unformattedDate);
    return (
      unformattedDate?.year +
      "-" +
      unformattedDate?.month +
      "-" +
      unformattedDate?.day
    );

    // let unformattedDate = calendarFunctions.getBsDateByAdDate(
    //   adYear,
    //   adMonth,
    //   AdDay
    // );
    // // console.log("bsDate", unformattedDate);

    // let formattedBSDate = `${calendarFunctions.getNepaliNumber(
    //   unformattedDate?.bsYear
    // )}-${calendarFunctions.getNepaliNumber(
    //   unformattedDate?.bsMonth
    // )}-${calendarFunctions.getNepaliNumber(unformattedDate?.bsDate)}`;
    // // console.log("formattedBSDate", formattedBSDate);
    // return formattedBSDate;
  }
}

function BS2AD(bsDate) {
  let ad = NepaliFunctions.BS2AD(bsDate);
  return ad;

  // console.log("bsDate", bsDate);
  // if (bsDate) {
  //   let bsDateArr = bsDate.split("-");
  //   // console.log("bsDateArr", bsDateArr);
  //   // getAdDateByBsDate(bsDateArr[0], bsDateArr[1], bsDateArr[2]);

  //   bsDateArr = bsDateArr.map((param) => {
  //     // console.log("param", param);
  //     // console.log(calendarFunctions.getNumberByNepaliNumber(param));
  //     return calendarFunctions.getNumberByNepaliNumber(param);
  //   });
  //   let bsYear = bsDateArr[0];
  //   let bsMonth = bsDateArr[1];
  //   let BsDay = bsDateArr[2];

  //   let adDate = calendarFunctions.getAdDateByBsDate(bsYear, bsMonth, BsDay);
  //   // console.log("adDate", adDate);
  //   return adDate;
  // }
}

function CurrentBSDate() {
  let currentDate = new Date();

  let year = currentDate?.getFullYear();
  let month = String(currentDate?.getMonth() + 1).padStart(2, "0");
  let day = String(currentDate?.getDate()).padStart(2, "0");

  let formattedDate = `${year}-${month}-${day}`;

  let adDateArr = formattedDate.split("-");

  let adYear = +adDateArr[0];
  let adMonth = +adDateArr[1];
  let AdDay = +adDateArr[2];
  let unformattedDate = NepaliFunctions.AD2BS({
    year: adYear,
    month: adMonth,
    day: AdDay,
  });

  return (
    unformattedDate?.year +
    "-" +
    unformattedDate?.month +
    "-" +
    unformattedDate?.day
  );
  //
  // let currentDate = new Date();
  // let currentNepaliDate = calendarFunctions.getBsDateByAdDate(
  //   currentDate.getFullYear(),
  //   currentDate.getMonth() + 1,
  //   currentDate.getDate()
  // );
  // let formatedNepaliDate = calendarFunctions.bsDateFormat(
  //   "%y-%m-%d",
  //   currentNepaliDate.bsYear,
  //   currentNepaliDate.bsMonth,
  //   currentNepaliDate.bsDate
  // );

  // return formatedNepaliDate;
}

function oninitial() {
  let formatedNepaliDate = CurrentBSDate();

  var startDate = document.getElementById("startDate");
  startDate?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    miniEnglishDates: true
  });
  //    var mainInput = document.getElementById("nepali-datepicker");
  // mainInput.nepaliDatePicker();
  var toDate = document.getElementById("toDate");
  toDate?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var visitDate = document.getElementById("visitDate");
  visitDate?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
  });

  var dob = document.getElementById("dob");
  dob?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var dobBS = document.getElementById("dobBS");
  dobBS?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  //.......db variable is specific for patient reg date of birth
  var db = document.getElementById("db");
  db?.nepaliDatePicker({
    readOnlyInput: false,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    // ndpYearCount:300 ,
    onChange: function (date) {
      $("#dateOfBirth").val(date?.ad);
    },
  });

  var appointmentEngDate = document.getElementById("appointmentEngDate");
  appointmentEngDate?.nepaliDatePicker({
    readOnlyInput: false,
    disableBefore: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    // ndpYearCount:300 ,
    onChange: function (date) {
      $("#appointmentNepDate").val(date?.ad);
    },
  });

  var reappointmentEngDate = document.getElementById("reappointmentEngDate");
  reappointmentEngDate?.nepaliDatePicker({
    container: '.reappointment',
    readOnlyInput: false,
    disableBefore: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    // ndpYearCount:300 ,
    onChange: function (date) {
      $("#reappointmentNepDate").val(date?.ad);
    },
  });

  var followUpDate = document.getElementById("followUpDate");
  followUpDate?.nepaliDatePicker({
    readOnlyInput: true,
    disableBefore: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var dischargedDate = document.getElementById("dischargedDate");
  dischargedDate?.nepaliDatePicker({
    disableAfter: formatedNepaliDate,
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var admissionDate = document.getElementById("admissionDate");
  admissionDate?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    //   dateFormat: "MM/DD/YYYY"
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var dobBSTriage = document.getElementById("dobBSTriage");
  dobBSTriage?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var patientDOB = document.getElementById("dobBS");
  patientDOB?.nepaliDatePicker({
    readOnlyInput: true,
    disableAfter: formatedNepaliDate,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  // var currentBS = NepaliFunctions.GetCurrentBsDate();
  // currentBS?.nepaliDatePicker({
  //      readOnlyInput: true,
  //        ndpYear: true,
  //   ndpMonth: true,
  //   ndpYearCount: 10

  // });

  var startDateFiscal = document.getElementById("startDateFiscal");
  startDateFiscal?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  var fromDate = document.getElementById("fromDate");
  fromDate?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
  });

  var endDate = document.getElementById("endDate");
  endDate?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
  });

  var userStartDate = document.getElementById("userStartDate");
  userStartDate?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
    container: "#pdcModal",
  });

  var userStartDate1 = document.getElementById("userStartDate1");
  userStartDate1?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
    // container: "#pdcModal",
  });

  var userToDate = document.getElementById("userToDate");
  userToDate?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
  });

  //.....this variable is used in my team document upload page for nepali date for specific to that input field
  var nepaliDateInPopup = document.getElementById("nepaliDateInPopup");
  nepaliDateInPopup?.nepaliDatePicker({
    readOnlyInput: true,
    ndpYear: true,
    ndpMonth: true,
    ndpYearCount: 10,
    disableAfter: formatedNepaliDate,
    container: "#popupPage",
    onChange: function (date) {
      $("#completed").val(date?.ad);
      $("#duration").focus();
    },
  });

  //
  // console.log('formatedNepaliDate', formatedNepaliDate);

  // var startDate = document.getElementById("startDate");
  // var toDate = document.getElementById("toDate");
  // var visitDate = document.getElementById("visitDate");
  // var dob = document.getElementById("dob");
  // var followUpDate = document.getElementById("followUpDate");
  // var dischargedDate = document.getElementById("dischargedDate");
  // var admissionDate = document.getElementById("admissionDate");
  // let dobBSTriage = document.getElementById("dobBSTriage");

  // var patientDOB = document.getElementById("dobBS");
  // // let currentBS = NepaliFunctions.GetCurrentBsDate();
  // // let startDateFiscal = document.getElementById("startDateFiscal");
  // var fromDate = document.getElementById("fromDate");
  // var endDate = document.getElementById("endDate");

  // $("#visitDate")?.nepaliDatePicker({
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#startDate")?.nepaliDatePicker({
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#toDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // readOnlyInput: true,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#userStartDate")?.nepaliDatePicker({
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#userToDate")?.nepaliDatePicker({
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true
  // });

  // $("#fromDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // readOnlyInput: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#endDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // readOnlyInput: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#dobBS")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   // onChange: ()=>{
  //   //  $('#dobAD').val(BS2AD($('#dobBS').val()) || '')
  //   // }
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#dob")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   // onChange: () => {
  //   //   $('#dobAD').val(BS2AD($('#dobBS').val()) || '')

  //   // }
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#db")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   // onChange: () => {
  //   //   $('#dobAD').val(BS2AD($('#dobBS').val()) || '')

  //   // }
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#followUpDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableBefore: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   // maxDate: formatedNepaliDate
  //   minDate:formatedNepaliDate
  // });

  // $("#dischargedDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#admissionDate")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  //   // readOnlyInput: true,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // $("#startDateFiscal")?.nepaliDatePicker({
  //   // ndpYear: true,
  //   // ndpMonth: true,
  //   // readOnlyInput: true,
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });

  // // dobBSTriage?.nepaliDatePicker({
  // //   ndpYear: true,
  // //   ndpMonth: true,
  // //   // disableAfter: `${currentBS.year}-${currentBS.month}-${currentBS.day}`,
  // //   // readOnlyInput: true
  // // });

  // $("#dobBSTriage").nepaliDatePicker({
  //   dateFormat: "%y-%m-%d",
  //   closeOnDateSelect: true,
  //   maxDate: formatedNepaliDate
  // });
}

function getMaxFiscalDate() {
    try {
        const fiscalYear = JSON.parse(localStorage.getItem('fiscalYear'));
        const isDateFormat = parseInt(JSON.parse(localStorage.getItem("globalVariable"))[1].value); //0:Nepali, 1: English

        const fromDate = new Date(fiscalYear.fromDate);
        const toDate = new Date(fiscalYear.toDate);
        const currentDate = new Date();
        const isCurrentFiscalYear = currentDate >= fromDate && currentDate <= toDate;

        let maxDate;
        if (isDateFormat == 0) {
            maxDate = isCurrentFiscalYear ? NepaliFunctions.BS.GetCurrentDate('YYYY-MM-DD') : NepaliFunctions.AD2BS(fiscalYear.toDate.split("T")[0], "YYYY-MM-DD");
            //console.log("max date:", maxDate);
            return maxDate;
        } else {
            maxDate = isCurrentFiscalYear ? NepaliFunctions.AD.GetCurrentDate('YYYY/MM/DD') : fiscalYear.toDate.split("T")[0];
           // console.log("max date:", maxDate);
            return maxDate;
        }
    } catch (e) {
        console.log("e:", e)
    }
}

function getFiscalFromDate() {
    try {
        const fiscalYear = JSON.parse(localStorage.getItem('fiscalYear'));
        const isDateFormat = parseInt(JSON.parse(localStorage.getItem("globalVariable"))[1].value); //0:Nepali, 1: English

        if (!fiscalYear || !fiscalYear.fromDate) {
            console.warn("Invalid fiscal year data.");
            return null;
        }

        if (isDateFormat == 0) {
            const fromDate = NepaliFunctions.AD2BS(fiscalYear.fromDate.split("T")[0], "YYYY-MM-DD");
            return fromDate;

        } else {
            const fromDate = fiscalYear.fromDate.split("T")[0];
            return fromDate;
        }
    } catch (e) {
        console.log("e:", e);
    }

}
function getFiscalToDate() {
    try {
        var fiscalYear = JSON.parse(localStorage.getItem('fiscalYear'));
        let isDateFormat = JSON.parse(localStorage.getItem("globalVariable"))[1].value; //0:Nepali, 1: English
        if (!fiscalYear || !fiscalYear.toDate) {
           console.warn("Invalid fiscal year data.");
            return null;
        }

        if (isDateFormat == 0) {
            const toDate = NepaliFunctions.AD2BS(fiscalYear.toDate.split("T")[0], "YYYY-MM-DD");
            return toDate;

        } else {
            const toDate = fiscalYear.toDate.split("T")[0];
            return toDate;
        }
    } catch (e) {
        console.log("e:", e);
    }
}