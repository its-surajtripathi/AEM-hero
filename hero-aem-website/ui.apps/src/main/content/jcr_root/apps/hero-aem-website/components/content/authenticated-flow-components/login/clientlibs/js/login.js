$(document).ready(function() {
	 $('.logout-link').on('click', function() {

	    var d = new Date();
        d.setTime(d.getTime());

	     document.cookie="data=null; path=/; expires=" + d.toGMTString();
	     document.cookie="selectedVehicleData=null; path=/; expires=" + d.toGMTString();
	     document.cookie="vehicleDetails=null; path=/; expires=" + d.toGMTString();

	      $('.log-in-link').removeClass('d-none');
                         $('.logout-header').addClass('d-none');
	 });
	 $('#logIn').find('.close').click(function(){
		 if(window.location.href.indexOf('/my-account/') !=-1){
		        window.location.href="/en-in.html"
		 }
	 })
	 customValidationLogin($('#loginForm'));

    $('#loginForm .mobile-number-login').on('keyup', function() {

        if ($(this).val().length == 10 && $(this).valid()) {
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
            event: "Login OTP Requested",
            profileDetials: {
                loginLocation : 'Login Component'
            },
        };
        validateMobileNo($(this))
    });
    $('#loginForm .resend-otp').on('click', function() {
        window.digitalData = {
            event: "Login Resend OTP Requested",
            profileDetials: {
                loginLocation : 'Login Component'
            },
        };
        validateMobileNo($(this))
    });
    $('#loginBtn').on('click', function(event) {
        event.preventDefault();
        if($("[name='loginMobileNo']").valid() &&  $('[name="loginOtp"]').valid()){
            window.digitalData = {
                event: "Header Login Successful",
                profileDetials: {
                    loginLocation : 'Header Login Component'
                },
            };
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

    function validateMobileNo(otpElement) {

        var checkDMSRow = [{
            "0": otpElement.closest('#loginForm').find('.mobile-number-login').val()
        }]
        var dmsRequest = createRequestBody("oa_verifyDMS", checkDMSRow, "2");
        $('#hero-loader').removeClass('d-none');
        sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, dmsRequest, checkDMSRow).then(function(data) {
        	if(data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
	        	if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_verifyDMS.Row[0].status == "success") {
	                var sendOTPRow = [{
	                    "0": "+91",
	                    "1": otpElement.closest('#loginForm').find('.mobile-number-login').val()
	                }]
	                var sendOTPRequest = createRequestBody("oa_sendOTP", sendOTPRow, "10");
	                sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, sendOTPRequest, sendOTPRow).then(function(data) {
	                    if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_sendOTP.Row[0].status == "sent.") {
	                    	$('#loginForm .resend-otp').addClass('show');
	                        $('#loginForm .sent-otp').removeClass('show');
	                    }
	                    $('#hero-loader').addClass('d-none');
	                })
	
	            } else {
	                otpElement.closest('#loginForm').find('.invalid-mobile-message').show();
	                $('#hero-loader').addClass('d-none');
	            }
        	}else{
        		otpElement.closest('#loginForm').find('.api-failure-msg').show();
                $('#hero-loader').addClass('d-none');
        	}
        })
    }

    function getAccessToken(loginElement) {
    	let browser = get_browser();
        let getTokenRow = [{
            "0": "91",
            "1": $("#loginForm").find("[name='loginMobileNo']").val(),
            "2": $("#loginForm").find("[name='loginOtp']").val(),
            "3": "",
            "4": "WEB",
            "5": browser.version,
            "6": browser.name
        }]
        var getTokenRequest = createRequestBody("MB_GET_AUTHORISED", getTokenRow, "26");
        $('#hero-loader').removeClass('d-none');
        sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, getTokenRequest, getTokenRow).then(function(data) {
        	if(data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
	            if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_GET_AUTHORISED.Row[0].status == "success") {
	                var responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_GET_AUTHORISED.Row[0];
	                let dataObject = new Object();
	                dataObject.token = responseData.token.token;
	                dataObject.mediaToken = responseData.mediaToken;
	                dataObject.mobile = responseData.mobile_no;
	                dataObject.name = responseData.name;
	                dataObject.profilePicPath = responseData.profile_pic_path;
	                let now = new Date();let time = now.getTime();time += 3600 * 1000; now.setTime(time);
	                dataObject.expirationTime = now.toUTCString();
	                document.cookie = "data=" + btoa(JSON.stringify(dataObject)) +'; expires=' + now.toUTCString() + "; path=/";
	                $('.log-in-link').addClass('d-none');
	                $('.logout-header').removeClass('d-none');
	                $('.logout-header').find('.profile-name').text(dataObject.name);
	                $('.logout-header').find('.profile-pic-header').attr('src',dataObject.profilePicPath+'?'+atob(dataObject.mediaToken));
	                let getDetailsDMSRow = [{
	                    "0": dataObject.mobile
	                }]
	                var getDetailsDMSRequest = createRequestBody("oa_getDetailsDMS", getDetailsDMSRow, "2");
	                sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, getDetailsDMSRequest, getDetailsDMSRow).then(function(data) {
	                    if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getDetailsDMS.Row.length > 0) {
	                        let authSetDetailAppDBRow = [{
	                            "0": dataObject.mobile,
	                            "1": JSON.stringify(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getDetailsDMS.Row)
	                        }]
	                        var authSetDetailAppRequest = createRequestBody("oa_authSetDetailAppDB", authSetDetailAppDBRow, "1");
	                        sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, authSetDetailAppRequest, authSetDetailAppDBRow).then(function(data) {
	                            if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_authSetDetailAppDB.Row[0].status == "success"){
                                     if(responseData.is_existing == "0") {
                                     	getVehicleData();
                                         window.location.href = $('#loginForm').find('[name="pageAfterLogin"]').val();
                                    }else{
                                    	getVehicleData();
                                    }
	                            }
	                        })
	                    }
	                })
	
	            } else if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.MB_GET_AUTHORISED.Row[0].status == "fail") {
	                loginElement.closest('#loginForm').find('.invalid-otp-message').show();
	                $('#hero-loader').addClass('d-none');
	            }
        	}else {
        		loginElement.closest('#loginForm').find('.api-failure-msg').show();
                $('#hero-loader').addClass('d-none');
        	}
        })
    }
    
    function getVehicleData() {
        var getRow = [{
            "0": "+91",
            "1": JSON.parse(atob(getCookie('data'))).mobile
        }]
        var data = createRequestBody("oa_getVehicle", getRow, "1");

        sendAjaxCall(window.aemConfigs.apiEndpoints.middleWareAPI, data, getRow).then(function(data) {

            var response = data;
            getVehicleDetails = response.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getVehicle.Row

        }).then(function() {

            var vehicleDetailJson = [];
            let selectedVehicle = new Object();
            let defaultVehicleFlag = false;
            for (var i = 0; i < getVehicleDetails.length; i++) {

                if (getVehicleDetails[i].is_default_vehicle == '1' && !defaultVehicleFlag) {
                    selectedVehicle.vinNO = getVehicleDetails[i].vin_no;
                    selectedVehicle.engine_no = getVehicleDetails[i].engine_no;
                    selectedVehicle.licenseNo = getVehicleDetails[i].license_no;
                    selectedVehicle.purchaseDate = convertDate(getVehicleDetails[i].purchase_date);
                    selectedVehicle.imagePath = getImagePath(getVehicleDetails[i].model, getVehicleDetails[i].color);
                    selectedVehicle.modelName = getVehicleDetails[i].model;
                    defaultVehicleFlag = true;
                }
                var vehicleArray = {};
                vehicleArray.vinNO = getVehicleDetails[i].vin_no;
                vehicleArray.engine_no = getVehicleDetails[i].engine_no;
                vehicleArray.modelName = getVehicleDetails[i].model;
                vehicleArray.imagePath = getImagePath(getVehicleDetails[i].model, getVehicleDetails[i].color);
                vehicleArray.purchaseDate = getVehicleDetails[i].purchase_date;
                vehicleArray.licenseNo = getVehicleDetails[i].license_no;
                vehicleDetailJson.push(vehicleArray);

            }
            if(!defaultVehicleFlag) {
            	selectedVehicle.vinNO = getVehicleDetails[0].vin_no;
                selectedVehicle.engine_no = getVehicleDetails[0].engine_no;
                selectedVehicle.licenseNo = getVehicleDetails[0].license_no;
                selectedVehicle.purchaseDate = convertDate(getVehicleDetails[0].purchase_date);
                selectedVehicle.imagePath = getImagePath(getVehicleDetails[0].model, getVehicleDetails[0].color);
                selectedVehicle.modelName = getVehicleDetails[0].model;
            }

            let dataObject = JSON.parse(atob(getCookie('data')));
            let vehicleProfile = new Object();
            dataObject.selectedVehicle = selectedVehicle;
            dataObject.vehicleProfile = vehicleDetailJson;
            document.cookie = "vehicleDetails=" + btoa(JSON.stringify(dataObject.vehicleProfile))+ "; path=/";
            document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(dataObject.selectedVehicle)) + "; path=/";
            if(window.location.href.indexOf('/good-life/') != -1 || window.location.href.indexOf('/xclan/') != -1) {
            	location.reload();
            }else {
                window.location.href = $('#loginForm').find('[name="loggedInPage"]').val();
            }
        })
    }

    function createRequestBody(process_ID, create_row, in_process_ID) {
        var createRequestBody = {
            "PWSESSIONRS": {
                "PWPROCESSRS": {
                    "PWHEADER": {
                        "IN_PROCESS_ID": in_process_ID == null ? "1" : in_process_ID,
                        "APP_ID": "ONEAPP",
                        "ORG_ID": "ONEAPP",
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

    function sendAjaxCall(URL, data) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "POST",
                url: URL,
                data: JSON.stringify(data),
                headers: {
                    'Authorization': getCookie('data') != null ? JSON.parse(atob(getCookie('data'))).token : ''
                },
                success: function(response) {
                    resolve(response); // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                }
            })
        })
    }

    function get_browser() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            return {name:'IE',version:(tem[1]||'')};
            }   
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR|Edge\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }   
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
          name: M[0],
          version: M[1]
        };
     }

});
function convertDate(date) {
    var getDate = new Date(date).getDate();
    var getMonthYear = new Date(date).toLocaleString('en-us', {
        month: 'long',
        year: 'numeric'
    });
    var formattedDate = getDate + ' ' + getMonthYear;
    return formattedDate;
}

function convertShortDate(date) {
    var getDate = new Date(date).getDate();
    getDate = getDate < 10 ? "0" + getDate : getDate
    var getMonthYear = new Date(date).toLocaleString('en-us', {
        month: 'short',
        year: 'numeric'
    });
    var formattedDate = getDate + '-' + getMonthYear;
    return formattedDate;
}

function convertDateTime(dateTime) {
    var getDate = new Date(dateTime).getDate();
    var getMonthYear = new Date(dateTime).toLocaleString('en-us', {
        month: 'long',
        year: 'numeric'
    });
    var formattedDate = getDate + ' ' + getMonthYear;
    const timeString12hr = new Date(dateTime)
        .toLocaleTimeString('en-US', {
            timeZone: 'IST',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        });

    return formattedDate + ', ' + timeString12hr;
}

function convertTime(date) {
    const timeString12hr = new Date(date)
        .toLocaleTimeString('en-US', {
            timeZone: 'IST',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        });

    return timeString12hr;
}
function imgExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function getImagePath(model,color) {
	let path = "/content/dam/hero-aem-website/in/servicejourney/myvehicles/" + model.replace(/ /g, '-').toLowerCase().replace('+', '-').replace('*', '-') + "/" + color.toLowerCase() + ".png"
    if(imgExists(path)) {
    	return path;
    }else if(imgExists("/content/dam/hero-aem-website/in/servicejourney/myvehicles/" + model.replace(/ /g, '-').toLowerCase().replace('+', '-').replace('*', '-') + "/all.png")){
    	return "/content/dam/hero-aem-website/in/servicejourney/myvehicles/" + model.replace(/ /g, '-').toLowerCase().replace('+', '-').replace('*', '-') + "/all.png";
    }else {
    	return "/content/dam/hero-aem-website/in/servicejourney/myvehicles/all.png";
    }
}


// code to return initials of a string

function getInitials(nameString) {
    const fullName = nameString.split(' ');
    let initials;
    if (fullName.length > 1) {
        initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    } else {
        initials = nameString.charAt(0);
    }
    return initials.toUpperCase();
}
