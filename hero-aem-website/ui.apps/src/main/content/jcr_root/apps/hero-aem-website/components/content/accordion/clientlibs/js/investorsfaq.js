$(document).ready(function () { 
  let accordianContentHeading;
  let mobAccordianContentHeading;
  
  if ($(document).width() < 569) {
    $('.investors-content-wrap').addClass('d-none');
  } else {
    $('.investors-contact-mobile').addClass('d-none');
  }

  if($('#service-genuine-faq').length > 0){
    $('.faqs-accord-tile').css('border','1px solid #A5A5A5');
    $('.faq--slider-wrap .card').eq(0).addClass('active-faq-border-box');
    $('.faq--slider-wrap .card').eq(0).find('.card-head-faq').addClass('active');
    $('.faq--slider-wrap .card').eq(0).find('.collapse').addClass('show');
    $('.faq-card-tile-mobile.card').eq(0).addClass('active-faq-border-mob');
    $('.faq-card-tile-mobile.card').eq(0).find('.mob-head-faq').addClass('active');
    $('.faq-card-tile-mobile.card').eq(0).find('.collapse').addClass('show');
  }

  // Desktop View for FAQ
  $(".faq-click-tile").on("click", function () {
    $(".faqs-accord-tile").removeClass("active-faq-border-box");
    $('.faqs-accord-tile .collapse').removeClass('show');
    $('.card-head-faq').removeClass('active');
    $(this).parent().siblings().find($(".card-head-faq")).removeClass("active");
    $(this).toggleClass("active");
    $(this).parent().siblings().find($(".faq-click-tile")).removeClass("active");
  });

  $(".card-head-faq").on("click", function () {
    if ($(this).parent().parent().find('.collapse.show').length > 0 && 
          $(this).parent().parent().find('.faqs-accord-tile.card.active-faq-border-box').length > 0 &&
          $(this).find('.accordian-heading-faq p').html() == accordianContentHeading) {
        $(".faqs-accord-tile").removeClass("active-faq-border-box");
        $(this).parent().siblings().find($(".card-head-faq")).removeClass("active");
        $(document).find('.card-head-faq').removeClass('active');
      }
    else {
      $(document).find('.card-head-faq').removeClass('active');
      $(this).toggleClass("active");
    }
    accordianContentHeading = $(this).find('.accordian-heading-faq p').html();
    $(".faqs-accord-tile").removeClass("active-faq-border-box");
    $(this).parent().siblings().find($(".card-head-faq")).removeClass("active");
    $(".faqs-accord-tile").has(".active").addClass("active-faq-border-box");
  });

  $('.faq--slider-wrap').eq(0).addClass('reveal');
  $(".hollow-circle").click(handleClick);
  $(".submenu-faq-tile .faq-click-tile").click(handleClick);

  function handleClick() {
    $('.submenu-faq-tile').removeClass("faq-button-active");
    $(this).parent().addClass("faq-button-active");
    let clickedIndex = $(this).parent().index();
    $('.faq--slider-wrap').removeClass('reveal');
    $('.faq--slider-wrap').eq(clickedIndex).addClass('reveal');
  }


  // Mobile Accordian View for FAQ
  $(".mob-head-faq-mobile").on("click", function () {
    $(".faq-card-tile-mobile").removeClass("active-faq-border-mob");
    $('.faq-card-tile-mobile .collapse').removeClass('show');
    $('.mob-head-faq').removeClass('active');
    $(this).parent().siblings().find($(".mob-head-faq")).removeClass("active");
    $(this).toggleClass("active");
    $(this).parent().siblings().find($(".mob-head-faq-mobile")).removeClass("active");
  });

  $(".mob-head-faq").on("click", function () {
    if ($(this).parent().parent().find('.collapse.show').length > 0 && 
          $(this).parent().parent().find('.faq-card-tile-mobile.card.active-faq-border-mob').length > 0 &&
          $(this).find('.mob-sub-heading-faq p').html() == mobAccordianContentHeading) {
            $(".faq-card-tile-mobile").removeClass("active-faq-border-mob");
        $(this).parent().siblings().find($(".mob-head-faq")).removeClass("active");
        $(document).find('.mob-head-faq').removeClass('active');
      }
    else {
      $(document).find('.mob-head-faq').removeClass('active');
      $(this).toggleClass("active");
    }
    mobAccordianContentHeading = $(this).find('.mob-sub-heading-faq p').html();
    $(".faq-card-tile-mobile").removeClass("active-faq-border-mob");
    $(this).parent().siblings().find($(".mob-head-faq")).removeClass("active");
    $(".faq-card-tile-mobile").has(".active").addClass("active-faq-border-mob");
  });

  $('.right--mob-content-section .faq--slider-wrap-mob').addClass('reveal');

  $(window).resize(function () {
    if ($(document).width() < 569) {
      $('.investors-contact-mobile').removeClass('d-none');
      $('.investors-content-wrap').addClass('d-none');
    } else {
      $('.investors-content-wrap').removeClass('d-none');
      $('.investors-contact-mobile').addClass('d-none');
    }
  })
    
});