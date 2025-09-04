let timerOn = false;
var timeoutRef;
let otp = "";
let model = "X440";
let title = "";
let email = "";
let mobile = "";
let pincode = "";
var sendOtp$ = $("#sendotp");
const optbox$ = $(".otpbox");

function IsNumeric(e) {
  let charCode = e.which ? e.which : e.keyCode;
  if (
    (charCode > 95 && charCode < 106) ||
    (charCode > 47 && charCode < 58) ||
    charCode == 37 ||
    charCode == 39 ||
    charCode == 8 ||
    charCode == 9
  ) {
    return true;
  }
  e.preventDefault();
  return false;
}

$(document).ready(function () {
  try {
    $("#success-wrapper").hide();
    document.getElementById("successmessage").controls = false;
    $(".btn-submit").click(function () {
      if (window.digitalData) {
        window.digitalData = {
          form: {
            formname: $(".leadgen-invite-form form").attr("id"),
            formtype: $(".leadgen-invite-form form").attr("data-aa-form-type"),
          },
          page: getPageDetails(),
        };
        _satellite.track("formSuccess");
      }

      $(".premia-invite-success-container")
        .removeClass("d-none")
        .addClass("d-block");
      $(".premia-invite").addClass("d-none");
    });

    // form email field validation
    $(".email").bind("input propertychange", function () {
      const emailRgx =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!$(this).val().match(emailRgx)) {
        if (!$(".email").next("span").length) {
          $("<span class='error-message'>Invalid email</span>").insertAfter(
            $(this)
          );
        }
      } else {
        $(".email").next("span").remove();
        isFormValid();
      }
    });

    // pincode validation
    $(".pincode").on("keyup keydown keypress", function (e) {
      $(this)
        .val()
        .replace(/[^0-9\.]/g, "");
      if (IsNumeric(e)) {
        var regex = /^[1-9][0-9]{5}$/;
        if ($(this).val().length < 6 || $(this).val().length > 6) {
          $("#pincodeerrormessage").text("Pincode must be 6 digits");
        } else if (!regex.test($(this).val())) {
          $("#pincodeerrormessage").text("Invalid Pincode");
        } else {
          $("#pincodeerrormessage").text("");
          isFormValid();
        }
      }
    });

    // form contact field validation
    $(".mobileNumber").on(
      "keyup keydown keypress input propertychange",
      function (e) {
        $(this)
          .val()
          .replace(/[0-5][^0-9]/g, "");
        if (IsNumeric(e)) {
          var regex = /^[6-9][0-9]{9}$/;
          sendOtp$.removeClass("active").addClass("disabled");
          if ($(this).val().length < 10 || $(this).val().length > 10) {
            $("#phoneerrormessage").text("Phone number must be 10 digits");
          } else if (!regex.test($(this).val())) {
            $("#phoneerrormessage").text("Invalid Phone");
          } else {
            $("#phoneerrormessage").text("");
            sendOtp$.removeClass("disabled").addClass("active");
            optbox$.removeAttr("disabled");
            isFormValid();
          }
        }
      }
    );

    $("#lead-gen-submit-button").addButtonMusic();

    // on scroll, element will be rotated
    if ($(".acaa-invite").data("invite-present")) {
      if (isDesktop()) {
        $(window).scroll(function () {
          rotateOnScroll();
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// function to rotate an element on scroll
function rotateOnScroll() {
  const windowHeight = $(window).height();
  const windowScrollTop = $(window).scrollTop();

  // formula to calculate the height of screen
  const windowCenter = windowScrollTop + windowHeight / 2;

  // scoping the lead-gen element and calculating its position in the screen
  const $leadGenSectionElement = $(".acaa-invite-container");
  const $leadGenAnimatedElement = $(".leadgen-invite-wrapper");
  const sectionTop = $leadGenSectionElement.offset().top;
  const sectionHeight = $leadGenSectionElement.outerHeight();
  const sectionBottom = sectionTop + sectionHeight;

  if (windowCenter < sectionTop) {
    $leadGenAnimatedElement.css("transform", "rotate(-6deg)");
    $leadGenAnimatedElement.css("bottom", "-60px");
  } else if (windowCenter > sectionBottom) {
    $leadGenAnimatedElement.css("transform", "rotate(6deg)");
    $leadGenAnimatedElement.css("bottom", "60px");
  } else {
    $leadGenAnimatedElement.css("transform", "rotate(0deg)");
    $leadGenAnimatedElement.css("bottom", "0px");
  }
}

// auto otp box section
$(".otp-container")
  .find("input")
  .each(function () {
    $(this).attr("maxlength", 1);
    $(this).on("keyup input touchend", function (e) {
      var parent = $($(this).parent());

      if (e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find("input#" + $(this).data("previous"));
        if (prev.length) {
          $(prev).select();
        }

        disableSubmitButton();
      } else if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 105) ||
        e.keyCode === 39
      ) {
        var next = parent.find("input#" + $(this).data("next"));
        otp = "";
        for (let i = 1; i < 7; i++) {
          otp += $("#digit-" + i).val();
        }
        if (next.length && otp.length != 6) {
          $(next).select();
        } else {
          otp = parseInt(otp, 10);
          if (isValidOtp(mobile, otp)) {
            isFormValid();
          } else {
            validateOTP();
          }
        }
      }
    });
  });

const defaultServletPath =
  document.getElementById("current-page-path").content ||
  "/content/hero-aem-website/in/en-in/";
function sendTestRideData(name, email, mobile, model, pincode, otp) {
  if (isValidOtp(mobile, otp)) {
    const source = `AEM-${getOS()}-ACAA-Brand-Teaser-otp` || "CWS";
    //"AEM-Windows-undefined-Homepage-otp" // "AEM-OS-category-pageTitle-otp"
    let ip = "";
    try {
      fetch("/content/hero-aem-website/in/en-in.ip.html")
        .then((response) => response.json())
        .then((data) => {
          console.debug("CLIENT IP:", data.Client_IP);
          ip = data.Client_IP;
        });
    } catch (error) {
      console.error(error);
    }
    // const url= "https://hmclmobazfun02p-dev-old.azurewebsites.net/api/cloudware_prod?ORG_ID=PMP"
    const url =
      $(".container-fixed-width.acaa-invite").data("current-resource") +
      ".generatelead.html";
    var settings = {
      url: url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        // configName: "configAcaa",    // optional parameter
        MOBILE_NO: mobile,
        REQ_FORMAT: JSON.stringify({
          PWSESSIONRS: {
            PWPROCESSRS: {
              PWHEADER: {
                IN_PROCESS_ID: "1",
                APP_ID: "PMP_T",
                ORG_ID: "PMP_T",
                OUT_PROCESS_ID: "premia_teaser",
                LOGIN_ID: "983cbae056bf020530b1be6d9c97d022",
              },
              PWDATA: {
                premia_teaser: {
                  Row: [
                    {
                      0: name,
                      1: email,
                      2: mobile,
                      3: model,
                      4: source,
                      5: ip,
                      6: pincode,
                    },
                  ],
                },
              },
              PWERROR: "",
            },
          },
        }),
      }),
    };

    $.ajax(settings).done(function (response) {
      if (response.toLowerCase().includes("success")) {
        closeFullscreen();
        otp = "";
        $("#success-wrapper").show();
        $(".form-container").css("top", "4px");
        $(".leadgen-invite-form").hide();
        $(".form-button-container").hide();
        const successVideo = document.getElementById("successmessage");
        successVideo.currentTime = 0;
        successVideo.play();
        updateDOMElements();
        clearFormFields();
        document.querySelector("#otperrormessage").innerHTML = "";
      }
    });
  } else {
    validateOTP();
  }
}

function updateDOMElements() {
  $(".otp-container").next("span").remove();
  $(".btn-submit").removeClass("disabled").addClass("active");
  $(".btn-submit").removeAttr("disabled");
}

function getPageDetails() {
  let title = $("title").text();
  let category = window.location.pathname.split("/")[2];
  let splitedUrl = window.location.origin.split("//");
  let splitedDomain = splitedUrl[1].split(".");
  let siteCategory;
  if (splitedDomain[1] === "heromotocorp") {
    siteCategory = "corporate";
  }
  if (splitedDomain[1] === "dealers") {
    siteCategory = "dealer";
  }
  return {
    sitetype: "AEM",
    siteCategory: siteCategory,
    fullReferringUrl: document.referrer,
    pageName: title,
    pageUrl: window.location.href,
    path: window.location.pathname,
    category: category,
  };
}

function requestOtp(contactNumber, pageType, vehicleName) {
  // generateId() is defined here >> js\util.js
  sessionStorage.setItem("tempID", generateId());
  let form = new FormData();
  form.append("phoneNum", contactNumber);
  form.append("pageType", pageType);
  form.append("vehicleName", vehicleName);
  form.append("reqID", sessionStorage.getItem("tempID"));

  const settings = {
    url: defaultServletPath + ".sendotp.html",
    method: "POST",
    headers: {},
    mimeType: "multipart/form-data",
    processData: false,
    contentType: false,
    data: form,
    success: function () {
      if (window.digitalData) {
        window.digitalData = {
          event: "OTP sent Successful",
          form: {
            formname: $(".leadgen-invite-form form").attr("id"),
            formtype: $(".leadgen-invite-form form").attr("data-aa-form-type"),
          },
          page: getPageDetails(),
        };
      }
    },
    error: function () {
      if (window.digitalData && window._satellite) {
        window.digitalData = {
          event: "OTP fails",
          form: {
            formname: $(".leadgen-invite-form form").attr("id"),
            formtype: $(".leadgen-invite-form form").attr("data-aa-form-type"),
            fieldlist: "otp",
          },
          page: getPageDetails(),
        };
        _satellite.track("formError");
      }
    },
  };

  $.ajax(settings).done(function (response) {
    const result = JSON.parse(response);
    if (JSON.parse(result["New smsResult"]).STATUS === "OK") {
      timerOn = true;
      OTPTimer(30);
    } else {
      console.error(
        "Something went wrong. We got an error Response.",
        response
      );
    }
  });
}

function isValidOtp(mobile, otp) {
  // if (otp == "123456") {
  //   updateDOMElements();
  //   return true;
  // }
  const reqId = sessionStorage.getItem("tempID");
  return (
    otp.toString().padStart(6, "0") ===
    (Math.abs(hashCode(mobile + reqId)) % 1000000).toString().padStart(6, "0")
  );
}
const pageType = "ACAA"; // Premia ACAA
const vehicleName = "Karizma XMR";
function onSendOTP() {
  var mobNumber = $(".mobileNumber").val();
  if (mobNumber) {
    $(".otp-label").removeClass("disabled");
    $(".otp-container").removeClass("disable-input");
    optbox$.removeAttr("disabled");
    requestOtp(mobNumber, pageType, vehicleName);
  }
}

// start timer
function OTPTimer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  s = s < 10 ? "0" + s : s;
  document.getElementById("otptimer").innerHTML = m + ":" + s;
  remaining -= 1;
  const otpElement = document.getElementById("sendotp");
  if (remaining >= 0 && timerOn) {
    otpElement.innerText = "RESEND OTP";
    otpElement.classList.remove("active");
    otpElement.classList.add("disabled");
    timeoutRef = setTimeout(function () {
      OTPTimer(remaining);
    }, 1000);
    return;
  } else {
    otpElement.innerText = "RESEND OTP";
    otpElement.classList.add("active");
    otpElement.classList.add("resend");
    otpElement.classList.remove("disabled");
  }
}

function clearFormFields() {
  otp = "";
  $(".name").val("");
  $(".email").val("");
  $(".mobileNumber").val("");
  $(".pincode").val("");
  for (var i = 1; i <= 6; i++) {
    $(`#digit-${i}`).val("");
  }
  $("#leadgen-invite-form .error-message").each(function () {
    $(this).remove();
  });
  clearTimeout(timeoutRef);
  timerOn = false;
  $("#sendotp").addClass("disabled").removeClass("active");
  $("#sendotp").text("SEND OTP");
  $("#otptimer").text("");
  $(".otp-label").addClass("disabled");
  $(".otp-container").addClass("disable-input");
  sendOtp$.removeClass("active").addClass("disabled");
  optbox$.attr("disabled");
}
function disableSubmitButton() {
  $(".btn-submit").removeClass("active").addClass("disabled");
  $(".btn-submit").attr("disabled");
}

function enableSubmitButton() {
  document.querySelector("#otperrormessage").innerHTML = "";
  $(".btn-submit").removeClass("disabled").addClass("active");
  $(".btn-submit").removeAttr("disabled");
}

function sendLeadgenData() {
  getformData();
  if (model && title && email && mobile && pincode) {
    sendTestRideData(title, email, mobile, model, pincode, otp);
  }
}

function isFormValid() {
  getformData();
  if (
    model &&
    title &&
    email &&
    mobile &&
    pincode &&
    otp &&
    isValidOtp(mobile, otp)
  ) {
    enableSubmitButton();
    return true;
  } else {
    disableSubmitButton();
    return false;
  }
}
function getformData() {
  title = $(".name").val();
  email = $(".email").val();
  mobile = $(".mobileNumber").val();
  pincode = $(".pincode").val();
}

function submitNewLead() {
  disableSubmitButton();
  clearFormFields();
  $("#success-wrapper").hide();
  $(".leadgen-invite-form").show();
  $(".form-button-container").show();
}

function validateOTP() {
  const otperrormessage$ = document.querySelector("#otperrormessage");
  if (!isValidOtp(mobile, otp)) {
    otperrormessage$.innerHTML = "OTP does not match";
  } else {
    otperrormessage$.innerHTML = "";
    isFormValid();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}
