var script = document.createElement("script");
script.type = "text/javascript";
// let link = document.createElement('link');

// set the attributes for link element
// link.rel = 'stylesheet';

// link.type = 'text/css';
// link.type='text/css'

let styles = `.toast-title {
  font-weight: 700
}

.toast-message {
  word-wrap: break-word;
  font-size: 1.5rem !important;
}

.toast-message a,
.toast-message label {
  color: #fff
}

.toast-message a:hover {
  color: #ccc;
  text-decoration: none
}

.toast-close-button {
  position: relative;
  right: -.3em;
  top: -.3em;
  float: right;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  -webkit-text-shadow: 0 1px 0 #fff;
  text-shadow: 0 1px 0 #fff;
  opacity: .8
}

.toast-close-button:focus,
.toast-close-button:hover {
  color: #000;
  text-decoration: none;
  cursor: pointer;
  opacity: .4
}

button.toast-close-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none
}

.toast-top-center {
  top: 0;
  right: 0;
  width: 100%
}

.toast-bottom-center {
  bottom: 0;
  right: 0;
  width: 100%
}

.toast-top-full-width {
  top: 0;
  right: 0;
  width: 100%
}

.toast-bottom-full-width {
  bottom: 0;
  right: 0;
  width: 100%
}

.toast-top-left {
  top: 12px;
  left: 12px
}

.toast-top-right {
  top: 12px;
  right: 12px
}

.toast-bottom-right {
  right: 12px;
  bottom: 12px
}

.toast-bottom-left {
  bottom: 12px;
  left: 12px
}

#toast-container {
  position: fixed;
  z-index: 99999999999 !important
}

#toast-container * {
  box-sizing: border-box
}

#toast-container .toast {
  position: relative;
  overflow: hidden;
  margin: 0 0 6px;
  padding: 15px 15px 15px 50px;
  width: 300px;
  border-radius: 3px 3px 3px 3px;
  background-position: 15px;
  background-repeat: no-repeat;
  box-shadow: 0 0 12px #999;
  color: #fff;
  opacity: 1;
  z-index: 9999999999 !important;
}

#toast-container .toast:hover {
  box-shadow: 0 0 12px #000;
  opacity: 1;
  cursor: pointer
}

#toast-container .toast.toast-info {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important
}

// #toast-container .toast.toast-error {
//   // background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important
// background-size: 30px;
//   // background-image: url("data:image/svg+xml charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox = '0 0 512 512' height='20' width='20' %3E%3Cpath fill='rgba(255,255,255, 0.999999)' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z'/%3E%3C/svg%3E")

// // background-image: url("data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHBhdGggZD0iTTE5MiA0MzkuNDA0bC0xNjYuNDAyLTE2Ni40MDJjLTQuNyA0LjctMTAuMiA5LjktMzQuMSAxMS43LTUuNC0yNi42IDExLjctMjU2IDI1Ni0yNTYgMTE3LjEgMCAyMTEuMSA4LjAgMjU2IDI1NiAyNTYgMTExLjEgMjU2IDIxNiAxMjIgMjE2IDI0OCAyMTYgMTgwIDAgMzEyIDEuNiAzMTIgNS4xIDQyIDY2LjUgNTQuNyA4IDE3LjggMyAxNy44IDMuMjUgMS42IDIyLjEyLTM2LjM0IDEzLjQtOS45OTcgOS45OTctMTcuNzEgMCAwLTMuMDYtMTcuMTUgMjAuMi0yNS4zIDIyLjM1LTI1LjMgNDEuMiAwIDguOTgtMS42IDEyLjIyLTIuNjUgMTQuODMgMTIuMjJ6bS0xOTEgMzEzLjFjLjQ3LjQuOTYuNDEuOTEuOTEuMzcuNzEuODcuOTQgMC4xMi0yLjQuMjUtMi40LjI0LTIuNS4wNC0uNDcuNDEtLjY0Ljg4LS45OS42OS0xLjQuNjItMi4yNSAxLjIyLTMuMDIgMi45NC0zLjY0IDIuMjUtMy42My4wNC0uMTIgMC4yMy0xLjEzIDAgMC0uNzkuNDRsLjM5Ni04LjIxYy0uNDA2LS40Ny0uOTEyLTEuMTg4LTIuNzI5LTEuMTg4LTMuODMgMC0yLjY1IDIuNDYtMy4yNSA0LjE5LTMuNzQgNC4xOS04LjggMC04LjQ2LTIuMTMtMTQuNjgtOC4yOS04LjktMS4xMy0xNi40MS0xLjgtMjIuMTEtNS4xLTI2LjI4LTExLjctMjU1LTExLjctMjU1LTIwLjggMC0zLjg0LTEuNTYtMTIuMDMtMy43eiIgZmlsbD0iI0ZGNTI1MiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPgo=
// // ") !important

// background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTYiIHdpZHRoPSIxNiIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi41LjEgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4tLT48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMjU2IDUxMkEyNTYgMjU2IDAgMSAwIDI1NiAwYTI1NiAyNTYgMCAxIDAgMCA1MTJ6TTE3NSAxNzVjOS40LTkuNCAyNC42LTkuNCAzMy45IDBsNDcgNDcgNDctNDdjOS40LTkuNCAyNC42LTkuNCAzMy45IDBzOS40IDI0LjYgMCAzMy45bC00NyA0NyA0NyA0N2M5LjQgOS40IDkuNCAyNC42IDAgMzMuOXMtMjQuNiA5LjQtMzMuOSAwbC00Ny00Ny00NyA0N2MtOS40IDkuNC0yNC42IDkuNC0zMy45IDBzLTkuNC0yNC42IDAtMzMuOWw0Ny00Ny00Ny00N2MtOS40LTkuNC05LjQtMjQuNiAwLTMzLjl6Ii8+PC9zdmc+
// ") !important

// }


#toast-container .toast.toast-error {
  background-size: 26px;
  background-image: url("
  data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTYiIHdpZHRoPSIxNiIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi41LjEgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4tLT48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMjU2IDUxMkEyNTYgMjU2IDAgMSAwIDI1NiAwYTI1NiAyNTYgMCAxIDAgMCA1MTJ6TTE3NSAxNzVjOS40LTkuNCAyNC42LTkuNCAzMy45IDBsNDcgNDcgNDctNDdjOS40LTkuNCAyNC42LTkuNCAzMy45IDBzOS40IDI0LjYgMCAzMy45bC00NyA0NyA0NyA0N2M5LjQgOS40IDkuNCAyNC42IDAgMzMuOXMtMjQuNiA5LjQtMzMuOSAwbC00Ny00Ny00NyA0N2MtOS40IDkuNC0yNC42IDkuNC0zMy45IDBzLTkuNC0yNC42IDAtMzMuOWw0Ny00Ny00Ny00N2MtOS40LTkuNC05LjQtMjQuNiAwLTMzLjl6Ii8+PC9zdmc+
  ") !important
}

#toast-container .toast.toast-success {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important
}

#toast-container .toast.toast-warning {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important
}

#toast-container.toast-bottom-center .toast,
#toast-container.toast-top-center .toast {
  width: 300px;
  margin-left: auto;
  margin-right: auto
}

#toast-container.toast-bottom-full-width .toast,
#toast-container.toast-top-full-width .toast {
  width: 96%;
  margin-left: auto;
  margin-right: auto
}

.toast {
  background-color: #030303
}

.toast-success {
  background-color: #51a351
}

.toast-error {
  background-color: #bd362f
}

.toast-info {
  background-color: #2f96b4
}

.toast-warning {
  background-color: #f89406
}

progress-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px;
  background-color: #000;
  opacity: .4
}

div[toast] {
  opacity: 1 !important
}

div[toast].ng-enter {
  opacity: 0 !important;
  transition: opacity .3s linear
}

div[toast].ng-enter.ng-enter-active {
  opacity: 1 !important
}

div[toast].ng-leave {
  opacity: 1;
  transition: opacity .3s linear
}

div[toast].ng-leave.ng-leave-active {
  opacity: 0 !important
}

@media all and (max-width:240px) {
  #toast-container .toast.div {
    padding: 8px 8px 8px 50px;
    width: 11em
  }

  #toast-container .toast-close-button {
    right: -.2em;
    top: -.2em
  }
}

@media all and (min-width:241px) and (max-width:480px) {
  #toast-container .toast.div {
    padding: 8px 8px 8px 50px;
    width: 18em
  }

  #toast-container .toast-close-button {
    right: -.2em;
    top: -.2em
  }
}

@media all and (min-width:481px) and (max-width:768px) {
  #toast-container .toast.div {
    padding: 15px 15px 15px 50px;
    width: 25em
  }
}
`;

script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js";
// link.href = '../toastError.css'
document.body.appendChild(script);
// document.body.appendChild(link);

var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function setFocusOnNextElement() {
  toastr.options = {
    closeButton: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  var $visibleElements = $(
    "input:not([disabled]):visible, select:not([disabled]):visible, button.focussable:not([disabled]):visible, textarea:not([disabled]):visible , button:not([disabled]):visible"
  );
  var currentIndex = $visibleElements.index(this);
  var nextElement = $visibleElements.eq(currentIndex + 1);
  var main = $visibleElements.eq(currentIndex);
  var a = main.attr("name");
  var ab = main.attr("id");
  if (nextElement.length === 0) {
    nextElement = $visibleElements.first();
  } else if (main.hasClass("req")) {
    if (
      main.val() === null ||
      main.val() == "" ||
      main.val() == undefined ||
      main.val().match("^^ *$")
    ) {
      // toastr.error(a + " is required");
      main.css("border-color", "red");
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("alphaReq")) {
    if (main.val()) {
      // let string = main.val()
      // string = string.split(' ')
      // string = string.map((str) => {
      //   return str.charAt(0).toUpperCase() + str.slice(1)
      // })
      // string = string.join(" ")
      // string = string.charAt(0).toUpperCase() + string.slice(1)
      // main.val(string)
      main.css("border-color", "");
    } else if (
      main.val() === null ||
      main.val() == "" ||
      main.val() == undefined
    ) {
      main.css("border-color", "red");
      main.focus();
      // toastr.error(`${a} is required`);
      return false;
    }
    // else {
    //   main.css('border-color', 'red');
    //   toastr.error(`Remove unnecessary space from ${event.target.name}`);
    //   main.focus();
    //   return false;
    // }
  } else if (main.hasClass("alpha")) {
    // if (main.val().match("[^\s]+[a-zA-Z\s]+([a-zA-Z\s])*$")) {
    if (main.val()) {
      let string = main.val();
      string = string.split(" ");
      string = string.map((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      });
      string = string.join(" ");
      // string = string.charAt(0).toUpperCase() + string.slice(1)
      main.val(string);
      main.css("border-color", "");
    } else if (
      main.val() === null ||
      main.val() == "" ||
      main.val() == undefined
    ) {
    }
    // else {
    //   main.css('border-color', 'red');
    //   toastr.error(`Remove unnecessary space from ${event.target.name}`);

    //   main.focus();
    //   return false;
    // }
  } else if (main.hasClass("min")) {
    if (
      main.val() === null ||
      main.val() == "" ||
      main.val() == undefined ||
      !main.val().match("^(?!.*-)(?!.*e-e).+$") ||
      !main.val().match("^[^.]*$")
    ) {
      // toastr.error(`Invalid ${a}`);
      main.css("border-color", "red");
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("email")) {
    if (
      main.val() != "" &&
      !main
        .val()
        .match(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
        )
    ) {
      // toastr.error(a + " is required");
      main.css("border-color", "red");
      // toastr.error(`${a} is invalid`);
      main.focus();
      return true;
    } else {
      main.css("border-color", "");
      // nextElement.focus();
    }
  } else if (main.hasClass("mobile")) {
    // let mobileReg = '^[\d+\-\s,]*$'
    console.log("mobile");
    if (main.val() && !main.val().match("^[0-9+,]{1,}$")) {
      // toastr.error(a + " is invalid");
      main.css("border-color", "red");
      main.focus();
    } else if (main.val() && main.val().match("^[0-9+,]{1,}$")) {
      nextElement.focus();
      nextElement.select2("open");
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("mobile1")) {
    if (
      main.val() === null ||
      main.val() == "" ||
      main.val() == undefined ||
      (main.val() && !main.val().match("^[0-9]{5,}$"))
    ) {
      // toastr.error(a + " is invalid");
      main.css("border-color", "red");
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("contact")) {
    // let mobileReg = '^[\d+\-\s,]*$'
    if (main.val() && !main.val().match("^[0-9+-s,]{10}$")) {
      // toastr.error(a + " is required");
      main.css("border-color", "red");
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("mins")) {
    if (main.val() < 0 || main.val() == undefined) {
      //toastr.error(a + " is required");
      main.css("border-color", "red");
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("discount")) {
    if (main.val()) {
      if (
        main.val() < 0 ||
        main.val() > 100 ||
        !`${main.val()}`.match("^(?!.*-)(?!.*e-e).+$")
      ) {
        //toastr.error(a + " is required");
        main.css("border-color", "red");
        //  toastr.error(`${a} cannot be less than zero or above 100`);
        main.focus();
        return false;
      } else {
        main.css("border-color", "");
      }
    }
  } else if (main.hasClass("rate")) {
    if (main.val === "null" || main.val() <= 0) {
      //toastr.error(a + " is required");
      main.css("border-color", "red");
      //  toastr.error(`${a} cannot be less than zero or above 100`);
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("min1")) {
    if (
      main.val() < 1 ||
      main.val() == undefined ||
      main.val == null ||
      !main.val().match("^[^.]*$")
    ) {
      //toastr.error(a + " is required");
      main.css("border-color", "red");
      // toastr.error(`${a} is invalid `);
      main.focus();
      return false;
    } else {
      main.css("border-color", "");
    }
  } else if (main.hasClass("select2-hidden-accessible")) {
    var select2Input = nextElement.siblings("span.select2").find("input");
    if (main.val() === null || main.val() === "" || main.val() == undefined) {
      //toastr.error(a + " is required");
      main.focus();
      main.select2("close");
      nextElement.select2("close");
      return false;
    } else {
      // Set focus on the select2 input
      if (nextElement.hasClass("select2-hidden-accessible")) {
        // nextElement.select2('open');
        main.css("border-color", "");
        nextElement.focus();
        nextElement.select();

        return false;
      }
    }
    nextElement.focus();
    nextElement.select();

    return false;
    // Check if the select2 input has a null or empty value
  } else if (main.hasClass("custom-select")) {
    // main.attr("expandto");
    // main.attr("size", main.attr("expandto"));
    // setTimeout(() => {
    //   // main.focus();
    // var e = $.Event("keydown");
    // // e.which = 32;
    // e.keyCode = 13;
    // main.trigger(e);
    // }, 100);
    // return false;
    // main.click();
    // main.attr("size", 10)
    // function active(select) {
    //   var temp = $("<select/>");
    //   // $('<option />', { value: 1, text: $(select).find(':selected').text() }).appendTo(temp);
    //   // $(temp).insertBefore($(select));
    //   // select.attr("size", main.attr("expandto"));
    //   // select.css("position", "absolute");
    //   // select.css("margin-top", "-6px");
    //   // select.css({ boxShadow: "2px 3px 4px #888888" });
    // }
    // active(main);
  } else if (main.hasClass("button")) {
    main.css("border-color", "");
    main.focus();
    $("#button").trigger("click");
    return false;
  } else if (main.hasClass("buttons")) {
    // main.css('border-color', '');
    main.focus();
    $("#buttons").trigger("click");
    return false;
  } else if (main.hasClass("button2")) {
    // main.css('border-color', '');
    main.focus();
    $("#button2").trigger("click");
    return false;
  } else if (main.hasClass("button3")) {
    // main.css('border-color', '');
    main.focus();
    $("#button3").trigger("click");
    return false;
  } else if (main.hasClass("button4")) {
    // main.css('border-color', '');
    main.focus();
    $("#button4").trigger("click");
    return false;
  } else if (main.hasClass("button5")) {
    main.css("border-color", "");
    main.focus();
    $("#button5").trigger("click");
    return false;
  } else if (main.hasClass("button6")) {
    // main.css('border-color', '');
    main.focus();
    $("#button6").trigger("click");
    return false;
  } else if (main.hasClass("button7")) {
    // main.css('border-color', '');
    main.focus();
    $("#button7").trigger("click");
    return false;
  }else if (main.hasClass("button8")) {
    main.css("border-color", "");
    main.focus();
    $("#button8").trigger("click");
    return false;
  }else if (main.hasClass("button9")) {
    main.css("border-color", " ");
   main.focus();
   $("#button9").trigger("click");
   return false;
 }else if (main.hasClass("note-btn")) {
    $("#buttons").focus();
    $("#button").focus();
    return true;
    //     $('.note-editable').attr("id, summerText")
    //  setTimeout(()=>{
    //   console.log('...........');
    //   $('#summerText').focus()
    //  },100)
  }

  if (nextElement.is("textarea")) {
    nextElement.select();
  }
  if (nextElement.is("input")) {
    nextElement.select();
  }
  

  // if(nextElement.is("select")){

  //  main.on("keydown", (e)=>{
  //   // alert(e)
  //   if($(e.keyCode === 13)){

  //        // main.focus();
  //        var ev = $.Event("keydown");
  //        ev.which = 32;
  //        ev.keyCode = 32;
  //        document.trigger(e);

  //   }
  //  })
  // }

  nextElement.focus();
}

function BlurValidation(event) {
  // toastr.options = {
  //   "closeButton": false,
  //   "newestOnTop": false,
  //   "progressBar": true,
  //   "positionClass": "toast-top-right",
  //   "preventDuplicates": false,
  //   "onclick": null,
  //   "showDuration": "300",
  //   "hideDuration": "1000",
  //   "timeOut": "1000",
  //   "extendedTimeOut": "1000",
  //   "showEasing": "swing",
  //   "hideEasing": "linear",
  //   "showMethod": "fadeIn",
  //   "hideMethod": "fadeOut"
  // }

  let tempArr = [...event.target.classList];

  let $submitButton = $(".submitButton");

  if (tempArr.find((el) => el === "alphaReq")) {
    let value = event.target.value;
    if (value) {
      value = value.toUpperCase().replace(/\s+/g, " ").trim();
      event.target.value = value;
      $(`#${event.target.id}`).css("border-color", "");
    } else {
      // toastr.error(`${event.target.name} is required`);
      $(`#${event.target.id}`).css("border-color", "");
    }
  } else if (tempArr.find((el) => el === "alpha")) {
    let value = event.target.value;
    if (value) {
      if (value) {
        value = value.toUpperCase().replace(/\s+/g, " ").trim();
        event.target.value = value;
      }
    }
  } else if (tempArr.find((el) => el === "alphaNumSp")) {
    let value = event.target.value;
    if (value) {
      if (value) {
        value = value.replace(/\s+/g, " ").trim();
        event.target.value = value;
      }
    }
  } else if (tempArr.find((el) => el === "email")) {
    if (
      event.target.value &&
      event.target.value.match(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
      )
    ) {
      document.getElementById(`${event.target.id}`).style.borderColor = "";
    } else if (
      event.target.value == "" ||
      event.target.value === null ||
      event.target.value == undefined
    ) {
      document.getElementById(`${event.target.id}`).style.borderColor = "";
    } else {
      document.getElementById(`${event.target.id}`).style.borderColor = "";
      // toastr.error(`${event.target.name} is invalid`);
    }
  } else if (tempArr.find((el) => el === "min")) {
    if (
      event.target.value === null ||
      event.target.value == "" ||
      event.target.value == undefined ||
      !event.target.value.match("^(?!.*-)(?!.*e-e).+$") ||
      !event.target.value.match("^[^.]*$")
    ) {
      // toastr.error(`Invalid ${event.target.name}`);
      // $submitButton.attr("disabled", true)
      document.getElementById(`${event.target.id}`).focus();
      document.getElementById(`${event.target.id}`).style.borderColor = "red";
      return false;
    } else {
      document.getElementById(`${event.target.id}`).style.borderColor = "";
      return true;
    }
  } else if (tempArr.find((el) => el === "mobile")) {
    if (event.target.value && !event.target.value.match("^[0-9+-s,]{1,}$")) {
      // event.type === 'blur' && toastr.error(`${event.target.name} is invalid`);
      // $submitButton.attr("disabled", true)
      document.getElementById(`${event.target.id}`).style.borderColor = "";

      // return false;
    } else {
      document.getElementById(`${event.target.id}`).style.borderColor = "";
      // $submitButton.attr("disabled", false)
      // return true;
    }
  } else if (tempArr.find((el) => el === "req")) {
    let value = event.target.value;
    if (!value) {
      // toastr.error(`${event.target.name} is required`);
    }
    $(`#${event.target.id}`).css("border-color", "");
  }
}

function onFocusMin(event) {
  $(`#${event.target.id}`).select();
}

function onConditionalRendering(self, event) {
  // toastr.options = {
  //   "closeButton": false,
  //   "newestOnTop": false,
  //   "progressBar": true,
  //   "positionClass": "toast-top-right",
  //   "preventDuplicates": false,
  //   "onclick": null,
  //   "showDuration": "300",
  //   "hideDuration": "1000",
  //   "timeOut": "1000",
  //   "extendedTimeOut": "1000",
  //   "showEasing": "swing",
  //   "hideEasing": "linear",
  //   "showMethod": "fadeIn",
  //   "hideMethod": "fadeOut"
  // }

  // console.log('self', self);
  let $visibleElements = $(
    "input:not([disabled]):visible, select:not([disabled]):visible, button.focussable:not([disabled]):visible, textarea:not([disabled]):visible , button:not([disabled]):visible"
  );
  let currentElementIndex = 0;
  let nextElementIndex = 0;
  $visibleElements.each((index, el) => {
    if (self.target.id == el.id) {
      // console.log(el.id, index);
      currentElementIndex = index + 1;
      nextElementIndex = currentElementIndex + 1;
    }
  });
  let main = $visibleElements.eq(currentElementIndex);
  let nextElement = $visibleElements.eq(nextElementIndex);
  // console.log(currentElementIndex, 'currentElementIndex');
  // console.log(nextElementIndex, 'nextElementIndex');
  let name = main.attr("name");
  let id = main.attr("id");
  if (main.hasClass(" ")) {
    $(".conditionalRendered").on("keydown", (event) => {
      event.preventDefault();
      if (event.keyCode === 13 || event.keyCode === 9) {
        nextElement.focus();
      }
    });
  } else if (main.hasClass("conditionalRenderedReq")) {
    $(".conditionalRenderedReq").on("keydown blur", (event) => {
      event.preventDefault();
      console.log(event);
      if (event.keyCode === 13 || event.keyCode === 9) {
        if (main.val()) {
          nextElement.focus();
        } else {
          main.focus();
          main.css("border-color", "red");
          // toastr.error(`${name} is required`)
        }
      }

      if (event.type === "blur") {
        main.css("border-color", "");
      }
    });
  }
}

///shift + tab backward movement

function onBackwardRendering() {
  let $visibleElements = $(
    "input:not([disabled]):visible, select:not([disabled]):visible, button.focussable:not([disabled]):visible, textarea:not([disabled]):visible , button:not([disabled]):visible"
  );

  let currentElementIndex = $visibleElements.index(this);
  let previousElement = $visibleElements.eq(currentElementIndex - 1);
  let main = $visibleElements.eq(currentElementIndex);

  previousElement.focus();
}

function SubmitValidation() {
  let $visibleElements = $(
    "input:not([disabled]):visible, select:not([disabled]):visible, button.focussable:not([disabled]):visible, textarea:not([disabled]):visible , button:not([disabled]):visible"
  );
}
