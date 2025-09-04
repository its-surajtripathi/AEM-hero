$(document).ready(function () {
	$('.textarea-container textarea').keyup(function () {
		var characterCount = $(this).val().length,
			current = $('#current'),
			maximum = $('#maximum'),
			theCount = $('#the-count');

		current.text(characterCount);
	});
	//var getLowerservicetype;
	$('#job-crd-nxt-btn').on('click', function (e) {
		var calendarData = $('.rescalendar_controls').find('.refDate').val();
		var timePickerData = $('.selct-time-header').find('#timePicker').text();
		var jobCardData;
		var delerdataDiv = $('.dealers-card.active').find('.dealer-address').html();
		var getdivisionattr = $('.dealers-card.active').data('dealer-division');
		$('.dealer-summary-card').html(delerdataDiv);
		var getserviceType = $('.service-type-process.active').find('.servicetype-label').text();
		$('.servicedate-selected').find('span.summary-service-type').html(getserviceType);

		$('.dealer-summary-card').attr('data-dealer-division', getdivisionattr);
		if($('.dealers-card.active').find('.sub-item1').length >0) {
			$('.summery-sub-item1').html($('.dealers-card.active').find('.sub-item1').text().trim());
		}else {
			$('.summery-sub-item1').remove();
		}
		
		$('#summery-date').text(moment(new Date(calendarData)).format('MM/DD/YYYY'));
		$('#summery-time').text(timePickerData);
		// Dealer checkbox function start
		$('#job-details').empty();
		//Create an Array.
		var selectedJobCard = new Array();
		$(".getComplaintCodes input[type=checkbox]:checked").each(function () {
			selectedJobCard.push($(this).attr('data-checkbox-value'));
		});

		//Display the selected CheckBox values.
		if (selectedJobCard.length > 0 || $('.self-job-card-text-area').val() !== '') {
			//$('#job-details').html('<div>'+selectedJobCard+'</div>');
			$('#job-details').html('<div>' + selectedJobCard.join('</div><div>') + '</div>');
			if($('.self-job-card-text-area').val() !== ''){
			    $('#job-details').append('<p>'+$('.self-job-card-text-area').val()+'</p>');
			}

		}
		 if($('#job-details').html() !== ''){
            $('.self-jobcard-summary').show();
         }else{
            $('.self-jobcard-summary').hide();
         }
		// Dealer checkbox function end
	});
	$('.dealear-state-city').find('.book-now-btn').on('click', function (e) {
		$('.dealers-card').removeClass('active');
		$('.dealers-card').find('input[type=checkbox]:checked').closest('.dealers-card').addClass('active');
	});

	$('.summary .change-link').click(function () {
		$('.api-error-msg').hide();
		$('.book-serv-pages').hide();
		$("[id= " + $(this).attr('href') + "]").show();

	});
	// Job card checkbox functionality end
	$('.submit-booking').click(function () {
		$('.api-error-msg').hide();
		let bookingReq = {
			"comment": "",
			"booking_slot": $('#summery-date').text() + ' ' + $('.selct-time-header').find('#timePicker').data('value').substring(0, 2) + ':00:00',
			"express_service": "",
			"service_category": '',
			"first_name": JSON.parse(atob(getCookie('data'))).name,
			"job": $('input[name="optradio"]:checked').val(),
			"location": $('.dealers-card.active').attr('data-dealer-division'),
			"dealer_code": $('.dealers-card.active').find('input').val(),
			"vin": JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
			"loan_vehicle": "",
			"source": "Corporate Website",
			"mobile_number": JSON.parse(atob(getCookie('data'))).mobile,
			"last_name": JSON.parse(atob(getCookie('data'))).name,
			"ca1": "",
			"ca2": "",
			"ca3": "",
			"ca4": "",
			"ca5": "",
			"cc1": "",
			"cc2": "",
			"cc3": "",
			"cc4": "",
			"cc5": "",
			"cc6": "",
			"cc7": "",
			"cc8": "",
			"cc9": "",
			"cc10": "",
			"cc11": "",
			"customercomments": $('#customer-comments').val()

		};
		$('#job-details label').each(function (index, value) {
			let key = "cc" + (index + 1);
			bookingReq[key] = $(this).attr('value');

		});
		$('#hero-loader').toggleClass('d-none');
		$.ajax({
			type: "POST",
			url: window.aemConfigs.apiEndpoints.getBookServiceAPI,
			data: JSON.stringify(bookingReq),
			dataType: "json",
			contentType: "application/json",
			headers: {
				'Authorization': JSON.parse(atob(getCookie('data'))).token
			},
			success: function (response) {	
				$('#hero-loader').toggleClass('d-none');
				response = JSON.parse(response.message).PWSESSIONRS[0].PWPROCESSRS.PWDATA.WSCALL['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns:HMCL_spcJob_spcCard_spcProcess_spcfrom_spcCustomer_Output'];
				let status = response['ns:SRStatus'];
				if (status == 'Booked') {
					console.log('response---' + response['ns:Seq_spcNum'])
					$('#booknowPopup').html($('#booknowPopup').html().replace('{time}', $('.selct-time-header').find('#timePicker').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{date}', $('#summery-date').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{dealername}', $('#dealerName').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{srid}', response['ns:Seq_spcNum']))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{time}', $('.selct-time-header').find('#timePicker').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{date}', $('#summery-date').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{dealername}', $('#dealerName').text()))
					$('#booknowPopup').html($('#booknowPopup').html().replace('{srid}', response['ns:Seq_spcNum']))
					$('#booknowPopup .share-whatsapp-modal').attr('href',decodeURI($('#booknowPopup .share-whatsapp-modal').attr('href')).replace('{dealername}',$('#dealerName').text()).replace('{srid}',response['ns:Seq_spcNum']))
					setSRid(response['ns:Seq_spcNum']);
					$('#booknowPopup').modal('toggle');
				}
				if(window.digitalData){
					window.digitalData = {
						event: "Service Booking Step 4",
						vehicleDetails: {
							VehicleName: JSON.parse(atob(getCookie('selectedVehicleData'))).modelName,
							VehicleVinNumber: JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
							BookingReffrenceNumber: JSON.parse(atob(getCookie('selectedVehicleData'))).cardNumber,
						}
					}
				}
			},
			error: function (err) {
				$('#hero-loader').toggleClass('d-none');
				$('.api-error-msg').show();
				if(window.digitalData){
					window.digitalData = {
						event: "Service Booking Step 4 Failure",
						vehicleDetails: {
							VehicleName: JSON.parse(atob(getCookie('selectedVehicleData'))).modelName,
							VehicleVinNumber: JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
							ErrorMessage: $('.api-error-msg').text(),
						}
					}
				}
			}
		})
	})
});