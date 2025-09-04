	function getVouchers() {
	    if ($('.voucher-redemption-wrapper').length > 0) {
	    	$('.vouchers-available-wrapper').find('.no-results').addClass('d-none');
	    	$('.available-couponvouchers').remove();
	        let selectedVehData = JSON.parse(atob(getCookie('selectedVehicleData')));
	        let getRedemptionHistory = {
	            "apiName": "getDetails_redemptionHistory",
	            "requestBody": "{\"CARDNO\":\"" + selectedVehData.cardNumber + "\"}"
	        }
	        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, getRedemptionHistory).then(function(data) {
	            getRedemptionHistoryData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.Table;
	            if (data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API.StatusCode == 404) {
	                $('.vouchers-available-wrapper').find('.no-results').removeClass('d-none');
	            } else {
	                if(getRedemptionHistoryData != null && getRedemptionHistoryData.length){
	                getRedemptionHistoryData = $.grep(getRedemptionHistoryData, function(e) { return e.IS_REDEEMED!='Y' });
	                const result = getRedemptionHistoryData.reduce((acc, obj) => {
	                    return {
	                        ...acc,
	                        [obj.GIFT_POINTS]: [...acc[obj.GIFT_POINTS] || [], obj]
	                    }
	                }, {})
	
	                // Array of arrays
	                const result2 = Object.values(result);
	                // for(var i=0;i<result2.length;i++){
	                if(result2.length < 1) {
		                $('.vouchers-available-wrapper').find('.no-results').removeClass('d-none');
	                }
	                vehicleCallbackSucess(result2, $('.voucher-redemption-wrapper'), $('.availableVoucherTemplate'));
	
	
	
	                $('.voucher-tab').each(function(i) {
	                    var currentItem = $(this);
	                    currentItem.attr('data-index', i);
	                    if (currentItem.data('totalmilestones') == 1) {
	                        currentItem.find('.choose-one,.milestone-img,.icons-tab').addClass('d-none');
	                        currentItem.find('.reddem-one-voucher,.voucher-img,.servicevoucher-value').removeClass('d-none');
	                        if(currentItem.find('.servicevoucher-value .voucher-value').text()> 50){
	                            currentItem.find('.reddem-one-voucher .redeem-direct').addClass('d-none');
	                             currentItem.find('.reddem-one-voucher .redeem-select').removeClass('d-none');
	                        }else{
	                             currentItem.find('.reddem-one-voucher .redeem-direct').removeClass('d-none');
	                             currentItem.find('.reddem-one-voucher .redeem-select').addClass('d-none');
	                        }
	                    }
	
	                    else {
	                        currentItem.find('.reddem-one-voucher,.voucher-img,.servicevoucher-value').addClass('d-none');
	                        currentItem.find('.choose-one,.milestone-img,.icons-tab').removeClass('d-none');
	                    }
	
	
	
	                    currentItem.find('.reddem-one-voucher').on('click', function() {
	                        $('.voucher-amount').find('.voucher-redeem-details').remove();
	                        $('.no-response-error').hide();
	                    	$('.api-error').hide();
	                        for (var i = 0; i < result2.length; i++) {
	
	                            for (var j = 0; j < result2[i].length; j++) {
	                                if (currentItem.data('index') == i) {
	
	                                    vehicleCallbackSucess(result2[i][j], $('.voucher-amount'), $('.redeem-vouchertemplate'));

	                                    if(result2[i][j].VOUCHER_GIFT_TYPE === "GFT"){
	                                        $('.voucher-avail-instru').removeClass('d-none');
	                                        $('.sms-voucher-code').addClass('d-none');
	                                        $('.voucher-redeem-details .amount').show();
	                                    }
	                                    else if(result2[i][j].VOUCHER_GIFT_TYPE === "HSV"){
	                                        $('.voucher-avail-instru').addClass('d-none');
	                                        $('.sms-voucher-code').removeClass('d-none');
	                                        $('.voucher-redeem-details .amount').hide();
	                                    }else{
	                                         $('.sms-voucher-code').removeClass('d-none');
	                                    }
	                                    $('#popup-selection').find('.voucher-container .voucher-worth').text(result2[i][j].GIFT_VOUCHER_VALUE);
	                                    break;
	                                }


	                            }
	                        }
	                    });
	                    currentItem.find('.choose-one').on('click', function() {
	                    	$('.no-response-error').hide();
	                    	$('.api-error').hide();

	                        $('.couponRedemption').find('.offer-containers').remove();

	                        for (var i = 0; i < result2.length; i++) {

	                            for (var j = 0; j < result2[i].length; j++) {

	                                if (currentItem.data('index') == i && result2[i].length > 1) {
	                                    $('.milestoneValue').text(result2[i][j].GIFT_POINTS);
	                                    vehicleCallbackSucess(result2[i][j], $('.couponRedemption'), $('.coupon-vouchertemplate'));


	                                        var skuVal;
	                                        var productVal;
	                                        var currentRadio
	                                        var giftVoucherValue = result2[i][j].GIFT_VOUCHER_VALUE;
	                                        let giftID = result2[i][j].GIFT_ID;
	                                        if (result2[i][j].PRODUCT_SKU !== "" && result2[i][j].PRODUCT_SKU !== null) {
	                                            skuVal = result2[i][j].PRODUCT_SKU.split('~');
	                                            productVal = result2[i][j].PRODUCT_NAME.split('~');
	                                            $('#milstoneModal,#coupon-sku-modal,#redeemVoucher,#popup-selection').modal('hide');
	                                             $('.sms-voucher-code').removeClass('d-none');
	                                             $(document).on('click', '.offer-containers .product-code', function() {
	                                                var currentRadio = $(this);
                                                    $('.offer-containers').removeClass('selected');
	                                                currentRadio.closest('.offer-containers').addClass('selected');
	                                                $(document).on('click', '.reddem-one-sku', function() {
	                                                	$('.no-response-error').hide();
	                                                	$('.api-error').hide();
	                                                	currentRadio = $(this).closest('.coupon-milestonemodal-div').find('.offer-containers .product-code:checked');
	                                                    if (currentRadio.closest('.offer-containers').hasClass('QWK')) {
	                                                         $('#milstoneModal,#redeemVoucher,#popup-selection').modal('hide');

	                                                        $('.coupon-sku-wrapper').find('.coupon-sms-wrapper').empty();
	                                                        var newSKUArray = [];
	                                                        for (var k = 0; k < skuVal.length; k++) {
	                                                            var newSKU = {};;
	                                                            var getInputVal = skuVal[k];
	                                                            var inputtext = productVal[k];
	                                                            newSKU.value = getInputVal;
	                                                            newSKU.text = inputtext;
	                                                            newSKU.type = 'QWK';
	                                                            newSKU.giftid = giftID;
	                                                            newSKU.giftvalue = giftVoucherValue;
	                                                            newSKUArray.push(newSKU);
	
	
	                                                        }

	                                                        vehicleCallbackSucess(newSKUArray, $('.coupon-sku-wrapper'), $('.coupon-skutemplate'));
	                                                        $('#coupon-sku-modal').modal('show');
                                                             $(document).on('click', '.offer-containers .product-skucode', function() {
                                                                var currentRadio = $(this);
                                                                $('.offer-containers').removeClass('selected');
                                                                currentRadio.closest('.offer-containers').addClass('selected');
                                                            });
	
	                                                    } else if (currentRadio.closest('.offer-containers').hasClass('HSV') && giftVoucherValue > 50) {
	                                                        $('#milstoneModal,#coupon-sku-modal,#redeemVoucher').modal('hide');
	
	                                                        //var denomVal = currentRadio.closest('.offer-containers.HSV').data('denomvalue').split('~');
	                                                       /* for (var l = 0; l < denomVal.length; l++) {
	                                                            vehicleCallbackSucess(denomVal[l], $('.denomWrapper'), $('.denominationTemplate'));
	
	
	                                                        }*/
	                                                        $('.service-popup-content').find('.sms-link').addClass('disabled');
	                                                        $('#popup-selection').find('.voucher-container .voucher-worth').text(currentRadio.closest('.voucher-container').data('giftvalue'));
	                                                        $('#popup-selection').find('.voucher-container').attr('data-giftvalue',currentRadio.closest('.voucher-container').data('giftvalue'));
	                                                        $('#popup-selection').find('.voucher-container').attr('data-giftid',currentRadio.closest('.voucher-container').data('giftid'));
	                                                        $('#popup-selection').modal('show');

	
	
	                                                    } else {
	                                                    	$('.voucher-redeem-details').remove();
	                                                    	let radioObj = $(this).closest('.coupon-milestonemodal-div').find('[name=productcode]:checked').closest('.voucher-container');
	                                                    	let dataObj = {
	                                                    			VOUCHER_GIFT_TYPE : radioObj.data('type'),
	                                                    			GIFT_ID : radioObj.data('giftid'),
	                                                    			GIFT_VOUCHER_VALUE : radioObj.data('giftvalue'),
	                                                    			GIFT_NAME : radioObj.find('.offer-sub-middle').text()
	
	                                                    	}
	                                                        vehicleCallbackSucess(dataObj, $('.voucher-amount'), $('.redeem-vouchertemplate'));
	                                                    	if(dataObj.VOUCHER_GIFT_TYPE === "GFT"){
	                                                            $('.voucher-avail-instru').removeClass('d-none');
	                                                            $('.sms-voucher-code').addClass('d-none');
	                                                        }else if(dataObj.VOUCHER_GIFT_TYPE === "HSL"){
	                                                            $('.voucher-avail-instru').addClass('d-none');
	                                                            $('.sms-voucher-code').removeClass('d-none');
	                                                        }
	                                                        $('#milstoneModal,#coupon-sku-modal,#popup-selection').modal('hide');
	
	                                                        $('#redeemVoucher').modal('show');

	                                                        // $('.voucher-amount .amount').remove();
	                                                        //$('.voucher-amount').append('<span class="amount">' + giftVoucherValue + '</span>')
	
	                                                    }
	                                                });
	                                            });
	
	                                        }
	
	
	                                }
	
	
	
	                            }
	                        }
	                    });
	                });
	                $('.available-couponvouchers').slick({
	                    infinite: false,
	                    speed: 300,
	                    slidesToShow: 4,
	                    slidesToScroll: 1,
	                    responsive: [{
	                            breakpoint: 1024,
	                            settings: {
	                                slidesToShow: 3,
	                                slidesToScroll: 1,
	
	                            }
	                        },
	                        {
	                            breakpoint: 767,
	                            settings: {
	                                slidesToShow: 2,
	                                slidesToScroll: 1
	                            }
	                        },
	                        {
	                            breakpoint: 600,
	                            settings: {
	                                slidesToShow: 2,
	                                slidesToScroll: 1
	                            }
	                        },
	                        {
	                            breakpoint: 480,
	                            settings: {
	                                slidesToShow: 1,
	                                slidesToScroll: 1
	                            }
	                        }
	                        // You can unslick at a given breakpoint now by adding:
	                        // settings: "unslick"
	                        // instead of a settings object
	                    ]
	                })
	                $('.available-couponvouchers').removeClass('single-voucher');
	                if (window.innerWidth > 992) {
	                    if($('.available-couponvouchers').find('.voucher-white-card').length<=4){
	                             $('.available-couponvouchers').slick('unslick');
	                    }
	                 }else if(window.innerWidth < 991){
	                	 if($('.available-couponvouchers').find('.voucher-white-card').length<2) {
                             $('.available-couponvouchers').slick('unslick');
                             $('.available-couponvouchers').addClass('single-voucher');
	                	 }
	                 }
	                 }
	            }
	        });
	
	        $('.sms-link').on('click', function() {
	        	let voucherEle = $(this).closest('.modal-body').find('.voucher-container');
	        	if(voucherEle.hasClass('HSV')){
	        		if(voucherEle.data('giftvalue') == 50) {
	        			let reqObj = {
	        					"CardNo":JSON.parse(atob(getCookie('selectedVehicleData'))).cardNumber+"",
	        					"DenominationAmount":voucherEle.data('giftvalue')+"",
	        					"DenominationQty":"1",
	        					"GID":voucherEle.data('giftid')+"",
	        					"IsCoupon":"Y",
	        					"VOUCHER_SKU":"",
	        					"CALL_FROM":"WEB",
	        						};
	        			redeemCoupon(reqObj, 'HSV');
	        		}else {
	        			let denominationQty = $("#number1").text() > 0 ? $("#number1").text()+'~' : '';
	        			denominationQty = denominationQty + ($("#number2").text() > 0 ? $("#number2").text()+'~' : '');
	        			denominationQty = denominationQty + ($("#number3").text() > 0 ? $("#number3").text()+'~' : '');
	        			denominationQty = denominationQty + ($("#number4").text() > 0 ? $("#number4").text()+'~' : '');
	        			let denominationAmount = $("#number1").text() > 0 ? '30~' : '';
	        			denominationAmount = denominationAmount + ($("#number2").text() > 0 ? '50~' : '');
	        			denominationAmount = denominationAmount + ($("#number3").text() > 0 ? '100~' : '');
	        			denominationAmount = denominationAmount + ($("#number4").text() > 0 ? '200~' : '');
	        			let reqObj = {
	        					"CardNo":JSON.parse(atob(getCookie('selectedVehicleData'))).cardNumber+"",
	        					"DenominationAmount":denominationAmount.slice(0, -1),
	        					"DenominationQty":denominationQty.slice(0, -1),
	        					"GID":voucherEle.data('giftid')+"",
	        					"IsCoupon":"Y",
	        					"VOUCHER_SKU":"",
	        					"CALL_FROM":"WEB"
	        						};
	        			redeemCoupon(reqObj, 'HSV');
	        		}
	        	}else if(voucherEle.hasClass('QWK')) {

	        		let reqObj = {
	    					"CardNo":JSON.parse(atob(getCookie('selectedVehicleData'))).cardNumber+"",
	    					"DenominationAmount":voucherEle.data('giftvalue')+"",
	    					"DenominationQty":"1",
	    					"GID":voucherEle.data('giftid')+"",
	    					"IsCoupon":"Y",
	    					"VOUCHER_SKU":voucherEle.find('[name=productcode]:checked').val(),
	    					"CALL_FROM":"WEB"
	    						};
	        		redeemCoupon(reqObj, 'QWK');
	        	}else if(voucherEle.hasClass('HSL')) {
	        		let reqObj = {
	    					"CardNo":JSON.parse(atob(getCookie('selectedVehicleData'))).cardNumber+"",
	    					"DenominationAmount":voucherEle.data('giftvalue')+"",
	    					"DenominationQty":"1",
	    					"GID":voucherEle.data('giftid')+"",
	    					"IsCoupon":"Y",
	    					"VOUCHER_SKU":"",
	    					"CALL_FROM":"WEB"
	    						};
	        		redeemCoupon(reqObj, 'HSL');
	        	}
	        });


	    }
	}
    function redeemCoupon(reqBody, voucherType) {
    	$('.no-response-error').hide();
    	$('.api-error').hide();
    	let reqObj = {
    	        "apiName": "CouponRedemption",
    	        "requestBody": JSON.stringify(reqBody)
    	        }
    	        synchronousAjaxCallToAEM(window.aemConfigs.apiEndpoints.getGoodLifeAPI, reqObj).then(function(data) {
    	        	let response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.GOODLIFE_API;
    	        	if(response.ResponseCode == 0) {
    	        		$('.api-error').text(response.ResponseMessage);
    	        		$('.api-error').show();
    	        	}else if(response.ResponseCode == 1) {
    	        		$('#milstoneModal,#coupon-sku-modal,#popup-selection,#redeemVoucher').modal('hide');
    	        		$('.points-earn-left').text(response.Data.Table[0].TOTAL_POINTS);
    	        		let idname = 'submitPopup' + voucherType;
    	        		$("#"+idname).find('.info-popup-body-title').addClass('d-none');
    	        		let popupContent = $("#"+idname).find('.info-popup-body-title').html();
    	        		popupContent = popupContent.replace(/\${coupon-number}/g, response.Data.Table[0].Coupon_No);
    	        		popupContent = popupContent.replace(/\${points}/g, response.Data.Table[0].points);
		    			if(voucherType == 'HSV') {
		    				popupContent = popupContent.replace(/\${Coupon_Amount}/g, response.Data.Table[0].VoucherValue);
		    				popupContent = popupContent.replace(/\${modelName}/g, JSON.parse(atob(getCookie('selectedVehicleData'))).modelName);
		    			}
		    			if(voucherType == 'QWK') {
		    				popupContent = popupContent.replace(/\${Gift_Name}/g, response.Data.Table[0].Gift_Name);
		    				popupContent = popupContent.replace(/\${Coupon_Amount}/g, reqBody.DenominationAmount);
		    			}else {
		    				popupContent = popupContent.replace(/\${Coupon_Amount}/g, response.Data.Table[0].Coupon_Amount);
		    			}
    	        		$("#"+idname).find('.info-popup-body-title').closest('p').append('<span class="info-popup-body-title">'+popupContent+'</span>');
    	        		$("#"+idname).modal('toggle');
    	        		getVouchers();
    	        	}else {
                        $('.no-response-error').show();
    	        	}
    	        	

    	        })['catch'](function(error) {
                    $('.no-response-error').show();
                })
    }
    
    function getVoucherImg(voucherName) {
    	let voucherList = ['amazon', 'flipkart', 'nykaa', 'myntra', 'uber', 'dominos', 'bata', 'apollo', 'croma', 'titan', 'makemytrip'];
    	let mappedName = '/gifticon.png';
    	$(voucherList).each(function(i) {
    		if(voucherName.toLowerCase().indexOf(this) != -1) {
    			mappedName = '/' + this +'.png';
                return false;
                
    		}
    	})
    	return mappedName;
    	
    }
