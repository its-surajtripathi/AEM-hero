$(document).ready(function () {
  try {
    initBikeIntroComp();
    cursorFollow();



    if ($(window).width() <= 767) {
      $(".logoVideoWrapper").remove();
      $("html").removeClass("overflow-hidden");
    } else {
      triggerLogoVideo();
    }

  } catch (error) {
    console.error(error);
  }
});

// cursor follow animation
function cursorFollow() {
  const $cursorElement = $(".mouse-cursor-follow");
  $(".acc-banner-container").mousemove(function (event) {
    $cursorElement.removeClass("d-none");
    $cursorElement.css("top", event.pageY - 10 + "px");
    $cursorElement.css("left", event.pageX - 10 + "px");
  });
}

// triggering logo-video
function triggerLogoVideo() {
  const $logoVideo = $(".intro-karizma-video")[0];
  const $logoVideoWrapper = $(".intro-karizma-video-wrapper");
  setTimeout(function () {
    if ($logoVideo) {
      $logoVideoWrapper.removeClass("visibility-hidden");
      $logoVideo.play();
    }
  }, 5000);
  setTimeout(function () {
    if ($logoVideo) {
      $logoVideoWrapper.remove();
      $("html").removeClass("overflow-hidden");
    }
  }, 10500);
}

function initBikeIntroComp() {
  generateElements();

  $(window).scroll(function () {
    introTextZoomAnimation();
  });

  $(".brand-reveal-bg, .intro-parent-text-wrapper").click(function () {
    startBgMusic();
    updateMusicControllerState();
    const $logoVideo = $(".intro-karizma-video")[0];
    $($logoVideo).prop("muted", false);
    $(this).unbind();
  });

  $(".bike-intro-scroll-img-wrapper").click(function () {
    const $testimonialTop = $(".testimonial").offset().top - 45;
    window.scrollTo({ top: $testimonialTop, behavior: 'smooth' });
  });

  var delay = isMobile() ? 100 : 10500;
  setTimeout(function () {
    $(".brand-reveal-bg, .intro-parent-text-wrapper").remove();
    animateContent();
  }, delay);

  function updateMusicControllerState() {
    $(".bg-music-controller .mouse-cursor-button")
      .addClass("playing")
      .removeClass("muted");
    $(".bg-music-controller .mute-btn-text").text("mute");
  }

  function animateContent() {
    $(".bg-music-controller").removeClass("d-none");
    $(".bike-intro-text-container, .line-anime-container").addClass(
      "animate-content"
    );
    $(".mouse-cursor-follow").remove();
    $(".brand-teaser-page").removeClass("cursor-none");
    $(".bike-intro-logo-img-wrapper").removeClass("visibility-hidden");
  }

  function generateElements() {
    var $starContainer = $(".brand-reveal-bg .stars");
    var $stripesContainer = $(".brand-reveal-bg .stripes");
    for (let i = 0; i < 100; i++) {
      $starContainer.append(`<div class="star"></div>`);
      $stripesContainer.append(`<div class="stripe"></div>`);
    }
  }

  // bike-intro text content zoom-in animation
function introTextZoomAnimation() {
  const windowHeight = $(window).height();
  const windowScrollTop = $(window).scrollTop();

  // formula to calculate bottom of screen
  const windowBottom = windowHeight + windowScrollTop;

  // formula to calculate the center of screen
  const windowCenter = windowScrollTop + windowHeight / 2;

  // scoping the brand-teaser sections and calculating its position in the screen
  const $bikeIntroTextContent = $(".intro-logo-quote-wrapper");
  const $bikeIntroScrollTextContent = $(".bike-intro-scroll-text-content");
  const $bikeIntroLineContent = $(".line-anime-container");
  const $bikeIntroSection = $(".bike-intro");
  const $testimonialSection = $(".testimonial");

  // calculating each section top, bottom, height, center
  const bikeIntroSectionTop = $bikeIntroSection.offset().top;
  const bikeIntroSectionHeight = $bikeIntroSection.outerHeight();
  const bikeIntroSectionBottom = bikeIntroSectionTop + bikeIntroSectionHeight;
  const bikeIntroSectionCenter = bikeIntroSectionTop + bikeIntroSectionHeight / 2;

  // if each section comes to center of the viewport, transition triggers
  if (isMobile() ? windowScrollTop > bikeIntroSectionTop - 1 && windowBottom < bikeIntroSectionBottom + 1 : windowScrollTop > bikeIntroSectionTop - 1 && windowCenter < bikeIntroSectionBottom) {
    $bikeIntroTextContent.css("transform", "scale(100%)");
    $bikeIntroScrollTextContent.css("transform", "scale(100%)");
    $bikeIntroLineContent.css("opacity", 1);
  } else {
    $bikeIntroTextContent.css("transform", "scale(0%)");
    $bikeIntroScrollTextContent.css("transform", "scale(0%)");
    $bikeIntroLineContent.css("opacity", 0);
  }
}
}


