$(document).ready(function () { 

  if ($(document).width() < 569) {
    $('.contact-desktop-view').addClass('d-none');
    $('.contact--slider-wrap').addClass('reveal');
  } else {
    $('.contact-mobile-view').addClass('d-none');
    $('.contact--slider-wrap').eq(0).addClass('reveal');
  }

  $(".card-head-mobile").on("click", function () {
    $(this).toggleClass("active");
    $(this).parent().siblings().find($(".card-head-mobile")).removeClass("active");
  });
  $(".investor-left-contact-arrow").click(handleClick);
  $(".submenu-contact-tile p").click(handleClick)

  function handleClick() {
    $('.submenu-contact-tile').removeClass("contact-button-active")
    $(this).parent().addClass("contact-button-active");
    let clickedIndex = $(this).parent().index();
    $('.contact--slider-wrap').removeClass('reveal');
    $('.contact--slider-wrap').eq(clickedIndex).addClass('reveal');
  }

  $(window).resize(function () {
    if ($(document).width() < 569) {
      $('.contact-mobile-view').removeClass('d-none');
      $('.contact-desktop-view').addClass('d-none');
      $('.contact--slider-wrap').addClass('reveal');
    } else {
      $('.contact-desktop-view').removeClass('d-none');
      $('.contact-mobile-view').addClass('d-none');
      $('.contact--slider-wrap').eq(0).addClass('reveal');
    }
  })
});