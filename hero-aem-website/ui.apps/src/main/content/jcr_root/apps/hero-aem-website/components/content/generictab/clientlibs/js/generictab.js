$(document).ready(function () {
  const tabSlickSettings = {
    infinite: $('.investor-explore').length > 0 ? false : true,
    dots: false,
    autoplay: false,
    centerMode: $('.investor-explore').length > 0 ? false : true,
    variableWidth: $('.investor-explore').length > 0 ? false : true,
    focusOnSelect: true,
    arrows: $('.investor-explore').length > 0 ? false : true,
    prevArrow: "<button type='button' class='slick-prev'><img src='/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/left-black-arrow.svg'></button>",
    nextArrow: "<button type='button' class='slick-next'><img src='/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/left-black-arrow.svg'></button>",
    responsive: [
      {
        breakpoint: 9999,
        settings: "unslick"
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: $('.investor-explore').length > 0 ? 3 : 2,
        }
      },
      {
        breakpoint: 414,
        settings: {
          slidesToShow: $('.good-life-tab-header').length > 0 || $('#genuine-parts-slick').length > 0 ? 2 : 3,
          slidesToScroll: $('.good-life-tab-header').length > 0 || $('#genuine-parts-slick').length > 0 ? 2 : 3,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: $('.good-life-tab-header').length > 0 || $('#genuine-parts-slick').length > 0 ? 2 : 3,
          slidesToScroll: $('.good-life-tab-header').length > 0 || $('#genuine-parts-slick').length > 0 ? 2 : 3,
        }
      }
    ]
  };
  $('.common-tabs-main').slick(tabSlickSettings, 500).on('afterChange', onSliderAfterChange);
  $(window).on('resize', function () {
    if ($('.common-tabs-main') && !$('.common-tabs-main').hasClass('slick-initialized')) {
      $('.common-tabs-main').slick(tabSlickSettings, 500);
    }
  });

  // $('#maintenanceschedule').on('click', '.slick-arrow', function () {
  //   $('.content-maintain--slider-wrap').css("visibility","hidden");
  //   $('.content-maintain--slider-wrap').css("","hidden");
  // })

  function onSliderAfterChange() {
      $('.content-maintain--slider-wrap').css("visibility", "visible");
      $('.content-maintain--slider-wrap').slick("setPosition");
      $('.content-hdbc--slider-wrap').slick("setPosition");
  }

  function changeCommonTabs(TabValue) {
    var strTabName = TabValue;
    $(strTabName).siblings().removeClass('active show');
    $(strTabName).addClass('active');
    setTimeout(function () {
      $(strTabName).addClass('show');
    }, 150);
  }
  $(document).on('click', '.common-tabs-main .nav-link', function () {
    $(this).parent().siblings().find('.nav-link').removeClass('active');
    $(this).parent().siblings().find('.active-img').addClass('d-none');
    $(this).parent().siblings().find('.inactive-img').removeClass('d-none');
    $(this).parent().find('.active-img').removeClass('d-none');
    $(this).parent().find('.inactive-img').addClass('d-none');

    var strTabName = $(this).attr('href');
    changeCommonTabs(strTabName);

    if ($('.content-hdbc--slider-wrap').length > 0) {
      let hash = $(this).closest('a').attr("href");
      console.log(hash, "hash")
      $(`${hash} .content-hdbc--slider-wrap`).slick("setPosition");
    }

    if ($('.content-maintain--slider-wrap').length > 0) {
      $('.content-maintain--slider-wrap').slick("setPosition");
    }
  });

  $(document).on('click', '.common-tabs-main .slick-arrow', function () {
    var TabValue = $(this).siblings('.slick-list').find('.nav-item.slick-current a').attr('href');
    changeCommonTabs(TabValue)
  });
  $(document).on('click', '.generic-left-faq-wrap .submenu-faq-tile', function () {
    var TabValue = $(this).attr('href');
    changeCommonTabs(TabValue)
  });
  $(document).on('click', '.generictab .outer-faq-card .mob-head-faq-mobile .faq-mob-generic', function () {
    let clickIndex = $(this).parent().parent().index();
    let blockInside = $(this).parent().parent().find('.tab-pane.fade.show');
    blockInside.removeClass('active');
    blockInside.eq(clickIndex).addClass('active');
    var TabValue = $(this).attr('href');
    changeCommonTabs(TabValue)
  });
  $(function () {
    $(".slider-for").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: ".slider-nav",
      speed: 300
    });
    $(".slider-nav").slick({
      slidesToShow: 8,
      slidesToScroll: 1,
      asNavFor: ".slider-for",
      dots: false,
      centerMode: false,
      focusOnSelect: true,
      vertical: true,
      speed: 300,
      arrows: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            vertical: false,
            adaptiveHeight: true,
            prevArrow: $('.city-bike-specifications .custom-slider-arrows .prev'),
            nextArrow: $('.city-bike-specifications .custom-slider-arrows .next'),
          }
        },
      ]
    });
    if ($(window).width() > 991) {
      $('.specifications-list .b1-heavy-text-std.slick-slide:first-child').click();
    }
    else {
      $('.specifications-list .b1-heavy-text-std.slick-slide.slick-current').first().click();
    }
  });

  $('.investor-explore ul.common-tabs-main .nav-item').click(function () {
    $('.investor-explore ul.common-tabs-main .nav-item').removeClass('slick-current');
    $(this).addClass('slick-current');
  })

  setTimeout(slickDotsWrap, 0);

  function slickDotsWrap() {
    $.each($('.slick-dots'), function () {
      if ($(this).find('li').length < 2) {
        $(this).css('display', 'none')
      }
    });
  }

  $(document).on('click', '.specifications-list .b1-heavy-text-std.slick-slide', function () {
    const currentSlide = $('.specifications-list .right-content .slick-current .info');
    $('.specifications-list .right-content .slick-slide .info').addClass('d-none');
    if(currentSlide){
      currentSlide.removeClass('d-none');
    }
  })
});
