function populateVehicleCards(vinNo, purchasedDate) {
    if ($("[data-subtype=book-service]").length > 0) {
        var eligibleServiceTypes = [];
        let getServiceDetail = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile,
            "1": vinNo
        }]
        let getServiceDetailRequest = requestParam("oa_getServiceDetails", getServiceDetail, "2");
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getServiceDetailRequest).then(function(data) {
            if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                let response = JSON.parse(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getServiceDetails.Row[0].serviceStatus);
                if (response.isServiceOpen == "No") {
                    let getFscRow = [{
                        "0": JSON.parse(atob(getCookie('data'))).mobile,
                        "1": vinNo
                    }]
                    if(response.nextServiceDate != '') {
                        $("[data-subtype=book-service]").find('.sub-item1').removeClass('d-none');
                        $("[data-subtype=book-service]").find('.sub-item1 .due-date').text(convertDate(response.nextServiceDate));		
                    }
                    let getFscRequest = requestParam("oa_getFSCDetails", getFscRow, "2");
                    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getFscRequest, getFscRow).then(function(data) {
                        if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getFSCDetails.Row.length > 0) {
                            let response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getFSCDetails.Row[0];
                            $("[data-subtype=book-service]").find('.cardSubtitle.title-pre p').prepend('<span class="free-sc-count">' + response.AvailableFSC + '</span>' + ' ');
                            if (parseInt(response.AvailableFSC) > 0 && getDateDifference(purchasedDate) < 490) {
                                let freeServiceType = [];
                                freeServiceType.push("FSC");
                                let cookieData = JSON.parse(atob(getCookie('data')));
                                cookieData.eligibleServiceTypes = freeServiceType;
                                document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                            }
                        }
                    })
                    $("[data-subtype=book-service]").find('.post-sub').addClass('d-none');
                    $("[data-subtype=book-service]").find('.pre-sub').removeClass('d-none');
                    $("[data-subtype=book-service]").find('.title-post').addClass('d-none');
                    $("[data-subtype=book-service]").find('.title-pre').removeClass('d-none');
                    $("[data-subtype=book-service]").find('.title-present').addClass('d-none');
                } else if (response.isServiceOpen == "Yes" && response.jobCardNumber == '') {
                	$("[data-subtype=book-service]").find('.sub-item1').addClass('d-none')
                    $("[data-subtype=book-service]").find('.pre-sub').addClass('d-none');
                    $("[data-subtype=book-service]").find('.title-pre').addClass('d-none');
                    $("[data-subtype=book-service]").find('.title-post').addClass('d-none');
                    $("[data-subtype=book-service]").find('.title-present').removeClass('d-none');
                    $("[data-subtype=book-service]").find('.post-sub').addClass('d-none');
                    $("[data-subtype=book-service]").find('.cardFooter').addClass('d-none');
                } else if (response.isServiceOpen == "Yes" && response.jobCardNumber != '') {
                	$("[data-subtype=book-service]").find('.sub-item1').addClass('d-none')
                    $("[data-subtype=book-service]").find('.pre-sub').addClass('d-none');
                    $("[data-subtype=book-service]").find('.post-sub').removeClass('d-none');
                    $("[data-subtype=book-service]").find('.title-post').removeClass('d-none');
                    $("[data-subtype=book-service]").find('.title-pre').addClass('d-none');
                    $("[data-subtype=book-service]").find('.title-present').addClass('d-none');
                    setSRid(response.serviceBookingNumber);
                }
            } else {
                $("[data-subtype=book-service]").find('.cardSubtitle ').addClass('d-none');
                $("[data-subtype=book-service]").find('.error-msg').removeClass('d-none');
            }

        })

        let getJoyrideRow = [{
            "0": vinNo,
            "1": {}
        }]
        let getJoyrideRequest = requestParam("oa_getJoyrideDetails_v2", getJoyrideRow, "2");
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getJoyrideRequest).then(function(data) {
            if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getJoyrideDetails_v2.Row.length > 0) {
                    let expiryData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getJoyrideDetails_v2.Row[0].AMC_expirydDate;

                    if (expiryData !== '') {
                        $('.amc-data').removeClass('d-none');
                        $('.amc-expiry-date').text(convertDate(expiryData));
                    } else {
                        $('.amc-data').addClass('d-none');
                    }
                    if (eligibleServiceTypes.indexOf('FSC') == -1 && (new Date(expiryData) > new Date()) && expiryData != '' && parseInt(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getJoyrideDetails_v2.Row[0].AMC_balance) > 0) {
                        eligibleServiceTypes.push("joyride");
                        let cookieData = JSON.parse(atob(getCookie('data')));
                        cookieData.eligibleServiceTypes = eligibleServiceTypes;
                        document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                    }
                }
            }
        })

        getGoodLifeDetails(vinNo);


        if (eligibleServiceTypes.indexOf('FSC') == -1) {
            eligibleServiceTypes.push("paid");
        }
        let cookieData = JSON.parse(atob(getCookie('data')));
        cookieData.eligibleServiceTypes = eligibleServiceTypes;
        document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
    }


    function getDateDifference(purchasedDate) {
        let date1 = new Date();
        let date2 = new Date(purchasedDate);
        var milli_secs = date1.getTime() - date2.getTime();

        // Convert the milli seconds to Days
        var days = milli_secs / (1000 * 3600 * 24);
        return Math.round(Math.abs(days)) - 1;
    }
}

function populatevehicleData(cookieValue) {


    $('.myVehicle-name .myVehicle-modal').text('');
    $('.myVehicle-name .myVehicle-number').text('');
    $("[data-subtype=book-service]").find('.cardSubtitle p').find('span').remove();
    $('.service-details,.vehicle-docs,.vehicle-usermanual').find('.card-body').remove();
    $('.vehicleDetails').find('.engine-no').text('');
    $('.vehicleDetails').find('.vin-no').text('');
    $('.vehicleDetails').find('.purchasedate').text('');

    selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
    populateVehicleCards(selVehCookie.vinNO, selVehCookie.purchaseDate, cookieValue);
    setAccordionData(cookieValue.mobile, selVehCookie.vinNO, selVehCookie.modelName, selVehCookie.purchaseDate, selVehCookie.engine_no);
    vehicleCallbackSucess(selVehCookie, $('.myVehicle-name'), $('.vehicleDataTemplate'));
    $('.myVehImg .bike-img').remove();
    vehicleCallbackSucess(selVehCookie, $('.userbike-img'), $('.vehicleImgDataTemplate'));



}

function getGoodLifeDetails(vinNo) {
    let getGoodlifeRow = {
        "apiName": "goodlife_member_master",
        "requestBody": "{\"CARDNO\":\"\",\"VIN\":\"" + vinNo + "\"}"


    }
    synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getGoodlifeRow).then(function(data) {
    	if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
            let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
            if (responseData.ResponseMessage == "Success") {
            	let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
                if (responseData.Data.Table[0].Card_Number != null && new Date(responseData.Data.Table[0].Valid_Till) > new Date()) {
                	let response = responseData.Data.Table[0];
                	selVehCookie.isGoodLifeEligible = 'Y';
                	selVehCookie.membershipClub = response.MembershipClub;
                	selVehCookie.cardNumber = response.Card_Number;
                    $("[data-subtype=goodlife]").find('.pre-sub').addClass('d-none');
                    $("[data-subtype=goodlife]").find('.post-sub').removeClass('d-none');
                    $("[data-subtype=goodlife]").find('.cardBody .img-fluid').attr('src', $('.goodlife-sub-img').val().split(',')[$('.goodlife-sub-type').val().split(',').indexOf(responseData.Data.Table[0].MembershipClub)]);
                } else {
                	selVehCookie.isGoodLifeEligible = 'N';
                	selVehCookie.membershipClub = '';
                	selVehCookie.cardNumber = '';
                    $("[data-subtype=goodlife]").find('.pre-sub').removeClass('d-none');
                    $("[data-subtype=goodlife]").find('.post-sub').addClass('d-none');
                    $("[data-subtype=goodlife]").find('.cardBody .img-fluid').attr('src', $("[data-subtype=goodlife]").find('.cardBody .img-fluid').data('default-img'));
                }
            	document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(selVehCookie)) + "; path=/";
            }
        }
    })
}

function setAccordionData(mobile, vinNo, modelName, purchasedate, engineno) {
    var getvehicleDocsRow = [{
        "0": "+91",
        "1": mobile,
        "2": vinNo
    }]
    var vehicleDocsdata = requestParam("oa_getVehicleDocs", getvehicleDocsRow);
    var serviceHistoryRow = [{
        "0": mobile,
        "1": vinNo,
        "2": 1,
    }]
    var serviceHistoryReq = requestParam("oa_serviceHistory", serviceHistoryRow, "2");
    var getUserManualRow = [{
        "0": mobile,
        "1": vinNo,
        "2": modelName,
        "3": "EN",
    }]
    var userManualReq = requestParam("oa_getOwnersManual", getUserManualRow);


    if ($('.vehicleDetails').length > 0) {

        $('.vehicleDetails').find('.engine-no').text(engineno);
        $('.vehicleDetails').find('.vin-no').text(vinNo);
        $('.vehicleDetails').find('.purchasedate').text(convertDate(purchasedate));
    }



    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, vehicleDocsdata, getvehicleDocsRow).then(function(data) {
        getVehicleDocDetails = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getVehicleDocs.Row
        if (getVehicleDocDetails.length > 0 && getVehicleDocDetails[0].status !== 'fail') {
            $('.vehicle-docs-section').find('.vehicle-docs').removeClass('d-none');
            vehicleCallbackSucess(getVehicleDocDetails, $('.vehicle-docs'), $('.getVehicleDocsTemplate'));
        } else {
            $('.vehicle-docs-section').find('.vehicle-docs').addClass('d-none');
        }

    })
    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, serviceHistoryReq, serviceHistoryRow).then(function(data) {
        var getServicehisDetails = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_serviceHistory.Row
        if (getServicehisDetails.length > 0 && getServicehisDetails[0].jobCardCompletedDate !== '') {
            $('.serviceHistory').closest('.accordion').removeClass('d-none');
            vehicleCallbackSucess(getServicehisDetails, $('.service-details'), $('.service-detail'));
        } else {
            $('.serviceHistory').closest('.accordion').addClass('d-none');
        }
    })
    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, userManualReq, getUserManualRow).then(function(data) {
        getVehicleDocDetails = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getOwnersManual.Row
        if (getVehicleDocDetails != null) {
            vehicleCallbackSucess(getVehicleDocDetails[0], $('.vehicle-usermanual'), $('.getUserManualTemplate'));
        }
    })
}