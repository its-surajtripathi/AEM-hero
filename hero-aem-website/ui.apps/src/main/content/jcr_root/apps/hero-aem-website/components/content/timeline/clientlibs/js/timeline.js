$(document).ready(function() {
    "use strict";
    if ($('.chairman-timeline').length > 0) {
        var yearSlider = document.getElementById('values-slider');
        var valuesForSlider = [];
        $('#timeline-slider').find('.slider-data-main').each(function() {
            valuesForSlider.push($(this).data('year'));
        })
        let maxSlide = parseInt($('#maxNumberSlide').val());
        let maxCardSlide = maxSlide ? maxSlide : 8;
        var totalSlides = Math.ceil(valuesForSlider.length / maxCardSlide);
        if(totalSlides == 1){
            $('#stepforward').css('visibility','hidden');
            $('#stepback').css('visibility','hidden');
        }
        var currentSlide = 1;
        var differenceSlide = 0;
        var format = {
            to: function(value) {
                return valuesForSlider[Math.round(value)];
            },
            from: function(value) {
                return valuesForSlider.indexOf(Number(value));
            }
        };
        noUiSlider.create(yearSlider, {
            start: [valuesForSlider[0]],
            range: {
                min: 0,
                max: maxCardSlide - 1 
            },
            step: 1,
            tooltips: true,
            density: 5,
            format: format,
            pips: {
                mode: 'steps',
                format: format
            },

        });
        for (let i = 0; i < valuesForSlider.length; i++) {
            var selectedValue = valuesForSlider[0];
            $('.journey-dropdown').find('.dropdown-menu').append('<a class="dropdown-item" href="JavaScript:;">' + valuesForSlider[i] + '</a>');
            $('.journey-dropdown').find('.dropdown-toggle').html(selectedValue);
            $('.journey-dropdown').find('.dropdown-menu .dropdown-item').each(function() {
                if ($(this).html() == selectedValue) {
                    $(this).addClass('active');
                }
            });
        }
        if ($(window).width() < 768) {
            $('.journey-dropdown').find('.dropdown-menu a').on('click', function() {
                var dropdownValue = $(this).html();
                $('.journey-dropdown').find('.dropdown-menu a').removeClass('active');
                $(this).addClass('active');
                $('.journey-dropdown').find('.dropdown-toggle').html(dropdownValue);
                $('.slider-data-main').addClass("d-none");
                $(`[data-year="${dropdownValue}"]`).removeClass('d-none');
                if ($('.multi-value-timeline').length > 0) {
	                var sliderValue = dropdownValue;
	                $("#headaward").text(sliderValue);
	                $('.center-slider').addClass('d-none');
	                $('.center-slider').filter(`[data-year="${sliderValue}"]`).removeClass('d-none');
	                $('.slick-slider').slick('refresh');
	            }
            });
        }

        $('#stepforward').on('click', function() {
            var currentMinRange = yearSlider.noUiSlider.options.range.min + maxCardSlide;
		    var currentMaxRange = yearSlider.noUiSlider.options.range.max + maxCardSlide;
		    if(currentSlide < totalSlides) {
		        if(currentMaxRange >= valuesForSlider.length) {
		            if(currentMinRange == valuesForSlider.length - 1) {
		                differenceSlide = currentMaxRange - valuesForSlider.length;
		                console.log('Equal');
		                yearSlider.noUiSlider.updateOptions({
		                    range: {
		                      min: currentMinRange - 1,
		                      max: valuesForSlider.length - 1
		                    }
		                }, false);
		            } else {
		                differenceSlide = currentMaxRange - valuesForSlider.length + 1;
		                console.log('Not Equal');
		                yearSlider.noUiSlider.updateOptions({
		                    range: {
		                      min: currentMinRange,
		                      max: valuesForSlider.length - 1
		                    }
		                }, false);
		            }
		        } else {
		            yearSlider.noUiSlider.updateOptions({
		                range: {
		                  min: currentMinRange,
		                  max: currentMaxRange
		                }
		            }, false);
		        }
		        currentSlide++;
		    }
        });
        $('#stepback').on('click', function(){
		    var currentMinRange = yearSlider.noUiSlider.options.range.min - maxCardSlide;
		    var currentMaxRange = yearSlider.noUiSlider.options.range.max + differenceSlide - maxCardSlide;
		    if(currentSlide > 1) {
		        differenceSlide = 0;
		        if(currentMinRange < 0) {
		            yearSlider.noUiSlider.updateOptions({
		                range: {
		                  min: 0,
		                  max: maxCardSlide - 1 
		                }
		            }, false);
		        } else {
		            yearSlider.noUiSlider.updateOptions({
		                range: {
		                  min: currentMinRange,
		                  max: currentMaxRange
		                }
		            }, false);
		        }
		        currentSlide--;
		    }
		});
        
        var activePips = [null, null];
        yearSlider.noUiSlider.on('update', function(values, handle) {
            if ($('.multi-value-timeline').length > 0) {
                var sliderValue = values[handle];
                $("#headaward").text(sliderValue);
                $('.center-slider').addClass('d-none');
                $('.center-slider').filter('[data-year="' + sliderValue + '"]').removeClass('d-none');
                $('.slick-slider').slick('refresh');
                $('.noUi-value').removeClass('active-pip');
    			$('.noUi-value:contains('+sliderValue+')').addClass('active-pip');
            }else{
            	var sliderValue = values[handle];
			    $(".slider-data-main").each(function () {
			        if ($(this).attr('data-year') == sliderValue) {
			            $('.slider-data-main').addClass("d-none");
			            $(this).removeClass('d-none');
			        }
			    });
			    $('.noUi-value').removeClass('active-pip');
			    $('.noUi-value:contains('+sliderValue+')').addClass('active-pip');
 		   }
        });
        var currentValue = yearSlider.noUiSlider.get();
        $("#headaward").text(currentValue);
        $(".slick-arrow").click((e) => {
            $('.slick-arrow').removeClass('slick-clicked');
            $(e.target).addClass('slick-clicked');
        })
    }
});