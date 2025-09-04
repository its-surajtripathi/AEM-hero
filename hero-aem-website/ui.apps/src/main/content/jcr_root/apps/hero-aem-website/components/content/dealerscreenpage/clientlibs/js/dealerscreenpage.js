$(document).ready(function () {
    if ($('#dealer-screen-page').length > 0) {
        $('.header-main,.footer').remove();
    }

    $('#dealer-screen-page .slide--wrap').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 800,
        arrows: false,
        autoplaySpeed: 10000,
        dots: false,
        pauseOnHover:false
    });

    $('#dealer-screen-page .slide-item').each(function () {
        let numItems = $(this).find('.item').length;
        let autoplay = 0;
        if (numItems >= 1) {
            autoplay = Math.ceil(numItems / 4) * 10000;
        }
        if (autoplay > 0) {
            $(this).attr('data-autoplay-ms', autoplay);
        }
    });

    $('#dealer-screen-page .slide--wrap').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var $currentSlide = $(slick.$slides[currentSlide]);
        var $nextSlide = $(slick.$slides[nextSlide]);

        let slide = slick.$slides.eq(nextSlide);
        let autoplay = slide.data('autoplay-ms');
        if (autoplay) {
            slick.options.autoplaySpeed = autoplay;
        } else {
            slick.options.autoplaySpeed = 10000;
        }

        if ($currentSlide.find('.item-wrap').length) {
            $currentSlide.find('.item-wrap').slick('unslick');
        }

        if ($nextSlide.find('.item-wrap').length) {
            $nextSlide.find('.item-wrap').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                autoplay: true,
                speed: 800,
                autoplaySpeed: 10000,
                arrows: false,
                pauseOnHover:false,
                dots: false
            });
        }
    });
})

