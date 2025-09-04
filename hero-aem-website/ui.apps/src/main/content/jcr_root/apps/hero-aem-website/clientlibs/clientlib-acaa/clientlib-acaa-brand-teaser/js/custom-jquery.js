jQuery.fn.extend({
  // To add the music effect to an element on hover and click
  addButtonMusic: function () {
    $(this).on({
      mouseenter: function () {
        globalStateObject.audioInstance.playHoverMusic();
      },
      mouseleave: function () {
        globalStateObject.audioInstance.pauseHoverMusic();
      },
      click: function () {
        globalStateObject.audioInstance.playClickMusic();
      },
    });
  },

  randomTextFromStart: function () {
    randomTextGenerator.fromStart($(this)[0]);
  },

  shuffleElementText: function (speed = 10) {
    randomTextGenerator.shuffleText($(this)[0], speed);
  },
  resetShuffleElementText: function () {
    randomTextGenerator.resetShuffleText($(this)[0]);
  },

  randomTextFromEnd: function () {
    randomTextGenerator.fromEnd($(this)[0]);
  },

  randomTextFromStartOnHover: function () {
    $(this).on({
      mouseenter: function () {
        randomTextGenerator.fromStart($(this)[0]);
      },
    });
  },

  randomTextFromEndOnHover: function () {
    $(this).on({
      mouseenter: function () {
        randomTextGenerator.fromEnd($(this)[0]);
      },
    });
  },

  randomTextOnHover: function () {
    $(this).on({
      mouseenter: function () {
        randomTextGenerator.fromStart($(this)[0]);
      },
      mouseleave: function () {
        randomTextGenerator.fromEnd($(this)[0]);
      },
    });
  },

  isInViewport: function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  },
});
