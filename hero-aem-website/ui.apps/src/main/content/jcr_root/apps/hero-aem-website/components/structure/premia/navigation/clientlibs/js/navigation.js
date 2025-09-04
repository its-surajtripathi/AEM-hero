$(document).ready(function () {
  $("#grabInviteButton").click(function () {
    $(".premia-invite").get(0).scrollIntoView({ behavior: "smooth" });
  });

  // Get the necessary elements
const closeButton = document.getElementById('close_icon');
const toolTip = document.getElementById('tooltipWrapper');

// Function to close the popup
function closePopup() {
  toolTip.style.display = 'none';
  console.log('hello')
}

// Event listener for the click event on the close button
closeButton.addEventListener('click', closePopup);

});
