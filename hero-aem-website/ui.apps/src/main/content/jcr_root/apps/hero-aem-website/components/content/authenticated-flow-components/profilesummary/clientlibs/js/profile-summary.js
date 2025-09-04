
function showInitials(){
    var displayinital = getInitials(JSON.parse(atob(getCookie('data'))).name);
    var getImagePath = JSON.parse(atob(getCookie('data'))).profilePicPath;
    $('.fetch-image .initials').html(displayinital);
    if (getImagePath && getImagePath !== '') {
     $('.fetch-image .initials').hide();
     $('.fetch-image').find('img').show();
    } else {
    $('.fetch-image').find('img').hide();
     $('.fetch-image .initials').show();
    }
}

