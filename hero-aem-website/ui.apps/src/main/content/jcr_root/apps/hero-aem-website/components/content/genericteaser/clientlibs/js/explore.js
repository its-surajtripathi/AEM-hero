$(document).ready(function () {
  const exploreSlickSettings = {
    infinite: false,
    autoplay: true,
    dots: true,
    prevArrow: false,
    nextArrow: false,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 9999,
        settings: "unslick",
      },
      {
        breakpoint: 991,
        settings: "unslick",
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          width: "100%",
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };

  const exploreSlickSettingsvar = {
    rows: 1,
    slidesToShow: 3,
    infinite: false,
    autoplay: true,
    dots: true,
    prevArrow: false,
    nextArrow: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          width: "100%",
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };
  $(".explore-card-section-new").slick(exploreSlickSettings, 500);
  $(window).on("resize", function () {
    if (
      $(".explore-card-section-new") &&
      !$(".explore-card-section-new").hasClass("slick-initialized")
    ) {
      $(".explore-card-section-new").slick(exploreSlickSettings, 500);
    }
  });

  $(".explore-card-section-slick").slick(exploreSlickSettingsvar, 500);
  $(window).on("resize", function () {
    if (
      $(".explore-card-section-slick") &&
      !$(".explore-card-section-slick").hasClass("slick-initialized")
    ) {
      $("explore-card-section-slick").slick(exploreSlickSettingsvar, 500);
    }
  });

  if($('.generic-teaser-xpulse-bg .slick-track').height() > 0) {
    $('.generic-teaser-xpulse-bg .slick-track .bootstrap-generic-xpulse').css('height', `${$('.generic-teaser-xpulse-bg .slick-track').height() - 15 }px`);
  }

  let titleMinHeight = 50.4;
  $(".explore-card-section-new .card-title").each(function () {
    if ($(this).height() > titleMinHeight) {
      titleMinHeight = $(this).height();
      $(".explore-card-section-new .card-title").css("height", titleMinHeight);
    }
  });

  let bodyMinHeight = 50.4;
  $(".explore-card-section-new .card-body").each(function () {
    $(".card-text").css("font-family", "var(--font-tstar-medium)");
    if ($(this).height() > bodyMinHeight) {
      bodyMinHeight = $(this).height() + 40;
      $(".explore-card-section-new .card-body").css("height", bodyMinHeight);
    }
  });
  
  $("#scooterBanner .volume-button").on("click", function () {
    let currentElement = $(this).parent().find("video")[0];
    if ($(window).width() < 768) {
      currentElement = $(this).parent().find("video")[1];
    }
    if (currentElement && currentElement.muted) {
      currentElement.muted = false;
      $(this).find(".volume-on").removeClass("d-none");
      $(this).find(".volume-on").addClass("d-block");
      $(this).find(".volume-off").removeClass("d-block");
      $(this).find(".volume-off").addClass("d-none");
    } else {
      currentElement.muted = true;
      $(this).find(".volume-on").removeClass("d-block");
      $(this).find(".volume-on").addClass("d-none");
      $(this).find(".volume-off").removeClass("d-none");
      $(this).find(".volume-off").addClass("d-block");
    }
  });

  $("#scooterBanner").on("slid.bs.carousel", function (e) {
    let videoEle = $(".carousel-item").find("video");
    videoEle.each(function () {
      $(this)[0].pause();
      let playVideo = $(".carousel-item.active").find("video");
      playVideo &&
        playVideo.each(function () {
          $(this)[0].play();
        });
    });
  });

  if($('.service-safe-hero-wrapp').length > 0){
    $('.common-tabs-main .nav-item .nav-link').addClass('service-safe-hero-nav-links');
    $('.hero-exchange-content').addClass('service-banner-exchange-content');
    $('.hero-exchange .hero-exchange-wrapper .hero-exchange-content .hero-exchange-img img').addClass('ride-safe-ad-banner-img');
    $('.investor-explore ul.common-tabs-main .nav-item').addClass('service-genric-scroll-header-width');
    $('.explore-tab-section .slick-track').addClass('service-genric-scroll-header-wrap');
  }
});

  



