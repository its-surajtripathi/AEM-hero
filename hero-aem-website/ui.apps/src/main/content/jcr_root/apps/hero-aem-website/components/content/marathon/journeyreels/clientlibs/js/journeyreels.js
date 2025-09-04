$(document).ready(function () {
    let slider = $('#journey-slider .slider-row');
    slider.slick({
        infinite: true,
        speed: 4500,
        slidesToScroll: 1,
        draggable: false,
        autoplaySpeed: 0,
        swipeToSlide: true,
        autoplay: true,
        variableWidth: true,
        cssEase: 'linear',
        arrows: false,
        dots: false,
        pauseOnHover:false,
        pauseOnFocus: false
    });
});