$(document).ready(function () { 
  if ($(document).width() > 768) {
    $('.hdbc-gallery-section .d-desktop').simpleLightbox();
  }else {
    $('.hdbc-gallery-section .d-mobile').simpleLightbox();
}

  if ($(document).width() < 768) {
    console.log('Longer', $(document).width(), $(window).height());
    if($(window).height() < 650) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-five-half');
    }else if($(window).height() < 725 && $(window).height() >= 650) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-six');
    }else if($(window).height() < 775 && $(window).height() >= 725) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-six');
    } else if ($(window).height() < 775 && $(window).height() >= 725) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-seven-half');
    } else if ($(window).height() < 850 && $(window).height() >= 775) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-eight-half');
    } else if ($(window).height() < 950 && $(window).height() >= 850) {
      $('.hdbc-gallery-tile').addClass('hdbc-gallery-tile-update-nine-half');
    }
  }
  
$('.bottom-hdbc--content-section .content-hdbc--slider-wrap:first').addClass('reveal');
$(".hdbc-submenu--tile p").click(handleClick)

function handleClick() {
  $('.hdbc-submenu--tile').removeClass("button-hdbc-active")
  $(this).parent().addClass("button-hdbc-active");
  let clickedIndex = $(this).parent().index();
  $('.content-hdbc--slider-wrap').removeClass('reveal');
  $('.content-hdbc--slider-wrap').eq(clickedIndex).addClass('reveal');
  // $('.content-hdbc--slider-wrap').slick('setPosition');
  // $('.functional-rep').slick('unslick');
  // $('.content-hdbc--slider-wrap .mobile').slick('setPosition');
}

function handleCenter() {
  $('.hdbc-submenu--tile').removeClass('button-hdbc-active');
  $('.hdbc-submenu--tile').each(function () {
    if ($(this).hasClass('slick-current')) {
      $(this).addClass('button-hdbc-active');
      let clickedIndex = $(this).index();
      $('.content-hdbc--slider-wrap').removeClass('reveal');
      $('.content-hdbc--slider-wrap').eq(clickedIndex).addClass('reveal');
    }
  });
}

const slickSettingsGallery = {
  rows: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 2,
  slidesToShow: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 3,
  autoplay: false,
  autoplaySpeed: 3000,
  dots: true,
  arrows: false,
  infinite: true,
  slidesToScroll: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 3,
  responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 769,
      settings: {
        rows: 2,
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 426,
      settings: {
        rows: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 3,
        slidesToShow: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 2,
        slidesToScroll: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 1 : 2,
      }
    }
  ]
}

$(window).resize(function () {
  if ($(this).width() > 768) {
    $('.content-hdbc--slider-wrap').slick("resize");
  }
})


$('#default .content-hdbc--slider-wrap').slick(slickSettingsGallery);

$('.content-hdbc--slider-wrap .slick-track').each(function () {
  if ($(this).find('.hdbc-gallery-tile').length < 4) {
    $(this).addClass("d-flex");
  }
});

const slickSettingsInThePress = {
  rows: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 3 : 2,
  slidesToShow: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 2 : 3,
  autoplay: false,
  autoplaySpeed: 3000,
  dots: true,
  arrows: false,
  infinite: true,
  slidesToScroll: $('.single-photo-mobile').length > 0 && $(document).width() < 569 ? 2 : 3,
  responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 769,
      settings: {
        rows: 2,
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 426,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    }
  ]
}

$('#inthepressimages .content-hdbc--slider-wrap').slick(slickSettingsInThePress);

$('.bottom--hdbc-wrapper .top--hdbc-sub-menu').slick({
  mobileFirst: true,
  slidesToScroll: 1,
  slidesToShow: 1,
  infinite: false,
  prevArrow: "<img class='a-left control-c next slick-prev' src='/content/dam/hero-aem-website/brand/design/icons/slider-right-white-arrow-icon.svg'>",
  nextArrow: "<img class='a-right control-c next slick-next' src='/content/dam/hero-aem-website/brand/design/icons/left-slider-white-arrow-icon.svg'>",
  centerMode: true,
  variableWidth: true,
  responsive: [{
    breakpoint: 769,
    settings: "unslick"
  }]
});

$('.functional-rep-content.mobile').slick({
  slidesToScroll: 1,
  slidesToShow: 1,
  infinite: false,
  arrows: false,
  dots: true,
});

$('.top--hdbc-sub-menu.slick-initialized').on('afterChange', function () {
  let centerSlide = $('.top--hdbc-sub-menu.slick-initialized').find('.slick-center');
  centerSlide.addClass('button-hdbc-active');
  handleCenter();
})

$('.top--hdbc-sub-menu .slick-arrow').click(handleCenter);
})

