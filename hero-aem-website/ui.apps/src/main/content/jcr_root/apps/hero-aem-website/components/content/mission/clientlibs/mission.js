$(document).ready(function () {
  const missionSlickSettings = {
        infinite: false,
        autoplay: true,
        dots:true,
        prevArrow: false,
        nextArrow: false,
        autoplaySpeed: 5000,
        centerMode: true,
        centerPadding: '0px',
        responsive: [
        	{
			    breakpoint: 9999,
			    settings: "unslick"
			},
            {
                breakpoint: 991,
                settings: "unslick"
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    width: "100%"
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    }
 $(".mission-card-section-slider").slick(missionSlickSettings, 500);
  $(window).on('resize', function() {
    if ($(".mission-card-section-slider") && !$(".mission-card-section-slider").hasClass('slick-initialized')) {
      $(".mission-card-section-slider").slick(missionSlickSettings, 500);
    }
  });
});