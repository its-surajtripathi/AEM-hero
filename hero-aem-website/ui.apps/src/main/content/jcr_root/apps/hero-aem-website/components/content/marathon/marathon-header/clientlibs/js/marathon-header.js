$(document).ready(function () {
  $.fn.isInViewport = function () {
    let elementTop = $(this).offset().top + 300;
    let elementBottom = elementTop + $(this).outerHeight();
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };

  $(".marathon-header-wrapper .marathon-header-links a").on(
    "click",
    function () {
      let hash = $(this).attr("href");
      $(".marathon-header-wrapper .marathon-header-links").removeClass(
        "active"
      );
      $(this).parent().addClass("active");
      $("html, body").animate({
        scrollTop: $(hash).offset().top - 66,
      });
    }
  );

  let scrollLink = $(".marathon-header-links a");
  let arr = [];
  scrollLink.each(function () {
    arr.push($(this).attr("href"));
  });

  $(window).on("load resize scroll", function () {
    arr.forEach(function (ele) {
      $(ele).each(function () {
        if ($(this).isInViewport()) {
          $("header .marathon-header-links").removeClass("active");
          $(`header .marathon-header-links [href="${ele}"`)
            .parent()
            .addClass("active");
        } else {
          $(`header .marathon-header-links [href="${ele}"`)
            .parent()
            .removeClass("active");
        }
      });
    });
  });
});
