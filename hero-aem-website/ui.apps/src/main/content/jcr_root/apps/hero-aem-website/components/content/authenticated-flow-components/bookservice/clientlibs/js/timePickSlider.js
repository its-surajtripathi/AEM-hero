$(document).ready(function () {
    var sheet = document.createElement("style"),
        $rangeInput = $(".range input"), a
    prefs = ["webkit-slider-runnable-track", "moz-range-track", "ms-track"];

    document.body.appendChild(sheet);

    var getTrackStyle = function (el) {
        var curVal = el.value;
            //val = (curVal - 1) * 16.666666667;

        // Set active label
        $(".range-labels li").removeClass("active selected");

        var curLabel = $(".range-labels").find("li:nth-child(" + curVal + ")").not('.disabled');

        curLabel.addClass("active selected");

    //$(this).closest('.range').find('input').
       // $(this).closest('.range').find('input').trigger('click')
        if(curLabel.length>0){

        var dataSelected = $(".active.selected").text();
         var dataSelectedValue = $(".active.selected").data('value');
        var index = $(this).index();
       // $rangeInput.val(index + 1).trigger("input");
         $('#timePicker').text(dataSelected);
        $('#timePicker').attr('selected-time',dataSelectedValue);


         if($('.refDate').css('visibility') !== 'hidden'){
                    $('#book-serve-first').find('.nxt-btn').removeClass('disabled');
                }
        }else{
			$('#book-serve-first').find('.nxt-btn').addClass('disabled');
			 $('#timePicker').text('');
        }
        return;
    };


$rangeInput.on("input", function () {
        sheet.textContent = getTrackStyle(this);
    });
    $('.range-labels').on('click', 'li', function (e) {
        if(!$(this).hasClass('disabled')){
       // $(this).closest('.range').find('input').trigger('click')
        var dataSelected = $(this).text();
         var dataSelectedValue = $(this).data('value');
        var index = $(this).index();
        $rangeInput.val(index + 1).trigger("input");
        console.log(index);
        console.log(dataSelected);
        $('#timePicker').text(dataSelected);
$('#timePicker').attr('selected-time',dataSelectedValue);
        }
        else{
			 $('#book-serve-first').find('.nxt-btn').addClass('disabled');
			  $('#timePicker').text('');
        }
    });


});

