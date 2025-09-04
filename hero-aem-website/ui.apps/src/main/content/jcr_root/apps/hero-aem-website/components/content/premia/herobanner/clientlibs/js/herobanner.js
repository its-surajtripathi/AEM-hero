$(document).ready(function () {
  try {
    var getAudioStatus = document.getElementById("audioElement");
    $(".start-button-animation-container").click(function () {
      if (getAudioStatus.paused) {
        getAudioStatus.play();
        $(".start-text").addClass("d-none");
        $(".stop-text").removeClass("d-none");
      } else {
        getAudioStatus.pause();
        $(".stop-text").addClass("d-none");
        $(".start-text").removeClass("d-none");
      }
      $(".button-circle1").toggleClass("outer-animation");
      $(".button-circle2").toggleClass("middle-animation");
      $(".button-circle3").toggleClass("inner-animation");
      $(".power-off").toggleClass("d-none");
      $(".power-on").toggleClass("d-none");
    });
    $(".start-button-animation-container").hover(function () {
      $(".button-circle1").addClass("round1-hover");
      $(".button-circle2").addClass("round2-hover");
      $(".button-circle3").addClass("round3-hover");
    });
    $(".start-button-animation-container").mouseleave(function () {
      var isClicked = $(".button-round1").hasClass("outer-animation");
      if (!isClicked) {
        $(".button-circle1").removeClass("round1-hover");
        $(".button-circle2").removeClass("round2-hover");
        $(".button-circle3").removeClass("round3-hover");
      }
    });
    getAudioStatus.onended = function () {
      $(".start-text").removeClass("d-none");
      $(".stop-text").addClass("d-none");
      $(".button-circle1").removeClass("outer-animation round1-hover");
      $(".button-circle2").removeClass("middle-animation round2-hover");
      $(".button-circle3").removeClass("inner-animation round3-hover");
      $(".power-off").removeClass("d-none");
      $(".power-on").addClass("d-none");
    };

    // for changing the banner video while resizing to mobile and desktop
    if ($(window).width() < 767) {
      loadMobileVideo();
    } else {
      loadDesktopVideo();
    }
    $(window).on('resize', function (event) {
      if ($(window).width() < 767) {
        loadMobileVideo();
      } else {
        loadDesktopVideo();
      }
    });
  } catch (error) {
  }
});

// for loading the video for desktop view
function loadDesktopVideo() {
  $("#videoElementDesktop").removeClass('d-none');
  $("#videoElementMobile").addClass('d-none');
  $(".discover-more").addClass("d-none");
}

// for loading the video for mobile view
function loadMobileVideo() {
  $("#videoElementDesktop").addClass('d-none');
  $("#videoElementMobile").removeClass('d-none');
  $(".discover-more").removeClass("d-none");
}
