$(document).ready(function () {
  $(".marathon-feature-section .splender-feature-slider").slick({
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    speed: 300,
    draggable: false,
    infinite: true,
    autoplaySpeed: 2000,
    autoplay: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          centerPadding: "5px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.68,
          centerPadding: "5px",
        },
      },
    ],
  });

  $(".feature--tile").hover(
    function () {
      $(this).find(".tile--onhover").css("bottom", 0);
    },
    function () {
      $(this).find(".tile--onhover").css("bottom", "-100%");
    }
  );
});
