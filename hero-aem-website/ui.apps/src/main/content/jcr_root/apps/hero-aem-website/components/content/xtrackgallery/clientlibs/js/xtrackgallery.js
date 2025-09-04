$(document).ready(function () { 
    $('.xpulse-img-width-resize').attr({
      "data-aos": "fade-right",     
    });
    $('.xpulse-stage-fade-left').attr({
      "data-aos": "fade-left",     
    });
    AOS.init({
      duration: 1200,
      disable: 'mobile'
    }) 

    $('#videoHeading p').css('-webkit-text-stroke', '2px #ed1c24');
    $('.xtrac-photo-outer-wrapper').addClass('choose-wrapper-none');
    
    $('.d-desktop-image-xtrac').simpleLightbox();

    $('.d-desktop-video-xtrac').simpleLightbox();

    $("#videoHeading p").click(function () {
      $('.image-hover-enlarge-img').addClass("gallery-click-hover");
      $('#photoHeading p').css('-webkit-text-stroke', '2px #000');
      $('#videoHeading p').css('-webkit-text-stroke', '2px #ed1c24');
      $('.xtrac-video-outer-wrapper').removeClass("d-none");
      $('.xtrac-photo-outer-wrapper').addClass("choose-wrapper-none");
    })

    $("#photoHeading p").click(function () {
      $('.image-hover-enlarge-img').removeClass("gallery-click-hover");
        $('#videoHeading p').css('-webkit-text-stroke', '2px #000');
        $('#photoHeading p').css('-webkit-text-stroke', '2px #ed1c24');
        $('.xtrac-photo-outer-wrapper').removeClass("choose-wrapper-none");
        $('.xtrac-video-outer-wrapper').addClass("d-none");
    })
  
    
  $('.content-video-xtrac--slider-wrap:first').addClass('reveal');
  $('.content-photo-xtrac--slider-wrap:first').addClass('reveal');
  
  const slickPhotosXtrac = {
    rows: 1,
    slidesToShow: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: "<img class='a-left-xtrac control-c next slick-prev' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
    nextArrow: "<img class='a-right-xtrac control-c next slick-next' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
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

  const slickVideosXtrac = {
    rows: 1,
    slidesToShow: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    prevArrow: "<img class='a-left-xtrac control-c next slick-prev' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
    nextArrow: "<img class='a-right-xtrac control-c next slick-next' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
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
  
  $('.content-video-xtrac--slider-wrap').slick(slickVideosXtrac);
  $('.content-photo-xtrac--slider-wrap').slick(slickPhotosXtrac);

  $('.content-video-xtrac--slider-wrap').on('afterChange', function (event, slick, currentSlide) { 
    const slideLength = $('.content-video-xtrac--slider-wrap .slick-slide').length;
    if(currentSlide === 0) {
        $('.xtrac-video-outer-wrapper .a-left-xtrac').addClass('slick-arrow-hidden');
    }
    else {
        $('.xtrac-video-outer-wrapper .a-left-xtrac').removeClass('slick-arrow-hidden');
    }  

    if ($(document).width() > 769) {
      if(currentSlide === slideLength - 3) {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    } else if ($(document).width() < 769 && $(document).width() > 426) {
      if(currentSlide === slideLength - 2) {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    } 
    else if ($(document).width() < 427) {
      if(currentSlide === slideLength - 1) {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-video-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    }
  })

  $('.content-photo-xtrac--slider-wrap').on('afterChange', function (event, slick, currentSlide) {
    const slideLength = $('.content-photo-xtrac--slider-wrap .slick-slide').length;
    if(currentSlide === 0) {
        $('.xtrac-photo-outer-wrapper .a-left-xtrac').addClass('slick-arrow-hidden');
    }
    else {
        $('.xtrac-photo-outer-wrapper .a-left-xtrac').removeClass('slick-arrow-hidden');
    }  

    if ($(document).width() > 769) {
      if(currentSlide === slideLength - 3) {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    } else if ($(document).width() < 769 && $(document).width() > 426) {
      if(currentSlide === slideLength - 2) {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    } 
    else if ($(document).width() < 427) {
      if(currentSlide === slideLength - 1) {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').addClass('slick-arrow-hidden');
      }
      else {
        $('.xtrac-photo-outer-wrapper .a-right-xtrac').removeClass('slick-arrow-hidden');
      } 
    }
  })
  
  $('.content-video-xtrac--slider-wrap .slick-track').each(function () {
    if ($(this).find('.xtarc--video-gallery-tile').length < 4) {
      $(this).addClass("d-flex");
    }
  });
  $('.content-photo-xtrac--slider-wrap .slick-track').each(function () {
    if ($(this).find('.xtarc--photo-gallery-tile').length < 4) {
      $(this).addClass("d-flex");
    }
  });

  
  $('.xtrac-video-outer-wrapper .a-left-xtrac').addClass('slick-arrow-hidden');
  $('.xtrac-photo-outer-wrapper .a-left-xtrac').addClass('slick-arrow-hidden');
  })