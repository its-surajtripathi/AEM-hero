$(document).ready(function () {
  let vid = document.getElementById("heroX");

  function playVid() {
    vid.play();
  }

  function pauseVid() {
    vid.pause();
  }
  function endedListner() {
    $("#heroX").fadeOut();

    if ($(".buttons .video.active").hasClass("Book")) {
        $("html, body").animate(
            {
              scrollTop: $(".booktestride").offset().top - $('header .product-header-main').height(),
            },
            1000
          );
    }
    setTimeout(function () {
      $("#heroX source").attr("src", "");
      $("#heroX")[0].load();
      $(".playerButtons .play")
        .removeClass("paused")
        .find("img")
        .attr("images/ico-play.svg");
      $(".playerButtons").hide();
      $("#heroX").fadeIn();
      $("#heroX").off("ended");
      $(".buttons .video").removeClass("active");
    }, 300);
  }
  $(".interact").addClass("active");
  $(".buttons .video").on("click", function (e) {
    e.preventDefault();
    var videoFile = $(this).attr("href");
    $(this).addClass("active");
    $(".interact").removeClass("active");
    $("#heroX").fadeOut();
    $(".playerButtons").css({ display: "flex" });
    setTimeout(function () {
      $("#heroX source").attr("src", videoFile);
      $("#heroX")[0].load();
      $("#heroX").prop("muted", false);
      $(".playerButtons .play")
        .removeClass("paused")
        .find("img")
        .attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-pause.svg");
      $(".playerButtons .mute").find("img").attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-mute.svg");
      $("#heroX").fadeIn();
      $("#heroX").on("ended", endedListner);
    }, 300);
    // if ($(this).hasClass('showPause')) {
    //     $('.playerButtons').fadeIn();
    // }
    // else {
    //     $('.playerButtons').fadeOut();
    // }
  });
  $(".playerButtons .play").on("click", function () {
    if ($(this).hasClass("paused")) {
      playVid();
      $(this)
        .removeClass("paused")
        .find("img")
        .attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-pause.svg");
    } else {
      pauseVid();
      $(this).addClass("paused").find("img").attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-play.svg");
    }
  });
  $("#heroX").prop("muted", true);

  $(".playerButtons .mute").click(function () {
    if ($("#heroX").prop("muted")) {
      $("#heroX").prop("muted", false);
      $(this).find("img").attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-mute.svg");
    } else {
      $("#heroX").prop("muted", true);
      $(this).find("img").attr("src", "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/ico-unmute.svg");
    }
  });
});
