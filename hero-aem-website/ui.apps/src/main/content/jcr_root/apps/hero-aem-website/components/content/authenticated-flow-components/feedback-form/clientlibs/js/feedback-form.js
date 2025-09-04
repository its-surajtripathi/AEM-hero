/*document.querySelectorAll(".__range-step").forEach(function (ctrl) {
  var el = ctrl.querySelector('input');
  var output = ctrl.querySelector('output');
  var newPoint, newPlace, offset;
  el.oninput = function () {
     // colorize step options
     ctrl.querySelectorAll("option").forEach(function (opt) {
        if (opt.value <= el.valueAsNumber)
           opt.style.backgroundColor = '#D0D3D4';
        else
           opt.style.backgroundColor = '#D0D3D4';
     });
     // colorize before and after
     var valPercent = (el.valueAsNumber - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min));
     var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(' +
        valPercent + ', #1C1C1C), color-stop(' +
        valPercent + ', #aaa));';
     el.style = style;

     // Popup
     if ((' ' + ctrl.className + ' ').indexOf(' ' + '__range-step-popup' + ' ') > -1) {
        var selectedOpt = ctrl.querySelector('option[value="' + el.value + '"]');
        output.innerText = selectedOpt.text;
        output.style.left = "50%";
        output.style.left = ((selectedOpt.offsetLeft + selectedOpt.offsetWidth / 2) - output.offsetWidth / 2) + 'px';
     }
  };
  el.oninput();
});

window.onresize = function () {
  document.querySelectorAll(".__range").forEach(function (ctrl) {
     var el = ctrl.querySelector('input');
     el.oninput();
  });
};

function selectOnlyThis(id) {
  var myCheckbox = document.getElementsByName("myCheckbox");
  Array.prototype.forEach.call(myCheckbox, function (el) {
     el.checked = false;
  });
  id.checked = true;
}


*/
$(document).ready(function() {
    if ($('.submit-feedback').length > 0) {
        var feedbackRow = [{
            "0": JSON.parse(atob(getCookie('data'))).mobile
        }]
        var feedbackReq = requestParam("oa_getFeedbackCategory", feedbackRow);
        synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, feedbackReq).then(function(data) {
            //sucess pop up need to show
            var response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getFeedbackCategory.Row;
            if (response.length > 0) {
                $.each(response, function(key, value) {
                    $('[name=category]').append('<option value="' + value.category + '">' + value.category + '</option>')

                });
            }
        });

        $('[name=category]').on('change', function() {
            var feedbacksubRow = [{
                "0": JSON.parse(atob(getCookie('data'))).mobile,
                "1": $('[name=category]').val()
            }]
            var subFeedbackReq = requestParam("oa_getFeedbackSubCategory", feedbacksubRow);
            synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, subFeedbackReq).then(function(data) {
                //sucess pop up need to show
                var response = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getFeedbackSubCategory.Row;
                if (response.length > 0) {
                    $('[name=subcategory]').empty();
                    $.each(response, function(key, value) {
                        $('[name=subcategory]').append('<option value="' + value.sub_category + '">' + value.sub_category + '</option>')

                    });
                }
            });
        });


        $('.submit-feedback textarea').keyup(function() {
            var characterCount = $(this).val().length,
                current = $('#current'),
                maximum = $('#maximum'),
                theCount = $('#the-count');

            current.text(characterCount);
        });

        var currentDate = new Date();

        var month = currentDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var dateOfMonth = currentDate.getDate() + 1;
        if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
        var year = currentDate.getFullYear();
        var formattedDate = dateOfMonth + "/" + month + "/" + year;


        $('.feedback-submitBtn').on('click', function(e) {
            e.preventDefault();
            var formFlag;
            $(this).closest('form').find('.form-group').each(function() {
                formFlag = validatingForm($(this));
            });
            formFlag = !($(this).closest('form').find('.hasError').is(':visible'));
            if (formFlag) {
                var requestaemFeedback = [{
                    "firstname": JSON.parse(atob(getCookie('data'))).name,
                    "lastname": JSON.parse(atob(getCookie('data'))).name,
                    "mobile": JSON.parse(atob(getCookie('data'))).mobile,
                    "category": $("[name=category]").val(),
                    "subcategory": $("[name=subcategory]").val(),
                    "vin": JSON.parse(atob(getCookie('selectedVehicleData'))).vinNO,
                    "dealercode": "10375",
                    "complaint": $("[name=suggestion]").val() || '',
                    "date": formattedDate,
                    "ownerid": "10375V20"
                }]
                synchronousAjax(window.aemConfigs.apiEndpoints.getSubmitFeedbackAPI, requestaemFeedback).then(function(data) {
                    var response = data;
                    var requestFeedback = [{
                        "0": data.message,
                        "1": eyJDb250ZW50LVR5cGUiOiJ0ZXh0L3htbCIsIlNPQVBBY3Rpb24iOiJcImRvY3VtZW50L2h0dHA6Ly9zaWViZWwuY29tL0hITUxJbnRlcmZhY2UvOkNXU19zcGNDdXN0b21lcl9zcGNDb21wbGFpbnRcIiJ9,
                        "2": "WSCALL_Oneapp_bookService"

                    }]
                    var data = requestParam("oa_getFeedbackCategory", requestFeedback);
                    synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, data, requestFeedback).then(function(data) {
                        //sucess pop up need to show
                        var response = data;
                        $('#feedback-modal').modal('toggle');
                        // location.reload();
                    });
                });
            } else {
                $('body').stop().animate({
                    scrollTop: 0
                });
            }
        });
    }

});