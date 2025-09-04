$(document).ready(function () {
  var defaultusername=$('.campaign-login #defaultuser').val();
  var defaultpassword=$('.campaign-login #defaultpassword').val();
  
  $('.campaign-login #defaultpassword').val('');
  $('.campaign-login #defaultuser').val('');
  
  const harleysession = sessionStorage.getItem('harleyadminlogin');
  if(harleysession){
    $('.campaign-login').addClass('d-none');
        $('.campaign-hlogin.campaign-container').removeClass('d-none');
        $('.campaign-hlogin.campaign-container').addClass('d-block');
  }
  $('.campaign-login .book-test-submit').click(function() {
    
    if((defaultusername==$('.campaign-login #username').val() && defaultpassword==$('.campaign-login #password').val())){
        sessionStorage.setItem('harleyadminlogin', true);
        $('.campaign-login').addClass('d-none');
        $('.campaign-hlogin.campaign-container').removeClass('d-none');
        $('.campaign-hlogin.campaign-container').addClass('d-block');
        $('body,html').stop().animate({
          scrollTop: 0
      });
    }
    else{
      $('.campaign-login .errorpassword').removeClass('d-none');
    }
  })

  $('.campaign-login #username, .campaign-login #password').on('input' , function(){
    $('.campaign-login .errorpassword').addClass('d-none');
    $('.campaign-login .book-test-submit').removeAttr('disabled');
  })


})