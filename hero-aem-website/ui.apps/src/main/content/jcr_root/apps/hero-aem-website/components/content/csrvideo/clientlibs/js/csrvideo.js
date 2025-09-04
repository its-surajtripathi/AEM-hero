$(document).ready(function(){
    $('#videoList ul a:first-child li').addClass("active");

    $("#videoList li").on("click",function(){
        $("#videoList li").removeClass("active");
       $(this).addClass("active");
    })
  });

  