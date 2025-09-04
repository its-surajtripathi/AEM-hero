
$(document).ready(function () {
if($('.product-header-main').length){
var productNavHeight = $('.product-header-main').height();
$('.hero-section-video,#scooterBanner,home-main-section').css('margin-top',productNavHeight);

$(".scroll-down-btn").on('click', function () {
  var scrollAmount = $('.next-section').offset().top - productNavHeight;
  window.scroll({
    top: scrollAmount,
    behavior: 'smooth'
  });

    });
    $(window).on('resize', function () {
    productNavHeight = $('.product-header-main').height();
   $('.hero-section-video,#scooterBanner,home-main-section').css('margin-top',productNavHeight);
    });
    }

});