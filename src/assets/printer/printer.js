function JSPrintManager() {
  var _this = this;
  let detectedPrinters = [];
  //WebSocket settings
  JSPM.JSPrintManager.auto_reconnect = true;
  JSPM.JSPrintManager.start();
  JSPM.JSPrintManager.WS.onStatusChanged = function () {
    // if (jspmWSStatus()) {
    //get client installed printers
    JSPM.JSPrintManager.getPrintersInfo().then(function (printersList) {
      let clientPrinters = printersList;
      detectedPrinters = printersList;
      console.log("printersList", printersList);
      localStorage.setItem("DetectedPrinters", JSON.stringify(clientPrinters));
    });
    // }
  };
}
