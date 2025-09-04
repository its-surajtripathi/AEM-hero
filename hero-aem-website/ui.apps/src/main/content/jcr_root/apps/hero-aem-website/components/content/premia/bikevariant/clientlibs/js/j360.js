(function($){
    $.fn.j360 = function(options) {
        var defaults = {
            clicked: false,
            currImg: 1
        }
        var options = jQuery.extend(defaults, options);
        return this.each(function() {
            var $obj = jQuery(this);
            var aImages = {};
            $obj.css({
                'margin-left' : 'auto',
                'margin-right' : 'auto',
                'text-align' : 'center',
                'overflow' : 'hidden'
            });
            // $obj.prepend('<img src="/images/loader.gif" class="loader" style="margin-top:' + ($obj.height()/2 - 15) + 'px" />');

            $overlay = $obj.clone(true);
            $overlay.html('<img src="" loading="lazy" class="loader" style="margin-top:' + ($obj.height()/2 - 15) + 'px" />');
            $overlay.attr('id', 'view_overlay');
            $overlay.css({
                'position' : 'absolute',
                'z-index': '1',
                'top' : $obj.offset().top,
                'left' : $obj.offset().left,                
            });
            $obj.after($overlay);
            $obj.after('<div id="colors_ctrls"></div>');
            jQuery('#colors_ctrls').css({
                'width' : $obj.width(),
                'position' : 'absolute',
                'z-index': '1',
                'top' : $obj.offset().top + $obj.height - 50,
                'left' : $obj.offset().left
            });

            // $('.body-preloaded-image').each(function(ind, ele) {                
            //     ele.remove();
            // });

            var imageTotal = 0;
            jQuery('img', $obj).each(function() {
                aImages[++imageTotal] = jQuery(this).attr('src');
                preload(jQuery(this).attr('src'));
            })
            var imageCount = 0;
            jQuery('.preload_img').on('load',function() {
                if (++imageCount == imageTotal) {
                    addListenersToImage();
                }                    
            });

            var loadedCount = 0
            $('.preload_img').each(function(index, elem) {                    
                if(++loadedCount == imageTotal) {
                    addListenersToImage();
                }            
            });

            function addListenersToImage() {               
                $overlay.animate({
                    'filter' : 'alpha(Opacity=0)',
                    'opacity' : 0
                }, 500);
                $obj.html('<img src="' + aImages[1] + '"  loading="lazy"/>');
                $overlay.bind('mousedown touchstart', function(e) {
                    if (e.type == "touchstart") {
                        options.currPos = window.event.touches[0].pageX;
                    } else {
                        options.currPos = e.pageX;
                    }
                    options.clicked = true;
                    return false;
                });
                jQuery(document).bind('mouseup touchend', function() {
                    options.clicked = false;
                });
                jQuery(document).bind('mousemove touchmove', function(e) {
                    if (options.clicked) {
                        var pageX;
                        if (e.type == "touchmove") {
                            pageX = window.event.targetTouches[0].pageX;
                        } else {
                            pageX = e.pageX;
                        }

                        var width_step = 4;
                        if (Math.abs(options.currPos - pageX) >= width_step) {
                            if (options.currPos - pageX >= width_step) {
                                options.currImg++;
                                if (options.currImg > imageTotal) {
                                    options.currImg = 1;
                                }
                            } else {
                                options.currImg--;
                                if (options.currImg < 1) {
                                    options.currImg = imageTotal;
                                }
                            }
                            options.currPos = pageX;
                            $obj.html('<img src="' + aImages[options.currImg] + '" />');
                        }
                    }
                });
            }

            // Bypassing this logic due to
            // Cannot read properties of undefined (reading 'msie')
            if (true || jQuery.browser.msie || jQuery.browser.mozilla || jQuery.browser.opera || jQuery.browser.safari ) {
                jQuery(window).resize(function() {
                    onresizeFunc($obj, $overlay);
                });
            } else {
                var supportsOrientationChange = "onorientationchange" in window,
                orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
                window.addEventListener(orientationEvent, function() {
                    onresizeFunc($obj, $overlay);
                }, false);
            }
            onresizeFunc($obj, $overlay)

        });
    };
    $.fn.destroy = function() {
        $("#view_overlay, #colors_ctrls").remove();
        appendImagesToDivFromBody(this);        
    };
})(jQuery)

function onresizeFunc($obj, $overlay) {
    /*
	$obj.css({
        'margin-top' : $(document).height()/2 - 150
    });*/
    $overlay.css({
        'margin-top' : 0,
        'top' : $obj.offset().top,
        'left' : $obj.offset().left
    });

    jQuery('#colors_ctrls').css({
        'top' : $obj.offset().top + $obj.height - 50,
        'left' : $obj.offset().left
    });
}

function preload(image) {
    if (typeof document.body == "undefined") return;
    try {
        var div = document.createElement("div");
        div.classList.add("body-preloaded-image");
        var s = div.style;
        s.position = "absolute";
        s.top = s.left = 0;
        s.visibility = "hidden";
        document.body.appendChild(div);
        div.innerHTML = "<img loading=\"lazy\" class=\"preload_img\" src=\"" + image + "\" />";
    } catch(e) {
    // Error. Do nothing.
    }
}


function appendImagesToDivFromBody(_this) {
    _this.empty();
    $('.body-preloaded-image').each(function(ind, ele) {
        var imgElement = $(ele).children('img');
        imgElement.removeClass('preload_img');
        $(_this).append(imgElement)
        ele.remove();
    });
}