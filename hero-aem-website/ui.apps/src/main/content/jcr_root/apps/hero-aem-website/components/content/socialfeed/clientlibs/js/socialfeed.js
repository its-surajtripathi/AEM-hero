$(document).ready(function () {
  $('.xtrack-scrollToTop ').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 500);
  })

  $(window).scroll(function () {
    if ($(window).scrollTop() > 0) {
      $('.xtrack-scrollToTop').addClass('reveal');
    } 
    else {
      $('.xtrack-scrollToTop').removeClass('reveal');
    }
  });

  $('.xtracks-social .slider--wrap').slick({
    infinite: true,
    dots: true,
    arrows: true,
    prevArrow: "<img class='social-arrow-left control-c next slick-prev' src='/content/dam/hero-aem-website/in/xtracks/arrow-prev.png'>",
    nextArrow: "<img class='social-arrow-right control-c next slick-next' src='/content/dam/hero-aem-website/in/xtracks/arrow-next.png'>",
    autoPlay: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
    ]
  });

  let socialFeed = $('.xtracks-social');
  if (socialFeed && socialFeed.length > 0) {
    $('.carousel-indicators').addClass(function () {
      return "hero-xtrack-slider-indicators";
    });
    // $('.hero-carousel').append("<img id='xtrack-carrousel-img' src='/content/dam/hero-aem-website/in/xtracks/banners/Rides-Team-Logo-1.png'/>");
    $('#scooterBanner .carousel-inner .carousel-item .scooter-banner-slide .slider-content').addClass('button-aligner');
  }

  $('nav.newsabhead ul li.breadcrumb-item a').click(function (event) {
    let thisRef = $(this).attr("href");
    if (socialFeed && socialFeed.length > 0) {
      if (thisRef.startsWith("#")) {
        event.preventDefault();
        $("html, body").animate({
          scrollTop: $(thisRef).offset().top - 145
        }, 500);
      }
    }
  })
})