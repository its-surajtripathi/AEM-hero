$(document).ready(function() {
    bredCrumbResize();

    function bredCrumbResize() {
        if ($('.bread-crumbs-section').length > 0) {
            var headerHeight = $('.header-main').height();
            $('.hero-breadcrumb').css({
                'margin-top': Math.round(headerHeight)
            })

            $('.home-main-section').css({
                'margin-top': Math.round($('.bread-crumbs-section').height())
            })
            if($('.hide-breadcrumb').length > 0 && getCookie('data') == null) {
            	$('.hide-breadcrumb').addClass('d-none');
            }
        }
    }
    $(window).bind("resize", function() {
        bredCrumbResize();
    });

    if($('#homeXpulse').length > 0){
        $(".breadcrumb  .breadcrumb-item a").click(function(){
         let hashValue = $(this).attr('href');
         hashValue && $("html, body").animate(
             {
               scrollTop: $(hashValue).offset().top - 100,
             },
             "slow"
           );
        }) 
     }
});