$('body').scrollspy({ target: ".product-navbar .nav", offset: 200 });
var servicescrollDwnNavOffset = $('.product-header-main').height();
$(".product-navbar .navbar-nav .nav-link").on('click', function (event) {
  var href = $(this).attr('href');
  if (this.hash !== "") {
    event.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top - servicescrollDwnNavOffset
    }, 800, function () {
      window.location.hash = hash;
      $(href)[0].scrollIntoView();
      window.scrollBy(0, -servicescrollDwnNavOffset);
    });
  }
});
$(window).on("scroll", function () {
    var bookingTestRideScrollOffset = '';
    if($('.explore-360-main').length){
         bookingTestRideScrollOffset = $(".explore-360-main").offset().top - $(window).scrollTop() + 10;
    }
    if (bookingTestRideScrollOffset <= 0) {
      $(".product-header-main .book-now-btn").addClass("visible");
    } else {
      $(".product-header-main .book-now-btn").removeClass("visible");
    }
  });