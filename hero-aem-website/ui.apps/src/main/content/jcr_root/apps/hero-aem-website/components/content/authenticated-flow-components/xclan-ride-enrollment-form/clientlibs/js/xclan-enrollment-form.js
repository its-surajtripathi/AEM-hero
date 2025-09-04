$(document).ready(function() {
    if ($('.xclan-enrollment-form-wrapper').length > 0 && document.getElementById('wcmmode') != null && document.getElementById('wcmmode').value != 'EDIT') {
        var vehicleData = JSON.parse(atob(getCookie('vehicleDetails')))
        $(vehicleData).each(function() {
            if (this.modelName.toLowerCase().indexOf('xpulse') != -1) {
                $('.xclan-enrollment-form-wrapper').find('[name=model]').append('<option value="' + this.vinNO + '|' + this.modelName + '">' + this.modelName + '</option>');
            }
        })
        if ($('.xclan-enrollment-form-wrapper').find('[name=model] option').length == 1) {
            window.location.href = $('.no-bike-redirect').val();
        } else {
            $('.xclan-enrollment-form-wrapper').find('[name=MOBILE]').val(JSON.parse(atob(getCookie('data'))).mobile)
            $('.xclan-enrollment-form-wrapper').find('[name=MOBILE]').attr('readonly', true);

            $($('[name=model]')).on('change', function() {
                var vinNo = $('[name=model]').val().split("|")[0];
                var fee = $.urlParam('nonXclanfees');
                var xclanMember = 'N';
                let getGoodlifeRow = {
                    "apiName": "goodlife_member_master",
                    "requestBody": "{\"CARDNO\":\"\",\"VIN\":\"" + vinNo + "\"}"


                }
                synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getGoodlifeRow).then(function(data) {
                    if (data.PWSESSIONRS[0].PWPROCESSRS.PWERROR == '') {
                        let responseData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
                        if (responseData.ResponseMessage == "Success") {
                        	 $('.member-api-error').hide();
                            if (responseData.Data.Table[0].Card_Number != null && new Date(responseData.Data.Table[0].Valid_Till) > new Date()) {
                                if (responseData.Data.Table[0].MembershipClub == 'Xclan') {
                                    fee = $.urlParam('xclanfees');
                                    $('[name=isClanMember]').val('Y');
                                    $('[name=fees]').val($.urlParam('xclanfees'));
                                    $('[name=encodedfees]').val($.urlParam('xclanencfees'));
                                }else {
                                	$('[name=fees]').val($.urlParam('nonXclanfees'));
                                    $('[name=encodedfees]').val($.urlParam('nonXclanencfees'));
                                    $('[name=isClanMember]').val('N');
                                }
                            } else {
                                $('[name=fees]').val($.urlParam('nonXclanfees'));
                                $('[name=encodedfees]').val($.urlParam('nonXclanencfees'));
                                $('[name=isClanMember]').val('N');
                            }

                        } else {
                            $('.api-error').text(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage);
                            $('.api-error').show();
                        }
                    }
                })['catch'](function(error) {
                    $('.member-api-error').show();
                })
            })
            $('.join-ride-form-submit').on('click', function() {
                var formFlag;
                $(this).closest('.xclan-enrollment-form-wrapper').find('.form-group').each(function() {
                    formFlag = validatingForm($(this));
                });
                formFlag = !($(this).closest('.xclan-enrollment-form-wrapper').find('.hasError').is(':visible'));
                if (formFlag) {
                    initiatePayment('MTAxOjox', $('[name=MOBILE]').val(), $('[name=model]').val().split("|")[0]).then(function(data) {
                        let validateDetailsReq = {
                            "Name": $('[name=NAME]').val(),
                            "GENDER": $('[name=GEDNER]').val(),
                            "CITY": $('[name=city]').val(),
                            "EMAIL": $('[name=EMAIL]').val(),
                            "PHONENO": $('[name=MOBILE]').val(),
                            "MODEL": $('[name=model]').val().split("|")[1],
                            "VIN": $('[name=model]').val().split("|")[0],
                            "REGISTRATIONNO": $('[name=registerationNumber]').val(),
                            "LICENSENUMBER": $('[name=licenseNo]').val(),
                            "FEE": $('[name=fees]').val(),
                            "IS_XCLAN_MEMBER": $('[name=isClanMember]').val(),
                            "HERO_TRANSACTION_ID": data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id,
                            "SOURCE": "WEB",
                            "AGE": $('[name=age]').val()

                        }
                        let joinRideReq = {
                            "apiName": "ValidateRideProfileEntry",
                            "requestBody": JSON.stringify(validateDetailsReq)


                        }
                        var accessCode = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].access_code;
                        var orderID = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.CC_PAYMENT_INITIATE.Row[0].order_id;

                        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, joinRideReq).then(function(data) {
                            if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseCode == 1) {
                                let getEncReq = {
                                    "orderID": orderID,
                                    "redirectURL": $(location).attr('protocol') + '//' + $(location).attr('host') + $('.success-redirect').val(),
                                    "cancelURL": $(location).attr('protocol') + '//' + $(location).attr('host') + $('.failure-redirect').val(),
                                    "rideValue": $('[name=encodedfees]').val()
                                }
                                let paymentDetailObj = {
                                    "orderID": orderID,
                                    "mobile" : $('[name=MOBILE]').val(),
                                    "nextAPICall": "InsertRideProfileEntry",
                                    "serverErrorPage": $('.failure-redirect').val(),
                                    "type": "xclan-ride",
                                    "requestBody": {
                                        "INTERMEDIATE_REFERENCE_NO": data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Data[0].INTERMEDIATE_REFERENCE_NO,
                                        "SOURCE": "WEB",
                                        "PAYMENT_REF_NO": "1"
                                    }
                                }
                                document.cookie = "paymentData=" + btoa(JSON.stringify(paymentDetailObj)) + "; path=/";
                                synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getReqForPayment, getEncReq).then(function(data) {
                                    window.location.href = window.aemConfigs.apiEndpoints.paymentGateWay + "&encRequest=" + data.encryptedValue + "&access_code=" + accessCode;
                                });
                            } else {
                                $('.api-error').text(data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.ResponseMessage);
                                $('.api-error').show();
                            }
                        })
                    })




                } else {
                    $('body').stop().animate({
                        scrollTop: 0
                    });
                }

            });
        }

    }


});