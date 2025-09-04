$(document).ready(function () {
  try {
    $('#notifyMeButton').hover(
      function () {
        $(this).find('.cmp-button__text').shuffleElementText(30);
      },
      function () {
        $(this).find('.cmp-button__text').resetShuffleElementText();
      }
    );
    $('#notifyMeButton').click(function () {
      globalStateObject.scrollWithoutSticky = true;
      $('.leadgen-invite-wrapper').get(0).scrollIntoView({
        behavior: 'smooth',
      });
      setTimeout(function () {
        globalStateObject.scrollWithoutSticky = false;
      }, 1000);
    });

    $('#notifyMeButton').addButtonMusic();
  } catch (error) {
    console.error(error);
  }
});
