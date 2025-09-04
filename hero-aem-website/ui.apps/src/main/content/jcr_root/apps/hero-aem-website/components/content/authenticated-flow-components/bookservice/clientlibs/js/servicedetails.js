$(document).ready(function() {
    if ($('.service-container').length > 0 && getCookie('data') != null) {
        let getServicehistoryRow = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile,
            "1": JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
            "2": "5"
        }]
        let getServiceHistoryReq = requestParam("oa_serviceHistory", getServicehistoryRow, "2");
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getServiceHistoryReq, getServicehistoryRow).then(function(data) {
            let history = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_serviceHistory.Row;
            if (history.length > 0) {
                vehicleCallbackSucess(history, $('.service-container'), $('.getServiceHistory'));
                getCities(history[history.length-1].state, history[history.length-1].city)
                $('#dealerstateDropdown').text(history[history.length-1].state);
                getDealers(history[history.length-1].state,history[history.length-1].city,history[history.length-1].dealerCode);
            }

        })


        //let serviceType = ['FSC','Joyride','Paid'];  
        let serviceType = JSON.parse(atob(getCookie('data'))).eligibleServiceTypes;
        if(serviceType.length == 0) {
        	serviceType.push('paid');
        }
        let iteratorObject = serviceType.values();

        for (let serviceTypeValue of iteratorObject) {
          //  $('[data-service-tag=' + serviceTypeValue + ']').siblings().removeClass('active').addClass('active');
            //$('[data-service-tag=' + serviceTypeValue + ']').find('[name=optradio]').removeAttr('disabled').attr('checked', true);
           // $('[data-service-tag=' + serviceTypeValue + ']').removeClass('disabled');
            if($.inArray('FSC', serviceType) !== -1){
				$('[data-service-tag=FSC]').addClass('active');
                $('[data-service-tag=FSC]').find('[name=optradio]').removeAttr('disabled').attr('checked', true);
            }else if($.inArray('FSC', serviceType) !== -1 && $.inArray('joyride', serviceType) !== -1 ){
                    $('[data-service-tag=FSC]').addClass('active');
                    $('[data-service-tag=FSC]').find('[name=optradio]').removeAttr('disabled').attr('checked', true);
                 }
            else if($.inArray('joyride', serviceType) !== -1 && $.inArray('paid', serviceType) !== -1){
                    $('[data-service-tag=joyride]').addClass('active');
                    $('[data-service-tag=joyride]').find('[name=optradio]').removeAttr('disabled').attr('checked', true);
                 }
            else{
					$('[data-service-tag=paid]').addClass('active');
               		$('[data-service-tag=paid]').find('[name=optradio]').removeAttr('disabled').attr('checked', true);
                 }


        }
        $('.service-type-process').each(function(){
            if($.inArray($(this).data('service-tag'), serviceType) !== -1){
$(this).removeClass('disabled');
                $(this).find('[name=optradio]').removeAttr('disabled');

            }else{
                $(this).addClass('disabled');
            }

        });
        $('.service-type-process').on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
           $(this).find('[name=optradio]').removeAttr('disabled').attr('checked', true)
        });


    if ($('.service-type-container').length > 0) {
        let getComplaintCodesRow = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile,
        }]
        let getComplaintCodesReq = requestParam("oa_getComplaintCodes", getComplaintCodesRow, "1");
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getComplaintCodesReq).then(function(data) {
            let codes = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getComplaintCodes.Row;
            if (codes.length > 0) {
                vehicleCallbackSucess(codes, $('.getComplaintCodes'), $('.getCodesTemplate'));
            }

        })
    }
    }

});