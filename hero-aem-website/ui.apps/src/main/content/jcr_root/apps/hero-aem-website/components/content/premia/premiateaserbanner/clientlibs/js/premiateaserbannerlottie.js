$(document).ready(function () {
  setTimeout(function () {
    // Get the container element
    var container = document.getElementById("harley-bike-blinker");

    // Load the lottie animation JSON file
    var animation = bodymovin.loadAnimation({
      container: container,
      path: "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-premia-site/resources/images/harley_bike_blink.json",
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }, 100);
});
