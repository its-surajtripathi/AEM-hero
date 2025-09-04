$(document).ready(function() {
    if ($('.myVehicles-wrapper').length > 0) {
         if ($('.current-vehicle-index').html() == '1') {
            $('.prev-vehicle').find('.active').addClass('d-none');
            $('.prev-vehicle').find('.inactive').removeClass('d-none');
            $('.prev-vehicle').addClass('disabled');
        } else {
            $('.prev-vehicle').removeClass('disabled');
            $('.prev-vehicle').find('.active').removeClass('d-none');
            $('.prev-vehicle').find('.inactive').addClass('d-none');

        }
        if (getCookie('data') != null) {

            $('.next-vehicle').on('click', function() {
                $('.prev-vehicle').find('.active').removeClass('d-none');
                $('.prev-vehicle').find('.inactive').addClass('d-none');
                $('.prev-vehicle').removeClass('disabled');
                let cookieValue = JSON.parse(atob(getCookie('data')));
                let vehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
                let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
                $(vehicleDetails).each(function(index) {
                    if (this.vinNO == selVehCookie.vinNO) {
                        if (index == vehicleDetails.length - 1) {
                            document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(this)) + "; path=/";
                            $('.current-vehicle-index').text('1');
                            hideXclanCard(this.modelName);

                        } else {
                            document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(vehicleDetails[index + 1])) + "; path=/";
                            hideXclanCard(vehicleDetails[index + 1].modelName);
                            $('.current-vehicle-index').text(index + 2);

                        }
                        return;

                    }

                });
                if ($('.current-vehicle-index').html() == $(vehicleDetails).length) {
                    $('.next-vehicle').find('.active').addClass('d-none');
                    $('.next-vehicle').find('.inactive').removeClass('d-none');
                    $('.next-vehicle').addClass('disabled');
                } else {
                    $('.next-vehicle').removeClass('disabled');
                }
                populatevehicleData(cookieValue);

            });
            $('.prev-vehicle').on('click', function() {
                $('.next-vehicle').find('.active').removeClass('d-none');
                $('.next-vehicle').find('.inactive').addClass('d-none');
                $('.next-vehicle').removeClass('disabled');
                let cookieValue = JSON.parse(atob(getCookie('data')));
                let vehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
                let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
                $(vehicleDetails).each(function(index) {
                    if (this.vinNO == selVehCookie.vinNO) {
                        document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(vehicleDetails[index - 1])) + "; path=/";
                        hideXclanCard(vehicleDetails[index - 1].modelName);
                        $('.current-vehicle-index').text(index);
                        return;
                    }

                });
                populatevehicleData(cookieValue);
                if ($('.current-vehicle-index').html() == '1') {
                    $('.prev-vehicle').find('.active').addClass('d-none');
                    $('.prev-vehicle').find('.inactive').removeClass('d-none');
                    $('.prev-vehicle').addClass('disabled');
                } else {
                    $('.prev-vehicle').removeClass('disabled');
                      $('.prev-vehicle').find('.active').removeClass('d-none');
                                        $('.prev-vehicle').find('.inactive').addClass('d-none');
                }
            });

                let selCookiePresent = JSON.parse(atob(getCookie('selectedVehicleData')));
                let getVehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
                $(getVehicleDetails).each(function(index){
            		if(this.vinNO == selCookiePresent.vinNO) {
            			$('.current-vehicle-index').text(index + 1);
                    	return false;
                    	 
            		}
            		
            	})
                if ($('.current-vehicle-index').html() == '1') {
                    $('.prev-vehicle').find('.active').addClass('d-none');
                    $('.prev-vehicle').find('.inactive').removeClass('d-none');
                    $('.prev-vehicle').addClass('disabled');
                } else {
                    $('.prev-vehicle').removeClass('disabled');
                    $('.prev-vehicle').find('.active').removeClass('d-none');
                    $('.prev-vehicle').find('.inactive').addClass('d-none');
                }
                
                $('.total-vehicle').text(getVehicleDetails.length);
                if ($('.current-vehicle-index').html() == $(getVehicleDetails).length) {
                    $('.next-vehicle').find('.active').addClass('d-none');
                    $('.next-vehicle').find('.inactive').removeClass('d-none');
                    $('.next-vehicle').addClass('disabled');
                } else {
                    $('.next-vehicle').removeClass('disabled');
                }
                vehicleCallbackSucess(selCookiePresent, $('.myVehicle-name'), $('.vehicleDataTemplate'));
                vehicleCallbackSucess(selCookiePresent, $('.userbike-img'), $('.vehicleImgDataTemplate'));
                populateVehicleCards(selCookiePresent.vinNO, selCookiePresent.purchaseDate);
                hideXclanCard(selCookiePresent.modelName);
                setAccordionData(JSON.parse(atob(getCookie('data'))).mobile, selCookiePresent.vinNO, selCookiePresent.modelName, selCookiePresent.purchaseDate, selCookiePresent.engine_no);
            
        } else {
        	if(document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
        		triggerLoginModal();
        	}
        }
    }
    function hideXclanCard(modelName) {
    	if(modelName.toLowerCase().indexOf('xpulse') == -1) {
        	$("[data-subtype=xclan]").closest('.my-vehicle-card').addClass('d-none');
        	$("[data-subtype=joyride]").closest('.my-vehicle-card').removeClass('d-none');
        }else {
        	$("[data-subtype=joyride]").closest('.my-vehicle-card').addClass('d-none');
        	$("[data-subtype=xclan]").closest('.my-vehicle-card').removeClass('d-none');
        }
    }
});