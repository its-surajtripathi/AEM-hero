$(document).ready( function(){
    $('.lights-on-image').addClass("d-none");
    let switchStatus = false;
    $("#xoomswitchButton").on('change', function() {
        if ($(this).is(':checked')) {
            switchStatus = $(this).is(':checked');
            $('.lights-on-image').removeClass("d-none");
            $('.lights-off-image').removeClass("d-block");
            $('.lights-off-image').addClass('d-none');
            $('.lights-on-image').addClass('d-block');
        }
        else {
        switchStatus = $(this).is(':checked');
        $('.lights-on-image').removeClass("d-block")
        $('.lights-on-image').addClass('d-none');
        $('.lights-off-image').addClass('d-block');
        }
    });

    $(window).resize(function () {
        if ($(document).width() < 500) {
            $('.xoom-lights-heading-wrapper').addClass("d-none")
            $('.xoom-lights-alt-heading-wrapper').addClass('d-block');
        }
    })
});