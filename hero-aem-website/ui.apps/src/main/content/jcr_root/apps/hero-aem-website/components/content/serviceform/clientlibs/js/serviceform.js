$(document).ready(function () {
    var today = new Date().toISOString().split('T')[0];
    $('input[type="date"]').attr('min', today);

    // Modal 
    $('a[data-target="#serviceEnroll"]').click(function (e) {
        e.preventDefault();
        $('#serviceEnroll').modal('show');
    });

    // Tab Functionality
    let tabs = $('#service-form .two-tab-wrap .service-form-tab');
    tabs.click(function () {
        tabs.removeClass('tab-active');
        $(this).addClass('tab-active');
        let clickIndex = $(this).index();
        $('#service-form  .input-form-wrap').addClass('d-none').eq(clickIndex).removeClass('d-none');
    });
    tabs.first().click();

    // Submenu Clicks
    $("#service-form  .cust-dropdown-menu").on("click", "li", function () {
        let selectionGroup = $(this).parents(".cust-drop-down");
        let button = selectionGroup.find(".dropdown-select");
        button.text($(this).find("a")[0].innerHTML.replaceAll("&amp;", "&"));
        button.addClass("btn--active");
        let form = $(this).closest("form");
        selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
        $(this).addClass("active");

        if ("enrollmentname" == button.attr("name")) {
            form.find('[name="enrollmentNameVal"]').val($(this).attr("value"));
            let value = $(this).attr("value").replace(/[^a-zA-Z0-9]+/g, '').trim().toLowerCase();
            $('[name="ttcenterNameVal"]').val('');
            $('.input-form-wrap').each(function (i, obj) {
                if (!$(obj).hasClass('d-none')) {
                    $(this).find('#ttcenter-type').prop("disabled", false);
                    $(this).find('#ttcenter-type').removeClass('btn--active');
                    $(this).find('#ttcenter-type').text("Select Training Centre");
                    if (value == "ridesafeprogram") {
                        $(this).find('#drive-check').removeClass('d-none');
                        $(this).find('#license-check').removeClass('d-none');
                        $(this).find('ul[aria-labelledby="ttcenterDropdown"] li').removeClass('d-none');
                    }
                    else if (value == "ridesafeawarenessprogram") {
                        $(this).find('#drive-check').addClass('d-none');
                        $(this).find('#license-check').addClass('d-none');
                        $(this).find('ul[aria-labelledby="ttcenterDropdown"] li').removeClass('d-none');
                    }
                    else if (value == "learntoride") {
                        $(this).find('#drive-check').addClass('d-none');
                        $(this).find('#license-check').removeClass('d-none');
                        $(this).find('ul[aria-labelledby="ttcenterDropdown"] li').addClass('d-none');
                        $(this).find('ul[aria-labelledby="ttcenterDropdown"] li.show-on-condition').removeClass('d-none')
                    }
                }
            });
        }
        else if ("ttcenter" == button.attr("name")) {
            form.find('[name="ttcenterNameVal"]').val($(this).attr("value"));
        }
    })

    // Checkboxes
    $('input[name="drive-radio"]').change(function () {
        var checkedValue = $('input[name="drive-radio"]:checked').val();
        $('input[name="hiddenDriveValue"]').val(checkedValue);
    });

    $('input[name="license-radio"]').change(function () {
        var checkedValue = $('input[name="license-radio"]:checked').val();
        $('input[name="hiddenLicenseValue"]').val(checkedValue);
    });

    $('input[name="drive-radio--group"]').change(function () {
        let checkedValueGroup = $('input[name="drive-radio--group"]:checked').val();
        $('input[name="hiddenDriveValue"]').val(checkedValueGroup);
    });

    $('input[name="license-radio--group"]').change(function () {
        let checkedValueGroup = $('input[name="license-radio--group"]:checked').val();
        $('input[name="hiddenLicenseValue"]').val(checkedValueGroup);
    });

    // Validations
    function serviceFormValidations($form) {

        // Validators
        jQuery.validator.addMethod("numbersOnly", function (value) {
            return /^[0-9]+$/i.test(value);
        });
        jQuery.validator.addMethod("validNumber", function (value) {
            const disallowedNumbers = [
                "0123456789",
                "1111111111",
                "2222222222",
                "3333333333",
                "4444444444",
                "5555555555",
                "6666666666",
                "7777777777",
                "8888888888",
                "9999999999",
                "0000000000",
                "1234567890",
                "1010101010",
                "2020202020",
                "3030303030",
                "4040404040",
                "5050505050",
            ];
            if (disallowedNumbers.indexOf(value) !== -1) {
                return false;
            }
            if (value.length < 10) {
                return false;
            } else {
                return true;
            }
        });
        jQuery.validator.addMethod("indianNumber", function (value) {
            return /^[6789]\d{9}$/i.test(value);
        });
        jQuery.validator.addMethod("charactersOnly", function (value) {
            return /^[a-zA-Z&\s]+$/i.test(value);
        });
        jQuery.validator.addMethod("emailOnly", function (value) {
            return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
        });
        jQuery.validator.addMethod("onlyFutureDates", function (value) {
            let pickedDate = Date.parse(value.replace(/-/g, " "));
            let todaysDate = new Date();
            return !(pickedDate <= todaysDate);
        });
        jQuery.validator.addMethod("know2ride", function (value) {
            let driveValueParent = $("input[name='hiddenDriveValue']").parent();
            let licenseValueParent = $("input[name='hiddenLicenseValue']").parent();

            if (!driveValueParent.hasClass('d-none') && !licenseValueParent.hasClass('d-none')) {
                let driveValue = $("input[name='hiddenDriveValue']").val();
                let licenseValue = $("input[name='hiddenLicenseValue']").val();

                if (driveValue === 'no' && licenseValue === 'yes') {
                    return false;
                }
            } else if (driveValueParent.hasClass('d-none') && licenseValueParent.hasClass('d-none')) {
                return true; 
            }

            return true;
        });
        jQuery.validator.addMethod("gotLic", function (value) {
            let driveValueParent = $("input[name='hiddenDriveValue']").parent();
            let licenseValueParent = $("input[name='hiddenLicenseValue']").parent();
            let driveValue = $("input[name='hiddenDriveValue']").val();
            let licenseValue = $("input[name='hiddenLicenseValue']").val();

            if (driveValueParent.hasClass('d-none') && licenseValueParent.hasClass('d-none')) {
                return true;
            }

            if ((driveValue === 'yes' && licenseValue === 'no') || licenseValue === 'no') {
                return false;
            }

            return true;
        });
        jQuery.validator.addMethod("notZero", function (value) {

            return parseInt(value) > 0;
        });

        $form.validate({
            ignore: [],
            rules: {
                fullname: {
                    required: true,
                    charactersOnly: true,
                },
                mobileno: {
                    required: true,
                    numbersOnly: true,
                    validNumber: true,
                    indianNumber: true,
                },
                email: {
                    required: true,
                    emailOnly: true
                },
                hiddenDriveValue: {
                    required: true,
                },
                hiddenLicenseValue: {
                    required: true,
                    gotLic: true,
                    know2ride: true
                },
                dateEnroll: {
                    required: true,
                    min: false,
                },
                ttcenterNameVal: {
                    required: true,
                },
                organisationfullname: {
                    required: true
                },
                participantsNo: {
                    notZero: true,
                    required: true,
                },
                contactpersonname: {
                    required: true
                }
            },
            messages: {
                fullname: {
                    charactersOnly: $('[name="fullname"]').data("validation-msg-format"),
                    required: $('[name="fullname"]').data("validation-msg-req")
                },
                mobileno: {
                    required: $('[name="mobileno"]').data("validation-msg-req"),
                    numbersOnly: "Please enter numbers only",
                    validNumber: "Please enter a valid number",
                    indianNumber: "Please enter a valid number"
                },
                email: {
                    required: $('[name="email"]').data("validation-msg-req"),
                    emailOnly: $('[name="email"]').data("validation-msg-format")
                },
                enrollmentNameVal: {
                    required: $('[name="enrollmentNameVal"]').data("validation-msg-req"),
                },
                hiddenDriveValue: {
                    required: $('[name="hiddenDriveValue"]').data("validation-msg-req")
                },
                hiddenLicenseValue: {
                    required: $('[name="hiddenLicenseValue"]').data("validation-msg-req"),
                    know2ride: $('[name="hiddenLicenseValue"]').data("condition-msg"),
                    gotLic: $('[name="hiddenLicenseValue"]').data("condition2-msg"),
                },
                dateEnroll: {
                    required: $('[name="dateEnroll"]').data("validation-msg-req"),
                },
                organisationfullname: {
                    required: $('[name="organisationfullname"]').data("validation-msg-req")
                },
                participantsNo: {
                    notZero: $('[name="participantsNo"]').data("condition-msg"),
                    required: $('[name="participantsNo"]').data("validation-msg-req"),
                },
                ttcenterNameVal: {
                    required: $('[name="ttcenterNameVal"]').data("validation-msg-req")
                },
                contactpersonname: {
                    required: $('[name="contactpersonname"]').data("validation-msg-req"),
                }
            }
        })
    }

    if ($("#service-form").length > 0) {
        serviceFormValidations($(".service-enrollment-form"));
        serviceFormValidations($(".service-enrollment-form--group"));
    }

    async function serviceFormSubmit(currentForm) {
        var serviceEnrollObj = {
            enrolltype: currentForm.attr('id') == "individual" ? "Individual" : "Group",
            fullname: currentForm.find('input[name="' + (currentForm.attr('id') == "individual" ? "fullname" : "contactpersonname") + '"]').val(),
            mobileno: currentForm.find('input[name="mobileno"]').val(),
            email: currentForm.find('input[name="email"]').val(),
            enrollmentNameVal: currentForm.find('input[name="enrollmentNameVal"]').val(),
            dateEnroll: currentForm.find('input[name="dateEnroll"]').val(),
            ttcenterNameVal: currentForm.find('input[name="ttcenterNameVal"]').val(),
            driveRadio: currentForm.find('#drive-check').hasClass("d-none") ? null : "yes",
            licenseRadio: currentForm.find('#license-check').hasClass("d-none") ? null : "yes",
            organisationfullname: currentForm.find('input[name="organisationfullname"]').val() || "",
            participantsNo: currentForm.find('input[name="participantsNo"]').val() || ""
        };
        console.log("serviceObj", serviceEnrollObj);

        // API Integration

        let safetyProgramURL = $("#service-form").attr("data-component-relativePath");
        var safetyProgramPath = safetyProgramURL.replace(
            "jcr:content",
            "_jcr_content"
        );
        $.ajax({
            url: safetyProgramPath,
            type: "POST",
            data: JSON.stringify(serviceEnrollObj),
            dataType: "json",
            contentType: "application/json",
            success: function (resp) {
                $('.thank-you-success').removeClass('d-none');
                $('.service-form-wrap').css('z-index', "-1");
            },
            error: function (error) { },
        });
    }



    $('#service-form input[name="submit"]').click(function () {
        $('input[type="date"]').removeClass('error');
        let closestForm = $(this).parent().siblings("form");

        if ($("input[name='hiddenDriveValue']", closestForm).parent().hasClass('d-none')) {
            closestForm.find("input[name='hiddenDriveValue']").rules("remove", "required");
        }
        if ($("input[name='hiddenLicenseValue']", closestForm).parent().hasClass('d-none')) {
            closestForm.find("input[name='hiddenLicenseValue']").rules("remove", "required");
        }

        if (closestForm.valid()) {
            serviceFormSubmit(closestForm);
            let formerrorList = closestForm.data("validator").errorList;
            let fieldlist = "";
            $.each(formerrorList, function (key, value) {
                if ("" !== fieldlist) {
                    fieldlist = fieldlist + "|";
                }
                fieldlist = fieldlist + formerrorList[key].element.name;
            });
        }
    });

    $('#serviceEnroll, #serviceEnroll .close').click(function(){
        if ($('#serviceEnroll').hasClass("show")) {
            $('.thank-you-success').addClass('d-none');
            $('.service-form-wrap').css('z-index', "1");
        }
    });
})