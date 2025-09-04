$(document).ready(function () {
    const quickSlickSettings = {
      infinite: true,
      dots: false,
      autoplay: false,
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
                  slidesToShow: 5,
                  slidesToScroll: 5,
              }
          },
          {
              breakpoint: 421,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
              }
          },
          {
              breakpoint: 360,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
              }
          }
      ]
  };
  $('.help-main-box').slick(quickSlickSettings, 100);
  resetForm($('#requestCallBack'));
  $(window).on('resize', function() {
    if ($('.help-main-box') && !$('.help-main-box').hasClass('slick-initialized')) {
      $('.help-main-box').slick(quickSlickSettings, 100);
    }
  });
});
function resetForm(formID){
  formID.on('hidden.bs.modal', function(e) {
      formID
      .find("input,textarea,select").not('[type="button"]').not('[type="hidden"]')
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
      $('label.error').remove();
      $('.send-otp-btn,.resend-otp-btn').removeClass('show');
      $('.invalid-otp-message') .hide();
      
  });
}
