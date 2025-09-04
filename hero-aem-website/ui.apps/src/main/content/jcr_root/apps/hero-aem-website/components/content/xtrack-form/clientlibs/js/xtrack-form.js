function validateNumbersOnly(e) {
  var unicode = e.charCode ? e.charCode : e.keyCode;
  if (
    unicode == 8 ||
    unicode == 9 ||
    (unicode > 47 && unicode < 58) ||
    unicode == 43 ||
    unicode == 45
  ) {
    return true;
  } else {
    //alert("This field accepts only Numbers");
    return false;
  }
}
$(document).ready(function () {
  if ($("#register").length > 0) {
    let defaultservlet = document.getElementById("defaultservlet").value;
    let captchText = "";
    let currentForm = $("#contactfrm");
    createCaptcha(currentForm);
    let eventcategory = $("#eventcategory");
    $(".event-names").length > 0 &&
      $(".event-names").each(function () {
        let names = $(this).attr("aria-label");
        eventcategory.append(`<option value="${names}">${names}</option>`);
      });
    $("#Submit").on("click", function () {
      let currentForm = $(this).closest("form");
      if(!$(".invalid-otp-message").hasClass('d-none')){
        $(".invalid-otp-message").addClass("d-none");
      }
      if (currentForm.valid()) {
        if (
          $("#cpatchaTextBox").length > 0 &&
          $("#cpatchaTextBox").val() != captchText
        ) {
          $(".invalid-otp-message").removeClass("d-none");
        } else {
          registerForm();
        }
      } else {
        let formerrorList = currentForm.data("validator").errorList;
        let fieldlist = "";
        $.each(formerrorList, function (key, value) {
          if ("" !== fieldlist) {
            fieldlist = fieldlist + "|";
          }
          fieldlist = fieldlist + formerrorList[key].element.name;
        });
      }
    });

    function registerForm() {
      $("html, body").animate(
        {
          scrollTop: $("form").offset().top - 180,
        },
        1000
      );

      $("#Submit").prop("disabled", true);
      var Submitbutton = document.getElementById("Submit");
      //Submitbutton.src = '/en-in//images/Please-wait.png';
      document.getElementById("Submit").value = "Please wait";
      document.getElementById("Submit").style.letterSpacing = "0.5px";
      document.getElementById("Submit").style.textAlign = "center";

      var event = jQuery("#contactfrm #eventcategory").val()?.replace(/\//g, " per ");
      var name = jQuery("#contactfrm #name").val();
      var age = jQuery("#contactfrm #age").val();
      var email = jQuery("#contactfrm #email").val();
      var mobile = jQuery("#contactfrm #mobile").val();
      var city = jQuery("#contactfrm #city").val();
      var date = jQuery("#contactfrm #date").val();
      var vehicle = jQuery("#contactfrm #existing_vehicle").val();
      var address = jQuery("#contactfrm #address").val();
      var fb_handle = jQuery("#contactfrm #fb_handle").val();
      var tweet_handle = jQuery("#contactfrm #tweet_handle").val();
      var insta_handle = jQuery("#contactfrm #insta_handle").val();
      var data_rider = $("input[name='chk_rider']:checked").val();
      var rider_community_name = jQuery(
        "#contactfrm #rider_community_name"
      ).val();
      var utm_source = "";
      var utm_medium = "";
      var utm_term = "";
      var utm_content = "";
      var utm_campaign = "";
      var source = "";
      var urldata = "";
      var webpath = "/en-in/";
      var url = webpath + "xtracks/?type=" + urldata;

      let eventDesc = $(`[aria-label="${event}"]`).closest(".event-list");
      let eventName = eventDesc.find("h5") && eventDesc.find("h5").text();
      let varLocation =
        eventDesc.find(".location") &&
        eventDesc.find(".location").text().trim();
      let varDate =
        eventDesc.find(".evt-date") &&
        eventDesc.find(".evt-date").text().trim().replaceAll(" ", "");
      let varTime =
        eventDesc.find(".time") && eventDesc.find(".time").text().trim();
      let googleLocation =
        eventDesc.find(".location a") &&
        eventDesc.find(".location a").attr("href");
      var sms_text = `Thank you for registering for Hero Ride Event - ${eventName}. Google location for the event: ${googleLocation}. -HMCL`;
      let xtrackFormData = {
        event: event,
        name: name,
        age: age,
        email: email,
        mobile: mobile,
        city: $(".xpulse-form-wrapp .regform-fields").length ? city : null,
        date: $(".xpulse-form-wrapp .regform-fields").length ? date : null,
        vehicle: vehicle,
        address: address,
        fb_handle: fb_handle,
        tweet_handle: tweet_handle,
        insta_handle: insta_handle,
        data_rider: data_rider,
        rider_community_name: rider_community_name,
        sms_text: sms_text.replaceAll("\n", " "),
      };
      var xtrackRelativePath = $("#register").attr(
        "data-component-relativePath"
      );

      var xtrackFormPath = xtrackRelativePath.replace(
        "jcr:content",
        "_jcr_content"
      );
      // console.log(xtrackFormData, "xtrackFormData");
      $.ajax({
        url: xtrackFormPath,
        type: "POST",
        data: JSON.stringify(xtrackFormData),
        dataType: "json",
        contentType: "application/json",
        success: function (resp) {
          let jsonResp = resp;
          if (typeof jsonResp != "object") {
            jsonResp = JSON.parse(resp);
          }
          if (
            (jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
              .MB_User_RegistrationV2 &&
              jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_User_RegistrationV2
                .Row[0].status == "success") ||
            (jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
              .Xpulse_Xperience_Registration &&
              jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
                .Xpulse_Xperience_Registration.Row[0].status == "success")
          ) {
            if ($('select#eventcategory').val() == "XDrags Underground") {
              window.location.href = "https://insider.in/hero-xdrags-underground-aug6-2023/event";
            }
            else {
              $("select").val("");
              $("input").val("");
              $("textarea").val("");
              $("input[name='chk_rider']").val("0");
              $("#Submit").prop("disabled", true);
              $("#Submit").addClass("disable-btn");
              var Submitbutton = document.getElementById("Submit");
              document.getElementById("Submit").value = "Submit";
              $("#Submit").removeAttr("style");
              $("#tyDiv").show();
              $(".registration-form h6").html("");
              $("#Submit").addClass("disable-btn");
              document.getElementById("error").innerHTML = "";
            }
          } else {
            $("#Submit").prop("disabled", false);
            var Submitbutton = document.getElementById("Submit");
            document.getElementById("Submit").value = "Submit";
            $("#Submit").removeAttr("style");
            let respErrorMsg =
              (jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
                .MB_User_RegistrationV2 &&
                jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
                  .MB_User_RegistrationV2.Row[0].message) ||
              (jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
                .Xpulse_Xperience_Registration &&
                jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA
                  .Xpulse_Xperience_Registration.Row[0].message);
            jQuery("#error").html(respErrorMsg);
            // document.getElementById("thankyou").innerHTML = "";
            $("#tyDiv").hide();
          }
        },
        error: function (error) { },
      });
      return false;
    }
    $("input[name='chk_rider']").on("click", function () {
      var data_rider = $("input[name='chk_rider']:checked").val();
      if (data_rider == 1) {
        $("#chk_name").show();
      } else {
        $("#chk_name").val(" ");
        $("#chk_name").hide();
      }
    });
    function customValidationXtrack($form) {
      // for mobile no fields
      jQuery.validator.addMethod("mobilenoOnly", function (value, element) {
        return /^(6|7|8|9)[0-9]\d{8}$/i.test(value);
      });
      //to allow numbers only
      jQuery.validator.addMethod("numbersOnly", function (value) {
        return /^[0-9]+$/i.test(value);
      });
      //to allow indian numbers only
      jQuery.validator.addMethod("indianNumber", function (value) {
        return /^[6789]\d{9}$/i.test(value);
      });
      //to allow only character
      jQuery.validator.addMethod("charactersOnly", function (value) {
        return /^[a-zA-Z&\s]+$/i.test(value);
      });
      //for email
      jQuery.validator.addMethod("emailOnly", function (value) {
        return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
      });
      //for valid age
      jQuery.validator.addMethod("aboveEighteen", function (value) {
        return /^\d{2,}$/.test(value) && parseInt(value) >= 18;
      });
      //for valid future dates
      jQuery.validator.addMethod("onlyFutureDates", function (value) {
        let pickedDate = Date.parse(value.replace(/-/g, " "));
        let todaysDate = new Date();
        return !(pickedDate <= todaysDate);
      });
      //for valid mobile number
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
      //   book-test-drive-form
      $form.validate({
        ignore: [],
        rules: {
          name: {
            required: true,
            charactersOnly: true,
          },
          mobile: {
            required: true,
            numbersOnly: true,
            validNumber: true,
            indianNumber: true,
          },
          city: {
            required: true,
            charactersOnly: true,
          },
          date: {
            required: true,
            onlyFutureDates: true,
          },
          datepulse: {
            required: true,
            onlyFutureDates: true,
            min: false,
          },
          captcha: {
            required: ".ignore-validation:visible",
          },
          email: {
            required: true,
            emailOnly: true,
          },
          eventcategory: {
            required: true,
          },
          age: {
            aboveEighteen: true,
          },
        },
        messages: {
          name: {
            required: $('[name="name"]').data("validation-msg-req"),
            charactersOnly: $('[name="name"]').data("validation-msg-format"),
          },
          mobile: {
            required: $('[name="mobile"]').data("validation-msg-req"),
            numbersOnly: "Please enter numbers only",
            validNumber: "Please enter a valid number",
            indianNumber: "Please enter a valid number"
          },
          email: {
            required: $('[name="email"]').data("validation-msg-req"),
            emailOnly: $('[name="email"]').data("validation-msg-format"),
          },
          city: {
            required: $('[name="city"]').data("validation-msg-req"),
            charactersOnly: $('[name="city"]').data("validation-msg-format"),
          },
          date: {
            required: $('[name="date"]').data("validation-msg-req"),
            onlyFutureDates: "Date should be greater than current date",
          },
          datepulse: {
            required: $('[name="datepulse"]').data("validation-msg-req"),
            onlyFutureDates: "Date should be greater than current date",
          },
          eventcategory: {
            required: $('[name="eventcategory"]').data("validation-msg-req"),
          },
          age: {
            aboveEighteen: $('[name="age"]').data("validation-msg-req"),
          },
        },
      });
    }
    if ($("#contactfrm").length > 0) {
      customValidationXtrack($("#contactfrm"));
    }

    // CAPTCHA CODE
    function dec2hex(dec) {
      return dec.toString(16).padStart(2, "0");
    }
    function generateId(len) {
      var arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    }
    $(".refresh").on("click", function () {
      createCaptcha($(this).parents("form"));
    });
    function createCaptcha(currentForm) {
      sessionStorage.setItem("tempID", generateId());
      var captchaData = {
        reqID: sessionStorage.getItem("tempID"),
      };
      $.ajax({
        url: defaultservlet + ".captcha.html",
        type: "POST",
        data: captchaData,
        success: function (resp) {
          $(currentForm).find("#captcha-img").remove();
          createCaptchaImage(resp);
          captchText = resp;
        },
        error: function () { },
      });
    }
    function createCaptchaImage(resp) {
      var canv = document.createElement("canvas");
      canv.id = "captcha-img";
      canv.width = 200;
      canv.height = 50;
      var context = canv.getContext("2d");

      context.font = "bold 20px Arial";
      const spaceWidth = canv.width - context.measureText(resp).width - 40;
      const wordSpace = Math.floor(spaceWidth / resp.length);
      let left = 10;
      for (let i = 0; i < resp.length; i++) {
        const deg = (Math.random() * 30 * Math.PI) / 180;
        const x = left;
        const y = canv.height / 2 + Math.random() * 10;

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = "rgb(" + 238 + "," + 35 + "," + 38 + ")";
        context.fillText(resp[i], 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);

        left +=
          context.measureText(resp[i]).width +
          wordSpace +
          Math.floor(Math.random() * 5);
      }

      const strokeLength = resp.length * Math.round(Math.random() + 1) + 3;
      for (let i = 0; i < strokeLength; i++) {
        context.strokeStyle = "rgb(" + 238 + "," + 35 + "," + 38 + ")";
        context.beginPath();
        context.moveTo(Math.random() * 100, Math.random() * 50);
        //context.lineTo(Math.random() * 100, Math.random() * 50);
        const x = Math.random() * 100;
        const y = Math.random() * 50;
        context.moveTo(x, y);
        //context.lineTo(x + 1, y + 1);
        context.stroke();
      }
      document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
    }

    $('[href="#register"]').click(function () {
      $("html, body").animate(
        {
          scrollTop: $("#register").offset().top - 120,
        },
        1000
      );
    });

    $('[href="#upcomingEvents"]').attr({
      "data-toggle": "modal",
      "data-target": "#upcomingEvents",
    });

    let maxLength = $(".event-list").length > 1;
    if (maxLength) {
      $(".event-list").each(function () {
        $(this).parent().addClass("col-md-6 col-lg-6 ");
      });
    } else {
      $(".event-list").each(function () {
        $(this).parent().addClass("col-md-12 col-lg-12 ");
      });
    }

    // Modal JS
    $("#upcomingEvents .btn-register-now").on("click", function () {
      $("#upcomingEvents").modal("hide");
      let eventNames = $(this).attr("aria-label");
      $("#eventcategory").val(eventNames);
      $("html, body").animate(
        {
          scrollTop: $("#register").offset().top - 120,
        },
        1000
      );
    });
  }
});
