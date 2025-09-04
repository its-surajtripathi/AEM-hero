$(document).ready(function() {
    if ($('.editprofileForm').length) {
        if (getCookie('data') != null) {
            $('.upload-image').on('click', function() {
                $('.file-input').click();
            });
            $('.editprofileForm').find('[name=user_name],[name=mobile_no]').attr('readonly', true).css('color', '#ccc');
            $('.file-input').on('change', function() {
                $('.alert-danger.size-error').hide()
                $('.alert-danger.type-error').hide();
                var selectedFile = this.files[0];
                if (selectedFile) {
                    var getfileType = selectedFile.type.split('/');
                    var getfileTypestring = getfileType[1].toLowerCase();

                    const filesize = Math.round((selectedFile.size / 1024));
                    if (filesize >= 4096) {

                        $('.alert-danger.size-error').show();
                    } else if (getfileTypestring === "png" || getfileTypestring === "jpeg" || getfileTypestring === "jpg") {

                        $('.alert-danger.type-error').hide();
                    } else {

                        $('.alert-danger.type-error').show();
                    }
                    if ($('.alert-danger').is(':visible')) {
                        $('body').stop().animate({
                            scrollTop: 0
                        });
                    } else {

                        selectedFile.convertToBase64().
                        then(function(obj) {
                            var imageValue = obj.result;
                            //var base64string = 'data:image/png;base64,' + base64String;
                            var getimageRow = [{
                                "0": imageValue,
                                "1": "profilePicture/" + selectedFile.name.substr(0, selectedFile.name.indexOf(".")),
                                "2": selectedFile.type.substr(selectedFile.type.indexOf("/") + 1),
                                "3": JSON.parse(atob(getCookie('data'))).mobile

                            }]
                            var getProfiledata = requestParam("oa_editProfilePicture", getimageRow, "6");
                            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getProfiledata, getimageRow).then(function(data) {
                                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_editProfilePicture.Row[0]) {
                                    var getimagePath = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_editProfilePicture.Row[0];
                                    $('.profile-pic-header').attr('src',getimagePath.profile_pic_path+'?'+atob(JSON.parse(atob(getCookie('data'))).mediaToken));
                                    $('.profile-roundPic').remove();
                                    vehicleCallbackSucess(getimagePath, $('.edit-personalImg .fetch-image'), $('.getProfileic'));
                                    let cookieData = JSON.parse(atob(getCookie('data')));
                                    cookieData.profilePicPath = getimagePath.profile_pic_path;
                	                document.cookie = "data=" + btoa(JSON.stringify(cookieData)) +";expires="+cookieData.expirationTime+"; path=/";
                                    showInitials();
                                }


                            });
                        }, 2000);
                    }
                }
            });

            var getProfileRow = [{
                "0": "+91",
                "1": JSON.parse(atob(getCookie('data'))).mobile
            }]
            var getProfiledata = requestParam("oa_getProfile", getProfileRow);
            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getProfiledata, getProfileRow).then(function(data) {
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getProfile.Row[0]) {
                    var getProfile = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getProfile.Row[0];
                    var response = JSON.parse(getProfile.profile);
                    let userProfile = new Object();
                    vehicleCallbackSucess(response, $('.edit-personalImg .fetch-image'), $('.getProfileic'))
                    var $formElements = $('.editprofileForm').find("input,select");


                    var cookieData = JSON.parse(atob(getCookie('data')));
                    if (response.profile_pic_path !== null && cookieData.profilePicPath && cookieData.profilePicPath !== '') {
                        var getProfileImg = response.profile_pic_path + "?" + atob(cookieData.mediaToken);

                        $('.fetch-image img').attr("src", getProfileImg);
                       // $('.fetch-image .initials').html(cookieData.name);
                        $('.fetch-image .initials').hide();

                    } else {
                        showInitials();
                    }
                    
                    $formElements.each(function() {
                        var inputName = $(this).attr("name");
                        var isCheckbox = $(this).attr('type') === 'checkbox';
                        Object.keys(response).forEach(function(key) {

                            var populateVal;
                            if (key === inputName) {
                                if (isCheckbox === true) {
                                    var checkedVal = response[key];
                                    if (typeof checkedVal === "boolean" || typeof checkedVal === "string") {
                                        var tempChedVal = "" + checkedVal;
                                        checkedVal = [];
                                        checkedVal.push(tempChedVal);
                                    }
                                    for (var i = 0; i < checkedVal.length; i++) {
                                        populateVal = checkedVal[i];
                                        populateValues($('.editprofileForm'), inputName, populateVal);
                                    }
                                } else {
                                    populateVal = response[key];
                                    populateValues($('.editprofileForm'), inputName, populateVal);
                                }
                            }
                        });
                    });
                    populateStates($("[name=state]"),$("[name=city]")).then(function (data){
                    	if($("[name=state] option[value='"+response.state.toUpperCase()+"']").length > 0) {
                        	$("[name=state]").val(response.state.toUpperCase());
                        	populateCity($("[name=state]"), $("[name=city]")).then(function (mmidata){
                        		if($("[name=city] option[value='"+response.city.toUpperCase()+"']").length > 0) {
                        			$("[name=city]").val(response.city.toUpperCase());
                            	}else {
                            		$("[name=city]").css('color', '#ccc');
                            	}
                        		
                       	 	})
                    	}else {
                    		$("[name=state]").css('color', '#ccc');
                    		$("[name=city]").css('color', '#ccc');
                        	$("[name=state]").closest('.form-group').find('.hasError').remove();
                    	}
                    	
                    })
                }
            });
            $('.editprofileForm .save-btn').on('click', function() {
                var formFlag;
                $(this).closest('form').find('.form-group').each(function() {
                    formFlag = validatingForm($(this));
                });
                formFlag = !($(this).closest('form').find('.hasError').is(':visible'));
                if (formFlag) {
                    var submitdetails = [{
                        "0": "+91",
                        "1": $("[name=mobile_no]").val(),
                        "2": $("[name=dob]").val(),
                        "3": $("[name=user_name]").val(),
                        "4": $('[name=gender]:checked').val(),
                        "5": $("[name=email]").val(),
                        "6": $("[name=blood_group]").val(),
                        "7": $("[name=address_line1]").val(),
                        "8": $("[name=city]").val(),
                        "9": $("[name=state]").val(),
                        "10": $("[name=pin_code]").val(),
                        "11" : {}
                    }]
                    var data = requestParam("oa_updateProfile_v2", submitdetails);
                    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, data, submitdetails).then(function(data) {
                        //sucess pop up need to show
                        var response = data;
                        if(data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
	                        if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_updateProfile_v2.Row[0].status == 'success') {
	                        	$('#editBooking').modal('toggle');
	                        }else {
	                        	$('.alert-danger.api-error').text(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_updateProfile_v2.Row[0].message);
	                            $('.alert-danger.api-error').show();
	                        }
                        }else {
                        	$('.alert-danger.api-error').show();
                        }
                        
                        // location.reload();
                    });
                } else {
                    $('body').stop().animate({
                        scrollTop: 0
                    });
                }
            });



        }else {
        	if(document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
        		triggerLoginModal();
        	}
        }
    }
    $('.edit-myProfile-wrapper').find('.accordion').last().addClass('last-accordion');
});

function populateValues($formel, name, fieldval) {
    var $elem = $formel.find("[name='" + name + "']");
    if (!($elem === undefined)) {
        var isAttrCheckOrRadio = $elem.attr('type') === 'checkbox' || $elem.attr('type') === 'radio';
        if (!($elem.attr('type') === undefined) && isAttrCheckOrRadio) {

            $formel.find("[name='" + name + "'][value='" + fieldval + "']").attr("checked", "checked").triggerHandler("change");
        } else {
            $elem.val(fieldval).triggerHandler("change");
            if ($formel.find('.hasError').is(':visible')) {
            if($formel.find('.hasError').closest('.form-group.drop-down').find('option:disabled').length){
               var defaultVal= $formel.find('.hasError').closest('.form-group.drop-down').find('option:disabled').text();
               $elem.val(defaultVal);
            }
            $formel.find('.hasError').remove();

            }
        }
        return true;
    }
    return false;
}

