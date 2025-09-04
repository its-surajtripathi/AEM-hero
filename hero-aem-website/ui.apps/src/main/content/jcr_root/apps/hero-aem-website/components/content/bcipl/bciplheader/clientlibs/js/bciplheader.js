$(document).ready(function () {
    var $window = $(window), $html = $('html');
    $("#siteMnuBtn").click(function () {
        $(".bcipl-navPan").toggleClass("bcipl-navPan-left");
    });

    $('.outer--ul li').mouseover(function () {
        if ($(this).find('ul.second-level-ul').length > 0) {
            if ($window.width() < 990) {
                $(this).find('ul.second-level-ul').css({ "position": "relative" })
            }
        }
    })

    $('.outer--ul li ul.second-level-ul li').mouseover(function () {
        if ($(this).find('ul.third-level-ul').length > 0) {
            $(this).parent().css({ "overflow": "visible" })
        }
        if ($window.width() < 990) {
            $(this).find('ul.second-level-ul').css({ "position": "relative" })
        }
    })

    $('.outer--ul li ul.third-level-ul li').mouseover(function () {
        if ($(this).find('ul.fourth-level-ul').length > 0) {
            $(this).parent().css({ "overflow": "visible" })
        }
    })

    $('.outer--ul li').mouseleave(function () {
        $(this).find('ul.second-level-ul').css({ "overflow": "hidden" });
        $(this).find('ul.third-level-ul').css({ "overflow": "hidden" });
        $(this).find('ul.fourth-level-ul').css({ "overflow": "hidden" })
    })

    let count = $(".breadcrumb .breadcrumb-item").length;
    if (count < 2) {
        $(".breadcrumb .breadcrumb-item").addClass("d-none");
    }
});
