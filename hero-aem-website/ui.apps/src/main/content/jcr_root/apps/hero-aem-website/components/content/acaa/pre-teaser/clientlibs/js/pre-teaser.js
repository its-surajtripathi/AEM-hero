$(document).ready(function () {
  try {
    //on click scroll to leadgen-invite-wrapper
    $('.bike-lead-button-wrapper').click(function () {
      $('.leadgen-invite-wrapper').get(0).scrollIntoView({
        behavior: 'smooth',
      });
    });

    // on scroll, transition function triggered
    $(window).scroll(function () {
      bikeLeadAnimationTrigger();
    });

    $('#pre-teaser-notify-btn').addButtonMusic();
    $('#pre-teaser-notify-btn').hover(
      function () {
        $(this).find('.primary-btn-text').shuffleElementText(30);
      },
      function () {
        $(this).find('.primary-btn-text').resetShuffleElementText();
      }
    );
  } catch (error) {
    console.error(error);
  }
});

function bikeLeadAnimationTrigger() {
  const windowHeight = $(window).height();
  const windowScrollTop = $(window).scrollTop();

  //formula to calculate the bottom of screen
  const windowBottom = windowScrollTop + windowHeight;

  // formula to calculate the height of screen
  const windowCenter = windowScrollTop + windowHeight / 2;

  // scoping the pre-teaser section and calculating its position in the screen
  const $bikeLeadParentElement = $('.bike-lead-wrapper');

  // calculating pre-teaser section top, bottom, height, center
  const bikeLeadTop = $bikeLeadParentElement.offset().top;
  const bikeLeadHeight = $bikeLeadParentElement.outerHeight();
  const bikeLeadBottom = bikeLeadTop + bikeLeadHeight;
  const bikeLeadCenter = bikeLeadTop + bikeLeadHeight / 2;

  // if pre-teaser section comes to center of the viewport, animation will triggered
  if (windowScrollTop + 100 > bikeLeadTop && windowCenter < bikeLeadBottom) {
    $bikeLeadParentElement.addClass('bike-lead-animation-wrapper');
  }
}
