if ($(window).width() < 569) {
    $('.inv-credit-mobile-img').removeClass('d-none');
      $('.inv-credit-desktop-img').addClass("d-none")
  } else {
    $('.inv-credit-desktop-img').removeClass("d-none")
    $('.inv-credit-mobile-img').addClass('d-none');
  }
  $(window).resize(function () {
    if ($(window).width() < 569) {
      $('.inv-credit-mobile-img').removeClass('d-none');
        $('.inv-credit-desktop-img').addClass("d-none")
    } else {
      $('.inv-credit-desktop-img').removeClass("d-none")
      $('.inv-credit-mobile-img').addClass('d-none');
    }
  })