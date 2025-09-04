$(document).ready(function () {
$('.quick-view-modal').each(function () {
     $(this).find('.productmodal').find(".varient1 img").attr('src', $(this).find('.explore-360-tab-blk .nav-link.active').attr('data-imagepath'));
});
	$(".explore-360-main-blk .nav-link").on("click", function () {
        $(this).parents('.quick-view-modal').find(".varient1 img").attr('src', $(this).attr('data-imagepath'));
      });

      $('.explore-360-tab-blk .nav-link').on('click', function () {
        $(this).parents('.explore-360-tab-blk').find('.nav-link').removeClass('active');
        $(this).addClass('active');
      });

 });