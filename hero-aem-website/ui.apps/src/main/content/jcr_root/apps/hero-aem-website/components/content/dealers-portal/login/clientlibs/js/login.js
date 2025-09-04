$(document).ready(function() {
    var verificationAPI = $('.dealersPortalAPI').val();

	 customValidationLogin($('#loginForm'));

   function getPageDetails() {
    let pagePath = window.location.pathname;
    let slug = pagePath.split("/");
    let actualSlug = slug[1].replace(".html", "");
    let primary_category = window.location.origin;
    let fullSplit = primary_category.split("//");
    let pcSplit = fullSplit[1].split(".");
    let title = $("title").text();
    let sub1 = "";
    let sub2 = "";
    let sub3 = "";
    let sub4 = "";
    if ($(".cmp-breadcrumb .breadcrumb-item:eq(0) span").text()) {
      sub1 = $(".cmp-breadcrumb .breadcrumb-item:eq(0) span").text();
      if ($(".cmp-breadcrumb .breadcrumb-item:eq(1) span").text())
        sub2 = $(".cmp-breadcrumb .breadcrumb-item:eq(1) span").text();
      if ($(".cmp-breadcrumb .breadcrumb-item:eq(2) span").text())
        sub3 = $(".cmp-breadcrumb .breadcrumb-item:eq(2) span").text();
      if ($(".cmp-breadcrumb .breadcrumb-item:eq(3) span").text())
        sub4 = $(".cmp-breadcrumb .breadcrumb-item:eq(3) span").text();
    } else {
      if (slug[2]) sub1 = slug[2].replace(".html", "");
      if (slug[3]) sub2 = slug[3].replace(".html", "");
      if (slug[4]) sub3 = slug[4].replace(".html", "");
      if (slug[5]) sub4 = slug[5].replace(".html", "");
    }
    return {
      siteType: "AEM",
      siteCategory: pcSplit[0],
      fullReferringUrl: document.referrer,
      fullSlug: actualSlug,
      fullURL: window.location.href,
      hostName: window.location.origin,
      pagename: title,
      PageTitle: title,
      pageURL: window.location.href,
      path: window.location.pathname,
      category: sub1,
      categorylevel1: sub2,
      categorylevel2: sub3,
      categorylevel3: sub4,
    };
  }

	 $('#loginForm #dealerCode').on('keyup', function() {
             if ($(this).val().charAt(0) != "1") {
                 $(this).parent('.cust-form-group').find('#invalid-dealer-code').removeClass('d-none');
                 $(this).closest('.login-form').find("#loginBtn").prop("disabled", true);
                 $(this).closest('.login-form').find(".mobile-number-login").prop("disabled", true);
                 $(this).closest('.login-form').find(".otp-field").prop("disabled", true);
             }else{
                 $(this).parent('.cust-form-group').find('#invalid-dealer-code').addClass('d-none');
                 $(this).closest('.login-form').find("#loginBtn").prop("disabled", false);
                 $(this).closest('.login-form').find(".mobile-number-login").prop("disabled", false);
                 $(this).closest('.login-form').find(".otp-field").prop("disabled", false);
             }
         });

    $('#loginForm .mobile-number-login').on('keyup', function() {

        if ($(this).val().length == 10 && $(this).valid()) {
            $('.invalid-mobile-message').hide();
            $(this).parent('.cust-form-group').find('.sent-otp').addClass('show');
            $(this).closest('.login-form').find(".otp-field").prop("disabled", false);
        }else{
            $(this).parent('.cust-form-group').find('.sent-otp').removeClass('show');
            $(this).closest('.login-form').find(".otp-field").prop("disabled", true);
        }
    });
    $('#loginForm .otp-field').on("keyup", function () {
    	    if(!$(this).valid()){
    	        $('.invalid-otp-message').hide();
    	    }
    	});

    $('#loginForm .sent-otp').on('click', function() {
      window.digitalData = {
        event: "Dealer Login OTP Requested",
        LoginDetails: {
          loginLocation: 'dealer-portal' + '-' + $("title").text(),
        },
        page: getPageDetails(),
      };
        sendOTP($(this))
    });

    $('#loginForm .resend-otp').on('click', function() {
        window.digitalData = {
      event: "Login Resend OTP Requested",
      LoginDetails: {
        loginLocation:  'dealer-portal' + '-' + $("title").text(),
      },
      page: getPageDetails(),
    };
        sendOTP($(this))
    });

    $('#loginBtn').on('click', function(event) {
        event.preventDefault();
        if($("[name='loginMobileNo']").valid() &&  $('[name="loginOtp"]').valid()){
        	getAccessToken($(this))
        }
    });

    function customValidationLogin($form) {
    $.validator.addMethod("mobilenoOnly", function (value, element) {
    	return /^(6|7|8|9)[0-9]\d{8}$/i.test(value);
      });
    $form.validate({
    	ignore: [],
        rules: {
            loginMobileNo: {
              required: true,
              mobilenoOnly: true,
            },
            loginOtp: {
              required: true

            },
          },
          messages: {
            loginMobileNo: {
                required: $('[name="loginMobileNo"]').data("validation-msg-req"),
                mobilenoOnly: $('[name="loginMobileNo"]').data("validation-msg-val"),
            },
            loginOtp: {
                required: $('[name="loginOtp"]').data("validation-msg-req")
              }
          },
      })
   }

    function sendOTP(otpElement) {
        var sendOTPRow = [{
            "0": otpElement.closest('#loginForm').find('.mobile-number-login').val(),
            "1": otpElement.closest('#loginForm').find('#dealerCode').val()
        }]

        var sendOTPRequest = createRequestBody("MB_login_sms", sendOTPRow, "10");
        $('#hero-loader').removeClass('d-none');
        sendAjaxCall(verificationAPI, sendOTPRequest, sendOTPRow).then(function(data) {
        	if(data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
	        	if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_login_sms.Row[0].status == "sent.") {
					$('#loginForm .resend-otp').addClass('show');
	                $('#loginForm .sent-otp').removeClass('show');
                    $('#hero-loader').addClass('d-none');
                    if (window.digitalData) {
                      window.digitalData = {
                        event: "OTP sent Successful",
                        form: {
                          formname: "dealer-portal" + "-" + $("#LogIn form").attr("id"),
                          formlocation: 'dealer-portal' + '-' +  $("title").text(),
                        },
                        page: getPageDetails(),
                      };
                    }
	            } else {
	                otpElement.closest('#loginForm').find('.invalid-mobile-message').show();
	                $('#hero-loader').addClass('d-none');
	            }
        	}else{
        		otpElement.closest('#loginForm').find('.api-failure-msg').show();
                $('#hero-loader').addClass('d-none');
                if (window.digitalData && window._satellite) {
                  window.digitalData = {
                    event: "OTP fails",
                    form: {
                      formname: "dealer-portal" + "-" + $("#LogIn form").attr("id"),
                      formtype: "dealer-portal-login",
                      fieldlist: "otp",
                    },
                    page: getPageDetails(),
                  };
                  _satellite.track("formError");
                }
        	}
        })
    }



    function createRequestBody(process_ID, create_row, in_process_ID) {
        var createRequestBody = {
            "PWSESSIONRS": {
                "PWPROCESSRS": {
                    "PWHEADER": {
                        "IN_PROCESS_ID": in_process_ID == null ? "1" : in_process_ID,
                        "APP_ID": "HMBPT",
                        "ORG_ID": "HMBPT",
                        "OUT_PROCESS_ID": process_ID,
                        "LOGIN_ID": ""
                    },
                    "PWDATA": {
                        [process_ID]: {
                            "Row": create_row
                        }
                    },
                    "PWERROR": ""
                }
            }
        }
        return createRequestBody;
    }

   function getAccessToken(loginElement) {
    //var dataObj = {};
        let getTokenRow = [{
            "0": $("#loginForm").find("[name='dealerCode']").val(),
            "1": $("#loginForm").find("[name='loginOtp']").val()


        }]
        var getTokenRequest = createRequestBody("MB_Verify_OTP_latest", getTokenRow, "1");
        $('#hero-loader').removeClass('d-none');
        sendAjaxCall(verificationAPI, getTokenRequest, getTokenRow).then(function(data) {
        	if(data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
	            if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_Verify_OTP_latest.Row[0].success == "1") {
                window.digitalData = {
                  event: "Dealer Login Successful",
                  LoginDetails: {
                    loginLocation:  'dealer-portal' + '-' +  $("title").text(),
                  },
                  page: getPageDetails(),
                };
	                var responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_Verify_OTP_latest.Row[0];
					document.cookie = "respData=" + btoa(JSON.stringify(responseData))+ "; path=/; Secure";
					var concatData = responseData.dealer_code + "," + responseData.token +  "," + responseData.area_office_code;

	                $('.log-in-link').addClass('d-none');
	                $('.logout-header').removeClass('d-none');
                    document.cookie = "sessionStat=" + btoa(concatData) + "; path=/; Secure";
                    window.location.href = $('#loginForm').find('[name="loggedInPage"]').val();

	            } else if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_Verify_OTP_latest.Row[0].success != "1") {
	                loginElement.closest('#loginForm').find('.invalid-otp-message').show();
	                $('#hero-loader').addClass('d-none');
	            }
        	}else {
        		loginElement.closest('#loginForm').find('.api-failure-msg').show();
                $('#hero-loader').addClass('d-none');
        	}
        })
    }

function sendAjaxCall(URL, data) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "POST",
                url: URL,
                data: JSON.stringify(data),

                success: function(response) {
                    resolve(response); // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                }
            })
        })
    }
});
