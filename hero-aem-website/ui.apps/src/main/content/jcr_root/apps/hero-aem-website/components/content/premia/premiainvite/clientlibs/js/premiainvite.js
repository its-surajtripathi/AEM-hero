let timerOn = false;
var lottieAnimationRef;
var timeoutRef;

$(document).ready(function () {
  try {
    $(window).scroll(function () {
      const windowHeight = $(window).height();
      const windowScrollTop = $(window).scrollTop();

      // formula to calculate the height of screen
      const windowCenter = windowScrollTop + windowHeight / 2;

      // scoping the envelope element and calculating its position in the screen
      const $bannerElement = $(".premia-invite");
      if ($bannerElement && $bannerElement.length) {
        const $bannerAnimatedElements = $(".unreveal-envelope");
        const bannerTop = $bannerElement.offset().top;
        const bannerHeight = $bannerElement.outerHeight();
        const bannerBottom = bannerTop + bannerHeight;

        // if envelope element comes to center of the viewport, animation class will be added
        if (windowCenter > bannerTop) {
          $bannerAnimatedElements.each(function () {
            $(this).addClass("reveal-envelope");
          });
        }
      }
    });

    $(".invite-done").click(function () {
      if (window.digitalData) {
        window.digitalData = {
          form: {
            formname: $(".premia-invitation-form form").attr("id"),
            formtype: $(".premia-invitation-form form").attr(
              "data-aa-form-type"
            ),
          },
          page: getPageDetails(),
        };
        _satellite.track("formSuccess");
      }

      $(".premia-invite-success-container")
        .removeClass("d-none")
        .addClass("d-block");
      $(".premia-invite").addClass("d-none");
      lottieAnimationRef.play();
    });

    // $(".premia-invite-circle-circle-text").addClass(
    //   "premia-invite-scrolling-animation"
    // );

    // $(".premia-invite-circle-circle-text").mouseover(function () {
    //   $(this).addClass("premia-invite-scrolling-animation");
    // });
    // $(".premia-invite-circle-circle-text").mouseout(function () {
    //   $(this).removeClass("premia-invite-scrolling-animation");
    //   $(this).addClass("premia-invite-scrolling-animation-anti-clock");
    // });
    // $(".scroll-down").click(function () {
    //   $(".premia-invite-image-wrapper").removeClass("d-none").addClass("d-block");
    //   $(".scroll-down").addClass("d-none");
    // });

    // for opening the modal
    $(".premia-invite-circle").click(function () {
      $(".invite-modal-fade-container").css("display", "block");
      $(".premia-invite").addClass("black-background");
      clearFormFields();
    });
    // for closing the modal
    $(".invite-modal-close").click(function () {
      $(".invite-modal-fade-container").css("display", "none");
      $(".premia-invite").removeClass("black-background");
    });

    // form name field validation
    // $(".name").bind("input propertychange", function () {
    //   if (!$(this).val().match("^[a-zA-Z ]{3,16}[a-zA-Z]$")) {
    //     if (!$(".name").next("span").length) {
    //       $(
    //         "<span class='error-message'>Please enter valid name.</span>"
    //       ).insertAfter($(this));
    //     }
    //   } else {
    //     $(".name").next("span").remove();
    //   }
    // });

    // form email field validation
    // $(".email").bind("input propertychange", function () {
    //   const emailRgx =
    //     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //   if (!$(this).val().match(emailRgx)) {
    //     if (!$(".email").next("span").length) {
    //       $(
    //         "<span class='error-message'>Please enter valid email.</span>"
    //       ).insertAfter($(this));
    //     }
    //   } else {
    //     $(".email").next("span").remove();
    //   }
    // });

    var sendOtp$ = $(".mobilenumber-box").next("a");
    // form contact field validation
    $(".mobilenumber-box").bind("input propertychange", function () {
      var regex = /^(0|91)?[6-9][0-9]{9}$/;

      if (!regex.test($(this).val())) {
        if (!$(".mobilenumber-box").next("span").length) {
          $(
            "<span class='error-message'>Please enter valid contact no.</span>"
          ).insertAfter($(this));
        }
        sendOtp$.removeClass("active").addClass("disabled");
      } else {
        $(".mobilenumber-box").next("span").remove();
        sendOtp$.removeClass("disabled").addClass("active");
      }
    });
    const text = document.querySelector(".premia-invite-circle-circle-text p");
    if (text) {
      text.innerHTML = text.innerText
        .split("")
        .map(
          (char, i) =>
            `<span style="transform:rotate(${i * 5.8}deg)">${char}</span>`
        )
        .join("");
    }

    setTimeout(function () {
      loadLottieFile();
    }, 100);
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keyup", function (e) {
  if (e.code === "Escape") {
    $(".invite-modal-fade-container").css("display", "none");
    $("main").css("position", "inherit");
  }
});

// auto otp box section
$(".otp-container")
  .find("input")
  .each(function () {
    $(this).attr("maxlength", 1);
    $(this).on("keyup", function (e) {
      var parent = $($(this).parent());

      if (e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find("input#" + $(this).data("previous"));
        if (prev.length) {
          $(prev).select();
        }

        disableDoneButton();
      } else if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 96 && e.keyCode <= 105) ||
        e.keyCode === 39
      ) {
        var next = parent.find("input#" + $(this).data("next"));

        let otp = "";
        for (let i = 1; i < 7; i++) {
          otp += $("#digit-" + i).val();
        }
        if (next.length && otp.length != 6) {
          $(next).select();
        } else {
          otp = parseInt(otp, 10);
          const model = "X440";
          const title = $(".name").val();
          const email = $(".email").val();
          const mobile = $(".mobilenumber-box").val();
          sendTestRideData(title, email, mobile, model, otp);
        }
      }
    });
  });

const defaultServletPath =
  document.getElementById("current-page-path").content ||
  "/content/hero-aem-website/in/en-in/";
function sendTestRideData(name, email, mobile, model, otp) {
  if (isValidOtp(mobile, otp)) {
    const source = `AEM-${getOS()}-Premia-Teaser-otp`;
    //"AEM-Windows-undefined-Homepage-otp" // "AEM-OS-category-pageTitle-otp"
    const ip = "";
    // const url= "https://hmclmobazfun02p-dev-old.azurewebsites.net/api/cloudware_prod?ORG_ID=PMP"
    const url =
      $(".container-fluid-width.premia-invite").data("current-resource") +
      ".premiainvite.html";
    var settings = {
      url: url,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        name: name,
        email: email,
        mobile: mobile,
        bike_model: model,
        source: source,
        ip: ip,
      }),
    };

    $.ajax(settings).done(function (response) {
      if (response.includes("success")) {
        updateDOMElements();
      }
    });
  } else {
    if (!$(".otp-container").next("span").length) {
      $(
        "<span class='error-message'>OTP does not match. Please try again.</span>"
      ).insertAfter($(".otp-container"));
    } else {
      $(".otp-container").next("span").remove();
    }
  }
}

function updateDOMElements() {
  $(".otp-container").next("span").remove();
  $(".tick").addClass("d-block").removeClass("d-none");
  $(".invite-done").removeClass("disabled").addClass("active");
  $(".invite-done").removeAttr("disabled");
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
  // generateId() is defined here >> ui.apps\src\main\content\jcr_root\apps\hero-aem-website\clientlibs\clientlib-premia-site\js\util.js
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
            formname: $(".premia-invitation-form form").attr("id"),
            formtype: $(".premia-invitation-form form").attr(
              "data-aa-form-type"
            ),
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
            formname: $(".premia-invitation-form form").attr("id"),
            formtype: $(".premia-invitation-form form").attr(
              "data-aa-form-type"
            ),
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
const pageType = "Premia HD"; // Premia Harley Devidson
let vehicleName = "X440";
function onSendOTP() {
  var mobNumber = $(".mobilenumber-box").val();
  if (mobNumber) {
    $(".otp-label").removeClass("disabled");
    $(".otp-container").removeClass("disable-input");
    requestOtp(mobNumber, pageType, vehicleName);
  }
}

// start timer
function OTPTimer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? "0" + m : m;
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
    otpElement.classList.remove("disabled");
  }
}

function loadLottieFile() {
  // Get the container element
  var container = document.getElementById("invite-lottie-container");
  var ele$ = $(".premia-invite-success-container");
  var mobilePath = ele$.data("lottie-mobile") || ele$.data("lottie");
  var path = $(window).width() < 768 ? mobilePath : ele$.data("lottie");

  //Load the animation JSON file
  lottieAnimationRef = bodymovin.loadAnimation({
    container: container,
    path: path, // Path to your animation JSON file
    renderer: "svg", // Choose the renderer (svg, canvas, html)
    loop: false, // Set loop to true or false
    autoplay: false, // Set autoplay to true or false
  });
}

function clearFormFields() {
  $("#userName").val("");
  $("#userEmail").val("");
  $("#userMobile").val("");
  for (var i = 1; i <= 6; i++) {
    $(`#digit-${i}`).val("");
  }
  $("#premia-invitation-form .error-message").each(function () {
    $(this).remove();
  });
  clearTimeout(timeoutRef);
  timerOn = false;
  $("#sendotp").addClass("disabled").removeClass("active");
  $("#sendotp").text("SEND OTP");
  $("#otptimer").text("");
  $(".otp-label").addClass("disabled");
  $(".otp-container").addClass("disable-input");
}

function disableDoneButton() {
  $(".tick").addClass("d-none").removeClass("d-block");
  $(".invite-done").removeClass("active").addClass("disabled");
  $(".invite-done").attr("disabled");
}
