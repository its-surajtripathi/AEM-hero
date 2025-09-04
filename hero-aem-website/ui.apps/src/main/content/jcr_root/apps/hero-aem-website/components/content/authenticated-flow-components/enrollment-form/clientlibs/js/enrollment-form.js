$(document).ready(function() {
    if ($('.enrollment-form-wrapper').length > 0) {
        if (getCookie('data') != null) {
            $('.proceed').on('click', function() {
                var formFlag;
                $(this).closest('.enrollment-step').find('.form-group').find('input[required=true],select[required=true]').closest('.form-group').each(function() {
                    formFlag = validatingForm($(this));
                });
                formFlag = !($(this).closest('.enrollment-step').find('.hasError').is(':visible'));
                if (formFlag && $('.enrollment-form-wrapper').attr('data-formtype') != 'good-life-199') {
                    $(this).closest('.enrollment-step').hide();
                    $(this).closest('.enrollment-step').next().removeClass('d-none');
                    $(this).closest('.enrollment-step').next().show();
                }
                if ($('.enrollment-form-wrapper').attr('data-formtype') != 'good-life-199') {
                    $(window).scrollTop(0);
                }
            });
            $('.cancel').on('click', function() {
                $(this).closest('.enrollment-step').hide();
                $(this).closest('.enrollment-step').prev().removeClass('d-none');
                $(this).closest('.enrollment-step').prev().show();
                $(window).scrollTop(0);
            });

            if ($('.enrollment-form-wrapper').attr('data-formtype') == 'good-life-199') {
                let selVehicleData = JSON.parse(atob(getCookie('selectedVehicleData')));
                let cookiedata = JSON.parse(atob(getCookie('data')));
                $('[name=OWNERNAME]').val(cookiedata.name);
                $('[name=OwnerMobile]').val(cookiedata.mobile);
                $('[name=Card_Number]').val(selVehicleData.cardNumber);
                $('[name=VIN]').val(selVehicleData.vinNO);
                vehicleCallbackSucess(selVehicleData, $('.xClan-banner-right'), $('.selvehicleData'));
                let vehicleData = JSON.parse(atob(getCookie('vehicleDetails')));
                vehicleCallbackSucess(vehicleData, $('.vehicle-list'), $('.vehicleDetailsTemp'));
                $('.xClan-banner-link').removeClass('d-none');
                $('.xClan-banner-link').removeClass('d-none');
                $('.nominee-proceed').on('click', function() {
                    formFlag = !($(this).closest('.enrollment-step').find('.hasError').is(':visible'));
                    if (formFlag) {
                        let getGLproducts = [{
                            "0": JSON.parse(atob(getCookie('data'))).mobile
                        }]
                        var getGLproductsdata = requestParam("oa_getGLProducts", getGLproducts);
                        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getGLproductsdata).then(function(data) {
                            if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                                $.each(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getGLProducts.Row, function(key, value) {
                                    if (this.amount == $('.payment-amount').val()) {
                                        initiatePayment(btoa(this.amount_id + '::' + this.id), $('[name=OwnerMobile]').val(), $('[name=VIN]').val()).then(function(data) {
                                            let validateDetailsReq = {
                                                "HERO_TRANSACTION_ID": data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id,
                                                "IS_EMPLOYEE_OF_HERO": $('[name=IsHeroEmployee]').is(":checked") ? 'Y' : 'N',
                                                "VIN": $('[name=VIN]').val(),
                                                "SOURCE": "WEB",
                                                "OLD_CARD_NO": $('[name=Card_Number]').val() != '' ? $('[name=Card_Number]').val() : '',
                                                "USER_DOB": convertShortDate($('[name=BIRTH_DT]').val()).replace(' ', '-'),
                                                "USER_EMAIL": $('[name=EMAIL]').val(),
                                                "USER_GENDER": $('[name=GEDNER]:checked').val(),
                                                "USER_MOBILE": $('[name=OwnerMobile]').val(),

                                                "USER_NAME": $('[name=OWNERNAME]').val().trim()
                                            }
                                            let insertProfileWebAppLog = {
                                                "apiName": "ValidateProfileWebApp199",
                                                "requestBody": JSON.stringify(validateDetailsReq)
                                            }
                                            var accessCode = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].access_code;
                                            var orderID = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id;
                                            synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, insertProfileWebAppLog).then(function(data) {

                                                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseCode == 1) {
                                                    let getEncReq = {
                                                        "orderID": orderID,
                                                        "redirectURL": $(location).attr('host') + $('.success-redirect').val(),
                                                        "cancelURL": $(location).attr('host') + $('.failure-redirect').val(),
                                                        "amount": $('.payment-amount').val()
                                                    }
                                                    let paymentDetailObj = {
                                                        "orderID": orderID,
                                                        "nextAPICall": "InsertProfileWebApp199",
                                                        "serverErrorPage": $('.failure-redirect').val(),
                                                        "mobile" : $('[name=OwnerMobile]').val(),
                                                        "type" : $('[name=Card_Number]').val() != '' ? "goodlife-renewal" : "goodlife-new",
                                                        "requestBody": {
                                                            "INTERMEDIATE_REFERENCE_NO": orderID,
                                                            "SOURCE": "WEB",
                                                            "PAYMENT_REF_NO": "1"
                                                        }
                                                    }
                                                    document.cookie = "paymentData=" + btoa(JSON.stringify(paymentDetailObj)) + "; path=/";
                                                    synchronousAjaxCallToAEM($('.request-path').val() + '.getPaymentUrl.html', getEncReq).then(function(data) {
                                                        window.location.href = window.aemConfigs.apiEndpoints.paymentGateWay + "&encRequest=" + data.encryptedValue + "&access_code=" + accessCode;
                                                    });

                                                } else {

                                                	if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage == 'Parameter not available in passing value.') {
                                                		$('.no-response-error').show();
                                                	}else {
                                                		$('.api-error').text(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage);
                                                        $('.api-error').show();
                                                	}
                                                }
                                            })['catch'](function(error) {
                                                $('.no-response-error').show();
                                            })
                                        });
                                        return false;
                                    }

                                })
                            }

                        })
                    }
                })
            } else {

                
                var vehicleData = JSON.parse(atob(getCookie('vehicleDetails')))
                $(vehicleData).each(function() {
                    if (this.modelName.toLowerCase().indexOf('xpulse') != -1) {
                        $('.enrollment-form-wrapper').find('[name=model]').append('<option value="' + this.vinNO + '">' + this.modelName + '</option>')
                    }
                })
                var selVehicleData = JSON.parse(atob(getCookie('selectedVehicleData')));
                if (selVehicleData.modelName.toLowerCase().indexOf('xpulse') != -1) {
                    $('[name=model]').val(selVehicleData.vinNO);
                    $('[name=model]').attr('disabled', 'disabled');
                    $('[name=model]').css("color", "#000");
                }
                $('[name=sameas_user]').on('click', function() {
                    if (this.checked == true) {
                        $('[name=NomineeAddress]').val($('[name=ADD1]').val() + ' ' + $('[name=STATE]').val() + ' ' + $('[name=CITY]').val() + ' ' + $('[name=PIN]').val())
                    } else {
                        $('[name=NomineeAddress]').val('');
                    }
                })
                $('[name=Relation_with_Owner]').on('change', function() {
                    if ($(this).val() == 'Other') {
                        $('.other-relation').removeClass('d-none');
                    } else {
                        $('.other-relation').addClass('d-none');
                    }
                })

                $('[name=NomineeRelation]').on('change', function() {
                    if ($(this).val() == 'Other') {
                        $('.other-relation-nominee').removeClass('d-none');
                    } else {
                        $('.other-relation-nominee').addClass('d-none');
                    }
                })

                $('[name=IS_OWNER_USER]').on('change', function() {
                    if ($('[name=IS_OWNER_USER]:checked').val() == 'USER') {
                        $('.is-user-selected').removeClass('d-none');
                        $('[name=NAME]').val('');
                        $('[name=MOBILE]').val('');
                    } else {
                        $('.is-user-selected').addClass('d-none');
                    }
                })

                $('.nominee-proceed').on('click', function() {
                    $('[name=IS_OWNER_USER]:checked').val() == 'USER' ? $('.owner-name').text($('[name=NAME]').val()) : $('.owner-name').text($('[name=OWNERNAME]').val());
                })
                $('.pre-requiste-form').on('click', function() {
                	if (!($(this).closest('.enrollment-step').find('.hasError').is(':visible'))) {
                		$('.xClan-banner-textRight').remove();
                        $('.xclan-banner-imgRight').remove();
                        let vehicleData = JSON.parse(atob(getCookie('vehicleDetails')))
                        $(vehicleData).each(function() {
                            if (this.vinNO == $('[name=model]').val()) {
                                vehicleCallbackSucess(this, $('.xClan-banner-right'), $('.selvehicleData'));
                            }
                        })
                		populateGoodLifeData($('[name=model]').val());
                	}
                	
                    
                });
                if ($('.enrollment-form-wrapper').attr('data-formtype') != 'xclan') {
                	let selVehicleData = JSON.parse(atob(getCookie('selectedVehicleData')));
                    vehicleCallbackSucess(selVehicleData, $('.xClan-banner-right'), $('.selvehicleData'));
            		populateGoodLifeData(selVehicleData.vinNO);
                    let vehicleData = JSON.parse(atob(getCookie('vehicleDetails')));
                    vehicleCallbackSucess(vehicleData, $('.vehicle-list'), $('.vehicleDetailsTemp'));
                    $('.xClan-banner-link').removeClass('d-none');
                }

                $('.payment').on('click', function() {
                    $(this).closest('.enrollment-step').find('.form-group').find('input[required=true],select[required=true]').closest('.form-group').each(function() {
                        formFlag = validatingForm($(this));
                    });
                    formFlag = !($(this).closest('.enrollment-step').find('.hasError').is(':visible'));
                    if (formFlag) {
                    	$('.no-response-error').hide();
                        $('.api-error').hide();
                        let getGLproducts = [{
                            "0": JSON.parse(atob(getCookie('data'))).mobile
                        }]
                        var getGLproductsdata = requestParam("oa_getGLProducts", getGLproducts);
                        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, getGLproductsdata).then(function(data) {
                            if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                                $.each(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getGLProducts.Row, function(key, value) {
                                    let amountPayable = parseInt($('.payment-amount').val()) > 499 ? 499 : $('.payment-amount').val();
                                    if (this.amount == amountPayable) {
                                    	var mobile = $('[name=IS_OWNER_USER]:checked').val() == 'USER' ? $('[name=MOBILE]').val() : $('[name=OwnerMobile]').val();
                                        initiatePayment(btoa(this.amount_id + '::' + this.id), mobile, $('[name=VIN]').val()).then(function(data) {
                                            let validateDetailsReq = {
                                                "VIN": $('[name=VIN]').val(),
                                                "OldCardNumber": $('[name=Card_Number]').val() != '' ? $('[name=Card_Number]').val() : '',
                                                "IsOwner_User": "1",
                                                "UserName": $('[name=IS_OWNER_USER]:checked').val() == 'USER' ? $('[name=NAME]').val().trim() : $('[name=OWNERNAME]').val().trim(),
                                                "User_DOB": convertShortDate($('[name=BIRTH_DT]').val()).replace(' ', '-'),
                                                "User_Add1": $('[name=ADD1]').val(),
                                                "User_Add2": "",
                                                "User_City": $('[name=CITY]').val(),
                                                "User_State": $('[name=STATE]').val(),
                                                "USER_PDF_PATH": "a",
                                                "User_PinCode": $('[name=PIN]').val(),
                                                "User_Mobile": mobile,
                                                "User_Email": $('[name=EMAIL]').val(),
                                                "User_Gender": $('[name=GEDNER]:checked').val(),
                                                "User_MaritalStatus": "",
                                                "User_AnniversaryDate": "",
                                                "User_Photo": "",
                                                "Owner_Name": $('[name=OWNERNAME]').val().trim(),
                                                "Owner_Mobile": $('[name=OwnerMobile]').val(),
                                                "EngineNumber": $('[name=ENG_NO]').val() + ($('.enrollment-form-wrapper').attr('data-formtype') == 'xclan' ?  "|" + $('[name=chapter]').val() : ''),
                                                "Model": $('[name=MODEL_CODE]').val(),
                                                "ModelColor": $('[name=MODEL_COLOR]').val(),
                                                "IS_Employye_Of_Hero": $('[name=IsHeroEmployee]').is(":checked") ? '1' : '0',
                                                "Fee": $('.payment-amount').val(),
                                                "Payment_Ref_Number": data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id,
                                                "Insurance_Duration": "1",
                                                "Relation_Type": $('[name=DeclarationRelation]').val(),
                                                "Relative_Name": $('[name=DeclarationRelativeName]').val(),
                                                "Nominee_Name": $('[name=NomineeName]').val(),
                                                "Nominee_Relationship": $('[name=NomineeRelation]').val(),
                                                "Nominee_ContactNumber": $('[name=NomineeMobile]').val(),
                                                "Nominee_Address": $('[name=NomineeAddress]').val(),
                                                "Is_Physicaly_Card_Required": "N",
                                                "RELATION_WITH_BUYER": $('[name=Relation_with_Owner]').val() == null ? '' : $('[name=Relation_with_Owner]').val(),
                                                "SOURCE": "WEB",
                                                "RELATION_WITH_OWNER_IF_OTHER": $('[name=RELATION_WITH_OWNER_IF_OTHER]').val(),
                                                "HERO_TRANSACTION_ID": data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id
                                            }
                                            let insertProfileWebAppLog = {
                                                "apiName": "validateProfileForAbovePlan199",
                                                "requestBody": JSON.stringify(validateDetailsReq)
                                            }
                                            var accessCode = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].access_code;
                                            var orderID = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id;
                                            synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, insertProfileWebAppLog).then(function(data) {

                                                if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseCode == 1) {
                                                    let getEncReq = {
                                                        "orderID": orderID,
                                                        "redirectURL": $(location).attr('host') + $('.success-redirect').val(),
                                                        "cancelURL": $(location).attr('host') + $('.failure-redirect').val(),
                                                        "amount": $('.payment-amount').val()
                                                    }
                                                    let paymentDetailObj = {
                                                        "orderID": orderID,
                                                        "nextAPICall": "InsertProfileWebApp",
                                                        "serverErrorPage": $('.failure-redirect').val(),
                                                        "mobile" : mobile,
                                                        "type" : $('.enrollment-form-wrapper').attr('data-formtype') == 'xclan' ? 'xclan-new' : ($('[name=Card_Number]').val() != '' ? "goodlife-renewal" : "goodlife-new"),
                                                        "requestBody": {
                                                            "INTERMEDIATE_REFERENCE_NO": orderID,
                                                            "SOURCE": "WEB",
                                                            "PAYMENT_REF_NO": "1"
                                                        }
                                                    }
                                                    document.cookie = "paymentData=" + btoa(JSON.stringify(paymentDetailObj)) + "; path=/";
                                                    synchronousAjaxCallToAEM($('.request-path').val() + '.getPaymentUrl.html', getEncReq).then(function(data) {
                                                        window.location.href = window.aemConfigs.apiEndpoints.paymentGateWay + "&encRequest=" + data.encryptedValue + "&access_code=" + accessCode;
                                                    });

                                                } else {
                                                	if(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage == 'Parameter not available in passing value.') {
                                                		$('.no-response-error').show();
                                                	}else {
                                                		$('.api-error').text(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage);
                                                        $('.api-error').show();
                                                	}
                                                    
                                                }
                                            })['catch'](function(error) {
                                                $('.no-response-error').show();
                                            })
                                        });
                                        return false;
                                    }

                                })
                            }

                        })




                    }


                });

            }
        } else {
            if (document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
                triggerLoginModal();
            }
        }

    }
    function populateGoodLifeData(vinNo) {
    	
            
            let getGoodlifeRow = {
                "apiName": "goodlife_member_master",
                "requestBody": "{\"CARDNO\":\"\",\"VIN\":\"" + vinNo + "\"}"
            }
            synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getGoodlifeRow).then(function(data) {
                $('.member-api-error').hide();
                if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                    let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
                    if (responseData.ResponseMessage == "Success") {
                    	
                    		let userdetails = responseData.Data.Table[0];
                            var $formElements = $('.profile-form-wrapper,.insurance-form-wrapper').find("input,select");
                            $formElements.each(function() {
                                var inputName = $(this).attr("name");
                                var isCheckbox = $(this).attr('type') === 'checkbox';
                                Object.keys(userdetails).forEach(function(key) {

                                    var populateVal;
                                    if (key === inputName) {
                                        if (isCheckbox === true) {
                                            var checkedVal = userdetails[key];
                                            if (typeof checkedVal === "boolean" || typeof checkedVal === "string") {
                                                var tempChedVal = "" + checkedVal;
                                                checkedVal = [];
                                                checkedVal.push(tempChedVal);
                                            }
                                            if (checkedVal != null) {
                                                for (var i = 0; i < checkedVal.length; i++) {
                                                    populateVal = checkedVal[i];
                                                    populateValues($('.profile-form-wrapper,.insurance-form-wrapper'), inputName, populateVal);
                                                }
                                            }

                                        } else {
                                            populateVal = userdetails[key];
                                            if (populateVal != null) {
                                                populateValues($('.profile-form-wrapper,.insurance-form-wrapper'), inputName, populateVal);
                                            }
                                        }
                                    }
                                });
                            });

                            if (userdetails.IS_OWNER_USER != null) {
                                $('[name=IS_OWNER_USER]').attr("disabled", true);
                                if ($('[name=IS_OWNER_USER]:checked').val() == 'USER') {
                                    $('.is-user-selected').removeClass('d-none');
                                } else {
                                    $('.is-user-selected').addClass('d-none');
                                }
                            }
                            if (userdetails.GEDNER != null) {
                                $(".radio-item-" + userdetails.GEDNER).attr("checked", true);
                            }
                            $('[name=OwnerMobile]').val() == '' ? $('[name=OwnerMobile]').val(userdetails.MOBILE) : '';
                            $('[name=OWNERNAME]').val() == '' ? $('[name=OWNERNAME]').val(userdetails.NAME) : '';
                            let dob = new Date(userdetails.BIRTH_DT);
                            let month=dob.getMonth()+1 ,day=dob.getDate();
                            if (month < 10) month = "0" + month;
                            if (day < 10) day = "0" + day;
                            $('[name=BIRTH_DT]').val(dob.getFullYear() + "-" + month + "-" + day );
                            $('[name=address_line1]').val(userdetails.ADD1 + userdetails.ADD2);
                            $('[name=chapter-city]').val($('[name=chapter]').val());
                            $('[name=BIRTH_DT]').css("color", "#000");
                            if(userdetails.MembershipClub != null) {
                            	$('.enrollment-type').text(userdetails.MembershipClub);
                            	$('.enrollment-error').show();
                            }
                            populateStates($("[name=STATE]"), $("[name=CITY]")).then(function (data){
                            	if(userdetails.STATE != null) {
                            		if($("[name=STATE] option[value='"+userdetails.STATE.toUpperCase()+"']").length > 0) {
                                    	$("[name=STATE]").val(userdetails.STATE.toUpperCase());
                                    	populateCity($("[name=STATE]"), $("[name=CITY]")).then(function (mmidata){
                                       	 	if($("[name=CITY] option[value='"+userdetails.CITY.toUpperCase()+"']").length > 0) {
                                       	 		$("[name=CITY]").val(userdetails.CITY.toUpperCase());
                                        	}else {
                                        		$("[name=CITY]").css('color', '#ccc');
                                        	}
                                   	 	})
                                	}else {
                                		$("[name=STATE]").css('color', '#ccc');
                                        $("[name=CITY]").css('color', '#ccc');
                                    	$("[name=STATE]").closest('.form-group').find('.hasError').remove();
                                	}
                                	 
                                	 $("[name=STATE]").val() == null ? $("[name=CITY]").attr('disabled', 'disabled') : '';
                            	}
                            	
                            })
                        
                    }
                }
            })['catch'](function(error) {
                $('.member-api-error').show();
                if ($('.enrollment-form-wrapper').attr('data-formtype') == 'xclan') {
                	$('.cancel:visible').trigger('click');
                }
            })
        
    }

});

// Select color change to black
function changeMe(sel){
    sel.style.color = "#000";              
}

// DATE-PICKER color change to black
$('input[type="date"]').change(function(){
    this.style.color = "#000";
});