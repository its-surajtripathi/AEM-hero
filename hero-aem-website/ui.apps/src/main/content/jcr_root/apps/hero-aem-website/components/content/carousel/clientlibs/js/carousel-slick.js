/*==SLICK OPTIONS==*/
$(document).ready(function () {
	$('.img-slick-carousel').slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		infinite: false,
		dots: true,
		variableWidth: true,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
		]
	});
});

$(window).on('scroll', function () {
	var threshold = 150;
	var btnwrapper = $('#scooter-banner-slide-mob');
	if ((btnwrapper.data('animation') && $(window).scrollTop() > threshold)) {
		btnwrapper.addClass('pos-sticky');
	} else {
		btnwrapper.removeClass('pos-sticky');
	}
	let sticky = btnwrapper;
	if (sticky.length) {
		let footer = $('.footer');
		let stickyTop = sticky.offset().top;
		let stickyBottom = stickyTop + sticky.outerHeight();
		let footerTop = footer.offset().top;
		let footerHeight = footer.outerHeight();
		let scrollTop = $(this).scrollTop();
		if (stickyBottom >= footerTop && scrollTop < footerTop + footerHeight - $(window).height()) {
			sticky.css('opacity', '0');
			setTimeout(function () {
				sticky.css('visibility', 'hidden');
			}, 300);
		} else {
			sticky.css('visibility', 'visible');
			setTimeout(function () {
				sticky.css('opacity', '1');
			}, 50);
		}
	}
});
