$(document).ready(function() {
    if ($('.xclan-wrapper').length > 0) {
        if (getCookie('data') != null) {
            let xclanRidesReq = {
                "apiName": "RideDetail",
                "requestBody": " {\"RideId\":\"" + $.urlParam('rideId') + "\"}"
            }
            synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, xclanRidesReq).then(function(data) {
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                    let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
                    if (responseData.ResponseMessage != null && responseData.ResponseMessage.toLowerCase() == "success") {
                        if (responseData.Data != null) {
                            vehicleCallbackSucess(responseData.Data.Table[0], $('.ride-details'), $('.xclanRideDetails-data'));
                            
                            let endDate = new Date(responseData.Data.Table[0].Date_Period.substr(responseData.Data.Table[0].Date_Period.lastIndexOf('-')+2).replace('AM',' AM').replace('PM',' PM'));
                            if(endDate > new Date()) {
                            	$('.register-for-ride').removeClass('d-none');
                            }
                            setTimeout(setUrl, 1500);
                            function setUrl() {
                                $('.register-for-ride').attr("href",$('.register-for-ride').attr('href').concat('&xclanencfees='+data.encodedxclanFees+"&nonXclanencfees="+data.encodednonxclanFees))

                            }
                        }
                    } else {
                        $('.ride-error').removeClass('d-none');
                    }
                }
            })
            
        } else {
            if (document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
                triggerLoginModal();
            }
        }
    }

})