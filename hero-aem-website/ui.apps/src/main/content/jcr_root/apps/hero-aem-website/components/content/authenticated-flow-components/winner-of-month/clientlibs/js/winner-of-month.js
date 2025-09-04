$(document).ready(function() {
    if ($('.winnerdetails').length > 0) {
        let getWinnerDetails = {
        "apiName": "WinnerOfTheMonthGL3",
        "requestBody": "{\"Source\":\"APP\"}",
        "processID":"33"
        }
        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getWinnerDetails).then(function(data) {
        getWinnerDataBanner = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Data;
        getWinnerData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Data;
        if($('.winner-banner-container').length >0){
            vehicleCallbackSucess(getWinnerDataBanner, $('.winner-banner-container'), $('.getWinnerBanner'));
        }
        if($('.bannerdetails').length >0){
            vehicleCallbackSucess(getWinnerData, $('.bannerdetails'), $('.getWinner'));
        }
        })
    }
});