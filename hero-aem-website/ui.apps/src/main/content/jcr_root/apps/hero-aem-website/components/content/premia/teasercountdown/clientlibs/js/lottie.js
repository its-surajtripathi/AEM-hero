$(document).ready(function () {
  setTimeout(function () {
    // Get the container element
    var container = document.getElementById("lottie-container");
    try {
      bodymovin.destroy();
      //Load the animation JSON file
      var animation = bodymovin.loadAnimation({
        container: container,
        path: $(".lottie-background-image").data("lottie"), // Path to your animation JSON file
        renderer: "svg", // Choose the renderer (svg, canvas, html)
        loop: true, // Set loop to true or false
        autoplay: true, // Set autoplay to true or false
      });
    } catch (error) {
      console.log(error);
    }
  }, 100);
});
