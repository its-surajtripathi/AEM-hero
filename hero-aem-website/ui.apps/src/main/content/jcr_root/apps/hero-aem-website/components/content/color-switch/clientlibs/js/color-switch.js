$(document).ready(function () {
	if ($('.engine-sound')[0]) {
	    var engineSound = new Audio(
	      $(".engine-sound a").attr('data-audio-path')
	    );
	
	    $(".engine-sound a").on("click", function () {
	      engineSound.play();
	      $(".engine-sound").addClass("animate");
	      engineSound.addEventListener("ended", function () {
	        $(".engine-sound").removeClass("animate");
	      });
	    });
	  }
 });