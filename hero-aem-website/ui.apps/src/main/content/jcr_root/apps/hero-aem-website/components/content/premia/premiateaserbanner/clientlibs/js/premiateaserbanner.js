$(function () {
  try {
    // when the teaser banner comes to the center of the viewport, harley revealing animation will be triggered
    $(window).scroll(function () {
      const windowHeight = $(window).height();
      const windowScrollTop = $(window).scrollTop();

      // formula to calculate the height of screen
      const windowCenter = windowScrollTop + windowHeight / 1.5;

      // scoping the banner element and calculating its position in the screen
      const $bannerElement = $(".harley-headlight-img-wrapper");
      const $bannerAnimatedElements = $(".unreveal-harley");
      const bannerTop = $bannerElement.offset().top;
      const bannerHeight = $bannerElement.outerHeight();
      const bannerBottom = bannerTop + bannerHeight;

      // if banner element comes to center of the viewport, animation class will be added
      if (windowCenter > bannerTop && windowCenter < bannerBottom) {
        $bannerAnimatedElements.each(function () {
          $(this).removeClass("unreveal-harley").addClass("reveal-harley");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
