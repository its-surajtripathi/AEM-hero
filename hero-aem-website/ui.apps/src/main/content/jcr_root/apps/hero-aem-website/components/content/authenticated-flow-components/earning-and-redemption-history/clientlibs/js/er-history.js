$(document).ready(function() {
    if ($('.earning-history-container').length > 0) {
        let selectedVehData = JSON.parse(atob(getCookie('selectedVehicleData')));
        let getEarningHistory = {
            "apiName": "getTransactions_earning_history",
            "requestBody": "{\"CARDNO\":\"" + selectedVehData.cardNumber + "\",\"TYPE\":\"1\"}"
        }
        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getEarningHistory).then(function(data) {
            getEarningsHistoryData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Data;
            if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseCode == 0){
            $('.earning-history').find('.no-results').removeClass('d-none');
            }
            else{
            vehicleCallbackSucess(getEarningsHistoryData, $('.earning-history'), $('.getEarningHistory'));
            $('.earning-history').find('.no-results').addClass('d-none');
            }

        })
    }
    if ($('.redemption-history-cintainer').length > 0) {
        let selectedVehData = JSON.parse(atob(getCookie('selectedVehicleData')));
        let getRedemptionHistory = {
            "apiName": "getDetails_redemptionHistory",
            "requestBody": "{\"CARDNO\":\"" + selectedVehData.cardNumber + "\"}"
        }
        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getRedemptionHistory).then(function(data) {
            getRedemptionHistoryData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Table;
            if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.StatusCode == 404){
            $('.redemption-history').find('.no-results').removeClass('d-none');
            }
            else{
            vehicleCallbackSucess(getRedemptionHistoryData, $('.redemption-history'), $('.getRedemptionHistory'));
            $('.redemption-history').find('.no-results').addClass('d-none');
            }
        })
    }
});