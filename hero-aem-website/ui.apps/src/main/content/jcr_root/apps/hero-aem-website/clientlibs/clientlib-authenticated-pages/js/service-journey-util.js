function requestParam(process_ID, create_row, in_process_ID) {
    var requestParam = {
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
    return requestParam;
}

function triggerLoginModal() {
	 $('#logIn').modal('toggle');
}
function ajaxHandler(apiurl, process_ID, create_row, in_process_ID) {
    fetch(apiurl, {
            Method: 'POST',


            Body: requestParam(process_ID, create_row),
            Cache: 'default'
        }).then(response => {
            //handle response
            sucessMessage(response);
        })
        .then(data => {
            //handle data

        })
        .catch(error => {
            //handle error
        });
}

function synchronousAjax(URL, data) {
	$('#hero-loader').toggleClass('d-none');
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            url: URL,
            data: JSON.stringify(data),
            headers: {
                'Authorization': JSON.parse(atob(getCookie('data'))).token
            },
            success: function(response) {
				$('#hero-loader').toggleClass('d-none');
				
				if(JSON.stringify(response).indexOf('403') != -1 && JSON.stringify(response).indexOf('Invalid Session Access') != -1) {
					triggerLoginModal();
				}else {
	                resolve(response); // Resolve promise and go to then()
				}
            },
            error: function(err) {
				$('#hero-loader').toggleClass('d-none');
                reject(err) // Reject the promise and go to catch()
            }
        })
    })
}

function setCookies(cookieName, expiryindays) {
    var date = new Date();
    date.setDate(date.getDate() + expiryindays);
    document.cookie = cookieName + " expires=" + date + ";path=/";

}

function vehicleCallbackSucess(response, appendElem, template) {
    // getVehicleDetails =  response.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getVehicle.Row

    var template = _.template(template.html());
    var resultsTemplate = template({
        vehicleDetails: response

    });
    appendElem.append(resultsTemplate);
}

var getCookie = function(name) {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; ++i) {
        let pair = cookies[i].trim().split("=");
        if (pair[0] == name) return pair[1];
    }
    return null;
};

let base64String = "";
// Code to convert file to base 64
function validateImage(file) {
    /*var file = document.querySelector(
        'input[type=file]')['files'][0];*/

    const fsize = file.size;
    const filesize = Math.round((fsize / 1024));
    

    if (filesize >= 4096) {
        alert("File too Big, please select a file less than 4mb");
    } else if (filesize < 1000) {
        alert("File too small, please select a file greater than 2mb");
    } else {
        alert("File size is OK");
    }

}

File.prototype.convertToBase64 = function(){
    return new Promise(function(resolve, reject) {
           var reader = new FileReader();
           reader.onloadend = function (e) {
               resolve({
                 fileName: this.name,
                 result: e.target.result, 
                 error: e.target.error
               });
           };   
           reader.readAsDataURL(this);
   }.bind(this)); 
};

// Code to convert base64 to image
function displayString() {
    var image = new Image();

    image.src = 'data:image/png;base64,' + base64String;

    document.body.appendChild(image);
}

function synchronousAjaxCall(URL, data, method, token) {
	$('#hero-loader').toggleClass('d-none');
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: method,
            url: URL,
            data: data,
            dataType:'jsonp',
            headers: {
                'Authorization': token
            },
            success: function(response) {
				$('#hero-loader').toggleClass('d-none');
				resolve(response); // Resolve promise and go to then()
            },
            error: function(err) {
				$('#hero-loader').toggleClass('d-none');
				reject(err) // Reject the promise and go to catch()
            }
        })
    })
}

function synchronousAjaxCallWithoutDataType(URL, data, method, token) {
	$('#hero-loader').toggleClass('d-none');
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: method,
            url: URL,
            data: data,
            headers: {
                'Authorization': token
            },
            success: function(response) {
				$('#hero-loader').toggleClass('d-none');
				resolve(response); // Resolve promise and go to then()
            },
            error: function(err) {
				$('#hero-loader').toggleClass('d-none');
				reject(err) // Reject the promise and go to catch()
            }
        })
    })
}

function synchronousAjaxCallToAEM(URL, data) {
	$('#hero-loader').toggleClass('d-none');
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            url: URL,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            headers: {
                'Authorization': getCookie('data') == null ? '' : JSON.parse(atob(getCookie('data'))).token
            },
            success: function(response) {
				$('#hero-loader').toggleClass('d-none');
				resolve(response); // Resolve promise and go to then()
            },
            error: function(err) {
				$('#hero-loader').toggleClass('d-none');
				reject(err) // Reject the promise and go to catch()
            }
        })
    })
}


function setSRid(srid) {
	let selectedVehicleCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
	selectedVehicleCookie.SRID = srid;
	document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(selectedVehicleCookie)) + "; path=/";
}


$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

function initiatePayment(price, mobile, vinNo) {
	let requstObj = {
		    "PWSESSIONRS": {
		        "PWPROCESSRS": {
		            "PWDATA": {
		                "CC_PAYMENT_INITIATE": {
		                    "Row": [
		                        {
		                            "0": price,
		                            "1": mobile,
		                            "2": mobile,
		                            "3": vinNo,
		                            "4": ""
		                        }
		                    ]
		                }
		            },
		            "PWERROR": "",
		            "PWHEADER": {
		                "APP_ID": "ONEAPP",
		                "IN_PROCESS_ID": "13",
		                "LOGIN_ID": mobile,
		                "ORG_ID": "ONEAPP",
		                "OUT_PROCESS_ID": "CC_PAYMENT_INITIATE"
		            }
		        }
		    }
		}
	 return new Promise(function(resolve, reject) {
		 synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, requstObj).then(function(data) {
			 resolve(data);
		 })
	 })
}
function getTransactionResults(orderID, mobile , count) {
	return new Promise(function(resolve, reject) {
	let getPaymentStatusRow = [{
		"0": orderID,
        "1": mobile
    }]
	var reqObj = JSON.parse(atob(getCookie('paymentData')))
    var getPaymentStatusReq = requestParam("online_payment_status_cc", getPaymentStatusRow);
		 synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getPaymentStatusReq).then(function(data) {
			 if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.online_payment_status_cc.Row[0].status == 0 && count <= 5) {
				 setTimeout(function() {getTransactionResults(orderID, mobile, count+1)},5000);
			 }else {
				 var result = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.online_payment_status_cc.Row[0];
				 let cardNo = '';
		    		$.each(result, function(k, v) {
		    			$('.'+reqObj.type).html($('.'+reqObj.type).html().replace("${"+k+"}", v));
		    			$('.'+reqObj.type).html($('.'+reqObj.type).html().replace("${"+k+"}", v));
		    		});
		    		if(result.order_status == 'Success') {
						if (window.digitalData) {
							let isSignedIn = "Not Logged In";
							if (getCookie('data'))
							    isSignedIn = "Logged In";
							let formtype = localStorage.getItem('paymentFor');
							if(formtype == 'good-life'){
								window.digitalData = {
									event: 'Enrollment Form Submitted - Payment Success',
									GoodLifeDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										CardId: cardNo,
										TransactionID: result.tran_id,
										BankReffrenceID: result.bank_ref,
										Amount: result.amount
									}
								}
							}
							
						}
						if (window.digitalData) {
							let isSignedIn = "Not Logged In";
							let renew = localStorage.getItem('renewal');
							if (getCookie('data'))
							    isSignedIn = "Logged In";
							let formtype = localStorage.getItem('paymentFor');
							if(formtype == 'xclan'){
								window.digitalData = {
									event: 'Xclan Membership Form - Payment Success',
									XclanMembershipDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										CardId: cardNo,
										TransactionID: result.tran_id,
										BankReferenceID: result.bank_ref,
										Amount: result.amount,
										isRenewal: renew
									}
								}
							}
							else if(formtype == 'xclan-ride'){
								window.digitalData = {
									event: 'Xclan Ride Registration - Payment Success',
									XclanRideDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										CardId: cardNo,
										TransactionID: result.tran_id,
										BankReferenceID: result.bank_ref,
										Amount: result.amount,
										isRenewal: renew
									}
								}
							}
						}
		    			var reqBody = JSON.parse(JSON.stringify(reqObj.requestBody));
		    			reqBody.PAYMENT_REF_NO = result.tran_id;
		    			let insertDataObj = {
			    		        "apiName": reqObj.nextAPICall,
			    		        "requestBody": JSON.stringify(reqBody)
			    		    	}
						synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, insertDataObj).then(function(data) {
							let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
							cardNo = responseData.Data[0].CARD_NO;
							if(responseData.ResponseCode == 1) {
				    			$('.'+reqObj.type).html($('.'+reqObj.type).html().replace(/\${CARD_NO}/g, responseData.Data[0].CARD_NO));
							}
							var d = new Date();
						    d.setTime(d.getTime());
		           	        document.cookie="paymentData=null; path=/; expires=" + d.toGMTString();
		           	     
						})['catch'](function(error) {
							getTransactionResults(orderID, mobile, count+1);
				         })
		    		}else {
						if (window.digitalData) {
							let isSignedIn = "Not Logged In";
							if (getCookie('data'))
							    isSignedIn = "Logged In";
							let formtype = localStorage.getItem('paymentFor');
							if(formtype == 'good-life'){
								window.digitalData = {
									event: 'Enrollment Form Submitted - Payment Failure',
									GoodLifeDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										ErrorMSG: 'Payment Failed...Try again later',
										TransactionID: result.tran_id,
										BankReffrenceID: result.bank_ref,
										Amount: result.amount
									}
								}
							}	
						}
						let isSignedIn = "Not Logged In";
						let renew = localStorage.getItem('renewal');
						if (getCookie('data'))
							isSignedIn = "Logged In";
						if (window.digitalData) {
							let formtype = localStorage.getItem('paymentFor');
							if(formtype == 'xclan'){
								window.digitalData = {
									event: 'Xclan Membership Form - Payment Failure',
									XclanMembershipDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										ErrorMSG: 'Payment Failed...Try again later',
										TransactionID: result.tran_id,
										BankReferenceID: result.bank_ref,
										Amount: result.amount,
										isRenewal: renew
									}
								}
							}
							else if(formtype == 'xclan-ride'){
								window.digitalData = {
									event: 'Xclan Ride Registration - Payment Failure',
									XclanRideDetails:{
										FormName: $('title').text(),
										SignedIn: isSignedIn,
										ErrorMSG: 'Payment Failed...Try again later',
										TransactionID: result.tran_id,
										BankReferenceID: result.bank_ref,
										Amount: result.amount,
										isRenewal: renew
									}
								}
							}
						}
		    			window.location.href = reqObj.serverErrorPage;
		    		}
		    		
		    		resolve(data);
			 }
		 })['catch'](function(error) {
			 window.location.href = reqObj.serverErrorPage;
         })
	})
	
}
function populateStates(stateElement, cityElement) {
	$(stateElement).on('change', function() {
		populateCity(stateElement,cityElement);
		$(cityElement).val($(cityElement).find('option:first').val());
		$(cityElement).css('color',"#b8c1cb"); 
        
    });

	return new Promise(function(resolve, reject) {
	    let cookieData = JSON.parse(atob(getCookie('data')));
	    if (cookieData.mmiToken == null) {
	        let cookieData = JSON.parse(atob(getCookie('data')));
	        let url = window.aemConfigs.apiEndpoints.getListingAPI + '?api=state&geo_bound_type=india&geo_bound=india&get_attr=stt_nme';
	        synchronousAjax(window.aemConfigs.apiEndpoints.getMMIAccessTokenAPI).then(function(data) {
	            cookieData.mmiToken = JSON.parse(data).access_token;
	            document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
	            let token = "bearer " + cookieData.mmiToken;
	            synchronousAjaxCallWithoutDataType(url, "", "GET", token).then(function(mmidata) {
	                mmidata = JSON.parse(JSON.stringify(mmidata));
	                if (mmidata.responseCode == 200) {
	                 //validatingForm($(stateElement).closest('.form-group'));
	                    let statesRow = mmidata.results.get_attr_values[0].get_attr_values;
	                    $.each(statesRow, function(key, value) {
	                        $(stateElement).append('<option value="' + value.stt_nme + '">' + value.stt_nme + '</option>')
	                       
	                    });
	                    sortAscending(stateElement);
	                    resolve(mmidata);
	                }
	            })['catch'](function(error) {
	            	reject(error);
	            })
	        });
	    } else {
	
	        let url = window.aemConfigs.apiEndpoints.getListingAPI + '?api=state&geo_bound_type=india&geo_bound=india&get_attr=stt_nme';
	        let token = "bearer " + cookieData.mmiToken;
	        synchronousAjaxCallWithoutDataType(url, "", "GET", token).then(function(data) {
	            data = JSON.parse(JSON.stringify(data));
	            if (data.responseCode == 200) {
	                let statesRow = data.results.get_attr_values[0].get_attr_values;
	                $.each(statesRow, function(key, value) {
	                    $(stateElement).append('<option value="' + value.stt_nme + '">' + value.stt_nme + '</option>')
	                });
		            sortAscending(stateElement);
	                resolve(data);
	            }
	        })['catch'](function(error) {
            	reject(error);
            })
	    }
	})
    
}
function populateCity(stateElement,cityElement) {
	return new Promise(function(resolve, reject) {
		let cookieData = JSON.parse(atob(getCookie('data')));
	    let url = window.aemConfigs.apiEndpoints.getListingAPI + '?api=city&geo_bound_type=stt_nme&geo_bound=' + encodeURIComponent($(stateElement).val()) + '&get_attr=city_nme';
	    let token = "bearer " + cookieData.mmiToken;
	    synchronousAjaxCallWithoutDataType(url, "", "GET", token).then(function(data) {
	        data = JSON.parse(JSON.stringify(data));
	        if (data.responseCode == 200) {
	            let statesRow = data.results.get_attr_values[0].get_attr_values;
	            validatingForm($(stateElement).closest('.form-group'));
	            $(cityElement).find('option:not(:first)').remove();
	            $.each(statesRow, function(key, value) {
	                $(cityElement).append('<option value="' + value.city_nme + '">' + value.city_nme + '</option>')
	                $(cityElement).removeAttr('disabled');
	            });
	            sortAscending(cityElement);
                resolve(data);
	        }
	    })['catch'](function(error) {
        	reject(error);
        })
	})
}
function sortAscending(element) {
	$(element).find('option:first').after($(element).find('option:not(:first)').sort(function(x, y) {
        return $(x).text() < $(y).text() ? -1 : 1;
    }))
}