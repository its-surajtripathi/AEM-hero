$('.right--content-section .content--slider-wrap:first').addClass('reveal');
if($('.ref-wrap').length>0){
  $('.ref-wrap:first').removeClass('d-none');
}
$(".hollow-circle").click(handleClick);
$(".submenu--tile p").click(handleClick)

function handleClick() {
  $('.submenu--tile').removeClass("button-active")
  $(this).parent().addClass("button-active");
  let clickedIndex = $(this).parent().index();
  $('.content--slider-wrap').removeClass('reveal');
  $('.content--slider-wrap').eq(clickedIndex).addClass('reveal');
  if($('.ref-wrap').length>0){
    $('.ref-wrap').addClass('d-none');
    $('.ref-wrap').eq(clickedIndex).removeClass('d-none');
  }
  $('.content--slider-wrap').slick('setPosition');
  $('.functional-rep').slick('unslick');
  $('.content--slider-wrap .mobile').slick('setPosition');
}

function handleCenter() {
  $('.submenu--tile').removeClass('button-active');
  $('.submenu--tile').each(function () {
    if ($(this).hasClass('slick-current')) {
      $(this).addClass('button-active');
      let clickedIndex = $(this).index();
      $('.content--slider-wrap').removeClass('reveal');
      $('.content--slider-wrap').eq(clickedIndex).addClass('reveal');
    }
  });
}

const slickSettings = {
  autoplay: false,
  autoplaySpeed: 3000,
  dots: false,
  arrows: true,
  prevArrow: "<img class='a-left control-c next slick-prev' src='/content/dam/hero-aem-website/brand/design/icons/href-right-icon.svg'>",
  nextArrow: "<img class='a-right control-c next slick-next' src='/content/dam/hero-aem-website/brand/design/icons/href-right-icon.svg'>",
  infinite: true,
  slidesToShow: 4,
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
      settings: "unslick"
    }
  ]
}

$(window).resize(function () {
  if ($(this).width() > 768) {
    $('.content--slider-wrap').slick("resize");
  }
})

$('.content--slider-wrap').slick(slickSettings);

$('.content--slider-wrap .slick-track').each(function () {
  if ($(this).find('.img-tile').length < 4) {
    $(this).addClass("d-flex");
  }
});

$('.bottom--content-wrap .left--sub-menu').slick({
  mobileFirst: true,
  slidesToScroll: 1,
  slidesToShow: 1,
  infinite: false,
  prevArrow: "<img class='a-left control-c next slick-prev' src='/content/dam/hero-aem-website/brand/design/icons/href-right-icon.svg'>",
  nextArrow: "<img class='a-right control-c next slick-next' src='/content/dam/hero-aem-website/brand/design/icons/href-right-icon.svg'>",
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

$('.left--sub-menu.slick-initialized').on('afterChange', function () {
  let centerSlide = $('.left--sub-menu.slick-initialized').find('.slick-center');
  centerSlide.addClass('button-active');
  handleCenter();
})

$('.left--sub-menu .slick-arrow').click(handleCenter);