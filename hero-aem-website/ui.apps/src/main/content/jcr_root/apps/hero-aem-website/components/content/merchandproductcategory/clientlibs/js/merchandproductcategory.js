$(document).ready(function(){
  $('.scrollToTop').click(function(){
      $("html, body").animate({
          scrollTop: 0
        }, 500);
  })

  $(window).scroll(function() {
      if($(window).width()>769){
          if ($(window).scrollTop() > 0) {
              $('.scrollToTop').addClass('reveal');
            } else {
              $('.scrollToTop').removeClass('reveal');
            }
      }
    });

  var banner = $('.hero-carousel');
var products = $('.merchandproductcategory');

  if(banner && banner.length >0 && products && products.length > 0){

      $('.slider-content').addClass(function() {
            return "explore-collection-cta-container";
      })
    $('.slider-content').removeClass(function() {
            return "slider-content";
      })

    $('.carousel-indicators').addClass(function (){
         return "hero-slider-indicators";
    })
  }
})



