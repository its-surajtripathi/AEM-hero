$(document).ready(function() {
    if ($('.service-history').length > 0) {
        var serviceRecordData = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile,
            "1": JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
            "2": "10"
        }]
        var serviceRecordDataRequest = requestParam("oa_serviceHistory", serviceRecordData, "2");
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, serviceRecordDataRequest, serviceRecordData).then(function(data) {
            getServiceData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_serviceHistory.Row;
            vehicleCallbackSucess(getServiceData, $('.service-history'), $('.getServiceHistory'));
            $('.sr-details-link').click(function(e){
            	e.preventDefault();
            	setSRid($(this).parents('.serviceRecord-history').find('.sr-id').text());
            	window.location.href = $(this).attr('data-url');
            })
        })
    }
    
});