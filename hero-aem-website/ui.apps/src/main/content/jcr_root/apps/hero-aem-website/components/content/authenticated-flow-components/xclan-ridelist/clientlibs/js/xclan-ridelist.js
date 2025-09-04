$(document).ready(function() {

    if ($('.ride-list-wrapper').length > 0) {
        if (getCookie('data') != null) {
            $('.ride-list-wrapper').each(function(index, value) {
                let xclanRidesReq = {
                    "apiName": "RideList",
                    "requestBody": " {\"RideStatus\":\"" + $(this).data('ride-type') + "\"}"
                }
                let rideListElement = $(this);
                synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, xclanRidesReq).then(function(data) {
                    if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                        let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
                        if (responseData.ResponseMessage != null && responseData.ResponseMessage.toLowerCase() == "success") {
                            if (responseData.Data != null) {
                                vehicleCallbackSucess(responseData.Data.Table, rideListElement, $(rideListElement).find('.xclanRide-data'));
                            } else {
                                $(rideListElement).find('.no-rides-error').removeClass('d-none');
                            }
                        } else {
                            $(rideListElement).find('.api-error').removeClass('d-none');
                        }
                    }
                })
            });

        } else {
            if (document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
                triggerLoginModal();
            }
        }
    }

})

function getXclanDateDifference(fromDate, toDate) {
    let date1 = new Date(toDate);
    let date2 = new Date(fromDate);
    var milli_secs = date1.getTime() - date2.getTime();

    // Convert the milli seconds to Days
    var days = milli_secs / (1000 * 3600 * 24);
    return Math.round(Math.abs(days));
}