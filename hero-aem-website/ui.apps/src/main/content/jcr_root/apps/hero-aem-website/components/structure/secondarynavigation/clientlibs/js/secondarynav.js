$(document).ready(function () {
    $('.megamenu-li').on('click', function() {
        $(this).siblings().removeClass('active');
         if( $(event.target).hasClass('nav-link') || $(event.target.parentElement).hasClass('nav-link')){
             $(this).toggleClass('active');
             if($('.e-shop').hasClass('active')){
                    $(this).parent().siblings().find('.megamenu-li').removeClass('active');
             }
        }
    });
     if (window.innerWidth <= 991) {
        $('.megamenu-li').on('click', function() {
          $('.megamenu-li').removeClass('focused');
          $(this).addClass('focused');
        });
        $('.navbar-toggler').on('click', function(){
          $('.megamenu-li').removeClass('active focused');
          if($('body').hasClass('fixedcontent')){
			$('body').removeClass('fixedcontent');
		  }else{
			setTimeout(toggleScroll,500);
		  }
          
        });
      }
      
      function toggleScroll(){
		$('body').addClass('fixedcontent');
	  }
});