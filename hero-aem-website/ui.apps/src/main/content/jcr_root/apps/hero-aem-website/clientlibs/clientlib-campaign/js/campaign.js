
$(document).ready(function () {
	if ($('.header-main').length > 0 && $('.campaign-section').length > 0) {
		var productNavHeight = $('.header-main').height();
		$('.campaign-section').css('margin-top', productNavHeight + 10);
		$(window).on('resize', function() {
			productNavHeight = $('.header-main').height();
			$('.campaign-section').css('margin-top', productNavHeight + 10);
		});
	}
});