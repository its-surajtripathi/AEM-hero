$(document).ready(function () {

  var videos = $("video");

    videos.on("play", function() {
        videos.not(this).each(function() {
            this.pause();
        });
    });

  $('.d-desktop-video-hdbc').simpleLightbox();
    
  $('.hdbc-video--slider-wrap:first').addClass('reveal');

  const slickVideosHdbc = {
    rows: 1,
    slidesToShow: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: "<img class='a-left-hdbc control-c next slick-prev' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
    nextArrow: "<img class='a-right-hdbc control-c next slick-next' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
    infinite: false,
    slidesToScroll: 1,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 769,
        settings: {
          rows: 1,
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 426,
        settings: {
          rows: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  }
  
  $('.hdbc-video--slider-wrap').slick(slickVideosHdbc);

  $('.hdbc-video--slider-wrap').on('afterChange', function (event, slick, currentSlide) { 
    const slideLength = $('.hdbc-video--slider-wrap .slick-slide').length;
    if(currentSlide === 0) {
        $('.hdbc-video--slider-wrap .a-left-hdbc').addClass('slick-arrow-hidden');
    }
    else {
        $('.hdbc-video--slider-wrap .a-left-hdbc').removeClass('slick-arrow-hidden');
    }  

    if ($(window).width() > 769) {
      if(currentSlide === slideLength - 3) {
        $('.hdbc-video--slider-wrap .a-right-hdbc').addClass('slick-arrow-hidden');
      }
      else {
        $('.hdbc-video--slider-wrap .a-right-hdbc').removeClass('slick-arrow-hidden');
      } 
    } else if ($(window).width() < 769 && $(window).width() > 426) {
      if(currentSlide === slideLength - 2) {
        $('.hdbc-video--slider-wrap .a-right-hdbc').addClass('slick-arrow-hidden');
      }
      else {
        $('.hdbc-video--slider-wrap .a-right-hdbc').removeClass('slick-arrow-hidden');
      } 
    } 
    else if ($(window).width() < 427) {
      if(currentSlide === slideLength - 1) {
        $('.hdbc-video--slider-wrap .a-right-hdbc').addClass('slick-arrow-hidden');
      }
      else {
        $('.hdbc-video--slider-wrap .a-right-hdbc').removeClass('slick-arrow-hidden');
      } 
    }
  })
  
  $('.hdbc-video--slider-wrap .slick-track').each(function () {
    if ($(this).find('.hdbc--video-gallery-tile').length < 4) {
      $(this).addClass("d-flex");
    }
  });

  
  $('.hdbc-video--slider-wrap .a-left-hdbc').addClass('slick-arrow-hidden');
})