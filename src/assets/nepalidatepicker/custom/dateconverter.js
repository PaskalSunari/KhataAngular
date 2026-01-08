// Get max fiscal date based on current date and fiscal year
function getFiscalMaxDate() {
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
      maxDate = isCurrentFiscalYear ? NepaliFunctions.AD.GetCurrentDate('YYYY-MM-DD') : fiscalYear.toDate.split("T")[0];
      // console.log("max date:", maxDate);
      return maxDate;
    }
  } catch (e) {
    console.log("e:", e)
  }
}
// Get  fiscal year from date
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
// Get  fiscal year to date 
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
// Get current AD date
function getCurrentBSDate() {
  try {
    return NepaliFunctions.BS.GetCurrentDate('YYYY-MM-DD');
  } catch (e) {
    console.log('e:', e);
  }
}
// Format date object to YYYY-MM-DD
function getFormattedDate(date) {
  if (!date?.year || !date?.month || !date?.day) return '';
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}
// For nepali date picker in main page
function nepaliDatePicker(elementId, setElementValueId, focusElementId, setDate) {
  if (setDate == 1) {
    document.getElementById(elementId).value = getFiscalFromDate();
    document.getElementById(setElementValueId).value = NepaliFunctions.BS2AD(getFiscalFromDate());
  } else {
    document.getElementById(elementId).value = getFiscalMaxDate();
    document.getElementById(setElementValueId).value = NepaliFunctions.BS2AD(getFiscalMaxDate());
  }

  var dateInput = document.getElementById(elementId);

  dateInput.nepaliDatePicker({
    readOnlyInput: false,   // 🔑 important
    minDate: getFiscalFromDate(),
    maxDate: getFiscalMaxDate(),
    dateFormat: "YYYY-MM-DD",
    animation: "fade",
    miniEnglishDates: true,
    onClose: function (selectedDate) {
      document.getElementById(setElementValueId).value = getFormattedDate(NepaliFunctions.BS2AD(selectedDate[0]));
      document.getElementById(focusElementId).focus();
    }
  });

  dateInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // stop picker interference
      document.getElementById(focusElementId)?.focus();
      //   const bsDate = this.value;
      //   if (!bsDate) return;

      //   // wait until picker updates value
      //   setTimeout(() => {
      //     const adDate = NepaliFunctions.BS2AD(bsDate);
      //     console.log("adDate:", adDate);
      //     document.getElementById(setElementValueId).value = adDate;
      //     document.getElementById(focusElementId)?.focus();
      //   }, 0);
    }
  });


}
// For nepali date picker in popup
function nepaliDatePickerPopup(elementId, setElementValueId, focusElementId, popupId, setDate) {
  if (setDate == 1) {
    document.getElementById(elementId).value = getFiscalFromDate();
  } else {
    document.getElementById(elementId).value = getFiscalMaxDate();
  }

  var dateInput = document.getElementById(elementId);
  dateInput.nepaliDatePicker({
    readOnlyInput: true,
    minDate: getFiscalFromDate(),
    maxDate: getFiscalMaxDate(),
    dateFormat: "YYYY-MM-DD",
    animation: "fade",
    miniEnglishDates: true,
    container: `#${popupId}`,
    onClose: function (selectedDate) {
      document.getElementById(setElementValueId).value = getFormattedDate(NepaliFunctions.BS2AD(selectedDate[0]));
      document.getElementById(focusElementId).focus();
    }
  });
}
// For english date picker in main page
function englishDatePicker(elementId, setElementValueId, focusElementId, setDate) {
  if (setDate == 1) {
    document.getElementById(elementId).value = getFiscalFromDate();
  } else {
    document.getElementById(elementId).value = getFiscalMaxDate();
  }

  var dateInput = document.getElementById(elementId);
  dateInput.min = getFiscalFromDate();
  dateInput.max = getFiscalMaxDate();

  // Attach change event
  dateInput.addEventListener('change', (e) => {
    const selectedDate = e.target.value;
    document.getElementById(setElementValueId).value = selectedDate;
    document.getElementById(focusElementId).focus();

  });
}