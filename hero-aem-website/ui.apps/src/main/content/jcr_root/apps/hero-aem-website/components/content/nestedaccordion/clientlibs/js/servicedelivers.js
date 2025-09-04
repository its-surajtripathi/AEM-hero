$(document).ready(function () {

  $('.service-delivers-section picture.bg-img').addClass('d-none');
  $('.service-delivers-section picture.bg-img').first().removeClass('d-none');
  $('.deliver--slider-wrap').eq(0).addClass('reveal');

  $(".card-head-mobile").on("click", function () {
    $(this).toggleClass("active");
    $(this).parent().siblings().find($(".card-head-mobile")).removeClass("active");
  });

  $(".submenu-deliver-tile").eq(0).addClass("deliver-button-active");
  $(".left--service-deliver").find(".submenu-deliver-tile.deliver-button-active .border_top").addClass("border_top-active")
  $(".submenu-deliver-tile p").click(handleClick)

  function handleClick() {
    let clickedIndex = $(this).parent().index();
    $('.submenu-deliver-tile').removeClass("deliver-button-active");
    $('.border_top').removeClass("border_top-active");
    $(this).parent().addClass("deliver-button-active");
    $(this).siblings().addClass("border_top-active");
    $('.deliver--slider-wrap').removeClass('reveal');
    $('.deliver--slider-wrap').eq(clickedIndex).addClass('reveal');
    $('.service-delivers-section picture.bg-img').addClass('d-none');
    $('.service-delivers-section picture.bg-img').eq(clickedIndex).removeClass('d-none');
  }
});