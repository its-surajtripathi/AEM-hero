$(document).ready(function () {

  $('.dealersLogOut').on('click', function () {

    var d = new Date();
    d.setTime(d.getTime());
    document.cookie = "sessionStat=null; path=/; expires=" + d.toGMTString();
    document.cookie = "respData=null; path=/; expires=" + d.toGMTString();
    $('.dealersLogIn').removeClass('d-none');
    $('.dealersLogOut').addClass('d-none');
    window.location.href = $('.dealer-nav-class').find('[name="homePagePath"]').val();
  });

  $('.main-list li.main-link').on('mouseover', function () {
    let dropDownWrap = $(this).find('.drop-down-wrap');
    if (dropDownWrap.length) {
      dropDownWrap.removeClass('d-none');
    }
  }).on('mouseout', function () {
    let dropDownWrap = $(this).find('.drop-down-wrap');
    if (dropDownWrap.length) {
      dropDownWrap.addClass('d-none');
    }
  });


  $('nav.nav-mobile .arrow-dropdown').click(function () {
    $(this).toggleClass("rotate-arrow")
    let mobdropDownWrap = $(this).parent().parent().find('.mob-sub-list');
    if (mobdropDownWrap.length) {
      mobdropDownWrap.toggleClass('d-none');
    }
  })


  $('.dealer-hamburger-menu').click(function () {
    $('.nav-mobile').css('left', 0);
    $('#dealer-nav').css('opacity', 0);
  })

  $('.nav-mobile .close-btn').click(function () {
    $('.nav-mobile').css('left', '-100%');
    $('#dealer-nav').css('opacity', 1);
  })

  $('.nav-desktop .main-link .anchor-wrap a,.drop-down-wrap a,.nav-mobile a').each(function () {
    let href = $(this).attr("href");
    let parts = href.split("/");
    let lastPart = parts[parts.length - 1].replace(".html", "");
    $(this).attr("data-url", lastPart);
  });

  let currentPage = window.location.pathname.split("/").pop().replace(".html", "");
  $(".nav-desktop a, .nav-mobile a").each(function () {
    if ($(this).data("url") === currentPage) {
      $(this).addClass("active-page");
    }
  });

  $(window).resize(function () {
    if ($(window).width() > 999) {
      $('.nav-mobile').css('left', '-100%');
      $('#dealer-nav').css('opacity', 1);
    }
  })
})