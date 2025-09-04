$(document).ready(function () {
  $(".nav-tabs a").click(function () {
    $(this).tab('show');
  });

  $('#myModal').on('show.bs.modal', function (event) {
    $(this).find('.nav a:first').tab('show');
  })

  $('#harley-specs li a').on('click', function () {
    $('#harley-specs li a').removeClass('active');
    $(this).addClass('active');
  })
});
