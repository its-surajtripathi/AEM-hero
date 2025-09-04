
$(document).ready(function () {
  let datepicked = document.querySelector('#countdown');
  if (datepicked) {
    let countDownDate = new Date(datepicked.dataset.date).getTime();
    let x = setInterval(function () {
      let now = new Date().getTime();
      let distance = countDownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("timer").innerHTML = days + " Days : " + hours + " Hrs : "
        + minutes + " Mins : " + seconds + " Sec ";

        if (days <= 1) {
          document.getElementById("timer").innerHTML = days + " Day : " + hours + " Hrs : "
          + minutes + " Mins : " + seconds + " Sec ";
        }

      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "0 Day : 00 Hrs : 00 Mins : 00 Sec";
      }
    }, 1000);

    if ($('.hdbcstages').length) {
      $('#scooterBanner').css("margin-top", '0');
      $('.home-main-section').css("margin-top", '93px');
    }
    window.onscroll = function () { myFunction() };
    var header = document.getElementById("timerSticky");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
  }
});
