$(document).ready(function () {
  try {
    var video = document.getElementById("my-video");
    var playButton = document.getElementById("play-button");
    var pauseButton = document.getElementById("pause-button");
    var muteButton = document.getElementById("mute-button");
    var unmuteButton = document.getElementById("unmute-button");

    playButton.addEventListener("click", function () {
      video.play();
      togglePlayPauseButtons();
    });

    pauseButton.addEventListener("click", function () {
      video.pause();
      togglePlayPauseButtons();
    });

    muteButton.addEventListener("click", function () {
      video.muted = true;
      toggleMuteUnmuteButtons();
    });

    unmuteButton.addEventListener("click", function () {
      video.muted = false;
      toggleMuteUnmuteButtons();
    });

    video.addEventListener("play", function () {
      togglePlayPauseButtons();
    });

    video.addEventListener("pause", function () {
      togglePlayPauseButtons();
    });

    video.addEventListener("volumechange", function () {
      toggleMuteUnmuteButtons();
    });

    function togglePlayPauseButtons() {
      playButton.style.display = video.paused ? "block" : "none";
      pauseButton.style.display = video.paused ? "none" : "block";
    }

    function toggleMuteUnmuteButtons() {
      muteButton.style.display = video.muted ? "none" : "block";
      unmuteButton.style.display = video.muted ? "block" : "none";
    }

    // Initialize the button states based on the initial video state
    togglePlayPauseButtons();
    toggleMuteUnmuteButtons();

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();
      var clientHeight = document.documentElement.clientHeight;
      var containerHeight = rect.height;
      return (
        rect.top >= -(containerHeight / 3) &&
        rect.bottom <=
          (window.innerHeight || clientHeight) + containerHeight / 3
      );
    }

    var videoContainer = document.querySelector(".prodictVideoBannerContainer");

    document.addEventListener(
      "scroll",
      function () {
        if (isInViewport(videoContainer)) {
          video.play();
        } else {
          video.pause();
        }
      },
      {
        passive: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
});
