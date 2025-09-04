$(document).ready(function () { 
    
  $('.service-maintenance-container .content-maintain--slider-wrap:first').addClass('reveal');
  
  const slickSettingsGallery = {
    rows: $(document).width() < 769 ? 2 : 1,
    slidesToShow: $(document).width() < 769 ? 2 : 5,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    infinite: false,
    prevArrow: "<img class='a-left-maintainance control-c next slick-prev' src='/content/dam/hero-aem-website/service-journey-assets/hero-genuine-parts/left-arrow-maintain.png'>",
    nextArrow: "<img class='a-right-maintainance control-c next slick-next' src='/content/dam/hero-aem-website/service-journey-assets/hero-genuine-parts/right-arrow-maintain.png'>",
    slidesToScroll: 1,
  }
  
  $(window).resize(function () {
    if ($(this).width() > 768) {
      $('.content-maintain--slider-wrap').slick("resize");
    }
  })
  
  $('.content-maintain--slider-wrap').slick(slickSettingsGallery);
  $('.content-maintain--slider-wrap .slick-track').each(function () {
    if ($(this).find('.service-maintain-tile').length < 6) {
      $(this).addClass("d-flex");
    }
  });
  
  $('.functional-rep-content.mobile').slick({
    slidesToScroll: 1,
    slidesToShow: 1,
    infinite: false,
    arrows: false,
    dots: true,
  });

  $('.service-maintenance-container .content-maintain--slider-wrap').on('afterChange', function() {
    $('.content-maintain--slider-wrap').slick("setPosition");
  });

  })