$(document).ready(function () {
  try {
    var arrowDown = document.getElementById("arrow_down");
    var accordians = document.querySelector(".productDealerShipWrapper");
    arrowDown &&
      arrowDown.addEventListener("click", function (e) {
        const tgt = e.target;
        tgt.classList.toggle("arrow-rotated");
        accordians.classList.toggle("showAllAccordians");
      });
  } catch (err) {
    console.error(err);
  }
});
