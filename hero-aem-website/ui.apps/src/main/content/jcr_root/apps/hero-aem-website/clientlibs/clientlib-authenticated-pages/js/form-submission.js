$(document).ready(function() {
    $('#add-contact').click(function() {
        var formFlag;
        var $this = $(this);
        $(this).closest('.cmp-container ').find('.form-group').each(function() {
            formFlag = validatingForm($(this));
        });
        formFlag = !($(this).closest('.cmp-container').find('.hasError').is(':visible'));
        if (formFlag) {
            $('#hero-loader').toggleClass('d-none');
            var addContactRow = [{
                "0": JSON.parse(atob(getCookie('data'))).mobile,
                "1": "",
                "2": $('#addEmergencyContact').find('[name="name"]').val(),
                "3": $('#addEmergencyContact').find('[name="mobile"]').val(),
                "4": $('#addEmergencyContact').find('[name="relation"]').val(),
                "5": "Add",
                "6": {}
            }]
            var addContactRequest = requestParam("oa_emergencyContact_v2", addContactRow, "1");

            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, addContactRequest, addContactRow).then(function(data) {
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_emergencyContact_v2.Row[0].status == "success") {
                    window.digitalData = {
                        event: "Emergency Contact Updated",
                        profileDetials: {
                        },
                    };
                    window.location.reload();
                } else {
                    $('#hero-loader').toggleClass('d-none');
                    var createErrorDiv;
                    if ($('#addEmergencyContact').find('.alert-danger').length > 0) {
                        $('#addEmergencyContact').find('.alert-danger').remove();
                    }
                    createErrorDiv = $('<div class="alert-danger"></div>');
                    $this.closest('.cmp-container ').prepend(createErrorDiv);
                    $('#addEmergencyContact').find('.alert-danger').html(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_emergencyContact_v2.Row[0].message).show();
                }
            })
        } else {
            $('body,html').stop().animate({
                scrollTop: 0
            });
        }
    })
    setTimeout(deleteContactListener, 2000);

    function deleteContactListener() {
        $('.removecontact').click(function() {
            $('#hero-loader').toggleClass('d-none');
            var deleteContactRow = [{
                "0": JSON.parse(atob(getCookie('data'))).mobile,
                "1": $(this).closest('.fetch-contact').attr('data-contactID'),
                "2": $(this).closest('.fetch-contact').find('.name').text(),
                "3": $(this).closest('.fetch-contact').find('.mobile-number').text(),
                "4": $('.relation-id-mapping').find("option[value='" + $(this).closest('.fetch-contact').find('.relation').text() + "']").text(),
                "5": "Delete",
                "6": {}
            }]
            var deleteContactRequest = requestParam("oa_emergencyContact_v2", deleteContactRow);
            var removeDiv = $(this);
            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, deleteContactRequest, deleteContactRow).then(function(data) {
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_emergencyContact_v2.Row[0].status == "success") {
                    removeDiv.closest('.fetch-contact').remove();
                    $('.emergency-contact').closest('#details-section').find('.accordion-button .emergency-contact-count').text(' (' + (parseInt($('.emergency-contact').closest('#details-section').find('.accordion-button .emergency-contact-count').text().replace(/[^0-9]/gi, '')) - 1) + ')');
                    $('.emergencyContact').find('.add-contact').removeClass('d-none');
                    $('#hero-loader').toggleClass('d-none');
                } else {
                    console.log(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_emergencyContact_v2.Row[0].message);
                }
            })
        })
    }
    setTimeout(uploadListener, 2000);

    function uploadListener() {
        $('#licenseUpload,.fileUpload #fileInput').on('change', function() {
            $('#hero-loader').toggleClass('d-none');
            var selectedFile = this.files[0];
            if (selectedFile) {
                var getfileType = selectedFile.type.split('/');
                var getfileTypestring = getfileType[1].toLowerCase();

                var filesize = Math.round((selectedFile.size / 1024));
                if (filesize >= 4096) {
                    $('.alert-danger.size-error').show();
                    $('#hero-loader').toggleClass('d-none');
                } else if (getfileTypestring === "pdf" || getfileTypestring === "png" || getfileTypestring === "jpeg" || getfileTypestring === "jpg") {
                    $('.alert-danger.type-error').hide();
                } else {
                    $('.alert-danger.type-error').show();
                    $('#hero-loader').toggleClass('d-none');
                }
                if ($('.alert-danger').is(':visible')) {
                    $('body').stop().animate({
                        scrollTop: 0
                    });
                } else {
                    selectedFile.convertToBase64().
                    then(function(obj) {
                        let imageValue = obj.result;
                        var updateLicenseRow = [{
                            "0": imageValue,
                            "1": "vehicleDocuments/" + selectedFile.name.substr(0, selectedFile.name.indexOf(".")),
                            "2": selectedFile.type.substr(selectedFile.type.indexOf("/") + 1),
                            "3": JSON.parse(atob(getCookie('data'))).mobile,
                            "4": {}
                        }]
                        var licenseUpdateRequest = requestParam("oa_uploadDocuments_v2", updateLicenseRow, "6");
                        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, licenseUpdateRequest, updateLicenseRow).then(function(data) {
                        	if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_uploadDocuments_v2.Row[0].status == "success") {
                                window.digitalData = {
                                    event: "License Uploaded",
                                    profileDetials: {
                                    },
                                };
                                window.location.reload();
                            } else {
                                $('#hero-loader').toggleClass('d-none');
                            }
                        })
                    });
                }
            }

        })
    }
    if($('#payment-result-page').length > 0) {
    	var reqObj = JSON.parse(atob(getCookie('paymentData')))
    	getTransactionResults(reqObj.orderID, reqObj.mobile, 0).then(function( data ) {
    		$('.'+reqObj.type).removeClass('d-none');
    	});
    		
    }
   
});