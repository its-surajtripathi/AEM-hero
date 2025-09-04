$(document).ready(function () {
  var $slickEl = $(".our-initiatives .slide");

  $slickEl.slick({
    centerMode: true,
    slidesToShow: 3,
    variableWidth: true,
    focusOnSelect: true,
    dots: true,
    cssEase: "linear",
    infinite: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: true,
          slidesToShow: 3,
        },
      },
    ],
  });
});
