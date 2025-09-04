$(document).ready(function() {
    $('.cta-card').each(function(){
        $(this).on({
            mouseenter: function () {
             //$(this).parents().find('.text-flip-container .cta-card').removeClass('flipped')
                $(this).toggleClass('flipped');
                },
                mouseleave: function () {
                    $(this).removeClass('flipped');
                }
            });
    });

});