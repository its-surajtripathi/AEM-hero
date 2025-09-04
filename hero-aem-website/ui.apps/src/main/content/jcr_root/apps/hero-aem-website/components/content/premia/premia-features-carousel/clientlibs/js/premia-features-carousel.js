$(document).ready(function () {
  const element$ = $(".carousel-wrapper");
  var autoplay = element$.data("slick-autoplay");
  var autoplaySpeed = element$.data("slick-autoplay-speed");
  var speed = element$.data("slick-speed") || 1500;

  $(".premia-feature-carousel.carousel").slick({
    slidesToShow: 1,
    dots: true,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    infinite: true,
    centerMode: true,
    // centerPadding: '280px',
    centerPadding: "350px",
    speed: speed,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
        },
      },
    ],
  });

  if (autoplay) {
    // getting duration value from carousel dynamically and set the progressbar animation
    const carouselDurationSeconds = autoplaySpeed / 1000 + "s";
    $(".slick-dots button").css("animation-duration", carouselDurationSeconds);
  }

  $("li.cmp-carousel__indicator").click(function () {
    var clickedIndex = $(this).index();
    $(".premia-feature-carousel.carousel").slick("slickGoTo", clickedIndex);
  });

  // To add opacity:1 for the current transitioning slide
  $(".premia-feature-carousel.carousel").on(
    "afterChange",
    function (event, slick, currentSlide, nextSlide) {
      $(".current-transitioning-slide").removeClass(
        "current-transitioning-slide"
      );
    }
  );

  $(".premia-feature-carousel.carousel").on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      if (nextSlide === slick.slideCount - 1) {
        $("[data-slick-index=" + currentSlide + "]")
          .prev()
          .addClass("current-transitioning-slide");
      }
      if (currentSlide === slick.slideCount - 1) {
        $("[data-slick-index=" + currentSlide + "]")
          .next()
          .addClass("current-transitioning-slide");
      }
    }
  );
});
