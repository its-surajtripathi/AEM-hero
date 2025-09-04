$(document).ready(function () {
  const launchDate = $(
    ".countdown-banner .countdown-banner-timer-content"
  ).data("launch-date");

  const getLaunchDate = $(
    ".countdown-banner .countdown-banner-timer-content"
  ).data("get-launch-date");

  if (moment().isAfter(getLaunchDate)) {
    countDownTimerEnd();
  }

  $(
    ".countdown-banner .countdown-banner-timer-content#premia-countdown"
  ).timeTo({
    timeTo: new Date(launchDate),
    displayDays: 2,
    theme: "black",
    displayCaptions: true,
    fontSize: 120,
    captionSize: 34,
    callback: function () {
      countDownTimerEnd();
    },
  });

  // for opening the modal
  $(".countdown-streaming-link").click(function () {
    $(".countdown-banner").addClass("live-streaming-enabled");
  });

  // for closing the modal
  $(".streaming-modal-close").click(function () {
    $(".countdown-banner").removeClass("live-streaming-enabled");
  });

  // for scrolling to teaser component
  $(".scroll-down-image").click(function () {
    $(".teaser-banner-wrapper")[0].scrollIntoView({ behavior: "smooth" });
  });

  try {
    changeTimerText();
    updateButtonState();
  } catch (err) {
    console.error(err);
  }
});

// for showing and hiding of scroll down section component
function countDownTimerEnd() {
  $(".scroll-down-invite-section").addClass("d-none");
  $(".countdown-streaming-link").removeClass("d-none");
}

// for changing the text of timer minutes and seconds for desktop and mobile view
function changeTimerText() {
  if ($(window).width() < 767 && $(".countdown-banner .timeTo figcaption").length) {
    $(".countdown-banner .timeTo figcaption")[2].innerHTML = "mins";
    $(".countdown-banner .timeTo figcaption")[3].innerHTML = "secs";
  }
}

function updateButtonState() {
  const ref$ = $(".countdown-banner .date-ref-element");
  var disableGrabInviteButtonDate = ref$.data("disable-grab-invite-date");
  var watchLivestreamDate = ref$.data("live-stream-date");

  // To hide grab invite button
  if (moment().isAfter(disableGrabInviteButtonDate)) {
    $("#grabInviteButton").addClass("d-none");
    $("#bookingsOpenSoon").addClass("show-btn");
    updateGrabInviteSection();
  }

  // To hide grab invite button
  if (moment().isAfter(watchLivestreamDate)) {
    countDownTimerEnd();
  }
}

function updateGrabInviteSection() {
  $(".premia-invite-success-container").addClass("d-none");
  $(".premia-invite").addClass("d-none");
  $(".launch-event-info-container").removeClass("d-none").addClass("d-block");
  $(".launch-event-info-container").addClass("animate-content");
}
