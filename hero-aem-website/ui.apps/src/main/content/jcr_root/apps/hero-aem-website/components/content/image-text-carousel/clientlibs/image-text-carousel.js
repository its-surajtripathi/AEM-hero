$(document).ready(function () {
  const imageSlickSettings = {
    infinite: false,
    autoplay: true,
    dots: true,
    prevArrow: false,
    nextArrow: false,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 1,
    slidesToScroll: 1,
    width: "100%",
  };
  $(".image-slick").slick(imageSlickSettings, 1000);
  if ($(".slick-dots li").length <= 1) {
    $(".slick-dots li").css("display", "none");
  }
});
