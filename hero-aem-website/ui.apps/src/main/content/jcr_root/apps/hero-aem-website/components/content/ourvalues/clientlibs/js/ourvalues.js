$(document).ready(function() {
	function equalheight($this) {
		$this.each(function(index) {
			var maxHeight = 0;
			$(this).height('auto');
			if ($(this).height() > maxHeight) {
				maxHeight = $(this).height();
			}
			$(this).height(maxHeight);
		});
	}
	if ($('.benefit-box').length) {
		equalheight($('.benefit-box'));
		$(window).bind("resize", function() {
			equalheight($('.benefit-box'));
		});
	}
});