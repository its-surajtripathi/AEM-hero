$(document).ready(function() {
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    if ($('#refer-a-friend').length > 0) {
        populateStates($("[name=state]"), $("[name=city]"));
        var getModelList = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile
        }]
        var getModelListRequest = requestParam("oa_getModelList", getModelList);

        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getModelListRequest).then(function(data) {
            let bikeModels = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getModelList.Row;
            if (bikeModels.length > 0) {
                $.each(bikeModels, function(key, value) {
                    $('[name=bike-model]').append('<option value="' + value.model_name + '">' + value.model_name + '</option>');
                });
            }
        });
    }
    $('.refer-friend-submitBtn').on('click', function(e) {
        e.preventDefault();
        var formFlag;
        $(this).closest('form').find('.form-group').each(function() {
            formFlag = validatingForm($(this));
        });
        formFlag = !($(this).closest('form').find('.hasError').is(':visible'));
        if (formFlag) {
            // $('#result').text(JSON.stringify($('#refer-a-friend').serializeObject()));
            //  var testResult = $('#refer-a-friend').serialize();
        	if($('[name="referralType"]').data("referal-type") == 'good-life') {
        		let referFriendData = [{
	                "0": JSON.parse(atob(getCookie('data'))).mobile,
	                "1": JSON.parse(atob(getCookie('data'))).name,
	                "2": $('[name=name]').val(),
	                "3": $('[name=mobile]').val(),
	                "4": $('[name=state]').val(),
	                "5": $('[name=city]').val(),
	                "6": {}
	            }]
	            let data = requestParam("oa_goodlifeReferals_v2", referFriendData, "1");
        		synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, data, referFriendData).then(function(data) {
	                //sucess pop up need to show
	                let response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_goodlifeReferals_v2.Row[0];
	                if (response.status == 'success') {
	                    $('#submitPopup').modal('toggle');
	                } else {
	                    $('.refer-friend-error').removeClass('d-none');
	                    $('.refer-friend-error').text(response.message);
	                }

	            });
        	}else {
        		 var referFriendDetails = {
        	                agent: "",
        	                bike_model: $('[name=bike-model]').length > 0 ? $('[name=bike-model]').val() : '',
        	                city: $('[name=city]').val(),
        	                email: "",
        	                insert_date: "",
        	                interested_in: "",
        	                ip: "",
        	                mobile: $('[name=mobile]').val(),
        	                name: $('[name=name]').val(),
        	                own_vehicle: "",
        	                postal_code: "",
        	                preferred_dealership: "",
        	                source: "AEM - Refer a friend",
        	                state: $('[name=state]').val(),
        	                token: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
        	                utm_campaign: "",
        	                utm_content: "",
        	                utm_medium: "",
        	                utm_source: "",
        	                utm_term: "",
        	                vehicle_purchase_plan: $('[name="referralType"]').data("referal-type")
        	            }

        	            let encoded = btoa(JSON.stringify(referFriendDetails));
        	            let referFriendData = [{
        	                "0": encoded,
        	                "1": "eyJjb250ZW50LXR5cGUiOiJhcHBsaWNhdGlvbi9qc29uIn0=",
        	                "2": "OneApp_Prospect",
        	                "3": "1",
        	                "4": ""
        	            }]
        	            let data = requestParam("APICALL", referFriendData, "11");
        	            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, data, referFriendData).then(function(data) {
        	                //sucess pop up need to show
        	                let response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.APICALL.Row.response;
        	                if (JSON.parse(response).login == 'true') {
        	                    $('#submitPopup').modal('toggle');
        	                } else {
        	                    $('.refer-friend-error').removeClass('d-none');
        	                    $('.refer-friend-error').text(JSON.parse(response).message);
        	                }

        	            });
        	}
           

        } else {
            $('body').stop().animate({
                scrollTop: 0
            });
        }
    });
    $('.refer-yourself-btn').click(function() {
        if (getCookie('data') != null) {
            var getProfileRow = [{
                "0": "+91",
                "1": JSON.parse(atob(getCookie('data'))).mobile
            }]
            var profileRequest = requestParam("oa_getProfile", getProfileRow);
            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, profileRequest, getProfileRow).then(function(data) {
                var getProfile = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getProfile.Row[0];
                var response = JSON.parse(getProfile.profile);
                $('.refer-a-friend').find('[name=name]').val(response.user_name);
                $('.refer-a-friend').find('[name=mobile]').val(response.mobile_no);
                if($("[name=state] option[value='"+response.state.toUpperCase()+"']").length > 0) {
                	$('.refer-a-friend').find('[name=state]').val(response.state.toUpperCase());
                	populateCity($("[name=state]"), $("[name=city]")).then(function (mmidata){
                		if($("[name=city] option[value='"+response.city.toUpperCase()+"']").length > 0) {
                        	$('.refer-a-friend').find('[name=city]').val(response.city.toUpperCase());
                    	}else {
                        	$('.refer-a-friend').find('[name=city]').css('color', '#ccc');
                    	}
               	 	})
            	}else {
            		$('.refer-a-friend').find('[name=state]').css('color', '#ccc');
                	$('.refer-a-friend').find('[name=state]').closest('.form-group').find('.hasError').remove();
            	}
                
                

            })['catch'](function(response) {
                console.log(response);
            });
        } else {
            if (document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
                triggerLoginModal();
            }
        }

    });
});