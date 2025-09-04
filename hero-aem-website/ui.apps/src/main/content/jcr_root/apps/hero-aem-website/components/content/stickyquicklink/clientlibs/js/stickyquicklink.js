$(document).ready(function () {
    let html = $("html");
    let wrapper = $(".vertical-wrapper");
    let stickyMob = $('#horizontal-sticky-mob');
    let arrow = stickyMob.find('.arrow');
    let submenu = $('.submenu');
    let arrowImg = arrow.find('img');

    $('#vertical-sticky .sticky-vertical-tile').hover(function () {
        $(this).addClass('this-hovered');
        $(this).find('a').css({ 'display': 'block', 'visibility': 'visible' });
    }, function () {
        $(this).removeClass('this-hovered');
        $(this).find('a').css({ 'display': 'none', 'visibility': 'hidden' });
    });

    $("#click-to-expand").click(function () {
        if (wrapper.hasClass("expanded")) {
            $(this).css("transform", "rotate(0)")
            wrapper.animate({
                opacity: 0,
                marginTop: wrapper.outerHeight() + "px"
            }, 500, function () {
                wrapper.removeClass("expanded");
                wrapper.css("display", "none").css("marginTop", 0);
                html.css("overflow-y", "auto");
            });
            $("body > .grey-background").fadeOut(500, function () {
                $(this).remove();
            });
            if ($('#horizontal-sticky-mob').length) {
                $('#horizontal-sticky-mob').css('z-index', 6);
            }
            if($('#nps-feedback').length){
                $('#nps-feedback').css('z-index', 10);
            }
        } else {
            $(this).css("transform", "rotate(45deg)")
            wrapper.css({
                display: "flex",
                opacity: 0,
                marginTop: wrapper.outerHeight() + "px"
            }).addClass("expanded").animate({
                opacity: 1,
                marginTop: 0
            }, 500);
            html.css("overflow-y", "hidden");
            $("<div class='grey-background'></div>").appendTo("body").fadeIn(500);
            if ($('#horizontal-sticky-mob').length) {
                $('#horizontal-sticky-mob').css('z-index', 4);
            }
            if($('#nps-feedback').length){
                $('#nps-feedback').css('z-index', 1);
            }
        }
    });

    $(window).scroll(function () {
        let sticky = $('#horizontal-sticky');
        if (sticky.length) {
            let footer = $('.footer');
            let stickyTop = sticky.offset().top;
            let stickyBottom = stickyTop + sticky.outerHeight();
            let footerTop = footer.offset().top;
            let footerHeight = footer.outerHeight();
            let scrollTop = $(this).scrollTop();
            if (stickyBottom >= footerTop && scrollTop < footerTop + footerHeight - $(window).height()) {
                sticky.css('opacity', '0');
                setTimeout(function () {
                    sticky.css('visibility', 'hidden');
                }, 300);
            } else {
                sticky.css('visibility', 'visible');
                setTimeout(function () {
                    sticky.css('opacity', '1');
                }, 50);
            }
        }
    });

    arrow.click(function () {
        if (submenu.hasClass('open')) {
            submenu.removeClass('open').stop().animate({ bottom: -100 + "%" }, 400);
            arrowImg.css({ 'transform': 'rotate(0deg)' });
            if($('#vertical-sticky-mob').length){
                $('#vertical-sticky-mob').css('z-index', 6);
            }
            if($('#nps-feedback').length){
                $('#nps-feedback').css('z-index', 10);
            }
        } else {            
            submenu.addClass('open').stop().animate({ bottom: stickyMob.outerHeight() }, 400);
            arrowImg.css({ 'transform': 'rotate(180deg)' });
            if($('#vertical-sticky-mob').length){
                $('#vertical-sticky-mob').css('z-index', 1);
            }
            if($('#nps-feedback').length){
                $('#nps-feedback').css('z-index', 1);
            }
        }
        return false;
    });
});