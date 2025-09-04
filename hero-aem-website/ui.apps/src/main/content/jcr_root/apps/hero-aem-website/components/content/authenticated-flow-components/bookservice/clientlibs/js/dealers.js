$(document).ready(function() {

    if ($('.dealer-details').length > 0) {
    $('#dealercityDropdown').addClass('disabled');
        if (getCookie('data') != null) {
            $('.location-icon').click(function() {
                if ("geolocation" in navigator) { //check geolocation available 
                    navigator.geolocation.getCurrentPosition(function(position) {
                        getMMIToken(position.coords.latitude, position.coords.longitude);
                    }, function() {
                        $('.location-error').removeClass('d-none');
                    });
                } else {
                    console.log("Browser doesn't support geolocation!");
                }
                if (JSON.parse(atob(getCookie('data'))).mmiToken != null) {
                    getLocationDetails().then(function(locationDetails) {
                        getDealers(locationDetails[0], locationDetails[1]);
                        $('#dealercityDropdown').removeClass('disabled');
                        $('#dealerstateDropdown').text($('#dealerstateDropdown').attr('data-default-label'));
                        $('#dealercityDropdown').text($('#dealercityDropdown').attr('data-default-label'));
                    });

                }
            });

            function getMMIToken(latitude, longitude) {
                if (JSON.parse(atob(getCookie('data'))).mmiToken == null) {

                    synchronousAjax(window.aemConfigs.apiEndpoints.getMMIAccessTokenAPI).then(function(data) {
                        let cookieData = JSON.parse(atob(getCookie('data')));
                        cookieData.mmiToken = JSON.parse(data).access_token;
                        cookieData.latitude = latitude;
                        cookieData.longitude = longitude;
                        document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                        getLocationDetails().then(function(locationDetails) {
                            getDealers(locationDetails[0], locationDetails[1]);
                        });
                    });
                } else if (JSON.parse(atob(getCookie('data'))).latitude == null) {
                    let cookieData = JSON.parse(atob(getCookie('data')));
                    cookieData.latitude = latitude;
                    cookieData.longitude = longitude;
                    document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                    getLocationDetails().then(function(locationDetails) {
                        getDealers(locationDetails[0], locationDetails[1]);
                    });
                }
            }

            function getLocationDetails() {
                return new Promise(function(resolve, reject) {
                    let cookieData = JSON.parse(atob(getCookie('data')));
                    let url = window.aemConfigs.apiEndpoints.getLocationDetails.replace('{token}', cookieData.mmiToken) + '?lat=' + cookieData.latitude + '&lng=' + cookieData.longitude;
                    let token = "bearer " + cookieData.mmiToken;
                    synchronousAjaxCall(url, "", "GET", token).then(function(data) {
                        var stateCity = [];
                        if (data.responseCode == 200) {
                            stateCity.push(data.results[0].state);
                            if (data.results[0].city == '') {
                                stateCity.push(data.results[0].city);
                            } else {
                                stateCity.push(data.results[0].district.replace(' District', ''));
                            }
                        }
                        resolve(stateCity);
                    })
                })
            }

            var getDealerStatesRow = [{
                "0": "+91",
                "1": JSON.parse(atob(getCookie('data'))).mobile
            }]
            var dealerStateRequest = requestParam("oa_getDealerStates", getDealerStatesRow, "1");
            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, dealerStateRequest, getDealerStatesRow).then(function(data) {
                let states = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getDealerStates.Row;
                if (states.length > 0) {
                    $.each(states, function(key, value) {
                        $('.dealer-state-dropdown').append('<li><a href="javascript:void(0)">' + value.STATE + '</a></li>');
                    });
                }

            })
            $(".dealear-state-city .dealer-state-dropdown, .dealear-state-city .dealer-city-dropdown").on(
                "click",
                "li",
                function() {
                    let selectionGroup = $(this).parents(".form-group");
                    var button = selectionGroup.find(".dropdown-select");
                    button.text($(this).find('a')[0].innerHTML.replaceAll('&amp;', '&'));
                    var form = $(this).closest("form");
                    selectionGroup.find(".dropdown-menu li").removeClass("active");
                    $(this).addClass("active");
                    if ("dealerstatename" == button.attr("name")) {
                        getCities(button.text());
                    } else if ("dealercityname" == button.attr("name")) {
                        getDealers($('#dealerstateDropdown').text(), button.text());
                    }

                });

            


            
        } else {
        	if(document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
        		triggerLoginModal();
        	}
        }
          $(document).on('click','.dealers-card',function(){
            if($('.sub-item2').find('input').is(':checked')){
            $('#dealer-sec-container').find('.nxt-btn').removeClass('disabled');
            $('#self-jobcard-container').find('.nxt-btn').removeClass('disabled');
            $('#dealer-sec-container').find('alert-danger').addClass('d-none');
            }else{
                 $('#dealer-sec-container').find('alert-danger').removeClass('d-none');
                 $('#dealer-sec-container').find('.nxt-btn').addClass('disabled');
            }
        });
    }
});
function getCities(stateName, cityName) {
    var getDealerCitiesRow = [{
        "0": "+91",
        "1": JSON.parse(atob(getCookie('data'))).mobile,
        "2": stateName
    }]
    var dealerCityRequest = requestParam("oa_getDealerCities", getDealerCitiesRow, "1");
    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, dealerCityRequest, getDealerCitiesRow).then(function(data) {
        let cities = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getDealerCities.Row;
        $('#dealercityDropdown').text($('#dealercityDropdown').attr('data-default-label'));
        if (cities.length > 0) {
            $('.dealer-city-dropdown').empty();
            $.each(cities, function(key, value) {
            $('#dealercityDropdown').removeClass('disabled');
                $('.dealer-city-dropdown').append('<li><a href="javascript:void(0)">' + value.CITY + '</a></li>');

            });
        }
        $('#dealercityDropdown').text(cityName);

    })
}
function getDealers(stateName, cityName, dealerCode) {
    var getDealersRow = [{
        "0": "+91",
        "1": JSON.parse(atob(getCookie('data'))).mobile,
        "2": stateName,
        "3": cityName
    }]
    var dealersRequest = requestParam("oa_getDealers", getDealersRow, "1");
    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, dealersRequest, getDealersRow).then(function(data) {
        let dealers = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getDealers.Row;
        $('.dealers-card').remove();
        if (dealers.length > 0) {
            $('.no-dealers-msg').addClass('d-none');
            $('.dealer-msg').removeClass('d-none');
            $('.dealer-count').text(dealers.length);
            vehicleCallbackSucess(dealers, $('.dealers-list'), $('.getDealers'));
            $(".sub-item2 input[type=checkbox]").on('click',function(e){
                $(".sub-item2 input[type=checkbox]").not(this).prop('checked', false);
             });
        } else {
            $('.no-dealers-msg').removeClass('d-none');
            $('.dealer-msg').addClass('d-none');
        }

    }).then(function(data){
    	if($('.dealers-list input[type=checkbox][value='+dealerCode+']').length > 0) {
        	$('.dealers-list input[type=checkbox][value='+dealerCode+']').prop('checked', true);
            $('#self-jobcard-container').find('.nxt-btn').removeClass('disabled');
        	$('.nxt-btn.dealer-nxt').removeClass('disabled');
    	}else {
    		$('.nxt-btn.dealer-nxt').addClass('disabled');
    	}
    	getDealersDistance();
    })


}
function getDealersDistance() {
    if (JSON.parse(atob(getCookie('data'))).mmiToken != null) {
        $('.dealers-card').each(function(index) {
            getDealersELoc($(this), $(this).find('.dealer-add').text().trim().replace(/&/g,'').replace(/#/g,''));
        });
    } else {
        $('.dealers-card').find('.sub-item1').remove();
    }

}

function getDealersELoc(element, dealerAddress) {
    let url = window.aemConfigs.apiEndpoints.geteLocAPI + '?access_token=' + JSON.parse(atob(getCookie('data'))).mmiToken + '&address=' + dealerAddress;
    let token = "bearer " + JSON.parse(atob(getCookie('data'))).mmiToken;
    synchronousAjaxCall(url, "", "POST", token).then(function(data) {
        getDistanceFromLoc(element, data.copResults.eLoc);
    })
}

function getDistanceFromLoc(element, eLoc) {
    let cookieData = JSON.parse(atob(getCookie('data')));
    let url = window.aemConfigs.apiEndpoints.getDistanceAPI.replace('{token}', cookieData.mmiToken) + cookieData.longitude + ',' + cookieData.latitude + ';' + eLoc;
    let token = "bearer " + cookieData.mmiToken;
    synchronousAjaxCall(url, "", "GET", token).then(function(data) {
        if (data.responseCode == 200) {
            $(element).find('.sub-item1').text(parseFloat(((data.results.distances[0]) + '').split(',')[1] / 1000).toFixed(1) + ' km Away')
        }

    })
}