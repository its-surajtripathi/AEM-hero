$(document).ready(function() {

	if($('.goodlife-carousel').length > 0) {
		if (getCookie('data') != null) {
	    	let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
	    	if(selVehCookie.isGoodLifeEligible == 'Y') {
	    		$('#hero-loader').toggleClass('d-none');
	    		populateGoodLifeCarousel(selVehCookie.cardNumber,selVehCookie.vinNO, 'Y');
	    		vehicleCallbackSucess(selVehCookie, $('.vehicle-details'), $('.vehicle-details-temp'));
	    		vehicleCallbackSucess(selVehCookie, $('.inner-vehicle-details'), $('.inner-vehicle-details-temp'));
	    		$('.goodlife-carousel').find('.vehicle-img-sel').attr('src',selVehCookie.imagePath);
	    		getGoodlifeSubscribedProducts().then(function(data){
	    			$('.current-vehicle').text('1');
	    			$('.total-vehicles').text(data.goodLifeVins.length);
	    			$('#hero-loader').toggleClass('d-none');
	    		});
	    		getVouchers();
	    	}else {
	    		$('#hero-loader').toggleClass('d-none');
	    		getGoodlifeSubscribedProducts().then(function(data){
	    			$('.current-vehicle').text('1');
	    			if(data.goodLifeVins != null) {
	    				$('.total-vehicles').text(data.goodLifeVins.length);
		    			let vehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
		                let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
		                selVehCookie = vehicleDetails[data.goodLifeVins[0]];
		                vehicleCallbackSucess(selVehCookie, $('.vehicle-details'), $('.vehicle-details-temp'));
			    		vehicleCallbackSucess(selVehCookie, $('.inner-vehicle-details'), $('.inner-vehicle-details-temp'));
			    		$('.goodlife-carousel').find('.vehicle-img-sel').attr('src',selVehCookie.imagePath);
		                document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(selVehCookie)) + "; path=/";
			    		populateGoodLifeCarousel(selVehCookie.cardNumber,selVehCookie.vinNO, 'Y').then(function (responseData){
		                	$('#hero-loader').toggleClass('d-none');
		                })
			    		getVouchers();
	    			}
	    			
	    		});
	    		
	    	}
	    	 $('.next-vehicle').on('click', function() {
					$('#hero-loader').toggleClass('d-none');
	                $('.prev-vehicle').find('.active').removeClass('d-none');
	                $('.prev-vehicle').find('.inactive').addClass('d-none');
	                $('.prev-vehicle').removeClass('disabled');
	    			let cookieData = JSON.parse(atob(getCookie('data')));
	    		    $('.vehicle-heading').remove();
	    		    $('.pleasure-content').remove();
	                let vehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
	                let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
	                selVehCookie = vehicleDetails[cookieData.goodLifeVins[parseInt($('.current-vehicle').html())]];
	                vehicleCallbackSucess(selVehCookie, $('.vehicle-details'), $('.vehicle-details-temp'));
		    		vehicleCallbackSucess(selVehCookie, $('.inner-vehicle-details'), $('.inner-vehicle-details-temp'));
		    		$('.goodlife-carousel').find('.vehicle-img-sel').attr('src',selVehCookie.imagePath);
	                document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(selVehCookie)) + "; path=/";
	                $('.no-response-error').hide();
		    		populateGoodLifeCarousel(selVehCookie.cardNumber,selVehCookie.vinNO, 'Y').then(function (responseData){
	                	$('#hero-loader').toggleClass('d-none');
	                })
		    		getVouchers();
		    		$('.current-vehicle').text(parseInt($('.current-vehicle').text())+1);

	                if (parseInt($('.current-vehicle').text()) == cookieData.goodLifeVins.length) {
	                    $('.next-vehicle').find('.active').addClass('d-none');
	                    $('.next-vehicle').find('.inactive').removeClass('d-none');
	                    $('.next-vehicle').addClass('disabled');
	                } else {
	                    $('.next-vehicle').removeClass('disabled');
	                }
	    	 })
	    	 $('.prev-vehicle').on('click', function() {
					$('#hero-loader').toggleClass('d-none');
	    		 	$('.next-vehicle').find('.active').removeClass('d-none');
	                $('.next-vehicle').find('.inactive').addClass('d-none');
	                $('.next-vehicle').removeClass('disabled');
	    			$('.current-vehicle').text(parseInt($('.current-vehicle').text())-1);
	    			$('.vehicle-heading').remove();
	    		    $('.pleasure-content').remove();
	    			let cookieData = JSON.parse(atob(getCookie('data')));
	    			if (parseInt($('.current-vehicle').text())  == 1) {
	                    $('.prev-vehicle').find('.active').addClass('d-none');
	                    $('.prev-vehicle').find('.inactive').removeClass('d-none');
	                    $('.prev-vehicle').addClass('disabled');
	                } else {
	                    $('.prev-vehicle').removeClass('disabled');
	                }
	                let vehicleDetails = JSON.parse(atob(getCookie('vehicleDetails')));
	                let selVehCookie = JSON.parse(atob(getCookie('selectedVehicleData')));
	                selVehCookie = vehicleDetails[cookieData.goodLifeVins[parseInt($('.current-vehicle').html())- 1]];
	                vehicleCallbackSucess(selVehCookie, $('.vehicle-details'), $('.vehicle-details-temp'));
		    		vehicleCallbackSucess(selVehCookie, $('.inner-vehicle-details'), $('.inner-vehicle-details-temp'));
		    		$('.goodlife-carousel').find('.vehicle-img-sel').attr('src',selVehCookie.imagePath);
	                document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(selVehCookie)) + "; path=/";
	                $('.no-response-error').hide();
	                populateGoodLifeCarousel(selVehCookie.cardNumber,selVehCookie.vinNO, 'Y').then(function (responseData){
	                	$('#hero-loader').toggleClass('d-none');
	                })
	                getVouchers();
	    	 })
	    	 
		} else {
	    	if(document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
	    		triggerLoginModal();
	    	}
	    }
	}

	if($('.myVehicle-nav .myVehicle-nav-txt .total-vehicle').text() == 1 || $('.myVehicle-nav .myVehicle-nav-txt .total-vehicle').text() == '')
    $('.myCarousel .myVehicle .myVehicle-nav').hide();
})
var count=0;
function getGoodlifeSubscribedProducts() {
	var cookieData = JSON.parse(atob(getCookie('data')));
	var vehicleIndex = [];
	let vehicleData = JSON.parse(atob(getCookie('vehicleDetails')));
	var apiCallCount = 0
	return new Promise(function(resolve, reject) {
		$(vehicleData).each(function(index){
			populateGoodLifeCarousel('', this.vinNO, 'N', vehicleData).then(function (responseData){
				apiCallCount++;
				if(responseData != null && responseData.Card_Number != null) {
					vehicleIndex.push(index);
					
					cookieData.goodLifeVins = vehicleIndex;
                	document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                	if(vehicleIndex.length == 0) {
                		vehicleCallbackSucess(responseData, $('.pleasure-details'), $('.goodlife-details'));
    	                vehicleCallbackSucess(responseData, $('.membership-details'), $('.membership-details-temp'));
    	                $(".membership-logo").attr('src', $('.goodlife-sub-img').val().split(',')[$('.goodlife-sub-type').val().split(',').indexOf(responseData.MembershipClub)]);
                	}
                	 
				}
				if($(vehicleData).length == apiCallCount) {
					resolve(cookieData);
				}
			})
	    });
	})
	
	
}

function getDateIntervals(validityDate) {
    let date1 = new Date();
    let date2 = new Date(validityDate);
    var milli_secs = date1.getTime() - date2.getTime();

    // Convert the milli seconds to Days
    var days = milli_secs / (1000 * 3600 * 24);
    return Math.round(Math.abs(days)) - 1;
}


function populateGoodLifeCarousel(cardNumber, vinNo, updatePage, vehicleDataCookie) {
	return new Promise(function(resolve, reject) {
    let getGoodlifeRow = {
        "apiName": "goodlife_member_master",
        "requestBody": JSON.stringify({"CARDNO":cardNumber,
			"VIN": vinNo })


    }
    synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getGoodlifeRow).then(function(data) {
    	if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
            let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
            if (responseData.ResponseMessage != null && responseData.ResponseMessage == "Success") {
            	// call vehicle Call Back and populate the data
            	let goodlifeResponse = responseData.Data.Table[0];
            	
            	if(updatePage == 'Y') {
	                vehicleCallbackSucess(goodlifeResponse, $('.pleasure-details'), $('.goodlife-details'));
	                vehicleCallbackSucess(goodlifeResponse, $('.membership-details'), $('.membership-details-temp'));
	                $('[name=nomineename]').val(goodlifeResponse.NomineeName);
	                $('[name=nomineemobile]').val(goodlifeResponse.NomineeMobile);
	                $('[name=nomineerelationship]').val(goodlifeResponse.NomineeRelation);
	                $('[name=nomineeaddress]').val(goodlifeResponse.NomineeAddress);
	                if(goodlifeResponse.MembershipClub == 'Pro') {
	                	$('.view-nominee').addClass('d-none');
	                	$('.insurance-date').text('NA');
	                	$('.insurance-amount').text('NA');
	                }
	                if(getDateIntervals(goodlifeResponse.Valid_Till) <= 90) {
	                	$('#re-new-plans').find('p').removeClass('d-none');
	                }else {
	                	$('#re-new-plans').find('p').addClass('d-none');
	                }
	                $('.complete-profile').find('a').attr('href',$('.complete-profile').find('a').attr('href').split('?')[0]+'?q='+cardNumber);
	                $('.welcome-reward').find('a').attr('href',$('.welcome-reward').find('a').attr('href').split('?')[0]+'?q='+cardNumber);
	                $(".membership-logo").attr('src', $('.goodlife-sub-img').val().split(',')[$('.goodlife-sub-type').val().split(',').indexOf(goodlifeResponse.MembershipClub)]);
	                resolve(goodlifeResponse); // Resolve promise and go to then()
            	}else {
	            	
	            	$(vehicleDataCookie).each(function(index){
	            		if(this.vinNO == vinNo) {
	            			if(goodlifeResponse.Card_Number != null) {
		            			this.isGoodLifeEligible = 'Y';
		            			this.membershipClub = goodlifeResponse.MembershipClub;
		                    	this.cardNumber = goodlifeResponse.Card_Number;
		                    	$('.total-vehicles').text(count);
	            			}else {
	            				this.isGoodLifeEligible = 'N';
		            			this.membershipClub = '';
		                    	this.cardNumber = '';
	            			}
	                    	vehicleDataCookie[index] = this;
	                    	document.cookie = "vehicleDetails=" + btoa(JSON.stringify(vehicleDataCookie)) + "; path=/";
	                    	resolve(goodlifeResponse); // Resolve promise and go to then()
	                    	return false;
	                    	 
	            		}
	            	})
	            }
            }else {
            	if(updatePage == 'Y') {
            		$('.no-response-error').show();
            		resolve(data);
            	}else {
            		$(vehicleDataCookie).each(function(index){
                		if(this.vinNO == vinNo) {
                			this.isGoodLifeEligible = 'N';
    	            		this.membershipClub = '';
    	                    this.cardNumber = '';
                        	vehicleDataCookie[index] = this;
                        	document.cookie = "vehicleDetails=" + btoa(JSON.stringify(vehicleDataCookie)) + "; path=/";
                        	resolve(data); // Resolve promise and go to then()
                        	return false;
                        	 
                		}
                	})
            	}
            	
            }
        }
	})['catch'](function(error) {
		$(vehicleDataCookie).each(function(index){
    		if(this.vinNO == vinNo) {
    			this.isGoodLifeEligible = 'N';
        		this.membershipClub = '';
                this.cardNumber = '';
            	vehicleDataCookie[index] = this;
            	document.cookie = "vehicleDetails=" + btoa(JSON.stringify(vehicleDataCookie)) + "; path=/";
            	resolve(); // Resolve promise and go to then()
            	return false;
            	 
    		}
    	})
    })
	})

}