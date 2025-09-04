$(document).ready(function() {
    // getting duration value from carousel dynamically and set the progressbar animation
     const carouselDurationMs = $(".cmp-carousel").attr("data-cmp-delay");
     const carouselDurationSeconds = (carouselDurationMs/1000)+'s';
     $(".cmp-carousel__indicator p").css("animation-duration",carouselDurationSeconds);     
});

