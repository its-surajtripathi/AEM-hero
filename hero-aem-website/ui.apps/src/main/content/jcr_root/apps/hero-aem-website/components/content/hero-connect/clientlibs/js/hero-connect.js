$(document).ready(function () {
    let indvFeaturesWrap = $('#hero-connected .indv-features--wrap');
    let textWrap = $('#hero-connected .text-tile-wrap');
    let featureWrap = $('#hero-connected .phone--content .feature--wrap');
    let intervalID;

    indvFeaturesWrap.first().find('.indv-feature:first-child h3').click();

    $('#hero-connected .btn--wrap button').click(function () {
        $('#hero-connected .btn--wrap button').removeClass("btn--active");
        $(this).addClass("btn--active");
        let btnIndex = $(this).index();
        indvFeaturesWrap.not(indvFeaturesWrap.eq(btnIndex)).addClass("fade-out");
        textWrap.not(textWrap.eq(btnIndex)).addClass("fade-out");
        featureWrap.not(featureWrap.eq(btnIndex)).addClass("fade-out");
        indvFeaturesWrap.not(indvFeaturesWrap.eq(btnIndex)).css("height", 0);
        indvFeaturesWrap.eq(btnIndex).removeClass("fade-out");
        indvFeaturesWrap.eq(btnIndex).css("height", "auto");
        textWrap.eq(btnIndex).removeClass("fade-out");
        textWrap.eq(btnIndex).css("height", "auto");
        featureWrap.eq(btnIndex).removeClass("fade-out");
        featureWrap.eq(btnIndex).css("height", "auto");
        indvFeaturesWrap.eq(btnIndex).find('.indv-feature:first-child h3').click();

        // Reset Interval
        clearInterval(intervalID);
        intervalID = setInterval(clickSequentially, 2000);
    });

    function headerClick(event) {
        event.stopPropagation();
        let h3 = $(this);
        let indvFeature = h3.closest('.indv-feature');
        let indvFeaturesWrap = indvFeature.closest('.indv-features--wrap');
        let index = indvFeature.index();
        let top;
        if ($(window).width() >= 768) {
            top = index * 68;
        } else {
            top = index * 45.2;
        }
        let activeFeatureWrap = featureWrap.not('.fade-out');
        let activeIndex = activeFeatureWrap.find('.feature-tile').index();
        let slideDistance = (activeIndex - index) * 100;

        activeFeatureWrap.css('transform', `translateX(${slideDistance}%)`);

        let featureTiles = activeFeatureWrap.find('.feature-tile');
        featureTiles.each(function (i) {
            if (i === index) {
                $(this).addClass('visible');
            } else {
                $(this).removeClass('visible');
            }
        });

        let observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('visible');
                } else {
                    $(entry.target).removeClass('visible');
                }
            });
        }, { threshold: 0.5 });


        indvFeaturesWrap.find('.indv-feature h3').removeClass('feature--active');
        h3.addClass('feature--active');
        indvFeaturesWrap.css('--after-top', top + 'px');

        clearInterval(intervalID);
        intervalID = setInterval(clickSequentially, 2000);

        textWrap.each(function (i) {
            if (!$(this).hasClass('fade-out')) {
                $(this).find('.text-tile').addClass('fade-out')
                let textTile = $(this).find('.text-tile').eq(index);
                textTile.removeClass('fade-out');
            } else {
                let textTiles = $(this).find('.text-tile');
                textTiles.addClass('fade-out');
            }
        });
    }

    function clickSequentially() {
        let activeIndvFeaturesWrap = indvFeaturesWrap.not('.fade-out');
        let currentIndex = activeIndvFeaturesWrap.find('.indv-feature h3.feature--active').parent().index();
        let nextIndex = currentIndex + 1;
        if (nextIndex >= activeIndvFeaturesWrap.find('.indv-feature h3').length) {
            nextIndex = 0;
        }
        let nextH3 = activeIndvFeaturesWrap.find('.indv-feature h3').eq(nextIndex);
        nextH3.trigger('click', { preventDefault: true });
    }

    intervalID = setInterval(clickSequentially, 2000);
    $('#hero-connected .indv-feature h3').click(headerClick)
    $('#hero-connected .btn--wrap button:first-child').click();
    $('#hero-connected .indv-feature:first-child h3').click();

    // Button Slider

    $('#hero-connected .button-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
        infinite: false,
        prevArrow: '<div class="btn-slick-prev position-absolute"> < </div>',
        nextArrow: '<div class="btn-slick-next position-absolute"> > </div>'
    }).on('afterChange', function (event, slick, currentSlide) {
        let slider = $(this);
        let prevArrow = slider.find('.btn-slick-prev');
        let nextArrow = slider.find('.btn-slick-next');
        if (currentSlide === 0) {
            prevArrow.removeClass('this--active');
            nextArrow.show();
        } else if (currentSlide === slick.slideCount - slick.options.slidesToShow) {
            prevArrow.addClass('this--active');
            nextArrow.hide();
        } else {
            prevArrow.addClass('this--active');
            nextArrow.show();
        }
    });

    if ($('.btn--wrap button').length > 3) {
        $('.btn--wrap').addClass('btn--padding');
    }
    $('#hero-connected .button-slider .btn-slick-next').addClass('this--active');
});