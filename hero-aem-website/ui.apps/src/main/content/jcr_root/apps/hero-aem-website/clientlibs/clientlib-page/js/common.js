var getCookie = function (name) {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; ++i) {
    let pair = cookies[i].trim().split("=");
    if (pair[0] == name) return pair[1];
  }
  return null;
};
if(getCookie('sessionStat') != null) {
  $('.main-list').removeClass('d-none');
  $('.mobile-list').removeClass('d-none');
  $('.dealer-hamburger-menu').removeClass('d-none');
$('.dealersLogIn').addClass('d-none');
  $('.dealersLogOut').removeClass('d-none');

}
else{
  $('.main-list').addClass('d-none');
  $('.mobile-list').addClass('d-none');
  $('.dealer-hamburger-menu').addClass('d-none');
}

var perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}
var locationData = getCookie("locationDetails");
var locations = null;
if (null == locationData) {
  if ("geolocation" in navigator) {
    //check geolocation available
    //try to get user current location using getCurrentPosition() method
    let defaultservlet = document.getElementById('defaultservlet').value;
    navigator.geolocation.getCurrentPosition(function (position) {
        fetch(`${defaultservlet}.getlocation.json?lat=${position.coords.latitude}&long=${position.coords.longitude}`)
        .then(res => res.json())
        .then(data => {
            if (data.State && data.State != null) {
                document.cookie = `locationDetails=${JSON.stringify(data)};path='/'`;
                locations = {...data};
            } else {
                document.cookie = `locationDetails=;path='/'`;
            }
            window.location.reload();
        })
        .catch(error => {
            console.log("Unable to fetch location information.", error);
            document.cookie = `locationDetails=;path='/'`;
        });
    });
  } else {
    console.log("Browser doesn't support geolocation!");
    document.cookie = `locationDetails=;path='/'`;
  }
} else if (locationData.length > 3) {
  locations = {...JSON.parse(locationData)};
}

if(getCookie('data') != null) {
	let cookieval = JSON.parse(atob(getCookie('data')));
	$('.log-in-link').addClass('d-none');
    $('.logout-header').removeClass('d-none');
    $('.logout-header').find('.profile-name').text(cookieval.name);
    if(cookieval.profilePicPath && cookieval.profilePicPath !== ''){
    $('.logout-header').find('.profile-pic-header').addClass('d-none');
    $('.logout-header').find('.initials').addClass('d-none');
    $('.logout-header').find('.profile-pic-header').attr('src',cookieval.profilePicPath+'?'+atob(cookieval.mediaToken));
    }else{
        $('.logout-header').find('.initials').addClass('d-none');
        $('.logout-header').find('.profile-pic-header').addClass('d-none');
        $('.logout-header').find('.initials').text(getInitials(cookieval.name));
    }
}


