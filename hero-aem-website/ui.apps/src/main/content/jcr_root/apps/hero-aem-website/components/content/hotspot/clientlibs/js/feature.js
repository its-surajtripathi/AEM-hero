$(document).ready(function () {
  $(".feature-btn").on("click", function () {
    var featureNumber = "." + $(this).attr("data-target");
    $("connection").remove();
    $(".feature-btn").removeClass("active");
    $(this).addClass("active");
    $(".features-box").removeClass("active");
    $(featureNumber).addClass("active");
    let borderColor = $(".scooter-features-main .features-bike-main").length > 0 ? 'black': 'white';
    $().connections({
      from: '.features-box.active',
      to: '.feature-btn.active',
      css:{color:borderColor},
      within:'.features-section-wrapper'
    });
    $(".features-section-wrapper").removeClass(
      "option-1 option-2 option-3 option-4 option-5"
    );
  });
if (window.innerWidth <= 768) {
        $('.features-points').slick({
          infinite: false,
          dots: false,
          autoplay: false,
          variableWidth: true,
          arrows: false,
          responsive: [
            {
              breakpoint: 769,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 421,
              settings: {
                slidesToShow: 2.5,
                slidesToScroll: 2,
              }
            }
          ]
        });
      }
$(window).on("load resize", function () {
    $("connection").remove();
    setTimeout(function() {
	  if ($(".feature-btn.active").length > 0) {
      let borderColor = $(".scooter-features-main .features-bike-main").length > 0 ? 'black': 'white';
      $().connections({
        from: '.features-box.active',
        to: '.feature-btn.active',
        css:{color:borderColor},
        within:'.features-section-wrapper'
      });
	  }
   },500);
  });
});
