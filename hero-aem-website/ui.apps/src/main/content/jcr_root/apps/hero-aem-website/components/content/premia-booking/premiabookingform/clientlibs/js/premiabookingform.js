$(document).ready(function () {
  $(".mobile-no").on("keyup", function () {
    if ($(this).val().length == 10 && $(this).valid()) {
      $(this)
        .parent(".cust-form-group")
        .find("#send-otp")
        .removeClass("d-none");
    } else {
      $(this).parents("form").find("#send-otp").addClass("d-none");
      $(this).parents("form").find(".otp-field").prop("disabled", true);
    }
  });

  function formValidation($form) {
    jQuery.validator.addMethod("validNumber", function (value) {
      const disallowedNumbers = [
        "0123456789",
        "1111111111",
        "2222222222",
        "3333333333",
        "4444444444",
        "5555555555",
        "6666666666",
        "7777777777",
        "8888888888",
        "9999999999",
        "0000000000",
        "1234567890",
        "1010101010",
        "2020202020",
        "3030303030",
        "4040404040",
        "5050505050",
      ];
      if (disallowedNumbers.indexOf(value) !== -1) {
        return false;
      }
      if (value.length < 10) {
        return false;
      } else {
        return true;
      }
    });

    jQuery.validator.addMethod("indianNumber", function (value) {
      return /^[6789]\d{9}$/i.test(value);
    });

    jQuery.validator.addMethod("emailOnly", function (value) {
      return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
    });

    jQuery.validator.addMethod("sixDigits", function (value) {
      if (value.length < 6) {
        return false;
      } else {
        return true;
      }
    });

    $form.validate({
      ignore: [],
      rules: {
        mobile: {
          required: true,
          validNumber: true,
          indianNumber: true,
        },
        email: {
          required: true,
          emailOnly: true,
        },
        stateNameVal: {
          required: true,
        },
        cityNameVal: {
          required: true,
        },
        firstname: {
          required: true,
        },
        lastname: {
          required: true,
        },
        address1: {
          required: true,
        },
        pin: {
          required: true,
          sixDigits: true
        },
      },
      messages: {
        mobile: {
          required: $('[name="mobileno"]').data("validation-msg-req"),
          validNumber: "Please enter a valid number",
          indianNumber: "Please enter a valid number",
        },
        email: {
          required: $('[name="email"]').data("validation-msg-req"),
          emailOnly: $('[name="email"]').data("validation-msg-format"),
        },
        stateNameVal: {
          required: $('[name="stateNameVal"]').data("data-validation-msg-req"),
        },
        cityNameVal: {
          required: $('[name="cityNameVal"]').data("data-validation-msg-req"),
        },
        firstname: {
          required: $('[name="firstname"]').data("data-validation-msg-req"),
        },
        lastname: {
          required: $('[name="lastname"]').data("data-validation-msg-req"),
        },
        address1: {
          required: $('[name="address1"]').data("data-validation-msg-req"),
        },
        pin: {
          required: $('[name="pin"]').data("data-validation-msg-req"),
          sixDigits: "Please enter a valid pin code"
        },
      },
    });
  }

  if ($("#harley__form").length) {
    formValidation($("#harley__form"));

    const defaultServletPath = document.getElementById("current-page-path")
      ? document.getElementById("current-page-path").content
      : "/content/hero-aem-website/in/en-in/";

    function isValidOtp(mobile, otp) {
      const reqId = sessionStorage.getItem("tempID");
      return (
        otp.toString() ===
        (Math.abs(hashCode(mobile + reqId)) % 1000000)
          .toString()
          .padStart(6, "0")
      );
    }

    function generateId(len) {
      var arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    }

    function dec2hex(dec) {
      return dec.toString(16).padStart(2, "0");
    }

    function hashCode(s) {
      var h = 0,
        l = s.length,
        i = 0;
      if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
      return h;
    }

    function requestOtp(contactNumber, pageType, vehicleName) {
      sessionStorage.setItem("tempID", generateId());
      var otpdata = {
        phoneNum: contactNumber,
        pageType: pageType,
        reqID: sessionStorage.getItem("tempID"),
      };

      let defaultservlet = $("#defaultservlet").val();
      $.ajax({
        url: defaultservlet + ".sendotp.html",
        type: "POST",
        data: otpdata,
        success: function (resp) {
          console.log(resp);
        },
        error: function (err) {
          console.log(err);
        },
      });
    }

    function onSendOTP() {
      let mobNumber = $(".harley-input.mobile-no").val();
      const pageType = "Premia HD"; // Premia Harley Devidson
      let vehicleName = "X440";
      if (mobNumber) {
        requestOtp(mobNumber, pageType, vehicleName);
      }
    }

    $("#send-otp").click(function (e) {
      e.preventDefault();

      if ($('.otp-field').hasClass("otp--valid") || $('.otp-field').hasClass("otp--invalid")) {
        $('.otp-field').removeClass("otp--valid");
        $('.otp-field').removeClass("otp--invalid")
        $('.valid__otp,.invalid__otp').addClass("d-none");
      }

      var $sendOTP = $(this);
      var $timer = $("#timer");
      var count = 30;
      if (!$(".otp-field").val("")) {
        $(".otp-field").val("");
      }
      onSendOTP();
      $(".otp-field").removeAttr("disabled");
      $(this).text("Resend OTP");
      $timer.text("00:30");
      $timer.show();
      $(this).attr("disabled", true);
      $('.otp--sent').removeClass('d-none');
      var timerInterval = setInterval(function () {
        count--;
        var minutes = Math.floor(count / 60).toString().padStart(2, "0");
        var seconds = (count % 60).toString().padStart(2, "0");
        $timer.text(minutes + ":" + seconds);

        if (count <= 0) {
          clearInterval(timerInterval);
          $timer.text("00:00");
          $timer.hide();
          $('.otp--sent').addClass('d-none');
          $sendOTP.removeAttr("disabled");
        }
      }, 1000);
    });

    $(".harley-input.otp-field").keyup(function () {
      var otpValue = $(this).val();
      let mobNumber = $(".harley-input.mobile-no").val();
      if (otpValue.length === 6) {
        paynowform();
        // Otp Match
        if (isValidOtp(mobNumber, otpValue)) {
          $(this).removeClass("otp--invalid");
          $(this).addClass("otp--valid");
          $('.invalid__otp').addClass("d-none");
          $('.valid__otp').removeClass("d-none");
        } else {
          $(this).removeClass("otp--valid");
          $(this).addClass("otp--invalid");
          $('.valid__otp').addClass("d-none");
          $('.invalid__otp').removeClass("d-none");
        }
      }
    });
  }

  $("#pay-now").on("click", function () {
    $("#magento-form-submit .btn-payment").trigger("click");
  });

  $('#harley__form [name="firstname"]').on("input", function () {
    $("#magento-form-submit #firstname").val($(this).val());
  });

  $('#harley__form [name="lastname"]').on("input", function () {
    $("#magento-form-submit #lastname").val($(this).val());
  });

  $('#harley__form [name="address1"]').on("input", function () {
    $("#magento-form-submit #address1").val($(this).val());
  });

  $('#harley__form [name="address2"]').on("input", function () {
    $("#magento-form-submit #address2").val($(this).val());
  });

  $('#harley__form [name="pin"]').on("input", function () {
    $("#magento-form-submit #pincode").val($(this).val());
  });

  $('#harley__form [name="email"]').on("input", function () {
    $("#magento-form-submit #emailID").val($(this).val());
  });

  $('#harley__form [name="mobile"]').on("input", function () {
    $('#magento-form-submit [name="customer_mobile"]').val($(this).val());
    $('#magento-form-submit [name="customer_address[mobile_no]"]').val(
      $(this).val()
    );
  });

  $('#harley__campaign input[type="text"]').on("change", paynowform);
  $("#paynowcheck").on("change", paynowform);
});

function paynowform() {
  let selectForm = $("#harley__campaign form");
  let payNowFlag = false;
  let payNowChecked = $("#paynowcheck").is(":checked");
  selectForm.find("input").each(function () {
    if (
      !($(this).val().length > 0) ||
      $(this).hasClass("otp--invalid") ||
      !payNowChecked
    ) {
      payNowFlag = false;
      return;
    } else {
      payNowFlag = true;
    }
  });
  if (payNowFlag && selectForm.valid()) {
    $("#pay-now").removeAttr("disabled");
  } else {
    $("#pay-now").attr("disabled", "true");
  }
}
