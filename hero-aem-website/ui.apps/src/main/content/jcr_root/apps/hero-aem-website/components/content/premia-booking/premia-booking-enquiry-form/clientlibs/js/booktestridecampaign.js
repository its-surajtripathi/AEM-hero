$(document).ready(function () {
  $('.mobile-number').on('keyup', function () {
    if ($(this).val().length == 10) {
      $(this).parent('.cust-form-group').find('.otp-link').addClass('show');
    }
  });
  $('.sent-otp').on('click', function () {
    $('.resent-otp').addClass('show');
  });

  $('.campaign-right-content .campaign-dropdown .dropdown-content').on('click', function () {
    event.preventDefault();
    var getValue = $(this).text();
    $(this).parents('.select-dropdown').find('.btn-drop ').text(getValue);

  });

  $('.btn-drop-v1 .dropdown-content').on('click', function () {
    $(this).parents('.btn-drop-v1').find('.btn-drop').addClass('active');
  })

  $("#harleyRequestCallBack").on("hidden.bs.modal", function () {
    $("#book-test-drive-form2").trigger('reset');
  });
})
