$(document).ready(function() {
$('.select_voucher').find('.select-row').each(function(){
var currentSelection = $(this);
    $(this).find('.increase').on('click', function() {
    var getClickedElem = $(this);
            var populateInput = getClickedElem.closest('.pricebox').find('.price-input');
            var value = parseInt(populateInput.text(),10);
                    value = isNaN(value) ? 0 : value;
                    value++;
                    populateInput.html(value);
                    $(currentSelection).find('.rightside-number').html(value * getClickedElem.data('value'));

      });
      $(this).find('.decrease').on('click', function() {
          var getClickedElem = $(this);
                  var populateInput = getClickedElem.closest('.pricebox').find('.price-input');
                  var value = parseInt(populateInput.text(),10);
                          value = isNaN(value) ? 0 : value;
                          value < 1 ? value = 1 : '';
                          value--;
                          populateInput.html(value);
                          $(currentSelection).find('.rightside-number').html(value * getClickedElem.data('value'));

            });
$(this).find('.increase,.decrease').on('click', function() {
       // const totalValue = document.getElementById('total');
        // console.log("inside function");
        let value1 = +$("#number1").text() * 30;
        let value2 = +$("#number2").text() * 50;
        let value3 = +$("#number3").text() * 100;
        let value4 = +$("#number4").text() * 200
        var total = value1 + value2 + value3 + value4;

        $('#total').html(total);
    if(total != $('#popup-selection').find('.voucher-container').attr('data-giftvalue'))
    {
		$('.service-popup-content').find('.sms-link').addClass('disabled');
    }else{
		$('.service-popup-content').find('.sms-link').removeClass('disabled');
    }


    });
});


});