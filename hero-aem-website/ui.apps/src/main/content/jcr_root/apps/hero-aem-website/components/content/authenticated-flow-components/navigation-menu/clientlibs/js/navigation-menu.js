$(document).ready(function() {
    
        if ($('.sideNavbar-links .profilesection').length > 0) {
            let userData = JSON.parse(atob(getCookie('data')));
            vehicleCallbackSucess(userData, $('.profilesection'), $('.userDetailsNavTemplate'));
            showInitials();
        }

        if ($('.navUserProg').length > 0) {
            let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
            vehicleCallbackSucess(selVehCookie, $('.hero-text'), $('.vehicleDataTemplate'));
            vehicleCallbackSucess(selVehCookie, $('.summary-text'), $('.vehicleDataSummaryTemplate'));
            vehicleCallbackSucess(selVehCookie, $('.hero-image'), $('.vehicleImgDataTemplate'));
        }

        if ($('.profilesummary').length > 0) {
        	if (getCookie('data') != null) {
	            var getProfileRow = [{
	                "0": "+91",
	                "1": JSON.parse(atob(getCookie('data'))).mobile
	            }]
	            var profileRequest = requestParam("oa_getProfile", getProfileRow);
	            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, profileRequest, getProfileRow).then(function(data) {
	                var getProfile = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getProfile.Row[0];
	                var response = JSON.parse(getProfile.profile);
	                var profileDoc = getProfile.profileDocs != '' ? JSON.parse(getProfile.profileDocs) : '';
	                var emergencyContacts = getProfile.emergency != '' ? JSON.parse(getProfile.emergency) : '';
	                vehicleCallbackSucess(response, $('.profilesection'), $('.bookaserviceData'));
	                showInitials();
	                if (profileDoc.length != 0 && $('.manageLicense').length > 0) {
	                    $('.manageLicense .licensesection').removeClass('d-none');
	                    vehicleCallbackSucess(profileDoc, $('.licensesection'), $('.licenseData'))
	                } else {
	                    $('.manageLicense .fileUpload').removeClass('d-none');
	                }
	                if (emergencyContacts != 0 && $('.emergency-contact').length > 0) {
	                    if (JSON.parse(emergencyContacts.count) == 2) {
	                        $('.emergencyContact').find('.add-contact').addClass('d-none');
	                    }
	                    $('.emergency-contact').closest('#details-section').find('.accordion-button .emergency-contact-count').text(' (' + JSON.parse(emergencyContacts.count) + ')');
	                    vehicleCallbackSucess(JSON.parse(emergencyContacts.details), $('.emergency-contact'), $('.emergencyContactData'));
	                }
	            })['catch'](function(response) {
	                console.log(response);
	            });
	        } else {
	        	if(document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
	        		triggerLoginModal();
	        	}
	        }
        }


// MENU BTN IN MOBILE
$('.sideNavbar-links').hide();
$('.sideNav-toggle-btn').click(function() {
    if ($(this).attr('data-click-state') == 1) {
        $(this).attr('data-click-state', 0);
        $('.sideNavbar-links').hide();
        $(this).css({
            'transform': 'translateX(0rem)',
            'transition': 'transform 300ms ease-out'
        });
    } else {
        $(this).attr('data-click-state', 1);
        $('.sideNavbar-links').show();
        $(this).css({
            'transform': 'translateX(14.5rem)',
            'transition': 'transform 300ms ease-out'
        });
    }
});

// USER PROGRESS
$('.StepProgress-item').first().addClass('first-item');
$('.StepProgress-item.first-item').find('.active-step').removeClass('d-none');
$('.StepProgress-item.first-item').find('.inactive-step').addClass('d-none');
$('.book-now-btn').click(function() {
$("html, body").animate({ scrollTop: 0 }, "slow");
$('.StepProgress-item').removeClass('first-item');

             $(this).find('.inactive-step').removeClass('d-none');
    let btnId = $(this).closest('.book-serv-pages').attr('id');
    $('.StepProgress-item').each(function() {

         if ($(this).data('step-item') == btnId) {
            $(this).removeClass('next-item')
            $(this).addClass('active');
            $(this).next().next().addClass('next-item');
             $(this).next().next().find('.active-step').removeClass('d-none');
                $(this).next().next().find('.inactive-step').addClass('d-none');
             $(this).find('.active-step').addClass('d-none');
             $(this).find('.inactive-step').removeClass('d-none');
            $('.active').next('.progressBar').css("background", "#FF0000");
        }

    });
     $('.StepProgress-item.active').on('click',function(){
                $('.book-serv-pages').hide();
                //$('.StepProgress-item').removeClass('next-item');
                  $('.StepProgress-item').find('.active-step').addClass('d-none');
                      $('.StepProgress-item').find('.inactive-step').removeClass('d-none');
                		$("[id= " + $(this).attr('data-step-item') + "]").addClass('next-item').show();
                		$("[id= " + $(this).attr('data-step-item') + "]").find('.active-step').removeClass('d-none');
                		$("[id= " + $(this).attr('data-step-item') + "]").find('.inactive-step').addClass('d-none');
            });
});




});