$('.products-list').slick({
   slidesToShow: 1,
   slidesToScroll: 1,
   autoplay: false,
   autoplaySpeed: 2000,
   mobileFirst: true,
   // arrows: true,
   infinte: true,
   prevArrow: "<button type='button' class='slick-prev'></button>",
   nextArrow: "<button type='button' class='slick-next'></button>",
   dots: false,
   responsive: [
      {
         breakpoint: 769,
         settings: "unslick"
      }
   ]
});

$(document).ready(function(){
   $('#women .merchandise-content').addClass("flex-row-reverse");
   if($(window).width()<768){
       $('#women .merchandise-content').removeClass("flex-row-reverse");
   }

   $("a[href$='men']").on("click", function(event) {
       event.preventDefault();
       var target = $(this).attr("href");
       $("html, body").animate({
         scrollTop: $(target).offset().top - 50
       }, 500);
     });

   var descriptionHeight = $('#men-merchandise-desc').height();
    if(descriptionHeight > 108){
     $('#men-merchandise-desc').addClass("hide");
        $('#show-desc-men').on("click", function(event) {
            event.preventDefault();
        $('#men-merchandise-desc').removeClass('hide');
            $('#show-desc-men').css('display', 'none');
        });
    }
    if(descriptionHeight <= 108) {
$('#show-desc-men').css('display', 'none');
    }


    var womenDescriptionHeight = $('#women-merchandise-desc').height();
    console.log(womenDescriptionHeight);
    if(womenDescriptionHeight > 108){
     $('#women-merchandise-desc').addClass("hide");
        $('#show-desc-women').on("click", function(event) {
            event.preventDefault();
        $('#women-merchandise-desc').removeClass('hide');
            $('#show-desc-women').css('display', 'none');
        });
    }
    if(womenDescriptionHeight <= 108) {
$('#show-desc-women').css('display', 'none');
    }
})