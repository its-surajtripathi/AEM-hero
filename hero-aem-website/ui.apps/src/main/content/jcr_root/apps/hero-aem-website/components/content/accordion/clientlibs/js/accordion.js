$(document).ready(function () {

  $(".card-header").on("click", function () {
    $(this).toggleClass("active");
    $(this).parent().siblings().find($(".card-header")).removeClass("active");
    $(this).find(".expanded-icon").toggleClass("d-none");
    $(this).find(".collapsed-icon").toggleClass("d-none");
  });
  
  let xtraxFaq = $('.faq-accordian');
  if (xtraxFaq && xtraxFaq.length > 0) {
    $('.faq-accordian .card-header:first').addClass('active');
    $('.faq-accordian .body-accord-faq:first').addClass('show');
    $('.hm-accordion').on('shown.bs.collapse', function () {
      var tabHeight = $('.card-header').height() + $('header').height();
      var panel = $(this).find('.collapse.show');
      $('html, body').animate({
        scrollTop: panel.offset().top - tabHeight - 165
      }, 800);
    });
  }

  if ($('#genuine-parts').length > 0) {
    $('.accordion--title').click(function (e) {
      let dropDown = $(this).closest('.accordion-card').find('.accordion--panel');
      $(this).closest('.genuine-parts-accordion').find('.accordion--panel').not(dropDown).slideUp();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        $(this).closest('.genuine-parts-accordion').find('.accordion--title.active').removeClass('active');
        $(this).addClass('active');
      }
      dropDown.stop(false, true).slideToggle();
      e.preventDefault();
    });
    $('.accordion--title ').first().click()
  }
});
