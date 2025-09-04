$( document ).ready(function() {
   $('.publish-button').on('click', function() {
	$('#myModal').show();
		$.ajax({
	        url: "/bin/replicate",
	        type: 'POST',
			data:'path='+$('.publish-button').attr('data-root-path') +'&cmd=Activate',
	        success: function(resp) {
	            $('#myModal').show();
	            $('#myModal').find('.in-progress').hide();
				$('#myModal').find('.success').show();
				
	        },
	        error: function() {}
	    })
    });
    $('#myModal').find('.close-modal').on('click', function() {
		$('#myModal').hide();
	});
	
});
